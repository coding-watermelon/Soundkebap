'use strict'
/*
 Module gets favorites from other users and returns most frequent songs

 */
const soundcloud = require(__dirname + '/../../soundcloud/connector.js')
const helperModule = require(__dirname + '/helperModule.js')
const q = require('q');


module.exports = {
    getRecommendation
}

function getRecommendation(favorites, factor){
    var deferred = q.defer()



    var tracks = {}

    for(var i=0;i<favorites.length;i++){
        for(var j=0;j<favorites[i].favorites.length;j++){

            var trackId = favorites[i].favorites[j]

            if(tracks.hasOwnProperty(trackId)){
                tracks[trackId] ++
            }
            else{
                tracks[trackId] = 1
            }

        }
    }

    helperModule.getNormalizedTracks(tracks, factor).then(function(normalizedTracks){
        deferred.resolve(normalizedTracks)
    })

    return deferred.promise

}
