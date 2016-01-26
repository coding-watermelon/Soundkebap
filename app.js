'use strict';

var stylus        = require('stylus'),
    express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    path          = require('path'),
    q             = require('q'),
    port          = 7070

const dbInit      = require(__dirname + '/private/scripts/rethinkdb_init.js')

// --- app configuration
app.use(bodyParser.urlencoded({  extended: true }))
app.use(bodyParser.json())
app.use(stylus.middleware(path.join(__dirname, 'styles')))

app.use( express.static(__dirname + '/src1') )
app.use( express.static(__dirname + '/node_modules') )

//Database initialization
dbInit.init()
  .catch(function(err){console.log(err)})


// --- route initialization
require('./private/routes.js')(app)

// --- server and https setup
app.listen(port)
console.log("Listens on Port " + port)
