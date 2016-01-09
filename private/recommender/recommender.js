/*
Short Module description

*/

module.exports = {
  getRecommondation
}

var q                   = require('q'),
    contentRecommender  = require(__dirname + "/contentRecommender.js")

function getRecommondation(user){
  return contentRecommender.getRecommondation(user)
}
