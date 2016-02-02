'use strict'
const soundcloud = require(__dirname + '/../soundcloud/connector.js')
const db         = require(__dirname + '/../database/database.js')
const q          = require('q')

module.exports = {start}

setTimeout(function(){
    start(20000,40000)
        .catch(function(err){
            console.log(err)
        })
},1000)


function start(start, offset){
    const deferred = q.defer()

    function crawlUsernamesForTracks(){

        getNextTracks(start,offset).then(function(tracks){

            let i=0
            function iterateOverTracks(){
                getSongInformation(tracks[i].id).then(function(track){
                    console.log(i + "\tid: "+track.id+"\tusername: "+track.username)

                    updateTrack(track).then(function(){
                        if(i<tracks.length){
                            i++
                            iterateOverTracks()
                        }
                        else{
                            console.log("\n===============")
                            console.log("\nDone")
                            deferred.resolve("done")
                        }
                    })
                })
            }

            iterateOverTracks()
        })
    }
    crawlUsernamesForTracks()

    return deferred.promise
}

function getNextTracks(start,offset){
    const deferred = q.defer()

    db.getCrawledSongs(start,offset).then(function(response){
        deferred.resolve(response)
    })

    return deferred.promise
}

function updateTrack(track){
    const deferred = q.defer()

    db.updateSong(track).then(function(res){
        deferred.resolve(res)
    })

    return deferred.promise
}

function getSongInformation(id){
    const deferred = q.defer()

    soundcloud.getTrackById(id).then(function(track){
        deferred.resolve(track)
    })

    return deferred.promise
}