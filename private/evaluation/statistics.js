'use strict'

const db            = require(__dirname + '/../database/database.js')

setTimeout(function(){
    db.getGoldUsers().then(function(users){
        let totalFavorites = 0
        let minFavorites = 10000000000
        let maxFavorites = 0
        let otherUsers = 0

        for(let i=0;i<users.length;i++){

            //process users
            let favorites = users[i].user.favorites[0].favorites.length
            if(favorites>maxFavorites)
                maxFavorites = favorites
            if(favorites<minFavorites)
                minFavorites = favorites
            totalFavorites += favorites

            //process otherUsers
            for(let j=0;j<users[i].otherUsers.favorites.length;j++){
                otherUsers ++
                let favorites = users[i].otherUsers.favorites[j].favorites.length
                if(favorites>maxFavorites)
                    maxFavorites = favorites
                if(favorites<minFavorites)
                    minFavorites = favorites
                totalFavorites += favorites
            }
        }
        console.log("favorites")
        console.log(minFavorites)
        console.log(maxFavorites)
        console.log(totalFavorites)
        console.log(totalFavorites/otherUsers)

        let totalTracks = 0
        let minTracks = 10000000000
        let maxTracks = 0

        for(let i=0;i<users.length;i++){

            //process users
            let tracks = users[i].user.tracks[0].tracks.length
            if(tracks>maxTracks)
                maxTracks = tracks
            if(tracks<minTracks)
                minTracks = tracks
            totalTracks += tracks

            //process otherUsers
            for(let j=0;j<users[i].otherUsers.tracks.length;j++){
                let tracks = users[i].otherUsers.tracks[j].tracks.length
                if(tracks>maxTracks)
                    maxTracks = tracks
                if(tracks<minTracks)
                    minTracks = tracks
                totalTracks += tracks
            }
        }
        console.log("\ntracks")
        console.log(minTracks)
        console.log(maxTracks)
        console.log(totalTracks)
        console.log(totalTracks/otherUsers)

        let totalPlaylists = 0
        let minPlaylists = 10000000000
        let maxPlaylists = 0

        let totalSongsPerPlaylists = 0
        let minSongsPerPlaylists = 10000000000
        let maxSongsPerPlaylists = 0

        for(let i=0;i<users.length;i++){

            //process users
            let playlists = users[i].user.playlists[0].playlists.length
            for(let j=0;j<playlists;j++){
                let songs = users[i].user.playlists[0].playlists[j].length
                if(songs>maxSongsPerPlaylists)
                    maxPlaylists = songs
                if(songs<minSongsPerPlaylists)
                    minPlaylists = songs
                totalSongsPerPlaylists += songs
            }
            if(playlists>maxPlaylists)
                maxPlaylists = playlists
            if(playlists<minPlaylists)
                minPlaylists = playlists
            totalPlaylists += playlists

            //process otherUsers
            for(let j=0;j<users[i].otherUsers.playlists.length;j++){
                let playlists = users[i].otherUsers.playlists[j].playlists.length
                for(let k=0;k<playlists;k++){
                    let songs = users[i].otherUsers.playlists[j].playlists[k].length
                    if(songs>maxSongsPerPlaylists)
                        maxSongsPerPlaylists = songs
                    if(songs<minSongsPerPlaylists)
                        minSongsPerPlaylists = songs
                    totalSongsPerPlaylists += songs
                }
                if(playlists>maxPlaylists)
                    maxPlaylists = playlists
                if(playlists<minPlaylists)
                    minPlaylists = playlists
                totalPlaylists += playlists
            }
        }
        console.log("\nplaylists")
        console.log(minPlaylists)
        console.log(maxPlaylists)
        console.log(totalPlaylists)
        console.log(totalPlaylists/otherUsers)

        console.log("\nsongs per playlists")
        console.log(minSongsPerPlaylists)
        console.log(maxSongsPerPlaylists)
        console.log(totalSongsPerPlaylists)
        console.log(totalSongsPerPlaylists/totalPlaylists)
    })
},1000)