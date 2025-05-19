import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = `${environment.apiUrl}questions`;

  constructor(private http: HttpClient) {}

  getAllQuestions(): Observable<any> {
    return this.http.get(this.apiUrl + '/getAllQuestions');
  }

  getQuestionById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getQuestionById/${id}`);
  }

  createQuestion(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/createQuestion', data);
  }

  updateQuestion(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateQuestion/${id}`, data);
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteQuestion/${id}`);
  }
}
