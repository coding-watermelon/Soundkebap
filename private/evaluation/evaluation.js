'use strict'

const db            = require(__dirname + '/../database/database.js'),
      q             = require('q'),
      recommender   = require(__dirname + '/../recommender/socialRecommendation.js')

function evaluateUser(user){
    const deferred = q.defer()

    const userId = user.user.favorites[0].user_id
    const favoritesLength = user.user.favorites[0].favorites.length
    const tracksLength = user.user.tracks[0].tracks.length

    const maxFolds = 5
    let iteration = 0

    let precision = 0.0
    let recall = 0.0

    function executeEvaluation(){
        let removedTracks = []
        let favorites = []
        let tracks = []
        let playlists = []
        let availableTracks = {}

        for(let i=0;i<favoritesLength;i++){
            if(i<(iteration*(favoritesLength/maxFolds)) || i > ((iteration+1)*(favoritesLength/maxFolds))){
                favorites.push(user.user.favorites[0].favorites[i])
            }
            else{
                removedTracks.push(user.user.favorites[0].favorites[i])
            }
        }
        availableTracks.favorites = [{"user_id":userId,"favorites":favorites}]

        for(let i=0;i<tracksLength;i++){
            if(i<(iteration*(tracksLength/maxFolds)) || i > ((iteration+1)*(tracksLength/maxFolds))){
                tracks.push(user.user.tracks[0].tracks[i])
            }
            else{
                removedTracks.push(user.user.tracks[0].tracks[i])
            }
        }
        availableTracks.tracks = [{"user_id":userId,"tracks":tracks}]

        for(let i=0;i<user.user.playlists.length;i++){
            let songs = []

            for(let j=0;j<user.user.playlists[i].playlists.length;j++){
                let playlist = user.user.playlists[i].playlists[j]
                for(let k=0;k<playlist.length;k++){

                    if(k<(iteration*(playlist.length/maxFolds)) || k > ((iteration+1)*(playlist.length/maxFolds))){
                        songs.push(playlist[k])
                    }
                    else{
                        removedTracks.push(playlist[k])
                    }
                }
            }
            playlists.push(songs)
        }
        availableTracks.playlists = [{"user_id":userId,"playlists":playlists}]

        recommender.collectValuesFromModules(availableTracks,user.otherUsers,removedTracks.length).then(function(recommendedTracks){
            console.log("============= YEAH =============")
            console.log(recommendedTracks)
            console.log(removedTracks)

            let commonIds = 0

            for(let i=0;i<recommendedTracks.length;i++){
                for(let j=0;j<removedTracks.length;j++){
                    if(recommendedTracks[i] == removedTracks[j]){
                        commonIds ++
                    }
                }
            }
            precision += (commonIds/recommendedTracks.length)
            recall += (commonIds/(removedTracks.length*maxFolds))
            console.log({"precision":precision,"recall":recall})

            if(iteration<(maxFolds-1)){
                iteration ++
                executeEvaluation()
            }
            else{
                deferred.resolve({"precision":precision,"recall":recall})
            }
        })
    }

    executeEvaluation()

    return deferred.promise
}

function evaluateUsers(){
    const deferred = q.defer()

    db.getGoldUsers().then(function(users){

        let i=0
        let overallPrecision = 0.0
        let overallRecall = 0.0

        function callEvaluateUser(user){
            console.log("evaluate user "+i)
            evaluateUser(user)
                .then(function(result){

                    overallPrecision = overallPrecision + (result.precision/ users.length)
                    overallRecall = overallRecall + (result.recall/ users.length)

                    if(i<users.length -1){
                        i++
                        callEvaluateUser(users[i])
                    }
                    else{
                        deferred.resolve({"precision":overallPrecision,"recall":overallRecall})
                    }
                })
        }
        callEvaluateUser(users[i])

    })

    return deferred.promise
}

setTimeout(function(){
    evaluateUsers().then(function(result){
        console.log(result)
    })
},1000)
