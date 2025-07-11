import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/enviroment';

// 🏷️ Interfaces para tipado
interface PersonaDetail {
  id: number;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: string;
  sexo: string;
}

interface RolDetail {
  id: number;
  nombre: string;
}

interface CasoDetail {
  id: number;
  codigo_caso: string;
  entidad_receptora_id: number;
  fecha_caso: string;
  estado: string;
  delito_id: number[];
}

@Injectable({
  providedIn: 'root'
})
export class RolesPersonService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.api.base}/api/personas-roles-vista`;
  private readonly rolesPersonCasoUrl = `${environment.api.base}/rolespersonacaso/filter/paging`;
  private readonly rolesPersonCasoBaseUrl = `${environment.api.base}/rolespersonacaso`;
  
  // 🆕 URLs para los nuevos servicios
  private readonly personasUrl = `${environment.api.base}/personas`;
  private readonly rolesUrl = `${environment.api.base}/roles`;
  private readonly casosUrl = `${environment.api.base}/casos`;

  // 🔄 Métodos existentes
  getPersonasRolesByCasoId(casoId: number): Observable<any[]> {
    if (!casoId || casoId <= 0) {
      console.warn('Invalid casoId provided, returning empty array');
      return of([]);
    }
    
    return this.httpClient.get<any[]>(`${this.apiUrl}?caso_id=${casoId}`).pipe(
      map(response => {
        console.log('Raw response from API:', response);
        if (response === null || response === undefined) {
          console.warn('Null/undefined response from personas-roles API, returning empty array');
          return [];
        }
        if (!Array.isArray(response)) {
          console.warn('Non-array response from personas-roles API, converting to array or returning empty');
          return Array.isArray(response) ? response : [];
        }
        const filteredResponse = response.filter(item => item !== null && item !== undefined);
        console.log('Filtered response:', filteredResponse);
        return filteredResponse;
      }),
      catchError(error => {
        console.error('Error fetching personas roles by caso ID:', error);
        return of([]);
      })
    );
  }

  getRolesperson(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl).pipe(
      map(response => {
        console.log('Raw response from getRolesperson API:', response);
        if (response === null || response === undefined) {
          console.warn('Null/undefined response from roles-person API, returning empty array');
          return [];
        }
        if (!Array.isArray(response)) {
          console.warn('Non-array response from roles-person API, returning empty array');
          return [];
        }
        const filteredResponse = response.filter(item => item !== null && item !== undefined);
        console.log('Filtered getRolesperson response:', filteredResponse);
        return filteredResponse;
      }),
      catchError(error => {
        console.error('Error fetching roles person:', error);
        return of([]);
      })
    );
  }

  getRolesPersonCasoByPage(page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc'): Observable<any> {
    const params = `page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    return this.httpClient.get<any>(`${this.rolesPersonCasoUrl}?${params}`).pipe(
      map(response => {
        if (response === null || response === undefined) {
          console.warn('Null/undefined response from roles-person-caso API, returning empty result');
          return { content: [], totalElements: 0, totalPages: 0 };
        }
        return response;
      }),
      catchError(error => {
        console.error('Error fetching roles person caso by page:', error);
        return of({ content: [], totalElements: 0, totalPages: 0 });
      })
    );
  }

  getRolesPersonCasoByPageAndId(page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc', id?: number): Observable<any> {
    let params = `page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    if (id) {
      params += `&id=${id}`;
    }
    return this.httpClient.get<any>(`${this.rolesPersonCasoUrl}?${params}`).pipe(
      map(response => {
        if (response === null || response === undefined) {
          console.warn('Null/undefined response from roles-person-caso API with ID filter, returning empty result');
          return { content: [], totalElements: 0, totalPages: 0 };
        }
        return response;
      }),
      catchError(error => {
        console.error('Error fetching roles person caso by page and ID:', error);
        return of({ content: [], totalElements: 0, totalPages: 0 });
      })
    );
  }

  /**
   * 🔍 BÚSQUEDA INTELIGENTE: Por nombre o ID
   * 
   * Flujo:
   * 1. Si es número → buscar directamente por ID del registro
   * 2. Si es texto → buscar persona por nombre → obtener persona_id → buscar registros con ese persona_id → usar sus IDs de registro
   */
  searchRolesPersonCasoByText(page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc', searchTerm: string): Observable<any> {
    console.log(`🔍 Búsqueda inteligente con término: "${searchTerm}"`);
    
    // Verificar si es numérico (ID del registro)
    const numericId = parseInt(searchTerm);
    if (!isNaN(numericId) && numericId.toString() === searchTerm.trim()) {
      console.log(`🎯 Búsqueda por ID de registro: ${numericId}`);
      return this.getRolesPersonCasoByPageAndId(page, size, sortBy, sortDir, numericId);
    }
    
    // Es texto → buscar por nombre de persona
    console.log(`👤 Búsqueda por nombre de persona: "${searchTerm}"`);
    return this.searchPersonasByName(searchTerm).pipe(
      switchMap(personas => {
        if (personas.length === 0) {
          console.log(`❌ No se encontraron personas con el nombre "${searchTerm}"`);
          return of({ content: [], total_elements: 0, totalPages: 0 });
        }
        
        console.log(`✅ Encontradas ${personas.length} personas:`, personas.map(p => `${p.nombres} ${p.apellidos} (persona_id: ${p.id})`));
        
        // Obtener los persona_ids
        const personaIds = personas.map(p => p.id);
        
        // Buscar todos los registros que tengan estos persona_ids
        return this.findRegistrosByPersonaIds(personaIds, page, size, sortBy, sortDir);
      }),
      catchError(error => {
        console.error('❌ Error en búsqueda inteligente:', error);
        return of({ content: [], total_elements: 0, totalPages: 0 });
      })
    );
  }

  /**
   * 🔍 Buscar registros por persona_ids y devolver los IDs de los registros
   */
  private findRegistrosByPersonaIds(personaIds: number[], page: number, size: number, sortBy: string, sortDir: string): Observable<any> {
    console.log(`🔎 Buscando registros para persona_ids:`, personaIds);
    
    // Obtener todos los registros (sin paginación inicial para filtrar)
    return this.getRolesPersonCasoByPageAndId(0, 1000, sortBy, sortDir).pipe(
      map(response => {
        const allRecords = response?.content || [];
        console.log(`📋 Total registros obtenidos: ${allRecords.length}`);
        
        // Filtrar registros que coincidan con los persona_ids
        const matchingRecords = allRecords.filter((record: any) => 
          personaIds.includes(record.persona_id)
        );
        
        console.log(`🎯 Registros que coinciden: ${matchingRecords.length}`);
        console.log('Registros encontrados:', matchingRecords.map((r: any) => `ID: ${r.id}, persona_id: ${r.persona_id}, caso_id: ${r.caso_id}`));
        
        // Aplicar paginación manual
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedRecords = matchingRecords.slice(startIndex, endIndex);
        
        console.log(`📄 Mostrando página ${page + 1}: ${paginatedRecords.length} registros`);
        
        return {
          content: paginatedRecords,
          total_elements: matchingRecords.length,
          totalPages: Math.ceil(matchingRecords.length / size)
        };
      }),
      catchError(error => {
        console.error('❌ Error buscando registros por persona_ids:', error);
        return of({ content: [], total_elements: 0, totalPages: 0 });
      })
    );
  }

  /**
   * 👤 Buscar personas por nombre
   */
  searchPersonasByName(nombre: string): Observable<PersonaDetail[]> {
    console.log(`👤 Buscando personas por nombre: "${nombre}"`);
    
    // Intentar endpoint de búsqueda primero
    return this.httpClient.get<PersonaDetail[]>(`${this.personasUrl}/search`, {
      params: { nombre: nombre }
    }).pipe(
      map(response => {
        console.log('✅ Respuesta del endpoint de búsqueda:', response);
        return response || [];
      }),
      catchError(error => {
        console.warn('⚠️ Endpoint de búsqueda falló, usando método alternativo:', error);
        
        // Fallback: obtener todas las personas y filtrar
        return this.httpClient.get<PersonaDetail[]>(this.personasUrl).pipe(
          map(allPersonas => {
            console.log(`📋 Obtenidas ${allPersonas?.length || 0} personas totales`);
            if (!allPersonas || !Array.isArray(allPersonas)) {
              return [];
            }
            
            const searchLower = nombre.toLowerCase();
            const filtered = allPersonas.filter(persona => {
              const fullName = `${persona.nombres || ''} ${persona.apellidos || ''}`.toLowerCase();
              const matches = fullName.includes(searchLower);
              if (matches) {
                console.log(`✅ Coincidencia: ${persona.nombres} ${persona.apellidos} (ID: ${persona.id})`);
              }
              return matches;
            });
            
            console.log(`🎯 Personas filtradas: ${filtered.length}`);
            return filtered;
          }),
          catchError(fallbackError => {
            console.error('❌ Error en búsqueda alternativa:', fallbackError);
            return of([]);
          })
        );
      })
    );
  }

  /**
   * 👤 Obtener detalles de una persona por ID
   */
  getPersonaById(id: number): Observable<PersonaDetail> {
    console.log(`Fetching persona details for ID: ${id}`);
    return this.httpClient.get<PersonaDetail>(`${this.personasUrl}/${id}`).pipe(
      map(response => {
        console.log('Persona detail response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error fetching persona by ID:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 🛡️ Obtener detalles de un rol por ID
   */
  getRolById(id: number): Observable<RolDetail> {
    console.log(`Fetching rol details for ID: ${id}`);
    return this.httpClient.get<RolDetail>(`${this.rolesUrl}/${id}`).pipe(
      map(response => {
        console.log('Rol detail response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error fetching rol by ID:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 📁 Obtener detalles de un caso por ID
   */
  getCasoById(id: number): Observable<CasoDetail> {
    console.log(`Fetching caso details for ID: ${id}`);
    return this.httpClient.get<CasoDetail>(`${this.casosUrl}/${id}`).pipe(
      map(response => {
        console.log('Caso detail response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error fetching caso by ID:', error);
        return throwError(() => error);
      })
    );
  }

  updateRolesPersonCaso(id: number, data: any): Observable<any> {
    console.log(`Updating roles person caso with ID: ${id}, data:`, data);
    
    const formattedData = {
      casoId: data.caso_id || data.casoId,
      personaId: data.persona_id || data.personaId,
      rolId: data.rol_id || data.rolId
    };
    
    console.log('Formatted data for backend:', formattedData);
    
    return this.httpClient.put<any>(`${this.rolesPersonCasoBaseUrl}/${id}`, formattedData).pipe(
      map(response => {
        console.log('Update response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error updating roles person caso:', error);
        return throwError(() => error);
      })
    );
  }

  createRolesPersonCaso(data: any): Observable<any> {
    console.log('Creating roles person caso with data:', data);
    return this.httpClient.post<any>(this.rolesPersonCasoBaseUrl, data).pipe(
      map(response => {
        console.log('Create response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error creating roles person caso:', error);
        return throwError(() => error);
      })
    );
  }

  deleteRolesPersonCaso(id: number): Observable<any> {
    console.log(`Deleting roles person caso with ID: ${id}`);
    return this.httpClient.delete<any>(`${this.rolesPersonCasoBaseUrl}/${id}`).pipe(
      map(response => {
        console.log('Delete response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error deleting roles person caso:', error);
        return throwError(() => error);
      })
    );
  }
}
