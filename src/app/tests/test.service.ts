import { Injectable } from '@angular/core';
//import { Test } from './test';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestConfig } from './test-config';
import { Question } from '../shared/question';
import { TestQuestion } from './TestQuestion';
import { BehaviorSubject } from 'rxjs';
import { Test } from './test';

@Injectable()
export class TestService {
  private _testUrl; //= 'http://localhost:57193/api/Questions/Test?DomainId=1&NumberOfQuestions=6&tags=<tags><tag>3</tag><tag>22</tag></tags>';
  private domain: number;
  private numberOfQuestions: number;
  private tagList: string = '<tags></tags>';
  private _testUrl1 = 'http://localhost:57193/api/Questions/Test?DomainId=';
  private _testUrl2 = '&NumberOfQuestions='
  private _testUrl3 = '&tags=';
 // private test = new Test();
  
  constructor(private _http: HttpClient) { }

 getNewTestQuestions(config: TestConfig) : Observable<TestQuestion[]> {
   console.log("in getNewTestQuestions!!");

   this.
     //Set local variables to config values to be used by test URL.
     /*   this.domain = config.DomainID;
       this.numberOfQuestions = config.numberOfQuestions;
       this.tagList = config.tagList; */
     _testUrl = this._testUrl1 + config.DomainID.toString() + this._testUrl2 + config.numberOfQuestions.toString();
      if (config.tagList != null)
      {
        this._testUrl += this._testUrl3 + config.tagList;
      }
     
   console.log("Test URL is: " + this._testUrl);

   return this._http.get<TestQuestion[]>(this._testUrl)
 //  .map(data => this.test.Questions = data)
   .do(data => console.log('New test: ' + JSON.stringify(data)))
   .catch(this.handleError); 
  }

  private handleError(err: HttpErrorResponse) {
    console.log('Error from http call: ' + err.message);
    return Observable.throw(err.message);
  }

     /* --------------------Test config----------------- */
     private test = new BehaviorSubject<Test>(null);
     currentTest = this.test.asObservable();
  
    changeTest(test: Test)
    {
      this.test.next(test);
    }
}