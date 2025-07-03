import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DistritoFiscal {
  id: number;
  nombre: string;
  estado: boolean;
}

// Nueva interfaz para Entidad
export interface Entidad {
  id: number;
  nombre: string;
  tipo_entidad: string;
  estado: boolean;
}

@Injectable({ providedIn: 'root' })
export class DistritoFiscalService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/distritosFiscales';
  // Nueva URL para entidades
  private readonly entidadesUrl = 'http://localhost:8080/entidades';

  getDistritosFiscales(): Observable<DistritoFiscal[]> {
    return this.httpClient.get<DistritoFiscal[]>(this.apiUrl);
  }

  // Nuevo método para obtener entidades
  getEntidades(): Observable<Entidad[]> {
    return this.httpClient.get<Entidad[]>(this.entidadesUrl);
  }
}
