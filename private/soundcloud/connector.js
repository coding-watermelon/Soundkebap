/*
 Short Module description

 */
const SC = require('node-soundcloud');
const q = require('q');

module.exports = {
    getFollowers,
    getFollowings,
    getConnections,
    getTracksFromUser,
    getPlaylistsFromUser,
    getTracks
}

function getFollowers(id){
    var deferred = q.defer()
    SC.get("/users/"+id+"/followers", function(err, response) {
        if ( err ) {
            throw err;
        } else {
            deferred.resolve(response.collection)
        }
    })
    return deferred.promise
}

function getFollowings(id){
    var deferred = q.defer()
    SC.get("/users/"+id+"/followings", function(err, response) {
        if ( err ) {
            throw err;
        } else {
            deferred.resolve(response.collection)
        }
    })
    return deferred.promise
}

function getConnections(id){
    var deferred = q.defer()
    var promises = []

    promises.push(getFollowers(id))
    promises.push(getFollowings(id))

    q.all(promises).spread(function(followers, followings){
        var follower = []
        for(var i=0;i<followers.length;i++){
            follower.push(followers[i].id)
        }

        var following = []
        for(var i=0;i<followings.length;i++){
            following.push(followings[i].id)
        }

        deferred.resolve({"follower": follower, "following": following})
    })

    return deferred.promise
}

function getTracksFromUser(id){
    var deferred = q.defer()
    SC.get("/users/"+id+"/tracks", function(err, response) {
        if ( err ) {
            throw err;
        } else {
            for(var i=0; i<1;i++){
                console.log(response[i])
            }
            deferred.resolve(response)
        }
    })
    return deferred.promise
}

function getPlaylistsFromUser(id){
    var deferred = q.defer()
    //console.log(id)
    SC.get("/users/"+id+"/playlists", function(err, response) {
        if ( err ) {
            throw err;
        } else {
            console.log(response[0])
            deferred.resolve(response)
        }
    })
    return deferred.promise
}

function getTracks(connections){
    var deferred = q.defer()
    var promises = []
    var users = []
    users = connections.follower.concat(connections.following)

    for(var i=0;i<users.length;i++){
        id = users[i]

        promises.push(getTracksFromUser(id))
        promises.push(getPlaylistsFromUser(id))
    }

    q.all(promises).then(function(response){
        for(var i=0; i<response.length;i++){

        }
    })

    return deferred.promise
}
