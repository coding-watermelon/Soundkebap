'use strict'
/*
 Module gets own playlists and favorites and tracks from other users and returns top 10 songs from favorite artists

 */
const soundcloud = require(__dirname + '/../../soundcloud/connector.js')
const q = require('q')
const helperModule = require(__dirname + '/helperModule.js')


module.exports = {
    getRecommendation
}

function getRecommendation(favorites, playlists, tracks, maxTracks, factor){
    var deferred = q.defer()

    var userSongs = {}

    for(var i=0;i< favorites.length; i++){
        for(var j=0;j<favorites[i].favorites.length;j++){

            var trackId = favorites[i].favorites[j]
            if(userSongs.hasOwnProperty(trackId)){
                userSongs[trackId] += 2
            }
            else{
                userSongs[trackId] = 2
            }
        }
    }

    for(var i=0;i<playlists.length;i++){
        for(var j=0;j<playlists[i].playlists.length;j++){

            var playlist = playlists[i].playlists[j]
            for(var k=0;k<playlist.length;k++){

                var trackId = playlist[k]
                if(userSongs.hasOwnProperty(trackId)){
                    userSongs[trackId] += 1
                }
                else{
                    userSongs[trackId] =1
                }
            }
        }
    }

    var similarUsers = []
    for(var i=0;i<tracks.length;i++){

        var userId = tracks[i].user_id
        var similarity = 0

        for(var j=0;j<tracks[i].tracks.length;j++){
            var trackId = tracks[i].tracks[j]
            if(userSongs.hasOwnProperty(trackId))
                similarity += userSongs[trackId]
        }

        similarUsers.push({"user_id":userId,"similarity":similarity})
    }
    similarUsers = similarUsers.sort(function(a,b){return b.similarity - a.similarity})
    similarUsers = similarUsers.slice(0,5)

    var similarities = {}

    for(var i=0; i<similarUsers.length; i++){
        similarities[similarUsers[i].user_id] = similarUsers[i].similarity
    }

    var recommendedTracks = {}

    for(var i=0;i<tracks.length;i++){

        var userId = tracks[i].user_id
        if(similarities.hasOwnProperty(userId)){
            var value = similarities[userId]+1

            for(var j=0;j<tracks[i].tracks.length && j<maxTracks;j++){
                var trackId = tracks[i].tracks[j]

                if(recommendedTracks.hasOwnProperty(trackId)){
                    recommendedTracks[trackId] += value
                }
                else{
                    recommendedTracks[trackId] = value
                }
            }
        }
    }

    helperModule.getNormalizedTracks(recommendedTracks, factor).then(function(normalizedTracks){
        deferred.resolve(normalizedTracks)
    })

    return deferred.promise

}
