//Requires
var rethinkdb = require('rethinkdb'),
    q         = require('q'),
    config    = require(__dirname + "/private/config.json")

//Environment Variables
const port = config.database.port,
      host = config.database.host,
      databaseName = config.database.name

rethinkdb.connect({ host: host, port: port }, function(err, conn) {
  if(err) throw err
  console.log("Connected to RethinkDB Server")
  createDatabase(conn)
    .then(createUsersTable)
    .then(function(){return createHistoryTable(conn)})
    .then(function(){return createTrackTable(conn)})
    .then(function(){
      console.log('Finished initialization!')
      process.exit(1)
    })
    .catch(function(err){
      console.log(err.message)
      process.exit(1)
    })
})

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
  rethinkdb.db(databaseName).tableCreate('user', {primaryKey: 'userId'}).run(conn, function(err, conn){
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

  rethinkdb.db(databaseName).tableCreate('track', {primaryKey: 'trackId'}).run(conn, function(err, conn){
    if(err){
      deferred.reject(err)
      return
    }
    console.log("Created track Table")
    deferred.resolve(conn)
  })

  return deferred.promise
}
