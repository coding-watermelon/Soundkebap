import {Http, Headers} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {Track} from './track'
import {Observable} from 'rxjs/Observable';


@Injectable()
export class DataProvider {
  private _audio = document.createElement("AUDIO")
  public userId : String;

  constructor(private _http:Http){}

  getTracks(){
    return this._http.get('/api/newTracks')
      // .subscribe(
      //   data => console.log(data),
      //   err => console.log(err),
      //   () => console.log('Authentication Complete')
      // );
  }
}
