import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnqueteService {

  private apiUrl = `${environment.apiUrl}enquete`;

  constructor(private http: HttpClient) {}

  getAllEnquetes(params: any): Observable<any> {
    return this.http.get(this.apiUrl + "/getAllEnquetes", { params });
  }

  getEnqueteById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getEnqueteById/${id}`);
  }

  createEnquete(data: any): Observable<any> {
    return this.http.post(this.apiUrl + "/createEnquete", data);
  }

  updateEnquete(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateEnquete/${id}`, data);
  }

  deleteEnquete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteEnquete/${id}`);
  }

}
