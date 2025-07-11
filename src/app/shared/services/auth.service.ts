import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';



const ACCESS_TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.api.base}/api/v1/auth`;
  private readonly isAuthenticatedSignal = signal(!!localStorage.getItem(ACCESS_TOKEN_KEY));

  signIn(username: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>(`${this.apiUrl}/login-body`,
        { userName: username, password: password },
        { observe: 'response' }
      )
      .pipe(
        tap(response => {
          const token = response.body?.token;
          if (token) {
            this.storeToken(token);
            this.isAuthenticatedSignal.set(true);
          }
        })
      )
  }

  signOut(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.isAuthenticatedSignal.set(false);
  }

  isAuthenticated(): boolean {
    const isExpired = this.expiration ? this.expiration * 1000 <= Date.now() : true;
    if (isExpired) {
      this.signOut();
    }
    return this.isAuthenticatedSignal();
  }

  storeToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  get token(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  get expiration(): number | null {
    try {
      const jwt = localStorage.getItem(ACCESS_TOKEN_KEY);
      return JSON.parse(atob(jwt!.split('.')[1])).exp;
    } catch {
      return null;
    }
  }
  
  get user(): string | null {
    try {
      const jwt = localStorage.getItem(ACCESS_TOKEN_KEY);
      return JSON.parse(atob(jwt!.split('.')[1])).sub;
    } catch {
      return null;
    }
  }

  get roles(): string[] | [] {
    try {
      const jwt = localStorage.getItem(ACCESS_TOKEN_KEY);
      return JSON.parse(atob(jwt!.split('.')[1])).roles;
    } catch {
      return [];
    }
  }

  hasAnyRole(requiredRoles: string[]): boolean {
    const rolesFromUser: string[] = this.roles;
    return requiredRoles.some(requiredRole => rolesFromUser.includes(requiredRole));
  }
}
