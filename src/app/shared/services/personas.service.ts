// personas.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PersonaResponse } from '../models/response/personas.response';
import { Observable } from 'rxjs';
import { PersonaRequest } from '../models/request/personas.request';
import { environment } from '../../../environments/enviroment';

@Injectable({ providedIn: 'root' })
export class PersonasService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.api.base}/personas`; 

  getPersonas(): Observable<PersonaResponse[]> {
    return this.httpClient.get<PersonaResponse[]>(this.apiUrl);
    }


      getClientesByPage(page: number, size: number, sortBy = 'nombres', sortDir = 'asc', nombres = ''): Observable<PersonaResponse[]> {
    return this.httpClient.get<PersonaResponse[]>(`${this.apiUrl}/filter/paging`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sortBy', sortBy)
        .set('sortDir', sortDir)
        .set('nombres', nombres)
    });
  }
   
  create(persona: PersonaRequest): Observable<PersonaResponse> {
  return this.httpClient.post<PersonaResponse>(this.apiUrl, persona);
}

getPersona(id: number): Observable<PersonaResponse> {
  return this.httpClient.get<PersonaResponse>(`${this.apiUrl}/${id}`);
}


update(id: number, persona: PersonaRequest): Observable<PersonaResponse> {
  return this.httpClient.put<PersonaResponse>(`${this.apiUrl}/${id}`, persona);
}


  delete(id: number): Observable<void> {
 
   return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);

}
  }