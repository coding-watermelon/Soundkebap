/*
Short Module description

*/
const module1 = require('./modules/module1.js')
const SC = require('soundcloud')
const q = require('q')




function getRecommendation(user){
  var deferred = q.defer()

  SC.get("/users/"+user.id+"/tracks").then(function(response){
    console.log(response)
  })


  //var recommendation = module1.getRecommondation(user)




  deferred.resolve(["12314", "1235234"])

  return deferred.promise
}