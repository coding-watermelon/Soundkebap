'use strict'
const soundcloud = require(__dirname + '/../soundcloud/connector.js')
const db         = require(__dirname + '/../database/database.js')
const q          = require('q')

module.exports = {start}

start(1454)
  .catch(function(err){
    console.log(err)
  })

function start(startId, endId){
  const deferred = q.defer()
  let   currentId = startId

  function parsePlaylist(){
    getPlaylist(currentId)
      .then(extractGenres)
      .then(saveTracks)
      .then(savePlaylist)
      .then(function(){
        console.log('saved playlist with id '+ currentId)
        if(endId && startId < endId){
          currentId++
          parsePlaylist()
        }else if(endId && startId >= endId){
          deferred.resolve()
        }else{
          currentId++
          parsePlaylist()
        }
      })
      .catch(function(err){
        if(err === 'next'){
          console.log('skipped playlist with id ' + currentId)
          if(endId && startId < endId){
            currentId++
            parsePlaylist()
          }else if(endId && startId >= endId){
            deferred.resolve()
          }else{
            currentId++
            parsePlaylist()
          }
        }else{
          deferred.reject(JSON.stringify(err))
        }
      })
  }
  parsePlaylist()
  return deferred.promise
}

function getPlaylist(id){
  const deferred = q.defer()

  soundcloud.getPlaylistByid(id)
    .then(deferred.resolve)
    .catch(function(err){
      console.log(err)
      if(err[0].error_message === '404 - Not Found')
        deferred.reject('next')
      else{
        deferred.reject(err)
      }

    })

  return deferred.promise
}

function extractGenres(playlist){
  const deferred = q.defer()
  let genres     = new Set()

  if(playlist.tracks.length < 4){
    deferred.reject('next')
    return deferred.promise
  }

  for(var i=0; i<playlist.tracks.length; i++){
    if(playlist.tracks[i].genre != "")
      genres.add(playlist.tracks[i].genre)
  }
  playlist.genres = Array.from(genres)
  deferred.resolve(playlist)

  return deferred.promise
}

function saveTracks(playlist){
  const deferred = q.defer()
  let   promises = []
  let   tracks   = []

  for(var i=0; i<playlist.tracks.length; i++){
    promises.push(db.addTrack(playlist.tracks[i]))
    tracks.push(playlist.tracks[i].id)
  }

  q.allSettled(promises)
    .then(function(){
      deferred.resolve({
        id: playlist.id,
        user_id: playlist.user_id,
        genres: playlist.genres,
        tracks: tracks
      })
    })
    .catch(deferred.reject)

  return deferred.promise
}

function savePlaylist(playlist){
  return db.addPlaylist(playlist)
}
