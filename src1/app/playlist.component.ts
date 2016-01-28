import {Component} from 'angular2/core';
import {Track} from './track'
import {DataProvider} from './data-provider.service';
import {StreamingService} from './streaming.service'

@Component({
  selector: 'playlist',
  template: `
    <div id="playlist" class="col-md-6 col-md-offset-6" *ngIf="data.tracks">

        <div class="track" *ngFor="#track of data.tracks">

          <div class="row">
            <div class="col-sm-4">
              <img [src]="track.info['artwork_url']"/>
            </div>
            <div class="col-sm-8">
              <span class="track-title">{{track.info.title}}</span>
              <span class="track-username">{{track.info.username}}</span>
            </div>
          </div>

        </div>

    </div>
  `
})

export class Playlist {
  public data;

  constructor(private _streamingService: StreamingService) {
    this.data = this._streamingService.pub
  }

}
