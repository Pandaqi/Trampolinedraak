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

    // check if the room exists and is joinable
    let success = false
    if(rooms[code] != undefined && !rooms[code].gameStarted) {
      success = true
    }

    console.log("Room join requested at room " + code + " || Success: " + success.toString())

    // if joining was succesful ...
    //  => add the player
    //  => send an update to all other players
    if(success) {
      socket.join(code)
      let playerObject =  { name: state.userName }
      rooms[code].players[socket.id] = playerObject

      io.in(code).emit('new-player-joined', playerObject)
    }

    socket.emit('join-response', { success: success })
  })

  // When a room WATCH is requested
  socket.on('watch-room', state => {
    let code = state.roomCode.toUpperCase()

    let success = false
    if(rooms[code] != undefined /* && !rooms[code].gameStarted */) {
      success = true
    }

    console.log("Room watch requested at room " + code + " || Success: " + success.toString())

    // if watch request was succesful ...
    //  => add the watcher (just join the room)
    //  => update audience/watcher count ??? (TO DO)
    if(success) {
      socket.join(code)
    }

    socket.emit('watch-response', { success: success })
  })

  // When any client disconnects
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
