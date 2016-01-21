'use strict'

const soundcloud    = require(__dirname + '/../soundcloud/connector.js'),
      recommender   = require(__dirname + '/../recommender/recommender.js'),
      db            = require(__dirname + '/../database/database.js'),
      q             = require('q')

function addUser(id, counter){

    var deferred = q.defer()

    soundcloud.getConnections(id).then(function(connections) {
        var promises = []

        promises.push(soundcloud.getTracks([id]))
        promises.push(soundcloud.getTracks(connections))

        q.all(promises).spread(function(user, otherUsers){

            let goldUser = {"id":counter, "user": user, "otherUsers":otherUsers}

            db.addGoldUser(goldUser).then(function(response){
                console.log("============= added user "+counter+" =============")
                deferred.resolve(response)
            })

        })

    })

    return deferred.promise
}

function getIds(count){
    let deferred = q.defer()
    let promises = []
    let maxId = 200791700

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
    let randomId = Math.floor(Math.random()*maxId)+1

    return q.all([
        soundcloud.getUnknownUser(randomId, maxId)
    ]).then(function(response){
        let minConnections = 3
        let minPlaylists = 1
        let maxConnections = 50

        let user = response[0].user
        let maxId = response[0].maxId
        let connections = user.followers_count + user.followings_count

        if(connections >= minConnections && connections < maxConnections && user.playlist_count >= minPlaylists){
            console.log(connections)
            return user.id
        }
        else{
            return getUser(maxId)
        }
    })

}

function crawlUserSample(count){
    let deferred = q.defer()

    getIds(count).then(function(ids){
        console.log(ids)
        let i=0

        function callAddUser(id,i,count){
            console.log("call add User "+i)
            addUser(id,i)
                .then(function(){
                    if(i<count-1){
                        i++
                        callAddUser(id,i,count)
                    }
                    else{
                        deferred.resolve("crawling completed")
                    }
                })
        }

        callAddUser(ids[i], i,count)

    })

    return deferred.promise
}

crawlUserSample(20).then(function(response){
    console.log(response)
})