'use strict'
/*
Short Module description

*/

module.exports = {
  getRecommendation
}

const q                   = require('q'),
      contentRecommender  = require(__dirname + "/contentRecommender.js")

function getRecommendation(user){
  return contentRecommender.getRecommendation(user)
}
