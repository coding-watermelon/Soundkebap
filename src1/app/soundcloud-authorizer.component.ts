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
    this.clientId = "91bc651673fe4dd9d15c4d84b0627a93"
    this.callbackUrl = "http://soundkebap.markus-petrykowski.de/"
    // window.location.href = `
    // https://soundcloud.com/connect?client_id=` + this.clientId +
    // "&display=popup&redirect_uri=" + this.callbackUrl +
    // "&response_type=code_and_token&scope=non-expiring&state=SoundCloud_Dialog_48a88"

  }


}
