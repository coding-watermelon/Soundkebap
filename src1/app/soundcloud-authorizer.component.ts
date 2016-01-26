import {Component} from 'angular2/core';


@Component({
  selector: 'soundcloud-authorizer',
  template: `
    <div id="soundcloud-authorizer">
      <span id="authorizer-description">
        In order to provide you with musik you like we
        need you to connect with your Soundcloud-Account
      </span>
      <button class="btn soundcloud-connect" (click)="connectWithSoundcloud()">
        <i class="fa fa-soundcloud fa-2x"><span>Connect with Soundcloud</span></i>
      </button>
    </div>
  `,
  inputs: ['clientId', 'callbackUrl']
})

export class SoundcloudAuthorizer {
  public clientId : string;
  public callbackUrl : string;

  connectWithSoundcloud(){
    this.clientId = "a1c4188f7622b71c3e7c6cf7567fc488"
    window.location.href = `
    https://soundcloud.com/connect?client_id=` + this.clientId +
    "&display=popup&redirect_uri=http%3A%2F%2Flocalhost%3A7070" +
    "&response_type=code_and_token&scope=non-expiring&state=SoundCloud_Dialog_48a88"
  }


}
