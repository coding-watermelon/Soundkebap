'use strict'
/*
Short Module description

*/

const socialRecommender = require(__dirname + "/socialRecommendation.js"),
      q                 = require('q'),
      frequentBasket    = require(__dirname + "/modules/c_module1.js")

module.exports = {
  getRecommendation
}

function getRecommendation(user){
  const deferred = q.defer()
  socialRecommender.getRecommendation(user)
    .then(frequentBasket.getRecommendation)
    .then(function(tracks){
      deferred.resolve(tracks)
    })

  return deferred.promise
}
