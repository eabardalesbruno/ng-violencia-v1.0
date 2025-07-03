import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntidadDistritoResponse, EntidadDistritoPaginatedResponse, Entidad } from '../models/response/entidad-distrito.response';

@Injectable({ providedIn: 'root' })
export class EntidadDistritoService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/entidadesdistrito'; 

  // Obtener todas las entidades-distrito
  getEntidadesDistrito(): Observable<EntidadDistritoResponse[]> {
    return this.httpClient.get<EntidadDistritoResponse[]>(this.apiUrl);
  }

  // Obtener entidades-distrito con paginación y filtros
  getEntidadesDistritoByPage(
    page: number, 
    size: number, 
    sortBy = 'id', 
    sortDir = 'asc', 
    filtro = ''
  ): Observable<EntidadDistritoPaginatedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir)
      .set('filtro', filtro);

    const url = `${this.apiUrl}/filter/paging`;
    
    console.log('🌐 Haciendo petición HTTP:', {
      url,
      params: params.toString()
    });

    return this.httpClient.get<EntidadDistritoPaginatedResponse>(url, { params });
  }
   
  // Crear nueva entidad-distrito
  create(entidadDistrito: Omit<EntidadDistritoResponse, 'id'>): Observable<EntidadDistritoResponse> {
    return this.httpClient.post<EntidadDistritoResponse>(this.apiUrl, entidadDistrito);
  }

  // Obtener entidad-distrito por ID
  getEntidadDistrito(id: number): Observable<EntidadDistritoResponse> {
    return this.httpClient.get<EntidadDistritoResponse>(`${this.apiUrl}/${id}`);
  }

  // Actualizar entidad-distrito
  update(id: number, entidadDistrito: Omit<EntidadDistritoResponse, 'id'>): Observable<EntidadDistritoResponse> {
    return this.httpClient.put<EntidadDistritoResponse>(`${this.apiUrl}/${id}`, entidadDistrito);
  }

  // Eliminar entidad-distrito
  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Servicios auxiliares para catálogos (si existen estos endpoints)
  getEntidades(): Observable<Entidad[]> {
    return this.httpClient.get<Entidad[]>('http://localhost:8080/entidades');
  }


getDistritos(): Observable<any[]> {
  return this.httpClient.get<any[]>('http://localhost:8080/distritosFiscales');
}


}
