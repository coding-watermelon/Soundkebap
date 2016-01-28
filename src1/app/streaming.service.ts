'use strict'
import {Injectable} from 'angular2/core';
import {Track} from './track'
import {DataProvider} from './data-provider.service';
import {ActionTracker} from './action-tracker.service'


@Injectable()
export class StreamingService {
  private _audio = document.createElement("AUDIO")
  public tracks:Track[] = []
  public currentTrack:Track = {id: null, info: '' }
  public pub = {
    tracks: [],
    loading: true
  }
  public songProgress = {
    percentage: 0,
    currentTime: '0:00'
  };
  private _playedSeconds:Number = 0;
  private _playingSince:Number = 0;

  constructor(private _dataProvider: DataProvider,
              private _actionTracker: ActionTracker) {
      this._audio.addEventListener('ended', event => {
          this.next(true)
      })
      this._audio.addEventListener('play', event => {
          this._playingSince = this._audio.currentTime
      })
      this._audio.addEventListener('pause', event => {
          this._playedSeconds += this._audio.currentTime - this._playingSince
      })
      this._audio.addEventListener('timeupdate', event => {
          this.songProgress.percentage = Math.floor( ( (this._audio.currentTime / this._audio.duration) * 100 ) )
          this.songProgress.currentTime = Math.floor(this._audio.currentTime / 60) + ":" + Math.floor( ( this._audio.currentTime - ( Math.floor(this._audio.currentTime / 60) * 60 ) ) )
      })
      this._audio.addEventListener('durationchange', (event) => {
        console.log("Duration changed to ", this._audio.duration)
      })
  }

  loadData(){
    this._dataProvider.getTracks().subscribe(
      data => {
        data = data.json()
        this.tracks = this.tracks.concat(data)
        this.pub.tracks = this.tracks
        this.setTrack()
        this.pub.loading = false
      },
      err => {console.log(err)}
    )
  }

  next(startPlaying:Boolean) : void {
    //Monitor if a track was skipped due to dislike
    this._playedSeconds += this._audio.currentTime - this._playingSince
    // if(this._playedSeconds < 20)
    this._actionTracker.trackSkipped(this.currentTrack.id, this._playedSeconds)

    if ( this.tracks.length < 4 ){
      this._dataProvider.getTracks().subscribe(data => {
        data = data.json()
        this.tracks = this.tracks.concat(data)
        this.pub.tracks = this.tracks
        this.setTrack()

        if ( startPlaying )
          this._audio.play()
      })
    }else{
      this.setTrack(startPlaying)
    }
  }

  setTrack(auto:Boolean) : void {
    let shouldRestart = this.playing()

    this._playedSeconds = 0
    this._playingSince = 0
    this.currentTrack.id = this.tracks[0].id
    this.currentTrack.info = this.tracks[0].info
    this._audio.src = 'https://api.soundcloud.com/tracks/'+ this.currentTrack.id +'/stream?client_id=a1c4188f7622b71c3e7c6cf7567fc488'
    this.tracks.splice(0, 1)
    this.pub.tracks = this.tracks

    this._actionTracker.trackPlayed(this.currentTrack.id)

    if ( shouldRestart || auto )
      this.play()
  }

  play() : void {
    if ( this.currentTrack.id === null )
      this.next(true)
    else
      this._audio.play()
  }

  pause() : void {
    this._audio.pause()
  }

  playing() : Boolean {
    return !(this._audio.paused)
  }

  goTo(percent:number) : void {
    let second = percent * this._audio.duration
    this.songProgress.percentage = percent

    if(second > this._audio.duration)
      second = this._audio.duration

    if(this.playing()){
      this._playedSeconds += this._audio.currentTime - this._playingSince
      this._playingSince = second
    }

    this._audio.currentTime = second
  }

}
