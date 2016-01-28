'use strict'
import {Component, OnInit} from 'angular2/core';
import {Track} from './track'
import {AudioControls} from './audio-controls.component';
import {TrackDisplay} from './track-display.component';
import {Playlist} from './playlist.component';
import {SoundcloudAuthorizer} from './soundcloud-authorizer.component';
import {StreamingService} from './streaming.service'
import {ActionTracker} from './action-tracker.service'
import {DataProvider} from './data-provider.service';

import {HTTP_PROVIDERS} from 'angular2/http';

@Component({
    selector: 'my-app',
    providers: [StreamingService, DataProvider, ActionTracker, HTTP_PROVIDERS],
    directives: [TrackDisplay, AudioControls, SoundcloudAuthorizer, Playlist],
    template:`
      <soundcloud-authorizer *ngIf="!loggedIn"></soundcloud-authorizer>
      <div class="row" *ngIf="loggedIn">
        <div class="col-sm-6 wrapper">
          <audio-controls *ngIf="loggedIn"></audio-controls>
          <track-display *ngIf="loggedIn"></track-display>
        </div>
        <div class="col-sm-6 wrapper">
          <playlist></playlist>
        </div>
      </div>
    `
})



export class AppComponent implements OnInit {
  public loggedIn : Boolean = false;

  constructor(private _streamingService: StreamingService,
              private _dataProvider: DataProvider,
              private _actionTracker: ActionTracker) { }

  ngOnInit(){
    // this._streamingService.setTrack()
    // this._streamingService.play()
      let queryString = this.queryString()
      if(queryString.hasOwnProperty('userId')){
        document.cookie = "user-id="+queryString.userId
        document.cookie = "access-token="+queryString.access_token
      }

      if(this.getCookie('user-id') != "" ){
        this.loggedIn = true
        this._actionTracker.login()
          .subscribe(
            data => {
              this._dataProvider.userId = this.getCookie('user-id')
              this._streamingService.loadData()
            },
            err => console.log(err),
            () => console.log('Authentication Complete')
          );

      }
  }

  queryString(){
    let qs = window.location.search.substr(1).split('&')
    let queryString = {}
    for(var i=0; i<qs.length; i++){
      let pair = qs[i].split('=')
      queryString[pair[0]] = pair[1]
    }
    let hash = window.location.hash.substr(1).split('&')
    for(var i=0; i<hash.length; i++){
      let pair = hash[i].split('=')
      queryString[pair[0]] = pair[1]
    }
    if(queryString.hasOwnProperty('access_token')){
      queryString.userId = queryString['access_token'].split('-')[2]
    }
    return queryString
  }

  getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
  }

}
