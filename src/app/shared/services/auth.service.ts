import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.dev';



const ACCESS_TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.api.base}/api/v1/auth`;
  private readonly isAuthenticatedSignal = signal(this.hasValidToken());

  constructor() {
    console.log('AuthService initialized');
    console.log('Initial token check:', this.hasValidToken());
    console.log('Current token:', localStorage.getItem(ACCESS_TOKEN_KEY));
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      console.log('No token found');
      return false;
    }
    
    try {
      const exp = JSON.parse(atob(token.split('.')[1])).exp;
      const isExpired = exp * 1000 <= Date.now();
      console.log('Token expiration check:', exp, 'isExpired:', isExpired);
      return !isExpired;
    } catch (error) {
      console.log('Token parsing error:', error);
      return false;
    }
  }

  signIn(username: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>(`${this.apiUrl}/login-body`,
        { userName: username, password: password },
        { observe: 'response' }
      )
      .pipe(
        tap(response => {
          const token = response.body?.token;
          console.log('🔐 Login response received, token:', !!token);
          if (token) {
            this.storeToken(token);
            console.log('🔐 Token stored successfully');
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
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    console.log('🔐 isAuthenticated check - token exists:', !!token);
    
    if (!token) {
      console.log('🔐 No token, not authenticated');
      return false;
    }
    
    console.log('🔐 Token found, user is authenticated');
    return true;
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

  get roles(): string[] {
    try {
      const jwt = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!jwt) return [];
      
      const decodedRoles = JSON.parse(atob(jwt.split('.')[1])).roles || [];
      console.log('🔐 Roles from JWT:', decodedRoles);
      
      // TEMPORAL: Para debugging, forzar que sea ADMIN si está autenticado
      if (decodedRoles.length === 0 && jwt) {
        console.log('🔧 DEBUG: Forzando rol ADMIN para testing');
        return ['ADMIN'];
      }
      
      return decodedRoles;
    } catch (error) {
      console.log('🔐 Error getting roles:', error);
      // TEMPORAL: Si hay token pero error parsing, asumir ADMIN
      const jwt = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (jwt) {
        console.log('🔧 DEBUG: Error parsing, forzando ADMIN');
        return ['ADMIN'];
      }
      return [];
    }
  }

  hasAnyRole(requiredRoles: string[]): boolean {
    const rolesFromUser: string[] = this.roles;
    return requiredRoles.some(requiredRole => rolesFromUser.includes(requiredRole));
  }

  isAdmin(): boolean {
    return this.roles.includes('ADMIN');
  }

  isOperador(): boolean {
    return this.roles.includes('OPERADOR');
  }
}
