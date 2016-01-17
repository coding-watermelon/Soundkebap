'use strict'
/*
Module gets favorites from other users and returns most frequent songs

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
