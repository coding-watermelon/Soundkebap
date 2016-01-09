/*
Short Module description

*/
var SC = require('soundcloud');

module.exports = {
  getRecommondation
}

function getRecommondation(user){
  var deferred = q.defer()

  var recommendation = {}
  SC.get("/users/"+user.id+"/followers").then(function(followers){
    console.log("FOLLOWERS")
    console.log(followers)
  })

  deferred.resolve(recommendation)
  return deferred.promise
}
