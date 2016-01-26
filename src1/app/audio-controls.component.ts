import {Component} from 'angular2/core';
import {StreamingService} from './streaming.service'


@Component({
  selector: 'audio-controls',
  template: `
    <div class="audio-controls">
      <button class="audio-control" (click)="togglePlay()">
        <i  class="fa fa-play fa-2x"
            [class.fa-play]="!playing"
            [class.fa-pause]="playing">
        </i>
      </button>
      <button class="audio-control" (click)="next()"><i class="fa fa-forward fa-2x"></i></button>
    </div>
  `
})

export class AudioControls {
  public playing:Boolean = false;

  constructor(private _streamingService: StreamingService) { }

  togglePlay(){
    this.playing = !this.playing
    if(this._streamingService.playing()){
      this._streamingService.pause()
    }else{
      console.log("Start playing")
      this._streamingService.play()
    }
  }

  next(){
    this._streamingService.next()
  }

}
