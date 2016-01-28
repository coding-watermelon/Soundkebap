import {Component} from 'angular2/core';
import {Track} from './track'
import {StreamingService} from './streaming.service'


@Component({
  selector: 'track-display',
  template: `
    <div class="track-display" *ngIf="currentTrack.id">
      <div class="track-artwork">
        <img [src]="currentTrack.info['artwork-url']"/>
      </div>
      <div class="track-info">
        <div class="track-name">
          {{ currentTrack.info.title }}
        </div>
        <div class="track-user">
          {{ currentTrack.info.username }}
        </div>

      </div>
    </div>
  `
})

export class TrackDisplay {
  public currentTrack:Track;

  constructor(private _streamingService: StreamingService) {
    this.currentTrack = this._streamingService.currentTrack
  }

}
