'use strict'
/*
Module get tracks and performs a frequent basket analysis on the exisiting playlists.

 */
const soundcloud = require(__dirname + '/../../soundcloud/connector.js')
const helperModule = require(__dirname + '/helperModule.js')
const q = require('q');
const sample = require(__dirname + "/sample_reco.js")
const db = require(__dirname + '/../../database/database.js')


module.exports = {
    getRecommendation
}

db.connect()
  .then(function(){
    getRecommendation(sample).then(console.log)
  })

function getRecommendation(tracks){
    var deferred = q.defer()
    var promises = []

    for(var index=0; index < tracks.length; index++){
      promises.push(db.playlistsWithTrack(tracks[index].id))
    }

    q.allSettled(promises)
      .then(function(result){
          let filtered =
            result
              .map(function(obj, currentIndex){
                return {
                  playlists: obj.value,
                  trackId: tracks[currentIndex].id,
                  value: tracks[currentIndex].value
                }
              })
              .filter(function(obj){
                return obj.playlists.length > 2
              })
          findsimilarTracks(filtered)
            .then(function(newTracks){
                var concat = tracks.concat(newTracks)
                concat.sort(function(a,b){
                  return a.value < b.value
                })
                deferred.resolve(concat)
            })
      })
      .catch(function(err){
        console.log(err)
        deferred.reject()
      })

    return deferred.promise

}

function findsimilarTracks(tracks){
  const deferred = q.defer()
  let index = 0
  let newTracks = []

  function processTrack(){
    var promises = []

    populatePlaylistsWithTracks(tracks[index])
      .then(applyApriori)
      .then(function(result){

        for(var i=0; i<result.tracks.length; i++){
          promises.push(db.getTrack(result))
        }

        q.allSettled(promises)
          .then(function(populatedTracks){
            for(var i=0; i<populatedTracks.length; i++){
              newTracks.push({
                id: result.tracks[i],
                info: populatedTracks[i].value,
                value: tracks[index].value + ( result.iteration / result.maxiterations ) * 2
              })
            }

            if(index < (tracks.length-1) ){
              index = index+1
              processTrack()
            }else{
              deferred.resolve(newTracks)
            }
          })
          .catch(deferred.reject)



      })
      .catch(deferred.reject)
  }

  if(tracks.length > 0)
    processTrack()
  else
    deferred.resolve(newTracks)

  return deferred.promise
}

function populatePlaylistsWithTracks(track){
  const deferred = q.defer()
  let promises = []

  for(var i=0; i<track.playlists.length; i++){
    promises.push(getTracksForPlaylist(track.playlists[i]))
  }

  q.allSettled(promises)
    .then(function(playlists){
      let populatedPlaylists = playlists.map(function(promiseObject){
        return promiseObject.value
      })
      deferred.resolve({
        trackId: track.trackId,
        playlists: populatedPlaylists
      })
    })
    .catch(deferred.reject)

  return deferred.promise
}

function getTracksForPlaylist(playlistId){
  var deferred = q.defer()

  deferred.resolve(playlists[playlistId])
  // db.getTracksForPlaylist(playlistId)
  //   .then(deferred.resolve)
  //   .catch(deferred.reject)

  return deferred.promise
}

function applyApriori(track){
  var allTracks = new Set()
  var pruned = []
  var threshold = 3
  var maxiterations = threshold

  //Calculate maximal possible iterations
  var pLengths = track.playlists.map(function(obj){return obj.length})
  pLengths.sort()
  if(pLengths.length > threshold)
    maxiterations = pLengths[ (pLengths.length - (threshold+1) ) ]

  for(var i=0; i<track.playlists.length; i++){
    for(var j=0; j<track.playlists[i].length; j++){
      allTracks.add(track.playlists[i][j])
    }
  }
  allTracks = Array.from(allTracks)
  //initialSet only contains the existing trackid
  let sets = [ [track.trackId] ]
  let notFinished = true

  while(notFinished){
    let newSets = generateSets(sets, allTracks, track.trackId, [ ])
    let occurences = genereteOccurance(track.playlists, newSets)
    for(var key in occurences){
      if(occurences[key] < threshold){
        delete occurences[key]
        pruned.push(newSets[key])
        newSets[key] = []
      }
    }
    for(var j = 0; j < newSets.length; j++){
      if(newSets[j].length == 0){
        newSets.splice(j, 1)
        j = j-1
      }
    }
    if(newSets.length > 0){
      sets = newSets
    }else {
      notFinished = false
    }
    // console.log(newSets, occurences)
  }

  //Build result up
  var result = {
    tracks: [],
    iteration: 0,
    maxiterations: maxiterations
  }
  if(sets.length != 0){
    result.iteration = sets[0].length - 1
    var trackSet = new Set()
    for(var i=0; i<sets.length; i++){
      for(var j=0; j<sets[i].length; j++){
        trackSet.add(sets[i][j])
      }
    }
    trackSet.delete(track.trackId)
    result.tracks = Array.from(trackSet)
  }

  return result
}

function generateSets(sets, tracks, trackId, pruned){
  var newSets = []
  for(var i=0; i<sets.length; i++){
    for(var j=0; j<tracks.length; j++){
      var tempSet = sets[i].concat(tracks[j])
      var allowConcat = true
      for(var k=0; k<pruned.length; k++){
        if( isSuperset(tempSet, pruned[k]) )
          allowConcat = false
      }
      for(var k=0; k<newSets.length; k++){
        if( isSuperset(tempSet, newSets[k]) )
          allowConcat = false
      }
      if(allowConcat && sets[i].indexOf(tracks[j]) == -1)
        newSets.push(tempSet)
    }
  }
  return newSets
}

function genereteOccurance(playlists, sets){
  var occ = {}
  for(var k = 0; k<sets.length; k++){
    occ[k] = 0
  }
  for(var i=0; i<playlists.length; i++){
    for(var j=0; j<sets.length; j++){
      if( isSuperset(playlists[i], sets[j]) ){
          occ[j]++
      }
    }
  }
  return occ
}



// let tracksData = [
//   {
//     playlists: [101,102,103,104,105,106],
//     trackId: 1
//   },
//   {
//     playlists: [101,103,104,106],
//     trackId: 2
//   },
//   {
//     playlists: [102,103,104,105],
//     trackId: 3
//   },
//   {
//     playlists: [105,106],
//     trackId: 4
//   },
//   {
//     playlists: [101,102,103,104,105,106],
//     trackId: 5
//   },
//   {
//     playlists: [106],
//     trackId: 6
//   },
//   {
//     playlists: [101,103,105],
//     trackId: 7
//   },
//   {
//     playlists: [102,103,106],
//     trackId: 8
//   },
//   {
//     playlists: [101,103,104,105],
//     trackId: 9
//   },
//   {
//     playlists: [102,104,106],
//     trackId: 10
//   },
// ]
// let playlists = {
//   101: [1,2,5,7,9],
//   102: [1,3,5,10],
//   103: [1,2,3,5,7,8,9],
//   104: [1,2,3,5,9,10],
//   105: [1,3,5,7,9],
//   106: [1,2,4,5,6,8,10]
// }
// findsimilarTracks(tracksData)
// console.log( applyApriori({ trackId: 1,
//   playlists:
//    [ [ 1, 2, 5, 7, 9 ],
//      [ 1, 3, 5, 10 ],
//      [ 1, 2, 3, 5, 7, 8, 9 ],
//      [ 1, 2, 3, 5, 9, 10 ],
//      [ 1, 3, 5, 7, 9 ],
//      [ 1, 2, 4, 5, 6, 8, 10 ] ] }) )


// attach the .equals method to Array's prototype to call it on any array
function isSuperset(array1, array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    for(var i = 0; i<array.length; i++){
      if(array1.indexOf(array[i]) < 0)
        return false
    }
    return true
}
