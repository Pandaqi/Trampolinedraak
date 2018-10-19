import { serverInfo } from './sockets/serverInfo'

class Menu extends Phaser.State {
  constructor () {
    super()
    // construct stuff here, if needed
  }

  preload () {
    // load stuff here, if needed
  }

  create () {
    // do nothing, because we're waiting on players to make a choice
    console.log("Menu state");

    let gm = this.game;

    // Scale game to fit the entire window
    gm.scale.scaleMode = Phaser.ScaleManager.RESIZE
    gm.scale.setShowAll();
    window.addEventListener('resize', function () {  
      gm.scale.refresh();
    });
    gm.scale.refresh();

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
        socket.emit('new-room', {})
      })

      // Once the room has been succesfully created
      // save the room code, load the next screen
      socket.on('room-created', data => {
        serverInfo.roomCode = data.roomCode

        // remove the overlay
        document.getElementById("overlay").remove();

        // Starts the "game" state
        gm.state.start('Game');
      })

      
    }

    // function for joining a room (from start GUI overlay)
    document.getElementById('joinRoomBtn').onclick = function() {
      let btn = this;
      // disable the button
      btn.disabled = true;

      // fetches the inputs (which will be handed to the server on first connection)
      // to join the correct room
      let inputs = document.getElementsByClassName("joinInput");
      let roomCode = inputs[0].value;
      let userName = inputs[1].value;
      console.log(roomCode + " || " + userName);

      // Connects the player to the server
      serverInfo.socket = io(serverInfo.SERVER_IP)
      let socket = serverInfo.socket

      socket.on('connect', () => {
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
          document.getElementById("overlay").remove();

          // Starts the "controller" state
          gm.state.start('Controller');
        } else {
          btn.disabled = false;
          socket.disconnect(true);
        }
      })

      
    }


    // Watching a room simply means showing the game state
    // An audience can watch on a separate screen, or you can use this to reconnect if you lost internet connection
    document.getElementById('watchRoomBtn').onclick = function() {
      let btn = this;
      // disable the button
      btn.disabled = true;

      // fetches the inputs (which will be handed to the server on first connection)
      // to join the correct room
      let roomCode = document.getElementsByClassName("joinInput")[2].value;

      // Connects the player to the server
      serverInfo.socket = io(serverInfo.SERVER_IP)
      let socket = serverInfo.socket

      socket.on('connect', () => {
        socket.emit('watch-room', { 
          roomCode: roomCode, 
        })
      })

      // if joining was successful, go to the correct state
      // if not succesful, give the player another try
      socket.on('watch-response', data => {
        if(data.success) {
          // remove overlay
          document.getElementById("overlay").remove();

          // Starts the "controller" state
          gm.state.start('Game');
        } else {
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
