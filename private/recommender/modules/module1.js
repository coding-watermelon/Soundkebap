'use strict'
/*
 Module gets playlists from other users and returns most frequent songs

 */
const soundcloud = require(__dirname + '/../../soundcloud/connector.js')
const q = require('q');


module.exports = {
    getRecommendation
}

function getRecommendation(playlists){
    var deferred = q.defer()

    var tracks = {}

    for(var i=0;i<playlists.length;i++){
        for(var j=0;j<playlists[i].playlists.length;j++){

            var playlist = playlists[i].playlists[j]

            for(var k=0;k<playlist.length;k++){

                var trackId = playlist[k]

                if(tracks.hasOwnProperty(trackId)){
                    tracks[trackId] ++
                }
                else{
                    tracks[trackId] = 1
                }
            }
        }
    }

    var sortedTracks = []
    for(var track in tracks){
        sortedTracks.push([track, tracks[track]])
    }
    sortedTracks.sort(function(a, b) {return b[1] - a[1]})

    var maxCount = sortedTracks[0][1]
    var normalizedTracks = []
    for(var i=0;i<sortedTracks.length;i++){
        var id = sortedTracks[i][0]
        var value = sortedTracks[i][1] / maxCount
        normalizedTracks.push({"id":id,"value":value})
    }

    deferred.resolve(normalizedTracks)

    return deferred.promise

}
