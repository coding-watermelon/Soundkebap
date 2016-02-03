'use strict'
/*
 Module gets own playlists and playlists from database users and returns songs from similar users

 */
const db = require(__dirname + '/../../database/database.js')
const q = require('q')
const helperModule = require(__dirname + '/helperModule.js')


module.exports = {
    getRecommendation
}

function getRecommendation(user, similarUsers, factor){
    //Todo: preselection of playlists can be improved by filtering by genre
    var deferred = q.defer()
    var that = this
    that.user = user
    that.similarUsers = similarUsers

    db.getCrawledPlaylists().then(function(playlists){
        user = that.user
        similarUsers = that.similarUsers

        var userTracks = {}

        for(var i=0;i<user.length;i++){
            for(var j=0;j<user[i].playlists.length;j++){

                var playlist = user[i].playlists[j]

                for(var k=0;k<playlist.length;k++){

                    var trackId = playlist[k]

                    if(userTracks.hasOwnProperty(trackId)){
                        userTracks[trackId] += 5
                    }
                    else{
                        userTracks[trackId] = 5
                    }
                }
            }
        }
        for(var i=0;i<similarUsers.length;i++){
            for(var j=0;j<similarUsers[i].playlists.length;j++){

                var playlist = similarUsers[i].playlists[j]

                for(var k=0;k<playlist.length;k++){

                    var trackId = playlist[k]

                    if(userTracks.hasOwnProperty(trackId)){
                        userTracks[trackId] ++
                    }
                    else{
                        userTracks[trackId] = 1
                    }
                }
            }
        }

        var otherTracks = {}

        for(var i=0;i<playlists.length;i++){
            var playlistSongs = {}

            for(var j=0;j<playlists[i].tracks.length;j++){

                var trackId = playlists[i].tracks[j]

                if(playlistSongs.hasOwnProperty(trackId))
                    playlistSongs[trackId] ++
                else
                    playlistSongs[trackId] = 1
            }

            var userId = playlists[i]["user_id"]
            if(otherTracks.hasOwnProperty(userId))
                otherTracks[userId].tracks = Object.assign(otherTracks[userId].tracks,playlistSongs)
            else{
                otherTracks[userId] = {}
                otherTracks[userId].user_id = userId
                otherTracks[userId].tracks = playlistSongs
            }

        }

        var similarUsers = []
        for(var user in otherTracks){
            var userId = otherTracks[user].user_id
            var similarity = 1
            var unionOfSongs = Object.keys(userTracks).length

            for(var track in otherTracks[user].tracks){
                if(userTracks.hasOwnProperty(track))
                    similarity = similarity + userTracks[track]
                else
                    unionOfSongs ++
            }
            if(similarity>2)
                similarUsers.push({"user_id":userId,"similarity":similarity/unionOfSongs})
        }

        similarUsers = similarUsers.sort(function(a,b){return b.similarity - a.similarity})
        similarUsers.slice(0,50)

        var similarities = {}
        for(var i=0; i<similarUsers.length; i++){
            similarities[similarUsers[i].user_id] = similarUsers[i].similarity
        }

        var recommendedTracks = {}

        for(var user in otherTracks){

            var userId = otherTracks[user].user_id
            if(similarities.hasOwnProperty(userId)){

                for(var track in otherTracks[user].tracks){
                    var value = similarities[userId]

                    if(recommendedTracks.hasOwnProperty(track)){
                        recommendedTracks[track] += value
                    }
                    else{
                        recommendedTracks[track] = value
                    }
                }
            }
        }

        helperModule.getNormalizedTracks(recommendedTracks, factor).then(function(normalizedTracks){
            deferred.resolve(normalizedTracks)
        })
    })

    return deferred.promise

}
