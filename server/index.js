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
    // we don't need the monitors saved here
    rooms[id] = { 
      id: id, 
      players: {},
      gameStarted: false,
      suggestions: { nouns: [], verbs: [], adjectives: [], adverbs: [] },
      drawingsSubmitted: 0,
      playerOrder: [],
      orderPointer: 0,
      guesses: {},
      guessVotes: [],
      curRound: 0,
      gameState: "Waiting",
      timerEnd: 0,
      signalHistory: []
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
      socket.join(code + "-Controller")

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

      io.in(code+"-Monitor").emit('new-player', playerObject)

      // save the main room on the socket object, for easy access later
      socket.mainRoom = code
    }

    socket.emit('join-response', { success: success, vip: vip, err: err, rank: rank })
  })

  // When a room WATCH is requested
  socket.on('watch-room', state => {
    let room = state.roomCode.toUpperCase()

    let success = true
    let err = ''
    if(rooms[room] == undefined /* && !rooms[code].gameStarted */) {
      err = 'This room is not available'
      success = false
    }

    console.log("Room watch requested at room " + room + " || Success: " + success.toString())

    // if watch request was succesful ...
    //  => add the watcher (just join the room)
    //  => update audience/watcher count ??? (TO DO)
    //  => determine current game state, send that to the watch room ??? (TO DO)
    let timer = 0
    let gameState = 'Waiting'
    let preSignal = null

    if(success) {
      socket.join(room + "-Monitor")
      socket.mainRoom = room

      // Determine the current TIMER of the game
      if(rooms[room].timerEnd == 0) {
        // If there is no set timer end time, the current round must be timerless, so just return 0
        timer = 0
      } else {
        // Otherwise, calculate the time left on the timer
        // Subtraction gives the difference in milliseconds, so divide by 1000 (because our timer works in seconds)
        timer = (rooms[room].timerEnd - new Date())/1000
      }

      // Get the next state
      gameState = rooms[room].gameState

      // The game should have saved a certain "preSignal", which is the information needed before launching the current state
      // Send it as well
      if(rooms[room].preSignal !== null) {
        preSignal = rooms[room].preSignal
      }
    }

    socket.emit('watch-response', { success: success, err: err, timer: timer, gameState: gameState, preSignal: preSignal })
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

  // When any client disconnects ...
  socket.on('disconnect', state => {
    let room = socket.mainRoom

    // the player wasn't in a room yet; no need for further checks
    if(room == undefined || room == null) {
      return;
    }

    // if the room was already deleted ...
    if(rooms[room] == undefined) {
      return;
    }

    if(!(socket.id in rooms[room].players)) {
      // if the disconnect was from a MONITOR, no probs
      // The game is still going strong, one just needs to "watch room" again.
    } else {
      // If the disconnect is from a player, VERY MUCH PROBLEMOS
      // Delete the player
      delete rooms[room].players[socket.id]

      // If it was the last player, delete the whole room
      if(Object.keys(rooms[room].players).length < 1) {
        delete rooms[room]
      } else {
        // Inform all monitors of the change
        // TO DO: Nobody's listening for this signal yet ...
        // NOTE: It only sends the player that left, to save internet bandwidth
        io.in(room + "-Monitor").emit('player-disconnected', rooms[room].players[socket.id])
      }
    }
  })

  // When the game is ended/exited/destroyed
  socket.on('destroy-game', state => {
    // disconnect everyone
    io.in(socket.mainRoom + "-Controller").emit('force-disconnect', {})

    // room should be automatically destroyed when last player is removed (see "disconnect" eventListener)
  })

  socket.on('game-loading-finished', state => {
    // get room
    let room = socket.mainRoom

    // TO DO: Determine which signals have already been sent in this state, then resend all those signals (with socket.emit)
    // IDEA: Save all signals from a state in the room! And just replay those signals here. (When the state switches, clean this history.)
  })

  // When the VIP has decided to start the game ...
  socket.on('start-game', state => {
    let room = socket.mainRoom
    if(rooms[room] == undefined) {
      console.log("Error: Tried to start game in undefined room")
      return;
    }

    rooms[room].gameStarted = true;
    rooms[room].playerCount = Object.keys(rooms[room].players).length

    // Inform all players about this change (which should switch them to the next state)
    gotoNextState(room, 'Suggestions', true)
  })

  /*
  Old code to get the current room:
  let room = Object.keys(socket.rooms).filter(function(item) {
        return item !== socket.id;
    })[0]
  */

  // When someone submits a drawing ...
  socket.on('submit-drawing', state => {
    let room = socket.mainRoom

    console.log('Received drawing in room ' + room);

    if(state.type == "profile") {
      // save the drawing as profile picture (for this player)
      rooms[room].players[socket.id].profile = state.dataURI

      // update the waiting screen
      io.in(room + "-Monitor").emit('player-updated-profile', rooms[room].players[socket.id])
      rooms[room].signalHistory.push(['player-updated-profile', rooms[room].players[socket.id]])
    } else if (state.type == "ingame") {
      // save the drawing for this player
      rooms[room].players[socket.id].drawing = state.dataURI

      // notify the game monitors
      // (only send the player that is done, not the whole playerlist)
      io.in(room + "-Monitor").emit('player-done', rooms[room].players[socket.id])
      rooms[room].signalHistory.push(['player-done', rooms[room].players[socket.id]])

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
    let room = socket.mainRoom

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
    io.in(room + "-Monitor").emit('player-done', rooms[room].players[socket.id])
    rooms[room].signalHistory.push(['player-done', rooms[room].players[socket.id]])

    // if everyone has submitted suggestions, start the game immediately!
    let allSuggestionsDone = (r.nouns.length == rooms[room].playerCount)
    if(allSuggestionsDone) {
      gotoNextState(room, 'Drawing', true);
    }
  })

  // When someone submits a guess (to the drawing shown onscreen) ...
  socket.on('submit-guess', state => {
    let room = socket.mainRoom

    console.log('Received guess "' + state + '" in room ' + room)

    // check if guess already exists
    // if so, return that info to the player
    // he may reguess
    if(state in rooms[room].guesses) {
      socket.emit('guess-already-exists', {})
      return;
    }

    // add guess to dictionary of guesses and save whose it was
    let name = rooms[room].players[socket.id].name
    rooms[room].guesses[state] = { player: socket.id, name: name, whoGuessedIt: [], correct: false }

    // notify the game monitors
    io.in(room + "-Monitor").emit('player-done', rooms[room].players[socket.id])
    rooms[room].signalHistory.push(['player-done', rooms[room].players[socket.id]])

    // check if all guesses are done (if so, immediately start next round)
    // the player who drew the picture, obviously, DOES NOT GUESS
    let allGuessesDone = (Object.keys(rooms[room].guesses).length == (rooms[room].playerCount - 1))
    if(allGuessesDone) {
      gotoNextState(room, 'GuessingPick', true)
    }
  })

  // When someone votes for a certain guess to be the correct one ...
  socket.on('vote-guess', state => {
    let room = socket.mainRoom

    console.log('Received guess vote "' + state + '" in room ' + room)

    // save the vote
    rooms[room].players[socket.id].guessVote = state
    rooms[room].guessVotes.push(state)

    // notify the game monitors
    io.in(room + "-Monitor").emit('player-done', rooms[room].players[socket.id])
    rooms[room].signalHistory.push(['player-done', rooms[room].players[socket.id]])

    // if all votes are done, immediately start results
    let allVotesDone = (rooms[room].guessVotes.length == (rooms[room].playerCount - 1))
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
    let timer = 0;
    let curPlayerID = null;
    let p = null;
    let r = null;

    // reset signal history here (because there might be more preSignals added later, before the state switch)
    rooms[room].signalHistory = []
    rooms[room].preSignal = null

    if(rooms[room] == undefined) {
      console.log("Error: tried to switch states in a non-existent room")
      return;
    }
    
    switch(nextState) {
      // If the next state is the suggestions state (first of the game) ...
      case 'Suggestions':
        // inform (only the monitors) of some extra info, such as player count
        io.in(room + "-Monitor").emit('setup-info', rooms[room].playerCount)
        rooms[room].preSignal = ['playerCount', rooms[room].playerCount]

        // just set the timer
        timer = 60;
        break;

      // If the next state is the drawing state ...
      case 'Drawing':
        // create a random suggestion for each player
        // and send it to them
        r = rooms[room].suggestions

        for(let player in rooms[room].players) {
          let title = generateSuggestion(rooms[room])

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
            io.in(room + "-Controller").emit('fetch-drawing', {})

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

          // send the next drawing (to all monitors AND controllers in the room; controllers need to know if the drawing is theirs or not)
          // TO DO: Controllers actually only need to know the id; no need to send the whole object (OPTIMIZE!)
          let tempObj = { dataURI: p.drawing, name: p.name + "Round" + rooms[room].curRound, id: curPlayerID, lastDrawing: lastDrawing }
          io.in(room + "-Monitor").emit('return-drawing', tempObj)
          io.in(room + "-Controller").emit('return-drawing', tempObj)
          rooms[room].preSignal = ['drawing', tempObj]
        }

        timer = 60;
        break;

      // If the next state is the one where we pick the correct guess from the game screen ...
      case 'GuessingPick':
        // TO DO: We actually need to autofetch all guesses before we continue
        // but not now, because we're still testing other stuff :p
        certain = true

        // we should have a list of guesses now
        let guesses = rooms[room].guesses

        // add the correct title to this list
        // first get current player
        curPlayerID = rooms[room].playerOrder[rooms[room].orderPointer]
        p = rooms[room].players[curPlayerID]
        guesses[p.drawingTitle] = { player: curPlayerID, name: p.name, whoGuessedIt: [], correct: true }

        // add 4 random computer titles
        for(let i = 0; i < 4; i++) {
          // generate a random suggestion
          let title = generateSuggestion(rooms[room])

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
        io.in(room + "-Monitor").emit('return-guesses', guessKeys)
        rooms[room].preSignal = ['guesses', guessKeys]

        io.in(room + "-Controller").emit('return-guesses', guessKeys)

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
        
        curPlayerID = rooms[room].playerOrder[rooms[room].orderPointer]
        
        let realTitle = rooms[room].players[curPlayerID].drawingTitle
        let countCorrect = 0;
        for(let key in rooms[room].players) {
          // the player who drew the picture already gets points from checking the other players
          // so exclude him from this loop
          if(key != curPlayerID) {
            p = rooms[room].players[key]
            let myVote = p.guessVote

            // if the vote was correct ...
            if(myVote == realTitle) {
              //add score
              p.score += 1000;
              rooms[room].players[curPlayerID].score += 1000;

              // increase amount of people who guessed correctly
              countCorrect++;

              // save who guessed correctly
              rooms[room].guesses[realTitle].whoGuessedIt.push(p.name)
            } else {
              // if the vote was incorrect, search whose title it was, give them points
              // technically, one can vote for one's own incorrect drawing title, I don't see the need to prevent against such stupidity :p
              for(let key2 in rooms[room].players) {
                let p2 = rooms[room].players[key2]
                if(myVote == p2.drawingTitle) {
                  p2.score += 750;

                  // save who guessed this
                  rooms[room].guesses[myVote].whoGuessedIt.push(p.name)
                  break;
                }
              }
            }
          }
        }

        // if all players were correct, subtract the points again!
        // (of course, the player who made the drawing doesn't vote)
        if(countCorrect == (rooms[room].playerCount - 1)) {
          rooms[room].players[curPlayerID].score -= (rooms[room].playerCount + 2)*1000;
        }

        // send each guess (including the correct title), who guessed it, and who wrote it
        io.in(room + "-Monitor").emit('final-guess-results', rooms[room].guesses)
        rooms[room].preSignal = ['finalGuessResults', rooms[room].guesses]

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
        io.in(room + "-Monitor").emit('final-scores', r.players)
        rooms[room].preSignal = ['finalScores', r.players]

        // wipe out this round
        r.suggestions = { nouns: [], verbs: [], adjectives: [], adverbs: [] }
        r.drawingsSubmitted = 0
        r.playerOrder = []
        r.orderPointer = 0

        rooms[room].curRound++;

        timer = 0;
        break;
    }

    // calculate when the timer should end (on the server)
    // this is only used to create the "watch room" function (where people might drop in at any time)
    if(timer == 0) {
      rooms[room].timerEnd = 0
    } else {
      rooms[room].timerEnd = new Date(new Date().getTime() + timer*1000)  
    }

    // if we're certain that the next state should start, notify both Monitors and Controllers
    if(certain) {
      rooms[room].gameState = nextState

      io.in(room + "-Monitor").emit('next-state', { nextState: nextState, timer: timer })
      io.in(room + "-Controller").emit('next-state', { nextState: nextState, timer: timer })
    }
  }
})

// @parameter r => the player's room 
function generateSuggestion(room) {
  // The order is: ADJECTIVE + NOUN + VERB + ADVERB
  let title = ""
  let r = room.suggestions

  // There can be multiple adjectives (but there doesn't need to be one)
  // The maximum is 4 (we don't want an infinite loop, nor too many adjectives)
  let counter = 0
  while(Math.random() >= 0.25) {
    title += " " + r.adjectives[Math.floor(Math.random()*r.adjectives.length)]
    counter++
    if(counter >= 4) {
      break;
    }
  }

  title += " " + r.nouns[Math.floor(Math.random()*r.nouns.length)]

  if(Math.random() >= 0.25) {
    title += " " + r.verbs[Math.floor(Math.random()*r.verbs.length)]
  }

  if(Math.random() >= 0.25) {
    title += " " + r.adverbs[Math.floor(Math.random()*r.adverbs.length)]
  }

  return title
}
