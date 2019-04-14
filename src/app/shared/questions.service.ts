import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Question } from './question';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private _http: HttpClient) { }

  questionUrl: string = "http://localhost:57193/api/Questions?DomainId=";
  questions: any[];

  getQuestions(domainId: number): Observable<Question[]> {
    return this._http.get<Question[]>(this.questionUrl + domainId.toString())
    .do(data => console.log('Questions retrieved: '+JSON.stringify(data)))
    .catch(this.handleError);
  }

  postQuestion(domainId: number, question: Question) {
    return this._http.post(this.questionUrl + domainId.toString(), question)
    .do(data => console.log('Response of POST question: '+JSON.stringify(data)))
    .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }
}
