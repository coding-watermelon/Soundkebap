/*
Short Module description

*/
var module1 = require('./modules/module1.js')
var SC = require('soundcloud')
var q = require('q')



function getRecommendation(user){
  var deferred = q.defer()

  SC.get("/users/"+user.id+"/tracks").then(function(response){
    console.log(response)
  })


  //var recommendation = module1.getRecommondation(user)

  deferred.resolve(user)
  return deferred.promise
}