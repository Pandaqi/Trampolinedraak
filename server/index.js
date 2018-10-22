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
      guesses: []
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
    if(success) {
      socket.join(code)

      let rank = Object.keys(curRoom.players).length

      if(rank < 1) {
        vip = true
      }

      let playerObject =  { name: name, vip: vip, rank: rank, profile: null, room: code }
      curRoom.players[socket.id] = playerObject

      io.in(code).emit('new-player', playerObject)
    }

    socket.emit('join-response', { success: success, vip: vip, err: err })
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
    // TO DO: Perform code to actually start the game (like, distribute player roles, setup variables, etc.)
    let room = state.roomCode;
    if(rooms[room] == undefined) {
      console.log("Error: Tried to start game in undefined room")
      return;
    }

    rooms[room].gameStarted = true;

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
      io.in(room).emit('player-done', { player: rooms[room].players[socket.id] })

      // update drawings counter
      rooms[room].drawingsSubmitted++;

      // If all drawings have been submitted, start the next state automatically
      // This can be because all users have submitted, OR because the autofetch by the server is complete
      if(rooms[room].drawingsSubmitted == Object.keys(rooms[room].players).length) {
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

    // if everyone has submitted suggestions, start the game immediately!
    let allSuggestionsDone = (r.nouns.length == Object.keys(rooms[room].players).length)
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
    rooms[room].guesses.push({ guess: state.guess, player: socket.id })

    // check if all guesses are done
    // the player who drew the picture, obviously, DOES NOT GUESS
    let allGuessesDone = (rooms[room].guesses.length == (Object.keys(rooms[room].players).length - 1))
    if(allGuessesDone) {
      gotoNextState(room, 'GuessingPick', true)
    }
  })

  socket.on('timer-complete', state => {
    let room = Object.keys(socket.rooms).filter(function(item) {
        return item !== socket.id;
    })[0]

    let nextState = state.nextState
    gotoNextState(room, nextState, false)
  })

  // room: the current room to move to the next state
  // nextState: which state to move to
  // certain: whether all data has already been collected (or the computer still needs to do an autofetch)
  function gotoNextState(room, nextState, certain) {
    let timer = 0;
    
    switch(nextState) {
      // If the next state is the suggestions state (first of the game) ...
      case 'Suggestions':
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
        if(!certain) {
          // Ping all users to make sure you collect their drawings
          io.in(room).emit('fetch-drawing', {})

          // In the submit-drawing signal, it already checks if all drawings have been submitted, and starts the next state
          // This time, after the autofetch, it IS certain
        } else {
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

          // get current player
          let curPlayerID = rooms[room].playerOrder[rooms[room].orderPointer]
          let p = rooms[room].players[curPlayerID]

          // send the next drawing
          io.in(room).emit('return-drawing', { dataURI: p.drawing, name: p.name, id: curPlayerID })

          // update the order pointer (so that the next time this function is called, we load the next drawing, instead of the same)
          rooms[room].orderPointer++;
        }

        timer = 60;
        break;

      // If the next state is the own where we pick the correct guess from the game screen ...
      case 'GuessingPick':
        // we should have a list of guesses now
        let guesses = rooms[room].guesses

        // TO DO:
        // add the correct title to this list


        // shuffle them
        for (let i = guesses.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [guesses[i], guesses[j]] = [guesses[j], guesses[i]];
        }

        // throw them back (to both monitor and controller)
        io.in(room).emit('return-guesses', { guesses: guesses })

        timer = 60;
        break;
    }

    if(certain) {
      io.in(room).emit('next-state', { nextState: nextState, timer: timer })
    }
  }
})
