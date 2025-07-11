import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (!authService.isAuthenticated()) {
    toastr.error('Sesion finalizada.');
    router.navigate(['/sign-in']);
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];
  if (requiredRoles && !authService.hasAnyRole(requiredRoles)) {
    toastr.error('No tiene permiso para ver esta pagina');
    router.navigate(['/']);
    return false;
  }

  return true;
};
