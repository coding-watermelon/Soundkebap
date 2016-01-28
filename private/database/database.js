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
  addUserWithTestGroup,
  addTrack,
  addPlaylist,
  addGoldUser,
  getGoldUsers,
  getHistory,
  addSongToHistory,
  addSkipping
}
// User part
function getUser(userId){
  const deferred = q.defer()
  userId = parseInt(userId)
  if(!dbConnection){
    deferred.reject('No connection to database!')
    return deferred.promise
  }

  rethinkdb
    .db('soundkebap')
    .table('user')
    .filter(rethinkdb.row('id').eq(userId))
    .run(dbConnection, function(err, cursor){
      if(err)
        deferred.reject(err)
      else{
        cursor.toArray(function(err, result){
          if(err || result.length != 1)
            deferred.reject()
          else
            deferred.resolve(result[0])
        })
      }
    })

  return deferred.promise
}

function getTestGroups(){
  const deferred = q.defer()

  rethinkdb
    .db('soundkebap')
    .table('user')
    .group('testGroup')
    .count()
    .run(dbConnection, function(err, cursor){
      if(err)
        deferred.reject(err)
      else {
        cursor.toArray(function(err, result){
          if(err)
            deferred.reject()
          else
            deferred.resolve(result)
        })
      }

    })

  return deferred.promise
}

function addUserWithTestGroup(user){
  const deferred = q.defer()

  getTestGroups()
    .then(function(testGroups){
      let countA = 0
      let countB = 0
      let countC = 0

      for(var i=0; i<testGroups.length; i++){
        if(testGroups[i].group == "A"){
          countA++
        }else if(testGroups[i].group == "B"){
          countB++
        }else if(testGroups[i].group == "C"){
          countC++
        }
      }

      if(countA <= countB && countA <= countC){
        user.testGroup = "A"
      }else if(countB <= countA && countB <= countC){
        user.testGroup = "B"
      }else{
        user.testGroup = "C"
      }

      addUser(user)
        .then(deferred.resolve)
        .catch(deferred.reject)

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
      .table('goldUsers2')
      .insert(user)
      .run(dbConnection, function(err, result){
        if(err)
          deferred.reject(err)
        else
          deferred.resolve("added goldUser")
      })

  return deferred.promise
}

function getGoldUsers(){
  const deferred = q.defer()

  rethinkdb
      .db(config.database.name)
      .table('goldUsers2')
      .run(dbConnection, function(err, cursor){
        if (err) throw err
        cursor.toArray(function(err, result) {
          if (err) throw err
          deferred.resolve(result)
        })
      })

  return deferred.promise
}

function getHistory(userId){
  const deferred = q.defer()

  rethinkdb
      .db(config.database.name)
      .table('history')
      .filter(rethinkdb.row('userid').eq(userId))
      .run(dbConnection, function(err, cursor){
        if(err)
          deferred.reject(err)
        else {
          cursor.toArray(function(err, result){
            if(err)
              deferred.reject()
            else{
              if(result.length > 0)
                deferred.resolve(result[0].history)
              else
                deferred.resolve({})
            }


          })
        }

      })

  return deferred.promise
}

function addSkipping(userId, trackId, seconds){
  const deferred = q.defer()

  rethinkdb
    .db(config.database.name)
    .table('skips')
    .insert({
      userId: userId,
      trackId: trackId,
      seconds: seconds
    })
    .run(dbConnection, function (err, res) {
      if (err)
        deferred.reject(err)
      else
        deferred.resolve()
    })

  return deferred.promise
}

function addSongToHistory(userId, song){
  const deferred = q.defer()
  const currentDate = Date.now()
  const trackId = song.trackId

  rethinkdb
      .db(config.database.name)
      .table('history')
      .filter(rethinkdb.row('userid').eq(userId))
      .run(dbConnection, function(err, cursor) {
        if (err)
          deferred.reject(err)
        else {
          cursor.toArray(function (err, res) {
            if (err)
              deferred.reject(err)
            else {
              if (res.length > 0) {
                if (res[0].history.hasOwnProperty(trackId)) {
                  res[0].history[trackId]["listening-count"] += song.listeningCount
                  res[0].history[trackId]["skip-count"] += song.skipCount
                  res[0].history[trackId]["last-listened"] = currentDate
                }
                else {
                  res[0].history[trackId] = {}
                  res[0].history[trackId]["listening-count"] = song.listeningCount
                  res[0].history[trackId]["skip-count"] = song.skipCount
                  res[0].history[trackId]["last-listened"] = currentDate
                }

                rethinkdb
                    .db('soundkebap')
                    .table('history')
                    .filter(rethinkdb.row('userid').eq(userId))
                    .update(res[0])
                    .run(dbConnection, function (err, result) {
                      if (err)
                        deferred.reject(err)
                      else
                        deferred.resolve("updated history")
                    })
              }
              else {
                //create history for user
                let user = {"userid":userId,"history":{
                    [trackId]:    {"listening-count":song.listeningCount,
                    "skip-count":song.skipCount,
                    "last-listened":currentDate}}}

                rethinkdb
                    .db('soundkebap')
                    .table('history')
                    .insert(user)
                    .run(dbConnection, function (err, res) {
                      if (err)
                        deferred.reject(err)
                      else
                        deferred.resolve("inserted history for user")
                    })
              }
            }
          })
        }
      })



  return deferred.promise
}
//
//setTimeout(function(){
//  addSongToHistory(131842115,{"trackId":228366807,"listeningCount":0,"skipCount":1}).then(function(response){
//    console.log(response)
//  })
//},1000)
