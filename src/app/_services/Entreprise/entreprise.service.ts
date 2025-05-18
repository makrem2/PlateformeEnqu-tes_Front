import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EntrepriseService {
  private apiUrl = `${environment.apiUrl}entreprise`;
  constructor(private http: HttpClient) {}

  updateEntreprise(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateentreprise/${id}`, data);
  }

  getOneEntreprise(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/getOneEntreprise/${id}`);
  }
}
