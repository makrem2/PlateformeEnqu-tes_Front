import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { TokenServiceService } from './token-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: any;
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = `${environment.apiUrl}auth`;
  private loggedIn$ = new BehaviorSubject<boolean>(false);
  helper = new JwtHelperService();

  refreshTokenn={
    refreshToken:''
  }
  constructor(
    private http: HttpClient,
    private tokenService: TokenServiceService,
    private router: Router
  ) {

    this.refreshTokenn.refreshToken = this.tokenService.getToken() || '';

  }

  signup(user: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/signup`, user)
      .pipe(catchError((error) => this.handleError(error)));
  }

  signin(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/signin`,
      credentials,
      httpOptions
    );
  }

  verifyEmail(token: string, verificationCode: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token)
      .set('verificationCode', verificationCode);

    return this.http.put(`${this.apiUrl}/verify-email`, null, { params });
  }

  logout(data:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signout`, data, httpOptions);
  }

  ClearSession_id(userId:any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/ClearSession_id/${userId}`, {});
  }

 // app.patch("/api/auth/ClearSession_id/:userId", controller.ClearSession_id);


  refreshToken() {
    return this.http.post(
      `${this.apiUrl}/refresh-token`,this.refreshTokenn
    );
  }

  getAllActivityLogs(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/getAllActivityLogs`, {
      params,
    });
  }

  /**
   * Handle errors globally for authentication
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message || 'An unexpected error occurred';
    return throwError(() => new Error(errorMessage));
  }

  isLoggedIn(): boolean {
    return this.tokenService.isTokenValid();
  }

  isAdmin(): boolean {
    return this.isRole('ROLE_ADMIN');
  }

  isEntreprise(): boolean {
    return this.isRole('ROLE_ENTREPRISE');
  }

  isRole(role: string): boolean {
    return (
      this.tokenService.getRole() === role &&
      !this.helper.isTokenExpired(this.tokenService.getToken()!)
    );
  }
}
