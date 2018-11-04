import { serverInfo } from './sockets/serverInfo'
import loadMainSockets from './sockets/mainSocketsGame'

class Menu extends Phaser.State {
  constructor () {
    super()
    // construct stuff here, if needed
  }

  preload () {
    // load stuff here
    //game.load.baseURL = 'https://trampolinedraak.herokuapp.com/';
    this.game.load.crossOrigin = 'Anonymous'
    this.game.stage.backgroundColor = "#EEEEEE";

    // We set this to true so our game won't pause if we focus
    // something else other than the browser
    this.game.stage.disableVisibilityChange = true
  }

  create () {
    // do nothing, because we're waiting on players to make a choice
    console.log("Menu state");

    let gm = this.game;

    //gm.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    //gm.scale.parentIsWindow = true;

    //import SimpleGame from './index'
    //not necessary anymore because I placed the functions here; we can just use this.game

    // function for creating a room (from start GUI overlay)
    document.getElementById('createRoomBtn').onclick = function () {
      // disable the button
      this.disabled = true;

      // Connects the player to the server
      serverInfo.socket = io(serverInfo.SERVER_IP)
      let socket = serverInfo.socket

      // Creates game room on server
      socket.on('connect', () => {
        document.getElementById("err-message").innerHTML = 'Creating room ...'
        socket.emit('new-room', {})
      })

      // Once the room has been succesfully created
      // save the room code, load the next screen
      socket.on('room-created', data => {
        serverInfo.roomCode = data.roomCode

        // remove the overlay
        document.getElementById("main").style.display = 'none';

        // Starts the "game" state
        gm.state.start('GameWaiting');
      })

      
    }

    // function for joining a room (from start GUI overlay)
    document.getElementById('joinRoomBtn').onclick = function() {
      // disable the button
      let btn = this;
      btn.disabled = true;

      // fetches the inputs (which will be handed to the server on first connection)
      // to join the correct room
      let inputs = document.getElementsByClassName("joinInput");
      let roomCode = inputs[0].value.toUpperCase();
      let userName = inputs[1].value.toUpperCase();
      console.log(roomCode + " || " + userName);

      // Connects the player to the server
      serverInfo.socket = io(serverInfo.SERVER_IP)
      let socket = serverInfo.socket

      socket.on('connect', () => {
        document.getElementById("err-message").innerHTML = 'Joining ...'

        socket.emit('join-room', { 
          roomCode: roomCode, 
          userName: userName 
        })
      })

      // if joining was successful, go to the correct state
      // if not succesful, give the player another try
      socket.on('join-response', data => {
        if(data.success) {
          // remove overlay
          document.getElementById("main").style.display = 'none';

          serverInfo.vip = data.vip;
          serverInfo.roomCode = roomCode;
          serverInfo.rank = data.rank;

          // Starts the "controller" state
          gm.state.start('ControllerWaiting');
        } else {
          document.getElementById("err-message").innerHTML = data.err
          btn.disabled = false;
          socket.disconnect(true);
        }
      })
    }


    // Watching a room simply means showing the game state
    // An audience can watch on a separate screen, or you can use this to reconnect if you lost internet connection
    document.getElementById('watchRoomBtn').onclick = function() {
      // disable the button
      let btn = this;
      if(btn.disabled) { return; }
      btn.disabled = true;

      // fetches the inputs (which will be handed to the server on first connection)
      // to join the correct room
      let roomCode = document.getElementsByClassName("joinInput")[2].value.toUpperCase();

      // Connects the player to the server
      serverInfo.socket = io(serverInfo.SERVER_IP)
      let socket = serverInfo.socket

      socket.on('connect', () => {
        document.getElementById("err-message").innerHTML = 'Loading room ...'

        socket.emit('watch-room', { 
          roomCode: roomCode, 
        })
      })

      // if joining was successful, go to the correct state
      // if not succesful, give the player another try (disconnect from socket for cleanliness, and saving bandwidth)
      socket.on('watch-response', data => {
        if(data.success) {
          // remove overlay
          document.getElementById("main").style.display = 'none'

          // load the main sockets
          loadMainSockets(socket, gm, serverInfo)

          // set the timer
          serverInfo.timer = data.timer

          // load the info (set the given variable on the serverInfo object)
          // TO DO: This means all those custom functions later on ('return-guesses', 'final-scores', etc.) can also be greatly simplified ...
          let preSignal = data.preSignal
          serverInfo[preSignal[0]] = preSignal[1]

          serverInfo.gameLoading = true

          // go to the correct state
          gm.state.start('Game' + data.gameState);
        } else {
          document.getElementById("err-message").innerHTML = data.err

          btn.disabled = false;
          socket.disconnect(true);
        }
      })
    }
  }

  update () {
    // This is where we listen for input!
  }
}

export default Menu
