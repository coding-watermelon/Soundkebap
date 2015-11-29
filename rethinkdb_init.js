//Requires
var rethinkdb = require('rethinkdb'),
    q         = require('q')

//Environment Variables
var port = 28015,
    host = 'localhost',
    databaseName = 'nexboard'

rethinkdb.connect({ host: host, port: port }, function(err, conn) {
  if(err) throw err
  console.log("Connected to RethinkDB Server")
  createDatabase(conn)
    .then(createUsersTable)
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
