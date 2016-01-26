'use strict'
/*
Short Module description

*/

const socialRecommender = require(__dirname + "/socialRecommendation.js"),
      q                 = require('q')

module.exports = {
  getRecommendation
}

function getRecommendation(user){
  const deferred = q.defer()

  socialRecommender.getRecommendation(user)
    .then(function(tracks){
      deferred.resolve(tracks.slice(0,40))
    })

  return deferred.promise
}
