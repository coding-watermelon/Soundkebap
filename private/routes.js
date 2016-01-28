'use strict'
const db            = require(__dirname + "/database/database.js"),
      recommender   = require(__dirname + "/recommender/recommender.js"),
      soundcloud    = require(__dirname + "/soundcloud/connector.js")

const login         = require(__dirname + "/routes/login.js")

module.exports = function(app) {

  /**
    *  GET: :return_to - either 'register' or 'settings'
    */
  // app.route('/api/endpoint')
  //   .get(function(req, res) {
  //
  //   })
  //   .post(function(req, res){
  //
  //   })

  function isValid(req, res, next){
    db.getUser(req.cookies["user-id"])
      .then(function(user){
        req.sessionUser = user
        next()
      })
      .catch(function(err){
        res.sendStatus(401)
      })
  }

  app.route('/api/track/skipped')
    .all(isValid)
    .post(function(req,res){
        db.addSkipping(req.sessionUser.id, req.body.id, req.body.seconds)
          .then(function(){res.status(200).send()})
          .catch(function(){res.status(505).send()})
    })

  app.route('/api/track/played')
    .all(isValid)
    .post(function(req,res){
        console.log("Played called with", req.body)
        db.addSongToHistory(req.sessionUser.id,{"trackId":req.body.id,"listeningCount":1,"skipCount":0})
          .then(function(){
            res.send({})
          })
    })

  app.route('/api/login')
    .post(login)

  app.route('/api/newTracks')
    .all(isValid)
    .get(function(req, res) {
      recommender.getRecommendation(req.sessionUser)
        .then(function(tracklist){
          res.status(200).send(tracklist)
        })
        .catch(function(err){
          console.log(err)
          res.sendStatus(505)
        })

    })




  /*
    soundcloudUserId - String
    accessToken - String
  */
  app.route('/api/user/add')
    .post(function(req, res){
      var soundcloudUserId = req.body.userId,
          accessToken      = req.body.accessToken

      //Get the soundcloud user and add it to db
      soundcloud.getUser(soundcloudUserId, accessToken)
        .then(db.addUser)
        .then(function(){
          res.status(200).send({})
        })
        .catch(function(err){res.status(500).send(err)})
    })



}
