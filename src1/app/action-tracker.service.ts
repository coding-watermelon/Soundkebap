import {Injectable} from 'angular2/core';
import {Track} from './track'
import {Http} from 'angular2/http'

@Injectable()
export class ActionTracker {
  constructor(private _http:Http){}

  login(){
    this._http.post('/api/login', "")
    .subscribe(
      data => console.log(data),
      err => console.log(err),
      () => console.log('Authentication Complete')
    );
  }
}
