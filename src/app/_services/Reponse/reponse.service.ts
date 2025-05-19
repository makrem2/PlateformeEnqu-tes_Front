import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReponseService {
  private apiUrl = `${environment.apiUrl}reponses`;

  constructor(private http: HttpClient) {}

  getAllReponses(params?: any): Observable<any> {
    return this.http.get(this.apiUrl, { params });
  }

  getReponseById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createReponse(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateReponse(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteReponse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
