import { serverInfo } from './sockets/serverInfo'
import { controllerTimer } from './utils/timers'
import loadRejoinRoom from './sockets/rejoinRoomModule'

class ControllerGuessing extends Phaser.State {
  constructor () {
    super()
    // construct stuff here, if needed
  }

  preload () {
    // load stuff here, if needed
  }

  create () {    
    let gm = this.game
    let socket = serverInfo.socket

    let div = document.getElementById("main-controller")
    let canvas = document.getElementById("canvas-container")

    // Create some text to explain rejoining was succesfull. 
    // If the player was already done for this round, the function returns true, and we stop loading the interface
    if( loadRejoinRoom(socket, serverInfo, div) ) {
      return;
    }
    
    let p1 = null

    if(serverInfo.drawing.id == socket.id) {
      // if the drawing is our own, do nothing
      p1 = document.createElement("p")
      p1.innerHTML = serverInfo.translate('controller-guessing-1') 
      div.appendChild(p1)
    } else {
      // if it's someone else's drawing, guess what it represents!
      p1 = document.createElement("p")
      p1.innerHTML = serverInfo.translate('controller-guessing-2') 
      div.appendChild(p1)

      let inp1 = document.createElement("input")
      inp1.type = "text";
      inp1.placeholder = serverInfo.translate('guess-placeholder') 
      div.appendChild(inp1)

      // display button to submit guess
      let btn1 = document.createElement("button")
      btn1.innerHTML = serverInfo.translate('submit-guess')
      btn1.addEventListener('click', function(event) {
        // send the guess to the server
        socket.emit('submit-guess', inp1.value.toLowerCase().trim() )

        // Remove submit button (and input text)
        btn1.remove()
        inp1.remove()

        p1.innerHTML = serverInfo.translate('controller-guessing-3')
      })
      div.appendChild(btn1)

    }

    // if the guess already exists, we must reguess
    // right now, I just copied the code from above and changed the message bit. 
    // it's not good programming, but hey, the game is almost done now.
    socket.on('guess-already-exists', data => {
      p1.innerHTML = '<span id="err-message">' + serverInfo.translate('guess-already-exists') + '</span>'

      let inp1 = document.createElement("input")
      inp1.type = "text";
      inp1.placeholder = serverInfo.translate('guess-placeholder')
      div.appendChild(inp1)

      // display button to submit guess
      let btn1 = document.createElement("button")
      btn1.innerHTML = serverInfo.translate('submit-guess')
      btn1.addEventListener('click', function(event) {
        // send the guess to the server
        socket.emit('submit-guess', inp1.value.toLowerCase().trim() )

        // Remove submit button (and input text)
        btn1.remove()
        inp1.remove()

        p1.innerHTML = serverInfo.translate('controller-guessing-3')
      })
      div.appendChild(btn1)
    })

    this.timer = serverInfo.timer

    console.log("Controller Guessing state");
  }

  shutdown() {
    serverInfo.socket.off('guess-already-exists')
  }

  update () {
    controllerTimer(this, serverInfo, 'GuessingPick')
  }
}

export default ControllerGuessing
