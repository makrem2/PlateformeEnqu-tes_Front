import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../_services/Authentification/token-service.service';
import { AuthenticationService } from '../_services/Authentification/authentication.service';

export const entrepriseGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | boolean | UrlTree => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);
  const tokenService = inject(TokenServiceService);

  if (!tokenService.isTokenValid()) {
    tokenService.clearTokens();
    return router.createUrlTree(['/'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return authService.isEntreprise()
    ? true
    : router.createUrlTree(['/'], {
        queryParams: { returnUrl: state.url },
      });
};
