'use strict'

//Requires
var rethinkdb = require('rethinkdb'),
    q         = require('q'),
    config    = require(__dirname + "/../config.json")

//Environment Variables
const port = config.database.port,
      host = config.database.host,
      databaseName = config.database.name

exports.init = function(){
  const deferred = q.defer()

  rethinkdb.connect({ host: host, port: port }, function(err, conn) {
    if(err) throw err
    console.log("Connected to RethinkDB Server")
    createDatabase(conn)
      .then(createUsersTable)
      .then(function(){return createHistoryTable(conn)})
      .then(function(){return createTrackTable(conn)})
      .then(function(){return createPlaylistTable(conn)})
      .then(function(){
        console.log('Finished database-initialization!')
        deferred.resolve()
      })
      .catch(function(err){
        deferred.reject(err.message)
      })
  })

  return deferred.promise
}

function createDatabase(connection){
  var deferred = q.defer()

  rethinkdb.dbCreate(databaseName).run(connection, function(err, conn){
    if(err){
      deferred.reject(err)
      return
    }
    console.log("Created Database")
    deferred.resolve(connection)
  })

  return deferred.promise
}

function createUsersTable(conn){
  var deferred = q.defer()
  rethinkdb.db(databaseName).tableCreate('user', {primaryKey: 'id'}).run(conn, function(err, conn){
    if(err){
      deferred.reject(err)
      return
    }
    console.log("Created User Table")
    deferred.resolve(conn)
  })

  return deferred.promise
}

function createHistoryTable(conn){
  var deferred = q.defer()
  rethinkdb.db(databaseName).tableCreate('history', {primaryKey: 'trackId'}).run(conn, function(err, conn){
    if(err){
      deferred.reject(err)
      return
    }
    console.log("Created history Table")
    deferred.resolve(conn)
  })

  return deferred.promise
}

function createTrackTable(conn){
  var deferred = q.defer()

  rethinkdb.db(databaseName).tableCreate('track', {primaryKey: 'id'}).run(conn, function(err, conn){
    if(err){
      deferred.reject(err)
      return
    }
    console.log("Created track Table")
    deferred.resolve(conn)
  })

  return deferred.promise
}

function createPlaylistTable(conn){
  const deferred = q.defer()

  rethinkdb.db(databaseName).tableCreate('playlist', {primaryKey: 'id'}).run(conn, function(err, conn){
    if(err){
      deferred.reject(err)
      return
    }
    console.log("Created playlist Table")
    deferred.resolve(conn)
  })

  return deferred.promise
}
