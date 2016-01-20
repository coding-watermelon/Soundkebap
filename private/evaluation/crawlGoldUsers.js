'use strict'

const soundcloud    = require(__dirname + '/../soundcloud/connector.js'),
      recommender   = require(__dirname + '/../recommender/recommender.js'),
      db            = require(__dirname + '/../database/database.js'),
      q             = require('q')

function addUser(id, counter){

    var deferred = q.defer()
    var promises = []


    promises.push(soundcloud.getTracks([id]))
    soundcloud.getConnections(id).then(function(connections) {
        promises.push(soundcloud.getTracks(connections))
    })

    q.all(promises).spread(function(user, otherUsers){

        let goldUser = {"id":counter, "user": user, "otherUsers":otherUsers}

        db.addGoldUser(goldUser).then(function(response){
            deferred.resolve(response)
        })

    })

    return deferred.promise
}

function getIds(count){
    let deferred = q.defer()
    let promises = []
    let maxId = 10000000

    for(let i=0;i<count;i++){
        promises.push(getUser(maxId))
    }

    q.allSettled(promises).then(function(response){
        let ids = []

        for(let i=0;i<response.length;i++){
            ids.push(response[i].value)
        }

        deferred.resolve(ids)
    })

    return deferred.promise
}

function getUser(maxId){
    let randomId = Math.floor(Math.random()*maxId)

    return q.all([
        soundcloud.getUnknownUser(randomId, maxId)
    ]).then(function(response){
        let minConnections = 3
        let minPlaylists = 1

        let user = response[0].user
        let maxId = response[0].maxId

        if((user.followers_count + user.followings_count) >= minConnections && user.playlist_count >= minPlaylists){
            console.log("Yeah")
            return user.id
        }
        else{
            return getUser(maxId)
        }
    })

}

function crawlUserSample(count){
    let deferred = q.defer()
    let promises = []

    getIds(count).then(function(ids){
        for(let i=0;i<count;i++){
            promises.push(addUser(ids[i],i))
        }

        q.allSettled(promises).then(function(){
            deferred.resolve("crawling completed")
        })

    })

    return deferred.promise
}

//crawlUserSample(1).then(function(response){
//    console.log(response)
//})
getIds(5).then(function(ids){
    console.log(ids)
})