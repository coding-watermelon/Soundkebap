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

      db.getUser(req.query.userId)
        .then(recommender.getRecommondation)
        .then(function(tracklist){
          res.send(tracklist)
        })
        .catch(function(err){
          console.log(err)
          res.sendStatus(505)
        })

    })

  app.route('/api/user/sessionStart')
    .post(function(req,res){

    })

  app.route('/api/user/add')
    .post(function(req, res){

      //Get the soundcloud user and add it to db
      soundcloud.getUser('921432')
        .then(function(user){
          res.send(user)
        })
    })




}
