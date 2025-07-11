import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  const token = authService.token;
  const excludeUrls = [
    '/api/v1/auth/login-body'
  ];

  const isExclude = excludeUrls.some(url => req.url.includes(url));

  return next(!isExclude && token ?
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }) : req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          authService.signOut();
          toastr.error('Token expirado');
          void router.navigate(['/sign-in']);
        }

        return throwError(() => error);
      })
    );
};
