import {Component} from 'angular2/core';
import {Track} from './track'
import {StreamingService} from './streaming.service'


@Component({
  selector: 'track-display',
  template: `
    <div class="track-display" *ngIf="currentTrack.id">
      {{currentTrack.id}}
      <div class="track-artwork">
        <img src="https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg"/>
      </div>
      <div class="track-info">
        <div class="track-name">
          {{ currentTrack.info }}
        </div>
        <div class="track-user">
          Alle Farben
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
