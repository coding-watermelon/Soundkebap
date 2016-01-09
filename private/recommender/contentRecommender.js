'use strict'
/*
Short Module description

*/

const socialRecommender = require(__dirname + "/socialRecommendation.js")

module.exports = {
  getRecommendation
}

function getRecommendation(user){
  return socialRecommender.getRecommendation(user)
}
