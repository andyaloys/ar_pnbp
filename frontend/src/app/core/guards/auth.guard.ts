import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.getToken()) {
    return true;
  }

  // Jika belum login, arahkan ke halaman login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Jika sudah login, cegah akses form login dan arahkan langsung ke dashboard
  if (authService.isLoggedIn() && authService.getToken()) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
