'use strict'
/*
Module gets own playlists and tracks from other users and returns songs from favorite artists

*/
const soundcloud = require(__dirname + '/../../soundcloud/connector.js')
const q = require('q');


module.exports = {
  getRecommendation
}

function getRecommendation(user){
  var deferred = q.defer()



  return deferred.promise

}
