/*
Short Module description

*/
const module1 = require('./modules/module1.js')
const SC = require('node-soundcloud')
const q = require('q')




function getRecommendation(user){
  const deferred = q.defer()

  var recommendation = []

  SC.init({
    id: 'a1c4188f7622b71c3e7c6cf7567fc488',
    secret: 'e1162fe35d42826eacdca456b75d15da',
    accessToken: '1-162111-131842115-01c04c60d99c9'
  });

  module1.getRecommondation(user).then(function(response){
    recommendation = response
  })



  deferred.resolve(recommendation)

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
)