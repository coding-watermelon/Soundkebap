'use strict'
import {Injectable} from 'angular2/core';
import {Track} from './track'
import {DataProvider} from './data-provider.service';

@Injectable()
export class StreamingService {
  private _audio = document.createElement("AUDIO")
  public tracks:Track[] = []
  public currentTrack:Track = {id: null, info: '' }

  constructor(private _dataProvider: DataProvider) { }

  next(startPlaying:Boolean){
    if ( this.tracks.length < 2 ){
      this._dataProvider.getTracks().then(Tracks => {
        this.tracks = this.tracks.concat(Tracks)
        this.setTrack()

        if ( startPlaying )
          this._audio.play()
      })
    }else{
      this.setTrack()
    }
  }

  setTrack(){
    let shouldRestart = this.playing

    this.currentTrack.id = this.tracks[0].id
    this.currentTrack.info = this.tracks[0].info
    this._audio.src = 'https://api.soundcloud.com/tracks/'+ this.currentTrack.id +'/stream?client_id=a1c4188f7622b71c3e7c6cf7567fc488'
    this.tracks.splice(0, 1)

    if ( shouldRestart )
      this.play()
  }

  play() {
    if ( this.currentTrack.id === null )
      this.next(true)
    else
      this._audio.play()
  }

  pause() {
    this._audio.pause()
  }

  playing() {
    return !(this._audio.paused)
  }
}
