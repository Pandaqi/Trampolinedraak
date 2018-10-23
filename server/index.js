'use strict'
const http = require('http')
const app = require('./config')
const Server = http.Server(app)
const PORT = process.env.PORT || 8000
const io = require('socket.io')(Server, {origins: "*:*"})

Server.listen(PORT, () => console.log('Game server running on:', PORT))

const rooms = {}


io.on('connection', socket => {

  // when a new room is requested ...
  socket.on('new-room', state => {
    // generate random set of 4 letters
    // until we have an ID that does not exist yet!
    let id = "";

    do {
      id = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" //abcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < 4; i++)
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    } while (rooms[id] != undefined);

    // setup the room with the current id
    // create a dictionary to hold all the players (the ones with controllers)
    // NOT NECESSARY: create a dictionary to hold all the monitors (the ones displaying the actual game)
    // TO DO: of course, I will need more properties than this later on
    rooms[id] = { 
      id: id, 
      players: {},
      gameStarted: false,
      suggestions: { nouns: [], verbs: [], adjectives: [], adverbs: [] },
      drawingsSubmitted: 0,
      playerOrder: [],
      orderPointer: 0,
      guesses: [],
      guessVotes: [],
    }

    // join the room (room is "automatically created" when someone joins it)
    socket.join(id);

    // beam back the room code to the "game monitor"
    socket.emit('room-created', {roomCode: id})

    console.log("New room created: " + id)

  })

  // when a room JOIN is requested ...
  socket.on('join-room', state => {
    // get roomcode requested, turn into all uppercase (just to be sure)
    let code = state.roomCode
    let name = state.userName
    let curRoom = rooms[code]

    // check if the room exists and is joinable
    // also check if the name provided is not empty, too long, or already in use
    let success = true
    let err = ''

    if(curRoom == undefined || curRoom.gameStarted) {
      err = 'This room is not available or already started'
      success = false
    } else {
      let nameInUse = Object.keys(curRoom.players).some(function(k) {
          return curRoom.players[k].name === name;
      });

      if(name.length == 0) {
        err = 'Please enter a name!'
        success = false
      } else if(name.length >= 12) {
        err = 'Name must be under 12 characters'
        success = false
      } else if(nameInUse) {
        err = 'This name is already in use'
        success = false
      }
    }

    console.log("Room join requested at room " + code + " || Success: " + success.toString())

    // if joining was succesful ...
    //  => add the player
    //  => check if it's the first player (if so => make it the VIP)
    //  => send an update to all other players (in the same room, of course)
    let vip = false
    let rank = -1
    if(success) {
      socket.join(code)

      rank = Object.keys(curRoom.players).length

      if(rank < 1) {
        vip = true
      }

      let playerObject =  { 
        name: name, 
        vip: vip, 
        rank: rank, 
        profile: null, 
        room: code,
        drawing: null,
        drawingTitle: '',
        guessVote: '', 
        score: 0,
      }
      curRoom.players[socket.id] = playerObject

      io.in(code).emit('new-player', playerObject)
    }

    socket.emit('join-response', { success: success, vip: vip, err: err, rank: rank })
  })

  // When a room WATCH is requested
  socket.on('watch-room', state => {
    let code = state.roomCode.toUpperCase()

    let success = true
    let err = ''
    if(rooms[code] == undefined /* && !rooms[code].gameStarted */) {
      err = 'This room is not available'
      success = false
    }

    console.log("Room watch requested at room " + code + " || Success: " + success.toString())

    // if watch request was succesful ...
    //  => add the watcher (just join the room)
    //  => update audience/watcher count ??? (TO DO)
    if(success) {
      socket.join(code)
    }

    socket.emit('watch-response', { success: success, err: err })
  })

  // When any client disconnects ...
  socket.on('disconnect', state => {
    let room = Object.keys(socket.rooms).filter(function(item) {
        return item !== socket.id;
    })[0]

    // the player wasn't in a room yet; no need for further checks
    if(room == undefined || room == null) {
      return;
    }

    if(rooms[room].players[socket.id] == undefined) {
      // if the disconnect was from a MONITOR, no probs
      // The game is still going strong, one just needs to "view room" again.
    } else {
      // If the disconnect is from a player, VERY MUCH PROBLEMOS
      // Delete the player
      delete players[socket.id]

      // If it was the last player, delete the whole room
      if(Object.keys(rooms[room].players).length < 1) {
        delete rooms[room]
      } else {
        // Inform everyone of the change
        // NOTE: It sends the updated playerlist, so people need to figure out (clientside) who is gone and what to do with it
        io.in(room).emit('player-disconnected', players)
      }
    }
  })

  // When the VIP has decided to start the game ...
  socket.on('start-game', state => {
    let room = state.roomCode;
    if(rooms[room] == undefined) {
      console.log("Error: Tried to start game in undefined room")
      return;
    }

    rooms[room].gameStarted = true;
    rooms[room].playerCount = Object.keys(rooms[room].players).length

    // Inform all players about this change (which should switch them to the next state)
    gotoNextState(room, 'Suggestions', true)
  })

  // When someone submits a drawing ...
  // TO DO: This assumes the user is only in a single room. (It automatically picks element 0.)
  // If this changes later, REMEMBER TO CHANGE THIS (and all other places we use this)
  socket.on('submit-drawing', state => {
    let room = Object.keys(socket.rooms).filter(function(item) {
        return item !== socket.id;
    })[0]

    console.log('Received drawing in room ' + room);

    if(state.type == "profile") {
      // save the drawing as profile picture (for this player)
      rooms[room].players[socket.id].profile = state.dataURI

      // update the waiting screen
      io.in(room).emit('player-updated-profile', rooms[room].players[socket.id])
    } else if (state.type == "ingame") {
      // save the drawing for this player
      rooms[room].players[socket.id].drawing = state.dataURI

      // notify the game monitors
      // (only send the player that is done, not the whole playerlist)
      io.in(room).emit('player-done', rooms[room].players[socket.id])

      // update drawings counter
      rooms[room].drawingsSubmitted++;

      // If all drawings have been submitted, start the next state automatically
      // This can be because all users have submitted, OR because the autofetch by the server is complete
      if(rooms[room].drawingsSubmitted == rooms[room].playerCount) {
        gotoNextState(room, 'Guessing', true)
      }
    }
    
  })

  // When someone submits a suggestion ...
  socket.on('submit-suggestion', state => {
    // add it to the list of suggestions
    let room = Object.keys(socket.rooms).filter(function(item) {
        return item !== socket.id;
    })[0]

    console.log('Received suggestion "' + state.suggestion + '" in room ' + room)

    let r = rooms[room].suggestions
    let s = state.suggestion

    // suggestions are split based on word type; this allows us to construct meaningful and correct (random) combinations later on
    r.nouns.push(s[0])
    r.verbs.push(s[1])
    r.adjectives.push(s[2])
    r.adverbs.push(s[3])

    // notify the game monitors
    // (only send the player that is done, not the whole playerlist)
    io.in(room).emit('player-done', rooms[room].players[socket.id])

    // if everyone has submitted suggestions, start the game immediately!
    let allSuggestionsDone = (r.nouns.length == rooms[room].playerCount)
    if(allSuggestionsDone) {
      gotoNextState(room, 'Drawing', true);
    }
  })

  // When someone submits a guess (to the drawing shown onscreen) ...
  socket.on('submit-guess', state => {
    let room = Object.keys(socket.rooms).filter(function(item) {
        return item !== socket.id;
    })[0]

    console.log('Received guess "' + state.guess + '" in room ' + room)

    // add guess to array of guesses and save whose it was
    rooms[room].guesses.push({ guess: state.guess, player: socket.id, correct: false })

    // check if all guesses are done (if so, immediately start next round)
    // the player who drew the picture, obviously, DOES NOT GUESS
    let allGuessesDone = (rooms[room].guesses.length == (rooms[room].playerCount - 1))
    if(allGuessesDone) {
      gotoNextState(room, 'GuessingPick', true)
    }
  })

  // When someone votes for a certain guess to be the correct one ...
  socket.on('vote-guess', state => {
    let room = Object.keys(socket.rooms).filter(function(item) {
        return item !== socket.id;
    })[0]

    console.log('Received guess vote "' + state.guess + '" in room ' + room)

    // save the vote
    rooms[room].players[socket.id].guessVote = state.guess
    rooms[room].guessVotes.push(state.guess)

    // if all votes are done, immediately start results
    let allVotesDone = (rooms[room].guessVotes.length == (rooms[room].playerCount - 1))
    if(allVotesDone) {
      gotoNextState(room, 'GuessingResults', true)
    }
  })

  socket.on('timer-complete', state => {
    let room = Object.keys(socket.rooms).filter(function(item) {
        return item !== socket.id;
    })[0]

    let nextState = state.nextState
    let certain = false
    if(state.certain !== undefined && state.certain !== null) {
      certain = state.certain
    }
    gotoNextState(room, nextState, certain)
  })

  // room: the current room to move to the next state
  // nextState: which state to move to
  // certain: whether all data has already been collected (or the computer still needs to do an autofetch)
  function gotoNextState(room, nextState, certain) {
    let timer = 0;
    let curPlayerID = null;
    let p = null;
    
    switch(nextState) {
      // If the next state is the suggestions state (first of the game) ...
      case 'Suggestions':
        // inform (only the monitors) of some extra info, such as player count
        io.in(room).emit('setup-info', rooms[room].playerCount)

        // just set the timer
        timer = 60;
        break;

      // If the next state is the drawing state ...
      case 'Drawing':
        // create a random suggestion for each player
        // and send it to them
        let r = rooms[room].suggestions

        for(let player in rooms[room].players) {
          // generate a random suggestion
          let title = r.adjectives[Math.floor(Math.random()*r.adjectives.length)] + " " + r.nouns[Math.floor(Math.random()*r.nouns.length)];

          if(Math.random() >= 0.25) {
            title += " " + r.verbs[Math.floor(Math.random()*r.verbs.length)]

            if(Math.random() >= 0.25) {
              title += " " + r.adverbs[Math.floor(Math.random()*r.adverbs.length)]
            }
          }

          // save it
          rooms[room].players[player].drawingTitle = title

          // send it (the player variable holds the key for this player in the dictionary, which is set to its socketid when created)
          // so it all works out beautifully in the end!
          io.to(player).emit('drawing-title', { title: title })
        }

        timer = 60;
        break;

      // If the next state is the guessing state ...
      case 'Guessing':
        let allDrawingsSubmitted = (rooms[room].drawingsSubmitted == rooms[room].playerCount)
        if(!certain) {
          // if our uncertainty is unfounded, and we actually have all the drawings, just continue normally
          if(allDrawingsSubmitted) {
            certain = true;
          } else {
            // Ping all users to make sure you collect their drawings
            io.in(room).emit('fetch-drawing', {})

            // In the submit-drawing signal, it already checks if all drawings have been submitted, and starts the next state
            // This time, after the autofetch, it IS certain
          }
        }

        if(certain) {
          // if no player order has been established yet ...
          if(rooms[room].playerOrder.length < 1) {
            // get player keys
            let pIDs = Object.keys(rooms[room].players)

            // shuffle them
            for (let i = pIDs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pIDs[i], pIDs[j]] = [pIDs[j], pIDs[i]];
            }

            // save this new order
            rooms[room].playerOrder = pIDs
          }

          // check if this is the final round
          let curPointer = rooms[room].orderPointer
          let lastDrawing = false
          if(curPointer == (rooms[room].playerCount - 1)) {
            lastDrawing = true
          }

          // get current player
          curPlayerID = rooms[room].playerOrder[curPointer]
          p = rooms[room].players[curPlayerID]

          // send the next drawing
          io.in(room).emit('return-drawing', { dataURI: p.drawing, name: p.name, id: curPlayerID, lastDrawing: lastDrawing })

          // update the order pointer (so that the next time this function is called, we load the next drawing, instead of the same)
          curPointer++;
        }

        timer = 60;
        break;

      // If the next state is the one where we pick the correct guess from the game screen ...
      case 'GuessingPick':
        // we should have a list of guesses now
        let guesses = rooms[room].guesses

        // add the correct title to this list
        // first get current player
        curPlayerID = rooms[room].playerOrder[rooms[room].orderPointer]
        p = rooms[room].players[curPlayerID]

        // then push the guess (and the player ID)
        guesses.push({ guess: p.drawingTitle, player: curPlayerID, correct: true })

        // shuffle them
        for (let i = guesses.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [guesses[i], guesses[j]] = [guesses[j], guesses[i]];
        }

        // throw them back (to both monitor and controller)
        // to save internet (and computational power), just send the array immediately
        io.in(room).emit('return-guesses', guesses)

        timer = 60;
        break;

      // If the next state shows the results from this guessing round ...
      case 'GuessingResults':
        // already change the score
        // If X guesses the correct title, X gets 1000 points
        // If X guesses the title of Y, Y gets 750 points
        // For every player that guesses the correct title of X's drawing, X gets 1000 points
        // But, if EVERYONE guesses correctly, X loses 2000 points
        
        curPlayerID = rooms[room].playerOrder[rooms[room].orderPointer]
        
        let realTitle = rooms[room].players[curPlayerID].drawingTitle
        let countCorrect = 0;
        for(let key in rooms[room].players) {
          // the player who drew the picture already gets point from checking the other players
          // so exclude him from this loop
          if(key != curPlayerID) {
            p = rooms[room].players[key]
            let myVote = p.guessVote

            // if the vote was correct ...
            if(myVote == realTitle) {
              p.score += 1000;
              rooms[room].players[curPlayerID].score += 1000;
              countCorrect++;
            } else {
              // if the vote was incorrect, search whose title it was, give them points
              for(let key2 in rooms[room].players) {
                let p2 = rooms[room].players[key2]
                if(myVote == p2.drawingTitle) {
                  p2.score += 750;
                  break;
                }
              }
            }
          }
        }

        // if all players were correct, subtract the points again!
        if(countCorrect == rooms[room].playerCount) {
          rooms[room].players[curPlayerID].score -= (playerCount + 2)*1000;
        }

        // already wipe out this cycle
        rooms[room].guesses = []
        rooms[room].guessVotes = []

        // and then we just wait for the monitor to reveal the results :p
        // no timer here; whenever the VIP feels like it, he can press a button on his device and continue to the next cycle
        timer = 0; 
        break;
    }

    if(certain) {
      io.in(room).emit('next-state', { nextState: nextState, timer: timer })
    }
  }
})
