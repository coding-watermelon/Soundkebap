'use strict'
/*
Short Module description

*/

module.exports = {
  getRecommondation
}

const q                   = require('q'),
      contentRecommender  = require(__dirname + "/contentRecommender.js")

function getRecommondation(user){
  return contentRecommender.getRecommondation(user)
}
