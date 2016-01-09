'use strict'
/*
Short Module description

*/
const soundcloud = require(__dirname + '/../../soundcloud/connector.js')
const q = require('q');


module.exports = {
  getRecommendation
}

function getRecommendation(user){
  var deferred = q.defer()

  soundcloud.getConnections(user.id).then(function(connections){
    soundcloud.getTracks(connections).then(function(tracks){
      deferred.resolve(tracks)

    })

  })

  return deferred.promise

}
