import { Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { AuthFacade } from 'src/app/auth/facade/auth.facade';

// ✅ Functional Guard (recommended in Angular 15+)
export const authGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  return authFacade.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      return isAuthenticated ? true : router.createUrlTree(['/login']);
    })
  );
};
