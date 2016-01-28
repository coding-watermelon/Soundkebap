'use strict';
const db    = require(__dirname + '/../database/database.js')
const soundcloud = require(__dirname + "/../soundcloud/connector.js")

module.exports = function(req, res){
  console.log(req.cookies)
  let userId = parseInt(req.cookies["user-id"])
  let accessToken = req.cookies["access-token"]

  db.getUser(userId)
    .then(function(user){res.send(200)})
    .catch(function(){
        soundcloud.getUser(userId, accessToken)
          .then(function(user){
            return db.addUser(user)
          })
          .then(function(){res.send(200)})
          .catch(function(){res.send(401)})
    })
}
