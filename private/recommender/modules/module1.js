'use strict'
/*
 Module gets playlists from other users and returns most frequent songs

 */
const soundcloud = require(__dirname + '/../../soundcloud/connector.js')
const helperModule = require(__dirname + '/helperModule.js')
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

    helperModule.getNormalizedTracks(tracks).then(function(normalizedTracks){
        deferred.resolve(normalizedTracks)
    })

    return deferred.promise

}
