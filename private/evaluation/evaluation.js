'use strict'

const recommender   = require(__dirname + '/../recommender/recommender.js'),
      db            = require(__dirname + '/../database/database.js'),
      q             = require('q')


function evaluateUser(user){
    const deferred = q.defer()

    let precision = 0.5
    let recall = 0.5

    deferred.resolve({"precision":precision,"recall":recall})

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
