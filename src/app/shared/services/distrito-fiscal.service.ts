import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviroment';

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
  private readonly apiUrl = `${environment.api.base}/distritosFiscales`;
  // Nueva URL para entidades
  private readonly entidadesUrl = `${environment.api.base}/entidades`;

  getDistritosFiscales(): Observable<DistritoFiscal[]> {
    return this.httpClient.get<DistritoFiscal[]>(this.apiUrl);
  }

  // Nuevo método para obtener entidades
  getEntidades(): Observable<Entidad[]> {
    return this.httpClient.get<Entidad[]>(this.entidadesUrl);
  }
}
