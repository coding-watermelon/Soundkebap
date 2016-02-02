'use strict'
/*
 Module returns most favorite songs from crawled songs

 */
const db = require(__dirname + '/../../database/database.js')
const q = require('q')
const helperModule = require(__dirname + '/helperModule.js')


module.exports = {
    getRecommendation
}

function getRecommendation(factor){
    //TODO: get genre of user and return top songs from that genre
    var deferred = q.defer()

    db.getCrawledSongs(0,1000).then(function(songs){
        let maxFavorites = songs[0]["favoritings_count"]
        let recommendedTracks = {}
        let lookup = {}

        for(let i=0;i<songs.length;i++){
            recommendedTracks[songs[i].id] = Math.max(0.5,songs[i]["favoritings_count"]/maxFavorites)
            lookup[songs[i].id] = {
                'id': songs[i].id,
                'info':{
                    'title':        songs[i].title,
                    'artwork_url':  songs[i]["artwork_url"],
                    'username':     songs[i].username
                }
            }
        }

        helperModule.getNormalizedTracks(recommendedTracks, factor).then(function(normalizedTracks){
            deferred.resolve({'lookup':lookup,'tracks':normalizedTracks})
        })
    })

    return deferred.promise

}
