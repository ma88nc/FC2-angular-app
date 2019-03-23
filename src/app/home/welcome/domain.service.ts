import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { Domain } from './domain';

@Injectable()
export class DomainService {

  private _domainUrl = 'http://localhost:57193/api/Domains';
  constructor(private _http: HttpClient) { }

  getAll() : Observable<Domain[]> {
    return this._http.get<Domain[]>(this._domainUrl)    
    .do(data => console.log('All: ' + JSON.stringify(data)))
    .catch(this.handleError); 

 /*     return [
      { id: 1, description: 'General Knowledge' },
      { id: 2, description: 'Software Development' },
      { id: 3, description: 'Sports' } 
    ];  */
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }

}
