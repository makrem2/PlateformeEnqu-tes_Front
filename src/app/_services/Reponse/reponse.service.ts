import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReponseService {
  private apiUrl = `${environment.apiUrl}reponses`;

  constructor(private http: HttpClient) {}

  createReponse(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createReponses`, data);
  }

  getReponsesByEnqueteAndEntreprise(
    enqueteId: string,
    entrepriseId: string
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/getReponsesByEnqueteAndEntreprise/${enqueteId}/${entrepriseId}`
    );
  }

  getEnquetesRepondues(entrepriseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/repondues/${entrepriseId}`);
  }
  getDerniereEnqueteRepondue(entrepriseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/derniere-repondue/${entrepriseId}`);
  }

  getAllEnquetesRepondues(entrepriseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/repondues/${entrepriseId}`);
  }

  //http://localhost:8081/api/reponses/getAllReponsesParEntreprise

  getAllReponsesParEntreprise(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllReponsesParEntreprise`);
  }
}
