'use strict'
const db            = require(__dirname + "/database/database.js"),
      recommender   = require(__dirname + "/recommender/recommender.js"),
      soundcloud    = require(__dirname + "/soundcloud/connector.js")

module.exports = function(app) {

  /**
    *  GET: :return_to - either 'register' or 'settings'
    */
  app.route('/api/endpoint')
    .get(function(req, res) {

    })
    .post(function(req, res){

    })

  app.route('/api/newTracks')
    .get(function(req, res) {
      console.log(req.query.userId)
      db.getUser(req.query.userId)
        .then(recommender.getRecommendation)
        .then(function(tracklist){
          res.status(200).send(tracklist)
        })
        .catch(function(err){
          console.log(err)
          res.sendStatus(505)
        })

    })

  app.route('/api/user/sessionStart')
    .post(function(req,res){

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
