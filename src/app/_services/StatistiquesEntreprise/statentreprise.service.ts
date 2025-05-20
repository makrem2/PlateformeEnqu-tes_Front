import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatentrepriseService {
  private apiUrl = `${environment.apiUrl}Statsentreprise`;

  constructor(private http: HttpClient) {}

  getEntrepriseStats(entrepriseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/${entrepriseId}`);
  }


  getReponsesMensuelles(entrepriseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getReponsesMensuelles/${entrepriseId}`);
  }



  getReponsesParType(entrepriseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getReponsesParType/${entrepriseId}`);
  }
}
