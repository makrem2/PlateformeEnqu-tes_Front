import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { User } from '../../_models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userdataSubject = new BehaviorSubject<any>(null);
  userdata$ = this.userdataSubject.asObservable();

  private apiUrl = `${environment.apiUrl}user`;
  constructor(private http: HttpClient) {}

  setUserdata(data: any) {
    this.userdataSubject.next(data);
  }

  getUserdata() {
    return this.userdataSubject.getValue();
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-password-reset`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      newPassword,
    });
  }

  getAllUsersByRole(role: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAllUsersByRole/${role}`);
  }

  getAllUsers(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}/getAllUsers`, {
      params,
    });
  }

  getOneUser(id: any): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getOneUser/${id}`, {
      withCredentials: true,
    });
  }

  delete$ = (serverId: any) =>
    <Observable<User>>(
      this.http
        .delete<User>(`${this.apiUrl}/deleteUser/${serverId}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occurred - Error code: ${error.status}`);
  }

  updateAdminUser(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateAdminUser/${id}`, data);
  }

  updateUser(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateUser/${id}`, data);
  }

  updateUserPassword(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateUserPassword/${id}`, data);
  }

  updateUserImage(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateUserImage/${id}`, data);
  }

  blockUser(user_id: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/blockUser/${user_id}`, {});
  }

  unblockUser(user_id: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/unblockUser/${user_id}`, {});
  }

}
