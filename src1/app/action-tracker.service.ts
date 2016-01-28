import {Injectable} from 'angular2/core';
import {Track} from './track'
import {Http, Headers} from 'angular2/http'
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ActionTracker {
  constructor(private _http:Http){}

  login(){
    return this._http.post('/api/login', "")

  }

  trackSkipped(id, seconds){
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    this._http.post('/api/track/skipped', 'id='+id+"&seconds="+seconds, {headers: headers})
      .map(res => res.json())
      .subscribe(
        data => console.log(data),
        err => console.log(err),
        () => console.log('Authentication Complete')
      );
  }

  trackPlayed(id){
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this._http.post('/api/track/played', 'id='+id, {headers: headers})
        .map(res => res.json())
        .subscribe(
          data => console.log(data),
          err => console.log(err),
          () => console.log('Authentication Complete')
        );
  }
}
