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
  addGoldUser
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

  let insertTrack = {
    id: track.id ? track.id : null,
    user_id: track.user_id ? track.user_id : null,
    label_id: track.label_id ? track.label_id : null,
    duration: track.duration ? track.duration : null,
    tag_list: track.tag_list ? track.tag_list : null,
    permalink: track.permalink ? track.permalink : null,
    embeddable_by: track.embeddable_by ? track.embeddable_by : null,
    downloadable: track.downloadable ? track.downloadable : null,
    streamable: track.streamable ? track.streamable : null,
    genre: track.genre ? track.genre : null,
    title: track.title ? track.title : null,
    description: track.description ? track.description : null,
    release: track.release ?  track.release : null,
    track_type: track.track_type ? track.track_type : null,
    isrc: track.isrc ? track.isrc : null,
    bpm: track.bpm ? track.bpm : null,
    release_year: track.release_year ? track.release_year : null,
    release_month: track.release_month ? track.release_month : null,
    release_day: track.release_day ? track.release_day : null,
    original_format: track.original_format ? track.original_format : null,
    license: track.license ? track.license : null,
    uri: track.uri ? track.uri : null,
    permalink_url: track.permalink_url ? track.permalink_url : null,
    artwork_url: track.artwork_url ? track.artwork_url : null,
    waveform_url: track.waveform_url ? track.waveform_url : null,
    stream_url: track.stream_url ? track.stream_url : null,
    playback_count: track.playback_count ? track.playback_count : null,
    download_count: track.download_count ? track.download_count : null,
    favoritings_count: track.favoritings_count ? track.favoritings_count : null,
    comment_count: track.comment_count ? track.comment_count : null,
  }
  
  rethinkdb
    .db(config.database.name)
    .table('track')
    .insert(insertTrack)
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


// ####################### gold data set for evaluation

function addGoldUser(user){
  const deferred = q.defer()

  rethinkdb
      .db(config.database.name)
      .table('testUsers')
      .insert(user)
      .run(dbConnection, function(err, result){
        if(err)
          deferred.reject(err)
        else
          deferred.resolve("added goldUser")
      })

  return deferred.promise
}