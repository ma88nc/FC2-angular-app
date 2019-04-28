import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private _http: HttpClient) { }

  addImage(fullFileName: string, base64File: any)
  {
    const data = {'image': base64File, 'fullFileName' : fullFileName};
    var apiUrl = `${environment.apiGatewayUrl}/upload-image`;
    console.log(`${environment.apiGatewayUrl}/upload-image`);

    return this._http.post(apiUrl, data)
   // .do(data => console.log('Response of POST question: '+JSON.stringify(data)))
    .catch(this.handleError);

  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }
}
