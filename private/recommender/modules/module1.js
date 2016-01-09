/*
Short Module description

*/
const soundcloud = require(__dirname + '/../../soundcloud/connector.js')
const q = require('q');


module.exports = {
  getRecommondation
}

function getRecommondation(user){
  var deferred = q.defer()

  var recommendation = []

  soundcloud.getConnections(user.id).then(function(connections){

    soundcloud.getTracks(connections).then(function(tracks){
      //console.log(tracks)
    })

  })

  deferred.resolve(recommendation)
  return deferred.promise
}
