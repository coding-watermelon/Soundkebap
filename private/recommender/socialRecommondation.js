/*
Short Module description

*/

module.exports = {
  getRecommondation
}

const q       = require('q')

function getRecommondation(user){
  const deferred = q.defer()

  deferred.resolve(["12314", "1235234"])

  return deferred.promise
}
