'use strict'
const config        =   require(__dirname + "/../config.json"),
      q             =   require('q'),
      rethinkdb     =   require('rethinkdb')

let   dbConnection  = null

//Build up database connection
function connect(){
  var deferred = q.defer()

  if(!dbConnection){
    rethinkdb
      .connect({ host: config.database.host, port: config.database.port }, function(err, conn) {
      if(err){ deferred.reject(); throw err }
      console.log("Connected to RethinkDB")
      dbConnection = conn
      deferred.resolve()
    })
  }else {
    deferred.resolve()
  }

  return deferred.promise
}

connect()
  .then(playlistsWithTrack)
  .then(iterateThroughTracks)
  .then(console.log)
  .catch(console.log)

var count = 0;

function playlistsWithTrack () {
  const deferred = q.defer()

  rethinkdb
    .db(config.database.name)
    .table('playlist')
    .run(dbConnection, function(err, cursor){
      if(err)
        deferred.reject(err)
      else{
        cursor.toArray(function(err, playlist){
          console.log("Got all playlists")
          deferred.resolve(playlist)
        })
      }
    })

  return deferred.promise
}

function iterateThroughTracks(playlists){
  var index = 0
  var deferred = q.defer()
  console.log("Start iterating over " + playlists.length)

  function parsePlaylist(){
      var promises = []

      for(var i=0; i<playlists[index].tracks.length; i++){
        promises.push( updateTrack(playlists[index].tracks[i], playlists[index].id) )
      }
      q.allSettled(promises)
        .then(function(){
            console.log("Parsed Playlist " + index + " of " + playlists.length)
            if(index < playlists.length-1){
              index++
              parsePlaylist()
            }else{
              deferred.resolve("Finished")
            }
        })
        .catch(deferred.reject)
  }
  parsePlaylist()

  return deferred.promise
}


function updateTrack(trackId, playlistId){
  var deferred = q.defer()

  rethinkdb
    .db(config.database.name)
    .table('trackContainment')
    .insert({
      'trackId': trackId,
      'playlists': [playlistId],
      'elements': 1
    })
    .run(dbConnection, function(err, cursor){
      if(err){
        rethinkdb
          .db(config.database.name)
          .table('trackContainment')
          .get(trackId)
          .update({
            'playlists': rethinkdb.row('playlists').append(playlistId),
            'elements': (rethinkdb.row('playlists').count()+1)
          })
          .run(dbConnection, function (err, result) {
            if(err)
              deferred.reject(err)
            else
              deferred.resolve()
          })
      }else{
        deferred.resolve()
      }
    })

    return deferred.promise
}
