import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CasoResponse } from '../models/response/caso.response';
import { CasoCompletoRequest } from '../models/request/insertarcaso.request';
import { CasoCompletoResponse } from '../models/response/insertarcaso.response';

@Injectable({ providedIn: 'root' })
export class CasoService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = '${environment.api.base}/casos';

  // Obtiene casos paginados y filtrados
  getCasosByPage(
    page: number,
    size: number,
    sortBy = 'id',
    sortDir = 'asc',
    estado = '',
    codigoCaso = ''
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (estado) params = params.set('estado', estado);
    if (codigoCaso) params = params.set('codigoCaso', codigoCaso);

    return this.httpClient.get<any>(`${this.apiUrl}/filter/paging`, { params });
  }

  // Obtiene todos los casos (no paginado)
  getCasos(): Observable<CasoResponse[]> {
    return this.httpClient.get<CasoResponse[]>(this.apiUrl);
  }

  // Obtiene un caso por ID
  getCaso(id: number): Observable<CasoResponse> {
    return this.httpClient.get<CasoResponse>(`${this.apiUrl}/${id}`);
  }

  // Inserta un nuevo caso
  insertarCaso(caso: CasoCompletoRequest): Observable<CasoCompletoResponse> {
    return this.httpClient.post<CasoCompletoResponse>('${environment.api.base}/api/casos/insertar', caso);
  }

  // Obtiene todas las entidades distrito
  getEntidadesDistrito(): Observable<any[]> {
    return this.httpClient.get<any[]>('${environment.api.base}/entidadesdistrito');
  }

  // Obtiene todos los delitos
  getDelitos(): Observable<any[]> {
    return this.httpClient.get<any[]>('${environment.api.base}/delitos');
  }

  // Obtiene todos los roles
  getRoles(): Observable<any[]> {
    return this.httpClient.get<any[]>('${environment.api.base}/roles');
  }

  // ACTUALIZA ESTADO DE UN CASO
  actualizarEstado(url: string) {
    return this.httpClient.put(url, {}, { responseType: 'text' as 'json' });
  }

  // Elimina un caso por ID
  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}