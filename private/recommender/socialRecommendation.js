'use strict'
/*
Short Module description

*/

const module1 = require(__dirname + '/modules/module1.js'),
      SC = require('node-soundcloud'),
      q = require('q')

module.exports = {
      getRecommendation
}

function getRecommendation(user){
  const deferred = q.defer()

  module1.getRecommendation(user).then(function(response){
      deferred.resolve(response)
  })



  return deferred.promise
}

 getRecommendation({ id: 131842115,
       kind: 'user',
       permalink: 'sebastian-rehfeldt-1',
       username: 'Sebastian Rehfeldt',
       last_modified: '2015/10/14 13:21:49 +0000',
       uri: 'https://api.soundcloud.com/users/131842115',
       permalink_url: 'http://soundcloud.com/sebastian-rehfeldt-1',
       avatar_url: 'https://i1.sndcdn.com/avatars-000123963373-p1mmtc-large.jpg',
       country: null,
       first_name: 'Sebastian',
       last_name: 'Rehfeldt',
       full_name: 'Sebastian Rehfeldt',
       description: null,
       city: null,
       discogs_name: null,
       myspace_name: null,
       website: null,
       website_title: null,
       online: false,
       track_count: 0,
       playlist_count: 1,
       plan: 'Free',
       public_favorites_count: 3,
       followers_count: 6,
       followings_count: 17,
       subscriptions: [] }
 ).then(function(response){
        console.log(response)})