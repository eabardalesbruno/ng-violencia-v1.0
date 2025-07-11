import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DelitoService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.api.base}/delitos`;

  getDelitos(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl);
  }
}