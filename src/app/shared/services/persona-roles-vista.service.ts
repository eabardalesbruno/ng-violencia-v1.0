import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PersonaRolesVistaService {
  private apiUrl = '${environment.api.base}/api/personas-roles-vista';

  constructor(private http: HttpClient) {}

  // Trae todos los registros
  getPersonasRolesVista(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Trae registros por id de caso
  getPersonasRolesVistaPorCaso(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/caso/${id}`);
  }
}