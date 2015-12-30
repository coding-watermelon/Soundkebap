import {bootstrap, Component, NgFor, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/angular2';


@Component({
    selector: 'my-app',
    templateUrl: "app/app.component.html",
    directives: [NgFor],
    changeDetection: ChangeDetectionStrategy.OnPushObserve
})

export class AppComponent {
    public playlists:Array<Object>

    constructor(private ref: ChangeDetectorRef){
        this.playlists = []
        this.playNiceMusic()
    }

    playNiceMusic() {
        SC.resolve("https://soundcloud.com/sebastian-rehfeldt-1").then((user) =>{
            SC.get("/users/"+user.id+"/playlists").then((response)=>{
                this.playlists = response
                this.ref.markForCheck()
                this.ref.detectChanges()
                console.log(response)
                SC.stream("/tracks/"+response[0].tracks[0].id).then(function(player){
                    player.play()
                 })
            })
        })
    }
}
bootstrap(AppComponent);
