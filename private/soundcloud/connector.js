'use strict'
/*
 Short Module description

 */
const SC        = require('node-soundcloud'),
      q         = require('q'),
      config    = require(__dirname + "/../config.json")

SC.init({
  id: config.soundcloud["client-id"],
  secret: config.soundcloud["client-secret"],
  accessToken: config.soundcloud.accessToken
});

module.exports = {
    getUser,
    getFollowers,
    getFollowings,
    getConnections,
    getTracksFromUser,
    getPlaylistsFromUser,
    getTracks
}

function getUser(id, accessToken){
  var deferred = q.defer()
  SC.get("/users/"+id, function(err, user) {
      if ( err ) {
          throw err;
      } else {
          user.accessToken = accessToken
          deferred.resolve(user)
      }
  })
  return deferred.promise
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
            var tracks = []
            for(var i=0; i<response.length;i++){
                tracks.push(response[i].id)
            }
            deferred.resolve(tracks)
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
            var tracks = []
            for(var i=0; i< response.length;i++){
                for(var j=0;j<response[i].tracks.length;j++){
                    tracks.push(response[i].tracks[j].id)
                }
            }
            deferred.resolve(tracks)
        }
    })
    return deferred.promise
}

function getTracks(connections){
    var deferred = q.defer()
    var promises = []
    var users = connections.follower.concat(connections.following)

    for(var i=0;i<users.length;i++){
        id = users[i]

        promises.push(getTracksFromUser(id))
        promises.push(getPlaylistsFromUser(id))
    }

    q.all(promises).then(function(response){
        var tracks = []
        for(var i=0; i<response.length;i++){
            tracks = tracks.concat(response[i])
        }

        deferred.resolve(tracks)
    })

    return deferred.promise
}
