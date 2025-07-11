import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está autenticado, redirigir al home
  if (authService.isAuthenticated()) {
    void router.navigate(['/home']);
    return false;
  }

  // Si NO está autenticado, permitir acceso al login
  return true;
};
