import {Component} from 'angular2/core';
import {Track} from './track'
import {StreamingService} from './streaming.service'


@Component({
  selector: 'track-display',
  template: `
    <div class="track-display" *ngIf="currentTrack.id">
      <div class="track-artwork">
        <img [src]="currentTrack.info['artwork_url']"/>
      </div>
      <div class="track-info">
        <div class="track-name">
          {{ currentTrack.info.title }}
        </div>
        <div id="progressbar-wrapper">
          <div id="time-progress">{{progress.currentTime}}</div>
          <div id="progressbar" class="progress" (click)="goToSecond($event, this)" >
            <div class="progress-bar progress-bar-info"
                  role="progressbar"
                  aria-valuenow="45"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  [style.width.%]="progress.percentage">
              <span class="sr-only">45% Complete</span>
            </div>
          </div>
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
  public progress;

  constructor(private _streamingService: StreamingService) {
    this.currentTrack = this._streamingService.currentTrack
    this.progress = this._streamingService.songProgress
  }

  goToSecond(event, elem){
    let progressBar = document.getElementById('progressbar')
    let percent = event.offsetX  / progressBar.offsetWidth
    console.log(progressBar.offsetWidth, event.offsetX, percent)
    this._streamingService.goTo(percent)
  }

}
