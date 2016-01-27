'use strict'
/*
 Short Module description

 */

const module1 = require(__dirname + '/modules/module1.js'),
    module2 = require(__dirname + '/modules/module2.js'),
    module3 = require(__dirname + '/modules/module3.js'),
    module4 = require(__dirname + '/modules/module4.js'),
    soundcloud = require(__dirname + '/../soundcloud/connector.js'),
    SC = require('node-soundcloud'),
    q = require('q')

module.exports = {
    getRecommendation,
    collectValuesFromModules
}

function getTracksFromOtherUsers(id){
    const deferred = q.defer()

    soundcloud.getConnections(id).then(function(connections){
        soundcloud.getTracks(connections).then(function(tracks){
            deferred.resolve(tracks)
        })

    })

    return deferred.promise
}

function collectValuesFromModules(user, tracks, topSongs){
    var deferred = q.defer()
    var promises = []

    var lookup = {}
    if(user.hasOwnProperty("lookup") && tracks.hasOwnProperty("lookup"))
        lookup = Object.assign(user.lookup,tracks.lookup)

    promises.push(module1.getRecommendation(tracks.playlists,1))
    promises.push(module2.getRecommendation(tracks.favorites,1))
    promises.push(module3.getRecommendation(user.favorites, user.playlists ,tracks.tracks,20,1))
    promises.push(module4.getRecommendation(user.playlists, tracks.playlists,1))

    q.all(promises).then(function(response){
        var tracks = {}

        for(var i=0;i<response.length;i++){
            for(var j=0;j<response[i].length;j++){
                var track = response[i][j]
                if(tracks.hasOwnProperty(track.id)){
                    tracks[track.id] += track.value
                }
                else{
                    tracks[track.id] = track.value
                }
            }
        }

        //TODO: remove or decrease value of own tracks

        var sortedTracks = []
        for(let track in tracks){
            sortedTracks.push([track, tracks[track]])
        }
        sortedTracks.sort(function(a, b) {return b[1] - a[1]})

        var trackIds = sortedTracks.map(function ( track ) { return track[0] })
        trackIds = trackIds.slice(0,topSongs)

        //enrich songs with information
        if(Object.keys(lookup).length > 0){
            var recommendedTracks = []
            for(let i=0;i<trackIds.length;i++){
                recommendedTracks.push(lookup[trackIds[i]])
            }
            deferred.resolve(recommendedTracks)
        }
        else{
            //for evaluation
            deferred.resolve(trackIds)
        }


    })

    return deferred.promise
}

function getRecommendation(user){
    var deferred = q.defer()
    var promises = []


    promises.push(soundcloud.getTracks([user.id]))
    promises.push(getTracksFromOtherUsers(user.id))

    q.all(promises).spread(function(user, tracks){

        collectValuesFromModules(user, tracks,20).then(function(rankedTracks){
            deferred.resolve(rankedTracks)
        })

    })

    return deferred.promise
}

    //Jan: 82147580
    //Basti: 131842115
   //getRecommendation({ id: 131842115,
   //     kind: 'user',
   //     permalink: 'sebastian-rehfeldt-1',
   //     username: 'Sebastian Rehfeldt',
   //     last_modified: '2015/10/14 13:21:49 +0000',
   //     uri: 'https://api.soundcloud.com/users/131842115',
   //     permalink_url: 'http://soundcloud.com/sebastian-rehfeldt-1',
   //     avatar_url: 'https://i1.sndcdn.com/avatars-000123963373-p1mmtc-large.jpg',
   //     country: null,
   //     first_name: 'Sebastian',
   //     last_name: 'Rehfeldt',
   //     full_name: 'Sebastian Rehfeldt',
   //     description: null,
   //     city: null,
   //     discogs_name: null,
   //     myspace_name: null,
   //     website: null,
   //     website_title: null,
   //     online: false,
   //     track_count: 0,
   //     playlist_count: 1,
   //     plan: 'Free',
   //     public_favorites_count: 3,
   //     followers_count: 6,
   //     followings_count: 17,
   //     subscriptions: [] }
   //).then(function(response){
   //       console.log("\nFinal Recommendation\n======================\n")
   //       console.log(response)
   //   })
