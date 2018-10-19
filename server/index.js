'use strict'
const http = require('http')
const app = require('./config')
const Server = http.Server(app)
const PORT = process.env.PORT || 8000
const io = require('socket.io')(Server)

Server.listen(PORT, () => console.log('Game server running on:', PORT))

const players = {}
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
      gameStarted: false 
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
    let code = state.roomCode.toUpperCase()
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

      if(curRoom.players.length < 1) {
        vip = true
      }

      let playerObject =  { name: name, vip: vip, profile: null }
      curRoom.players[socket.id] = playerObject

      io.in(code).emit('update-playerlist', curRoom.players)
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
    if(players[socket.id] == undefined) {
      // if the disconnect was from a MONITOR, no probs
      // The game is still going strong, one just needs to "view room" again.
    } else {
      // If the disconnect is from a player, VERY MUCH PROBLEMOS
      // For now, just delete the player and notify everyone
      // NOTE: It sends the updated playerlist, so people need to figure out (clientside) who is gone and what to do with it
      delete players[socket.id]
      io.emit('player-disconnected', players)

      // TO DO: If it's the last player, delete the whole room
    }
  })

  // When the VIP has decided to start the game ...
  socket.on('start-game', state => {
    // TO DO: Perform code to actually start the game (like, distribute player roles, setup variables, etc.)
    let roomCode = state.roomCode
    rooms[roomCode].gameStarted = true

    // Inform all players about this change (which should switch them to the next state)

  })

  // When someone submits a drawing ...
  // TO DO: This assumes the user is only in a single room. (It automatically picks element 0.)
  // If this changes later, REMEMBER TO CHANGE THIS
  socket.on('submit-drawing', state => {
    let room = Object.keys(socket.rooms).filter(function(item) {
        return item !== socket.id;
    })[0]

    console.log('Received drawing in room ' + room);

    if(state.type == "profile") {
      // save the drawing as profile picture (for this player)
      rooms[room].players[socket.id].profile = state.dataURI

      // update the waiting screen
      io.in(room).emit('update-playerlist', rooms[room].players)
    }
    
  })


  // OLD CODE:



  // When a player connects
  socket.on('new-player', state => {
    console.log('New player joined with state:', state)
    players[socket.id] = state
    // Emit the update-players method in the client side
    io.emit('update-players', players)
  })

  // When a player moves
  socket.on('move-player', data => {
    const { x, y, angle, playerName, speed } = data

    // If the player is invalid, return
    if (players[socket.id] === undefined) {
      return
    }

    // Update the player's data if he moved
    players[socket.id].x = x
    players[socket.id].y = y
    players[socket.id].angle = angle
    players[socket.id].playerName = {
      name: playerName.name,
      x: playerName.x,
      y: playerName.y
    }
    players[socket.id].speed = {
      value: speed.value,
      x: speed.x,
      y: speed.y
    }

    // Send the data back to the client
    io.emit('update-players', players)
  })
})
