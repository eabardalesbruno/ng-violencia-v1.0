import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RolesPersonService {


  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = 'https://api.escuelajs.co/api/v1/categories';


 getRolesperson() {
    return this.httpClient.get<any[]>(this.apiUrl);
  }
}
