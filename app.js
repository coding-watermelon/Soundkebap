'use strict';

var stylus        = require('stylus'),
    express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    path          = require('path'),
    q             = require('q'),
    port          = 8080


// --- app configuration
app.use(bodyParser.urlencoded({  extended: true }))
app.use(bodyParser.json())
app.use(stylus.middleware(path.join(__dirname, 'src')))

app.use( express.static(__dirname + '/src') )
app.use( express.static(__dirname + '/node_modules') )

// --- route initialization
// require('./private/routes.js')(app)

// --- server and https setup
app.listen(port)
console.log("Listens on Port " + port)
