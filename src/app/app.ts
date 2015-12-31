import {bootstrap, Component, NgFor, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/angular2';

@Component({
    selector: 'my-app',
    templateUrl: "app/app.component.html",
    directives: [NgFor],
    changeDetection: ChangeDetectionStrategy.OnPushObserve
})

export class AppComponent {
    public playlists:Array<Object>
    public trackId:int
    public trackNumber:int
    public player
    public playing:boolean
    public widget:Object

    constructor(private ref: ChangeDetectorRef){
        this.playlists = []
        this.trackNumber=0
        this.playing=false
        this.getNiceMusic()
    }

    private update() {
        this.ref.markForCheck()
        this.ref.detectChanges()
    }

    getNiceMusic() {
        SC.resolve("https://soundcloud.com/sebastian-rehfeldt-1").then((user) =>{
            SC.get("/users/"+user.id+"/playlists").then((response)=>{
                this.playlists = response
                this.trackId = this.playlists[0].tracks[this.trackNumber].id
                this.update();
                console.log(response)
            })
        })
    }

    play(){
        SC.oEmbed(this.playlists[0].tracks[this.trackNumber].uri, { auto_play: true }).then((oEmbed) =>{
            console.log('oEmbed response: ', oEmbed);
            this.widget = oEmbed.html
            this.update()
        });
    }

    next(){
        SC.oEmbed(this.playlists[0].tracks[++this.trackNumber].uri, { auto_play: true }).then((oEmbed) =>{
            console.log('oEmbed response: ', oEmbed);
            this.widget = oEmbed.html
            this.update()
        });
    }
}
bootstrap(AppComponent);
