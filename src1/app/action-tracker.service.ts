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

  trackSkipped(id, seconds){
    this._http.post('/api/track/skipped', 'id='+id+"&seconds="+seconds)
      .subscribe(
        data => console.log(data),
        err => console.log(err),
        () => console.log('Authentication Complete')
      );
  }

  trackPlayed(id){
      console.log("trackPlayed")
      this._http.post('/api/track/played', 'id='+id)
        .subscribe(
          data => console.log(data),
          err => console.log(err),
          () => console.log('Authentication Complete')
        );
  }
}
