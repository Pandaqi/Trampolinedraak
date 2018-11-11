'use strict'
const http = require('http')
const app = require('./config')
const Server = http.Server(app)
const PORT = process.env.PORT || 8000
const io = require('socket.io')(Server, {origins: "*:*"})

Server.listen(PORT, () => console.log('Game server running on:', PORT))

// this variable will hold all current game rooms (and thus all games that are currently being played)
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
    // (we don't need the monitors saved here, as they do nothing but display the game)
    // also save any other variables we might need (such as drawings and guesses/suggestions submitted)
    rooms[id] = { 
      id: id, 
      players: {},

      gameStarted: false,
      curRound: 0,
      gameState: "Waiting",
      timerEnd: 0,
      timerLeft: 0,
      
      suggestions: { nouns: [], verbs: [], adjectives: [], adverbs: [] },
      drawingsSubmitted: 0,
      playerOrder: [],
      orderPointer: 0,
      guesses: {},
      guessVotes: [],
      
      signalHistory: [],
      peopleDisconnected: [],
      destroyingGame: false,

      language: state.language,
    }

    // save the main room in the socket, for easy access later
    socket.mainRoom = id

    // join the room (room is "automatically created" when someone joins it)
    socket.join(id + "-Monitor");

    // beam back the room code to the "game monitor"
    socket.emit('room-created', {roomCode: id})

    console.log("New room created: " + id)
  })

  // when a room JOIN is requested ...
  socket.on('join-room', state => {
    // get roomcode requested, turn into all uppercase (just to be sure)
    let room = state.roomCode
    let name = state.userName
    let curRoom = rooms[room]

    // check if the room exists and is joinable
    // also check if the name provided is not empty, too long, or already in use
    let success = true
    let err = ''
    let rejoin = false

    if(curRoom == undefined) {
      err = 'This room is not available'
      success = false
    } else if(curRoom.gameStarted) {
      // If the game has already started ...

      // If the game is paused, this player is a possible rejoiner!
      if(curRoom.peopleDisconnected.length > 0) {
        // Check if the name provided is in the list of disconnected players
        let nameInGame = curRoom.peopleDisconnected.some(function(k) {
            return k[1] === name;
        });

        // if so, we can succesfully rejoin!
        if(nameInGame) {
          rejoin = true
        } else {
          err = 'Attempted rejoin failed: incorrect name'
          success = false
        }
      } else {
        err = 'This game has already started'
        success = false
      }
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

    console.log("Room join requested at room " + room + " || Success: " + success.toString())

    // if joining was succesful ...
    //  => add the player
    //  => check if it's the first player (if so => make it the VIP)
    //  => send an update to all other players (in the same room, of course)
    let vip = false
    let rank = -1
    if(success) {
      socket.join(room + "-Controller")

      // if this is NOT a rejoin, create a new player
      // (if it IS a rejoin, the corresponding player should still exist within the room object, and we can get the correct values from there)
      if(!rejoin) {
        rank = Object.keys(curRoom.players).length

        if(rank < 1) {
          vip = true
        }

        let playerObject =  { 
          name: name, 
          vip: vip, 
          rank: rank, 
          profile: null, 
          room: room,
          drawing: null,
          drawingTitle: '',
          guessVote: '', 
          score: 0,
        }
        curRoom.players[socket.id] = playerObject

        sendSignal(room, true, 'new-player', playerObject)
      } else {
        // IMPORTANT: Because it's a rejoin, the socket.id will be different
        // As such, we need to transfer info from the OLD id to the NEW id, and then delete the old one

        // find the old player id
        for(let i = 0; i < curRoom.peopleDisconnected.length; i++) {
          let tempVal = curRoom.peopleDisconnected[i]
          if(tempVal[1] == name) {
            // copy the info over from old id (tempVal[0]) to new id (socket.id)
            curRoom.players[socket.id] = curRoom.players[ tempVal[0] ]

            // remove the player from the disconnected players
            curRoom.peopleDisconnected.splice(i, 1)

            // and permanently delete the old socket.id from the player keys
            delete curRoom.players[ tempVal[0] ]
            break;
          }
        }

        // get the rank
        rank = curRoom.players[socket.id].rank
      }

      // save the main room on the socket object, for easy access later
      socket.mainRoom = room
    }

    // send success response
    // if it's a new player, it will just setup the game and go to the waiting area
    // if it's a rejoin, it will push the player to the correct gamestate
    if(!success) {
      socket.emit('join-response', { success: success, err: err})
    } else {
      let gameState = curRoom.gameState
      let language = curRoom.language

      if(!rejoin) {
        socket.emit('join-response', { success: success, vip: vip, rank: rank, rejoin: rejoin, gameState: gameState, language: language })
      } else {
        let preSignal = curRoom.players[socket.id].preSignal
        let playerDone = curRoom.players[socket.id].done
        socket.emit('join-response', { success: success, vip: vip, rank: rank, rejoin: rejoin, gameState: gameState, language: language, preSignal: preSignal, playerDone: playerDone })
      }


      // if this was the last one to reconnect, resume the game!
      if(curRoom.peopleDisconnected.length <= 0) {
        // send message to all monitors
        sendSignal(room, true, 'pause-resume-game', false, false)

        // send message to the VIP
        let vipID = Object.keys(curRoom.players).find(key => curRoom.players[key].vip === true)
        sendSignal(room, false, 'pause-resume-game', false, false, vipID)

        // update timer (to account for time lost when pausing)
        curRoom.timerEnd = new Date(curRoom.timerEnd + curRoom.timerLeft*1000)
      }
    }

  })

  // When a room WATCH is requested
  socket.on('watch-room', state => {
    let room = state.roomCode
    let curRoom = rooms[room]

    let success = true
    let err = ''
    if(rooms[room] == undefined /* && !rooms[code].gameStarted */) {
      err = 'This room is not available'
      success = false
    }

    console.log("Room watch requested at room " + room + " || Success: " + success.toString())

    // if watch request was succesful ...
    //  => add the watcher (just join the room)
    //  => send the correct info (and pre/post signals) to the new monitor
    let timer = 0
    let gameState = 'Waiting'
    let preSignal = null
    let paused = false
    let language = curRoom.language

    if(success) {
      socket.join(room + "-Monitor")
      socket.mainRoom = room

      // Determine the current TIMER of the game
      if(curRoom.timerEnd == 0) {
        // If there is no set timer end time, the current round must be timerless, so just return 0
        timer = 0
      } else {
        // Otherwise, calculate the time left on the timer
        // Subtraction gives the difference in milliseconds, so divide by 1000 (because our timer works in seconds)
        timer = (curRoom.timerEnd - new Date())/1000
      }

      // Get the next state
      gameState = curRoom.gameState

      if(curRoom.peopleDisconnected.length > 0) {
        paused = true
      }

      // The game should have saved a certain "preSignal", which is the information needed before launching the current state
      // Send it as well
      if(curRoom.preSignal !== null) {
        preSignal = rooms[room].preSignal
      }
    }

    if(!success) {
      socket.emit('watch-response', { success: success, err: err })
    } else {
      socket.emit('watch-response', { success: success, timer: timer, gameState: gameState, language: language, preSignal: preSignal, paused: paused })
    }

  })

  // When a client, who wants to "watch room" a game that's currently underway, has finished loading ... 
  socket.on('finished-loading', state => {
    // replay the signal history (for the current state)
    let room = socket.mainRoom
    let sgs = rooms[room].signalHistory
    for(let i = 0; i < sgs.length; i++) {
      let curSig = sgs[i]
      // 0 is the signal name/title/handler, 1 is the actual info being transmitted
      socket.emit(curSig[0], curSig[1])
    } 
  })

  // The VIP has decided to continue the game without disconnected players
  socket.on('continue-without-disconnects', state => {
    let curRoom = rooms[socket.mainRoom]

    // reduce player count
    curRoom.playerCount -= curRoom.peopleDisconnected.length

    // delete all disconnected players (by socket id)
    for(let i = 0; i < curRoom.peopleDisconnected.length; i++) {
      delete curRoom.players[ curRoom.peopleDisconnected[i][0] ]
    }

    // send message to all monitors
    // (the VIP doesn't need a message, as he was the one that made this decision)
    sendSignal(room, true, 'pause-resume-game', false, false, false)

    // update timer (to account for time lost when pausing)
    curRoom.timerEnd = new Date(curRoom.timerEnd + curRoom.timerLeft*1000)
  })

  // When any client disconnects ...
  socket.on('disconnect', state => {
    let room = socket.mainRoom
    let curRoom = rooms[room]

    // the player wasn't in a room yet; no need for further checks
    // the game was already deleted; also nothing to do anymore
    if(room == undefined || room == null || curRoom == undefined) {
      return;
    }

    if(!(socket.id in curRoom.players)) {
      // if the disconnect was from a MONITOR, no probs
      // The game is still going strong, one just needs to "watch room" again.
    } else {
      // If the disconnect is from a player, VERY MUCH PROBLEMOS
      // If it was the last player, OR it was the VIP, delete the whole room
      if(Object.keys(curRoom.players).length < 1 || curRoom.players[socket.id].vip) {
        delete rooms[room]
      } else {
        // If it wasn't the last player in the room ...
        // If we're in game destroying mode (the players have deliberately chosen to end the game) ...
        if(curRoom.destroyingGame) {
          // Delete the player
          delete curRoom.players[socket.id]

          // Return here; so the game does not PAUSE or try something weird
          return;
        }

        // Pause the game

        // If this is the first one to pause the game (AKA "at this moment, the game is not paused yet")
        if(curRoom.peopleDisconnected.length <= 0) {
          // Save the time left on the timer
          curRoom.timerLeft = (curRoom.timerEnd - new Date())/1000

          // Inform everybody of this change ("true" means the game should pause, "false" means the game should resume)
          sendSignal(room, true, 'pause-resume-game', true, false, false)

          // We only want the VIP (for the controllers)
          let vipID = Object.keys(curRoom.players).find(key => curRoom.players[key].vip === true)
          sendSignal(room, false, 'pause-resume-game', true, false, false)
        }

        // If peopleDisconnected > 0, the game must automatically be paused (this is just more efficient than adding another variable)
        let name = curRoom.players[socket.id].name
        curRoom.peopleDisconnected.push([socket.id, name])
      }
    }
  })

  // When the game is ended/exited/destroyed
  socket.on('destroy-game', state => {
    // set our room to destroy mode (sounds exciting)
    rooms[socket.mainRoom].destroyingGame = true

    // disconnect everyone
    sendSignal(room, true, 'force-disconnect', {}, false, false)
    sendSignal(room, false, 'force-disconnect', {}, false, false)

    // room should be automatically destroyed when last player is removed (see "disconnect" eventListener)
  })

  // When the VIP has decided to start the game ...
  socket.on('start-game', state => {
    let room = socket.mainRoom
    let curRoom = rooms[room]

    if(curRoom == undefined) {
      console.log("Error: Tried to start game in undefined room")
      return;
    }

    curRoom.gameStarted = true;
    curRoom.playerCount = Object.keys(curRoom.players).length

    // Inform all players about this change (which should switch them to the next state)
    gotoNextState(room, 'Suggestions', true)
  })

  // When someone submits a drawing ...
  socket.on('submit-drawing', state => {
    let room = socket.mainRoom
    let curRoom = rooms[room]
    let curPlayer = curRoom.players[socket.id]

    curPlayer.done = true
    console.log('Received drawing in room ' + room);

    if(state.type == "profile") {
      // save the drawing as profile picture (for this player)
      curPlayer.profile = state.dataURI

      // update the waiting screen
      sendSignal(room, true, 'player-updated-profile', curPlayer)
    } else if (state.type == "ingame") {
      // save the drawing for this player
      rooms[room].players[socket.id].drawing = state.dataURI

      // notify the game monitors
      // (only send the player that is done, not the whole playerlist)
      sendSignal(room, true, 'player-done', curPlayer)

      // update drawings counter
      curRoom.drawingsSubmitted++;

      // If all drawings have been submitted, start the next state automatically
      // This can be because all users have submitted, OR because the autofetch by the server is complete
      if(curRoom.drawingsSubmitted == curRoom.playerCount) {
        gotoNextState(room, 'Guessing', true)
      }
    }
    
  })

  // When someone submits a suggestion ...
  socket.on('submit-suggestion', state => {
    let room = socket.mainRoom
    let curRoom = rooms[room]

    console.log('Received suggestion "' + state.suggestion + '" in room ' + room)

    // add it to the list of suggestions
    let r = rooms[room].suggestions
    let s = state.suggestion

    // suggestions are split based on word type; this allows us to construct meaningful and correct (random) combinations later on
    r.nouns.push(s[0])
    r.verbs.push(s[1])
    r.adjectives.push(s[2])
    r.adverbs.push(s[3])

    // notify the game monitors
    // (only send the player that is done, not the whole playerlist)
    sendSignal(room, true, 'player-done', curRoom.players[socket.id])
    curRoom.players[socket.id].done = true

    // if everyone has submitted suggestions, start the game immediately!
    let allSuggestionsDone = (r.nouns.length == curRoom.playerCount)
    if(allSuggestionsDone) {
      gotoNextState(room, 'Drawing', true);
    }
  })

  // When someone submits a guess (to the drawing shown onscreen) ...
  socket.on('submit-guess', state => {
    let room = socket.mainRoom
    let curRoom = rooms[room]

    console.log('Received guess "' + state + '" in room ' + room)

    // check if guess already exists
    // if so, return that info to the player
    // he may reguess
    if(state in curRoom.guesses) {
      socket.emit('guess-already-exists', {})
      return;
    }

    // add guess to dictionary of guesses and save whose it was
    let name = curRoom.players[socket.id].name
    curRoom.guesses[state] = { player: socket.id, name: name, whoGuessedIt: [], correct: false }

    // notify the game monitors
    sendSignal(room, true, 'player-done', curRoom.players[socket.id])
    curRoom.players[socket.id].done = true

    // check if all guesses are done (if so, immediately start next round)
    // the player who drew the picture, obviously, DOES NOT GUESS
    let allGuessesDone = (Object.keys(curRoom.guesses).length == (curRoom.playerCount - 1))
    if(allGuessesDone) {
      gotoNextState(room, 'GuessingPick', true)
    }
  })

  // When someone votes for a certain guess to be the correct one ...
  socket.on('vote-guess', state => {
    let room = socket.mainRoom
    let curRoom = rooms[room]

    console.log('Received guess vote "' + state + '" in room ' + room)

    // save the vote
    curRoom.players[socket.id].guessVote = state
    curRoom.guessVotes.push(state)

    // notify the game monitors
    sendSignal(room, true, 'player-done', curRoom.players[socket.id])
    curRoom.players[socket.id].done = true

    // if all votes are done, immediately start results
    let allVotesDone = (curRoom.guessVotes.length == (curRoom.playerCount - 1))
    if(allVotesDone) {
      gotoNextState(room, 'GuessingResults', true)
    }
  })

  socket.on('timer-complete', state => {
    let room = socket.mainRoom

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
    let timer = 0
    let curPlayerID = null
    let p = null
    let r = null
    let curRoom = rooms[room]

    if(curRoom == undefined) {
      console.log("Error: tried to switch states in a non-existent room")
      return;
    }

    // reset signal history here (because there might be more preSignals added later, before the state switch)
    curRoom.signalHistory = []
    curRoom.preSignal = null

    // clear player signals
    for(let player in curRoom.players) { 
      curRoom.players[player].preSignal = null
      curRoom.players[player].done = false
    }
    
    switch(nextState) {
      // If the next state is the suggestions state (first of the game) ...
      case 'Suggestions':
        // inform (only the monitors) of some extra info, such as player count
        sendSignal(room, true, 'pre-signal', ['playerCount', rooms[room].playerCount], true)

        // just set the timer
        timer = 60;
        break;

      // If the next state is the drawing state ...
      case 'Drawing':
        // create a random suggestion for each player
        // and send it to them
        r = curRoom.suggestions

        for(let playerID in curRoom.players) {
          let title = generateSuggestion(curRoom)

          // save it
          curRoom.players[playerID].drawingTitle = title

          // send it (the player variable holds the key for this player in the dictionary, which is set to its socketid when created)
          // sendSignal automatically saves the presignal (if the correct parameter is set to true)
          // so it all works out beautifully in the end!
          sendSignal(room, false, 'pre-signal', ['drawingTitle', title], true, true, playerID)
        }

        timer = 60;
        break;

      // If the next state is the guessing state ...
      case 'Guessing':
        let allDrawingsSubmitted = (curRoom.drawingsSubmitted == curRoom.playerCount)
        if(!certain) {
          // if our uncertainty is unfounded, and we actually have all the drawings, just continue normally
          if(allDrawingsSubmitted) {
            certain = true;
          } else {
            // Ping all users to make sure you collect their drawings
            sendSignal(room, false, 'fetch-drawing', {}, false, false)

            // In the submit-drawing signal, it already checks if all drawings have been submitted, and starts the next state
            // This time, after the autofetch, it IS certain
          }
        }

        if(certain) {
          // if no player order has been established yet ...
          if(curRoom.playerOrder.length < 1) {
            // get player keys
            let pIDs = Object.keys(curRoom.players)

            // shuffle them
            for (let i = pIDs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pIDs[i], pIDs[j]] = [pIDs[j], pIDs[i]];
            }

            // save this new order
            curRoom.playerOrder = pIDs
          }

          // check if this is the final round
          let curPointer = curRoom.orderPointer
          let lastDrawing = false
          if(curPointer == (curRoom.playerCount - 1)) {
            lastDrawing = true
          }

          // get current player
          curPlayerID = curRoom.playerOrder[curPointer]
          p = curRoom.players[curPlayerID]

          // send the next drawing (to all monitors AND controllers in the room; controllers need to know if the drawing is theirs or not)
          let tempObjMonitor = { dataURI: p.drawing, name: p.name + "Round" + curRoom.curRound, id: curPlayerID, lastDrawing: lastDrawing }
          let tempObjController = { id: curPlayerID, lastDrawing: lastDrawing }

          sendSignal(room, true, 'pre-signal', ['drawing', tempObjMonitor], true)
          sendSignal(room, false, 'pre-signal', ['drawing', tempObjController], true)
        }

        timer = 60;
        break;

      // If the next state is the one where we pick the correct guess from the game screen ...
      case 'GuessingPick':
        // TO DO: We could autofetch all guesses before we continue, but it's not necessary really
        certain = true

        // we should have a list of guesses now
        let guesses = curRoom.guesses

        // add the correct title to this list
        // first get current player
        curPlayerID = curRoom.playerOrder[rooms[room].orderPointer]
        p = curRoom.players[curPlayerID]
        guesses[p.drawingTitle] = { player: curPlayerID, name: p.name, whoGuessedIt: [], correct: true }

        // add random computer titles
        // the more players you have, the less computer titles are added
        //  (with 8 players, 0 computer titles are being added)
        let titlesToAdd = Math.max( Math.ceil(4 - curRoom.playerCount*0.5), 0)
        for(let i = 0; i < titlesToAdd; i++) {
          // generate a random suggestion
          let title = generateSuggestion(curRoom)

          // save it (if it doesn't already exist)
          if(!(title in guesses)) {
            guesses[title] = { player: 0, name: "computer", whoGuessedIt: [], correct: false }
          }
        }

        // shuffle them
        let guessKeys = Object.keys(guesses)
        for (let i = guessKeys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [guessKeys[i], guessKeys[j]] = [guessKeys[j], guessKeys[i]];
        }

        // throw them back (to both monitor and controller)
        // to save internet (and computational power), just send the array immediately
        sendSignal(room, true, 'pre-signal', ['guesses', guessKeys], true)
        sendSignal(room, false, 'pre-signal', ['guesses', guessKeys], true)

        timer = 60;
        break;

      // If the next state shows the results from this guessing round ...
      case 'GuessingResults':
        // we can't autofetch the guess votes, because there is no default or single thing to get
        // so just always be certain
        certain = true;

        // already change the score
        // If X guesses the correct title, X gets 1000 points
        // If X guesses the title of Y, Y gets 750 points
        // For every player that guesses the correct title of X's drawing, X gets 1000 points
        // But, if EVERYONE guesses correctly, X loses 2000 points
        
        curPlayerID = curRoom.playerOrder[curRoom.orderPointer]

        // quick hack to make the server NOT crash when playing with one player
        if(curRoom.playerCount <= 1) {
          curPlayerID = Object.keys(curRoom.players)[0]
        }

        let realTitle = curRoom.players[curPlayerID].drawingTitle
        let countCorrect = 0

        for(let key in curRoom.players) {
          // the player who drew the picture already gets points from checking the other players
          // so exclude him from this loop
          if(key != curPlayerID) {
            p = curRoom.players[key]
            let myVote = p.guessVote

            // if the vote was correct ...
            if(myVote == realTitle) {
              //add score
              p.score += 1000;
              curRoom.players[curPlayerID].score += 1000;

              // increase amount of people who guessed correctly
              countCorrect++;

              // save who guessed correctly
              curRoom.guesses[realTitle].whoGuessedIt.push(p.name)
            } else {
              // if the vote was incorrect, search whose title it was, give them points
              // technically, one can vote for one's own incorrect drawing title, but that yields a penalty
              // don't need to add points to the computer (and I don't want to)
              let searchPlayerID = Object.keys(curRoom.guesses).find( key => key == myVote );
              let guessObj = curRoom.guesses[searchPlayerID]
              if(guessObj != null && guessObj.name != "computer") {
                // if you voted your own incorrect title => PENALTY POINTS!
                if(guessObj.player == key) {
                  p.score -= 750
                } else {
                  // otherwise, the player that "fooled you" gets points
                  curRoom.players[ guessObj.player ].score += 750
                }

              }
              
              curRoom.guesses[myVote].whoGuessedIt.push(p.name)
            }
          }
        }

        // if all players were correct, subtract the points again!
        // (of course, the player who made the drawing doesn't vote)
        if(countCorrect == (curRoom.playerCount - 1)) {
          curRoom.players[curPlayerID].score -= (curRoom.playerCount + 2)*1000;
        }

        // send each guess (including the correct title), who guessed it, and who wrote it
        sendSignal(room, true, 'pre-signal', ['finalGuessResults', curRoom.guesses], true)

        // already wipe out this cycle
        rooms[room].guesses = {}
        rooms[room].guessVotes = []

        // update the order pointer (so that the next time the cycle is called, we load the next drawing, instead of the same)
        rooms[room].orderPointer++;

        // and then we just wait for the monitor to reveal the results :p
        // no timer here; whenever the VIP feels like it, he can press a button on his device and continue to the next cycle
        timer = 0; 
        break;

      // If the next state is the game over (aka "end of round") state ...
      case 'Over':
        r = rooms[room]

        // send the score
        sendSignal(room, true, 'pre-signal', ['finalScores', r.players], true)

        // wipe out this round
        r.suggestions = { nouns: [], verbs: [], adjectives: [], adverbs: [] }
        r.drawingsSubmitted = 0
        r.playerOrder = []
        r.orderPointer = 0

        curRoom.curRound++;

        timer = 0;
        break;
    }

    // calculate when the timer should end (on the server)
    // this is only used to make the "watch room" functionality possible (where people might drop in at any time)
    if(timer == 0) {
      curRoom.timerEnd = 0
    } else {
      curRoom.timerEnd = new Date(new Date().getTime() + timer*1000)  
    }

    // if we're certain that the next state should start, notify both Monitors and Controllers
    if(certain) {
      curRoom.gameState = nextState

      sendSignal(room, true, 'next-state', { nextState: nextState, timer: timer }, false, false)
      sendSignal(room, false, 'next-state', { nextState: nextState, timer: timer }, false, false)
    }
  }
})

/*
  This function takes care of sending all global signals. (This means they are not socket-specific signals, such as "joining the room was succesful")
  The reason this is a function, is because there are 
   => several types of signals (pre signal, normal signal, player-specific signal, etc.)
   => AND we want to save those signals in history (to allow rejoin/room watch functionality)
  Right now, players have no signalHistory (just a preSignal and a is-the-player-done boolean; this could change when I start making more complex games)

  @parameter room => the main room in which to send the signal
  @parameter monitor => true if the signal is sent to monitors, false if it's sent to controllers
  @parameter label => the name/label for the signal
  @parameter info => the info that's sent with the signal
  @parameter preSignal => whether it's a presignal 
                          (presignals are stored elsewhere than all other signals, because they are sent at different times for different purposes)
  @parameter storeSignal => true if the signal should be saved, false if not
  @parameter playerID => the specific player that should receive the signal (if applicable)
*/
function sendSignal(room, monitor, label, info, preSignal = false, storeSignal = true, playerID = null) {
  if(monitor) {
    io.in(room + "-Monitor").emit(label, info)
    
    if(storeSignal) {
      if(preSignal) {
        rooms[room].preSignal = info
      } else {
        rooms[room].signalHistory.push([label, info])
      }
    }

  } else {
    if(playerID == null) {
      io.in(room + "-Controller").emit(label, info)

      if(storeSignal) {
        if(preSignal) {
          for(let player in rooms[room].players) { 
            rooms[room].players[player].preSignal = info
          }
        } else {
          // at the moment, players don't need a signalHistory
        }
      }
    } else {
      io.to(playerID).emit(label, info)

      if(storeSignal) {
        if(preSignal) {
          rooms[room].players[playerID].preSignal = info
        } else {
          // at the moment, players don't need a signalHistory
        }
      }
    }
  }
}

// @parameter room => the room for which the suggestion needs to be generated
function generateSuggestion(room) {
  // The order is: ADJECTIVE + NOUN + VERB + ADVERB
  let title = ""
  let r = room.suggestions

  if(room.language == 'en') {
    // There can be multiple adjectives (but there doesn't need to be one)
    // The maximum is 2 (we don't want an infinite loop, nor too many adjectives)
    let counter = 0
    while(Math.random() >= 0.25) {
      title += " " + r.adjectives[Math.floor(Math.random()*r.adjectives.length)]
      counter++
      if(counter >= 2) {
        break;
      }
    }

    title += " " + r.nouns[Math.floor(Math.random()*r.nouns.length)]

    if(Math.random() >= 0.3) {
      title += " " + r.verbs[Math.floor(Math.random()*r.verbs.length)]

      if(Math.random() >= 0.3) {
        title += " " + r.adverbs[Math.floor(Math.random()*r.adverbs.length)]
      }
    }
  } else if (room.language == 'nl') {
    let adverbIncluded = false
    if(Math.random() >= 0.3) {
      title += " " + r.adverbs[Math.floor(Math.random()*r.adverbs.length)]
      adverbIncluded = true
    }

    if(adverbIncluded || Math.random() >= 0.3) {
      title += " " + r.verbs[Math.floor(Math.random()*r.verbs.length)]
    }

    if(Math.random() >= 0.3) {
      title += " " + r.adjectives[Math.floor(Math.random()*r.adjectives.length)]
    }

    title += " " + r.nouns[Math.floor(Math.random()*r.nouns.length)]

  }

  title = title.trim()

  return title
}
