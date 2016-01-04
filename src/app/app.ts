import {bootstrap, Component, NgFor, ChangeDetectionStrategy, ChangeDetectorRef. ElementRef} from 'angular2/angular2';

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
    public playing:boolean
    public player:Object
    public element:HTMLElement

    constructor(private ref: ChangeDetectorRef, private elementRef: ElementRef){
        this.element= elementRef.nativeElement

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

                SC.oEmbed(this.playlists[0].tracks[this.trackNumber].uri, { auto_play: false }).then((oEmbed) =>{
                    this.widget = oEmbed.html
                    this.update()
                })

                this.update()
            })
        })
    }

    play(){
        this.player = SC.Widget(this.element.getElementsByTagName("iframe")[0])
        this.player.play()
        this.player.bind(SC.Widget.Events.FINISH, () => {
            this.next()
        })
    }

    next(){
        this.player.load(this.playlists[0].tracks[++this.trackNumber].uri, {
            auto_play: true
        })
    }

    login(){
        SC.connect().then(function(){
            console.log("login")
        })
    }
}
bootstrap(AppComponent);
