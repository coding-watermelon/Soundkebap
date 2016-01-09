'use strict'
/*
Short Module description

*/

const socialRecommender = require(__dirname + "/socialRecommondation.js")

module.exports = {
  getRecommondation
}

function getRecommondation(user){
  return socialRecommender.getRecommondation(user)
}
