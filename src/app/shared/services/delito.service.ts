import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DelitoService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/delitos';

  getDelitos(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl);
  }
}