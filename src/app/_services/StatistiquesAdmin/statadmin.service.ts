import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatadminService {
  private apiUrl = `${environment.apiUrl}Statsadmin`;

  constructor(private http: HttpClient) {}

  getAdminStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getTauxReponseParEntreprise(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getTauxReponseParEntreprise`);
  }

  getTotalEnquetesParEntreprise(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getTotalEnquetesParEntreprise`);
  }
}
