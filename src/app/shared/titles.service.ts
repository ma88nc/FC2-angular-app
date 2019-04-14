import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Title } from './title';

@Injectable({
  providedIn: 'root'
})
export class TitlesService {

  constructor(private _http: HttpClient) { }

  titleUrl : string = "http://localhost:57193/api/Titles?DomainId="
  titles: any[];

 /*  getTitles(domainId : number) : Observable<Title[]> {
    return this._http.get<Title[]>(this.titleUrl + domainId.toString())    
      .do(data => console.log('Incoming Titles: ' + JSON.stringify(data))
    //  .do(data => this.tags = this.unflatten(data))
    //  .map((response) => new TreeNode(response.tagDescription, response.tagId, response.children))
        .map((response) => response = this.titles)
    //  .do((data) => console.log('Map to tree node fields: ' + JSON.stringify(this.tags)))
    .catch(this.handleError); 
  } */

  getTitles(domainId : number) : Observable<Title[]> {
  return this._http.get<Title[]>(this.titleUrl + domainId.toString())
    .do(data => console.log('New test: ' + JSON.stringify(data)))
    .catch(this.handleError); 
   }

  addTitle(domainId: number, title: Title) {
  return this._http.post(this.titleUrl + domainId.toString(), title)
  .do(data => console.log('Response of POST Title: '+JSON.stringify(data)))
  .catch(this.handleError);
}

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);  
  }
}
