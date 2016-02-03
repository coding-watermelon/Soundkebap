'use strict'
/*
Short Module description

*/

module.exports = {
  getRecommendation
}

const q                   = require('q'),
      contentRecommender  = require(__dirname + "/contentRecommender.js"),
      db                  = require(__dirname + "/../database/database.js")

function getRecommendation(user){
    const deferred = q.defer()

    contentRecommender.getRecommendation(user).then(function(tracks){
        db.getHistory(user.id).then(function(history){
            const currentDate = Date.now()
            let sortedTracks = []

            for(let i=0;i<tracks.length;i++){
                let trackId = tracks[i].id
                if(history.hasOwnProperty(trackId)){
                    let timespan = currentDate - history[trackId]["last-listened"]

                    //don't play this song the next 4 hours
                    const minTimespan = 144000000 //1000ms * 60s * 60min * 4h
                    if(timespan > minTimespan){
                        //give a penalty to already listened songs
                        let listeningPenalty = Math.min(3, (0.5*Math.log2(history[trackId]["listening-count"]+1) +
                                                            Math.log2(history[trackId]["skip-count"]+1)))
                        tracks[i].value -= listeningPenalty
                        sortedTracks.push([tracks[i], tracks[i].value])
                    }
                }
                else{
                    //if song is not in history, it will get no penalty
                    sortedTracks.push([tracks[i], tracks[i].value])
                }
            }

            sortedTracks.sort(function(a, b) {return b[1] - a[1]})
            sortedTracks = sortedTracks.map(function ( track ) { return track[0] })

            let i=0
            let j=0
            let recommendedTracks = []
            let recommendedArtists = {}

            function collectSongs(){
                let artist = sortedTracks[j].info.username
                if(artist != undefined){
                    if(recommendedArtists.hasOwnProperty(artist)){
                        if(recommendedArtists[artist]<2){
                            recommendedTracks.push(sortedTracks[j])
                            recommendedArtists[artist]++
                            i++
                        }
                    }
                    else{
                        recommendedTracks.push(sortedTracks[j])
                        recommendedArtists[artist] = 1
                        i++
                    }
                    j++

                    if(i<20 && j<sortedTracks.length)
                        collectSongs()
                    else
                        deferred.resolve(recommendedTracks)
                }
                else{
                    getSongInformation(sortedTracks[j].id).then(function(info){
                        sortedTracks[j].info = info
                        collectSongs()  //instead of rewriting the upper procedure for adding, we just call the function without incrementing i or j
                    })
                }

            }

            function getSongInformation(id){
                const deferred = q.defer()
                db.getSongById(id).then(function(track){
                    deferred.resolve({
                            "title":        track.title,
                            "artwork_url":  track.artwork_url,
                            "username":     track.username
                        })
                })
                return deferred.promise
            }

            collectSongs()
        })
    })

    return deferred.promise
}



//const user = { id: 131842115,
//    kind: 'user',
//    permalink: 'sebastian-rehfeldt-1',
//    username: 'Sebastian Rehfeldt',
//    last_modified: '2015/10/14 13:21:49 +0000',
//    uri: 'https://api.soundcloud.com/users/131842115',
//    permalink_url: 'http://soundcloud.com/sebastian-rehfeldt-1',
//    avatar_url: 'https://i1.sndcdn.com/avatars-000123963373-p1mmtc-large.jpg',
//    country: null,
//    first_name: 'Sebastian',
//    last_name: 'Rehfeldt',
//    full_name: 'Sebastian Rehfeldt',
//    description: null,
//    city: null,
//    discogs_name: null,
//    myspace_name: null,
//    website: null,
//    website_title: null,
//    online: false,
//    track_count: 0,
//    testGroup: "",
//    playlist_count: 1,
//    plan: 'Free',
//    public_favorites_count: 3,
//    followers_count: 6,
//    followings_count: 17,
//    subscriptions: [] }
//getRecommendation(user).then(function(response){console.log(response)})