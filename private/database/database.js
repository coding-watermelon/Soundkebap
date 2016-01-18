'use strict'
const config        =   require(__dirname + "/../config.json"),
      q             =   require('q'),
      rethinkdb     =   require('rethinkdb')

let   dbConnection  = null

//Build up database connection
rethinkdb
  .connect({ host: config.database.host, port: config.database.port }, function(err, conn) {
  if(err) throw err
  console.log("Connected to RethinkDB")
  dbConnection = conn
})


module.exports = {
  getUser,
  addUser,
  addTrack,
  addPlaylist,
}
// User part
function getUser(){
  const deferred = q.defer()

  if(!dbConnection){
    deferred.reject('No connection to database!')
    return deferred.promise
  }

  deferred.resolve({
    "id": 183926100,
    "kind": "user",
    "permalink": "sittenstrolch-211195947",
    "username": "Sittenstrolch",
    "last_modified": "2016/01/09 14:05:29 +0000",
    "uri": "https://api.soundcloud.com/users/183926100",
    "permalink_url": "http://soundcloud.com/sittenstrolch-211195947",
    "avatar_url": "https://a1.sndcdn.com/images/default_avatar_large.png",
    "country": null,
    "first_name": null,
    "last_name": null,
    "full_name": "",
    "description": null,
    "city": null,
    "discogs_name": null,
    "myspace_name": null,
    "website": null,
    "website_title": null,
    "online": false,
    "track_count": 0,
    "playlist_count": 0,
    "plan": "Free",
    "public_favorites_count": 2,
    "followers_count": 2,
    "followings_count": 2,
    "subscriptions": []
  })

  return deferred.promise
}

function addUser(user){
  const deferred = q.defer()

  rethinkdb
    .db(config.database.name)
    .table('user')
    .insert(user)
    .run(dbConnection, function(err, result){
      if(err)
        deferred.reject(err)
      else
        deferred.resolve()
    })

  return deferred.promise
}

// ####################### Tracks

function addTrack (track) {
  const deferred = q.defer()

  rethinkdb
    .db(config.database.name)
    .table('track')
    .insert(track)
    .run(dbConnection, function(err, result){
      if(err)
        deferred.reject(err)
      else
        deferred.resolve()
    })

  return deferred.promise
}

// ###################### playlists

function addPlaylist (playlist) {
  const deferred = q.defer()

  rethinkdb
    .db(config.database.name)
    .table('playlist')
    .insert(playlist)
    .run(dbConnection, function(err, result){
      if(err)
        deferred.reject(err)
      else
        deferred.resolve()
    })

  return deferred.promise
}
