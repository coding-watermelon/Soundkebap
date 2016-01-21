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
    getUnknownUser,
    getFollowers,
    getFollowings,
    getConnections,
    getTracksFromUser,
    getPlaylistsFromUser,
    getTracks,
    getFavoritesFromUser,
    getPlaylistByid
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

function getUnknownUser(id, maxId){
  var deferred = q.defer()
  SC.get("/users/"+id, function(err, user) {
      if ( err ) {
          deferred.resolve({"user":{},"maxId":maxId})
      } else {
          deferred.resolve({"user":user,"maxId":maxId})
      }
  })
  return deferred.promise
}

function getFollowers(id){
    var deferred = q.defer()
    SC.get("/users/"+id+"/followers", function(err, response) {
        if ( err ) {
            console.log("error by get followers and id: "+id)
            deferred.resolve([])
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
            console.log("error by get followings and id: "+id)
            deferred.resolve([])
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

    q.all(promises).then(function(response){
        var uniqueConnections = {}

        //insert into object to remove duplicates
        for(var i=0;i<response.length;i++){
            for(var j=0;j<response[i].length;j++){
                uniqueConnections[(response[i][j].id)] = true
            }
        }
        var connections = []
        for (var key in uniqueConnections) {
            connections.push(key)
        }

        deferred.resolve(connections)
    })

    return deferred.promise
}

function getTracksFromUser(id){
    var deferred = q.defer()
    SC.get("/users/"+id+"/tracks", function(err, response) {
        if ( err ) {
            console.log("error by get tracks and id: "+id)
            deferred.reject(err)
        } else {
            var tracks = []
            for(var i=0; i<response.length;i++){
                tracks.push(response[i].id)
            }
            deferred.resolve({"user_id":id,"tracks":tracks})
        }
    })
    return deferred.promise
}

function getPlaylistsFromUser(id){
    var deferred = q.defer()
    SC.get("/users/"+id+"/playlists", function(err, response) {
        if ( err ) {
            console.log("error by get playlists and id: "+id)
            deferred.reject(err)
        } else {
            var playlists = {"user_id":id,"playlists": []}
            for(var i=0; i< response.length;i++){
                var playlist = []
                for(var j=0;j<response[i].tracks.length;j++){
                    playlist.push(response[i].tracks[j].id)
                }
                playlists.playlists.push(playlist)
            }
            deferred.resolve(playlists)
        }
    })
    return deferred.promise
}

function getFavoritesFromUser(id){
    var deferred = q.defer()
    SC.get("/users/"+id+"/favorites", function(err, response) {
        if ( err ) {
            console.log("error by get favorites and id: "+id)
            deferred.reject(err)
        } else {
            var tracks = []
            for(var i=0; i< response.length;i++){
                tracks.push(response[i].id)
            }
            deferred.resolve({"user_id":id,"favorites":tracks})
        }
    })
    return deferred.promise
}

function getTracks(users){
    var deferred = q.defer()
    var promises = []

    for(var i=0;i<users.length;i++){
        var id = users[i]
        promises.push(getTracksFromUser(id))
        promises.push(getPlaylistsFromUser(id))
        promises.push(getFavoritesFromUser(id))
    }

    q.allSettled(promises).then(function(response){
        var recommendedTracks = {"tracks": [], "playlists": [], "favorites": []}

        for(var i=0;i<response.length;i++){
            if(response[i].state === "fulfilled" && response[i].value.hasOwnProperty("tracks"))
                recommendedTracks.tracks.push(response[i].value)
            if(response[i].state === "fulfilled" && response[i].value.hasOwnProperty("playlists"))
                recommendedTracks.playlists.push(response[i].value)
            if(response[i].state === "fulfilled" && response[i].value.hasOwnProperty("favorites"))
                recommendedTracks.favorites.push(response[i].value)
        }

        deferred.resolve(recommendedTracks)
    })

    return deferred.promise
}

function getPlaylistByid(id){
  const deferred = q.defer()
  SC.get("/playlists/"+id, function(err, response) {
      if ( err ) {
          deferred.reject(err)
      } else {
          deferred.resolve(response)
      }
  })
  return deferred.promise
}
