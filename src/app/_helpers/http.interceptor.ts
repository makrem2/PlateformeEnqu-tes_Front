import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenServiceService } from '../_services/Authentification/token-service.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenServiceService: TokenServiceService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Get the token from storage
    const token = this.tokenServiceService.getToken();

    // Clone the request and add the token to the headers
    if (token) {
      request = request.clone({
        setHeaders: {
          'x-access-token': `${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle authorization errors
        if (error.status === 403) {
          this.tokenServiceService.clearTokens();
          this.router.navigate(['/'], {
            queryParams: { sessionExpired: true },
          });
        }

        if (error.status === 403) {
          this.router.navigate(['/access-denied']);
        }

        return throwError(error);
      })
    );
  }
}
