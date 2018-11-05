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
      p1.innerHTML = "This is your drawing. I hope you're happy with yourself.";
      div.appendChild(p1)
    } else {
      // if it's someone else's drawing, guess what it represents!
      p1 = document.createElement("p")
      p1.innerHTML = 'What do you think this drawing means?'
      div.appendChild(p1)

      let inp1 = document.createElement("input")
      inp1.type = "text";
      inp1.placeholder = "your guess ..."
      div.appendChild(inp1)

      // display button to submit guess
      let btn1 = document.createElement("button")
      btn1.innerHTML = 'Submit guess'
      btn1.addEventListener('click', function(event) {
        // send the guess to the server
        socket.emit('submit-guess', inp1.value)

        // Remove submit button (and input text)
        btn1.remove()
        inp1.remove()

        p1.innerHTML = "Wow ... you're so creative!";
      })
      div.appendChild(btn1)

    }

    // if the guess already exists, we must reguess
    // right now, I just copied the code from above and changed the message bit. 
    // it's not good programming, but hey, the game is almost done now.
    socket.on('guess-already-exists', data => {
      p1.innerHTML = '<span id="err-message">Oh no! Your guess already exists (or you guessed the correct title immediately)! Try something else.</span>'

      let inp1 = document.createElement("input")
      inp1.type = "text";
      inp1.placeholder = "your guess ..."
      div.appendChild(inp1)

      // display button to submit guess
      let btn1 = document.createElement("button")
      btn1.innerHTML = 'Submit guess'
      btn1.addEventListener('click', function(event) {
        // send the guess to the server
        socket.emit('submit-guess', inp1.value)

        // Remove submit button (and input text)
        btn1.remove()
        inp1.remove()

        p1.innerHTML = "Wow ... you're so creative!";
      })
      div.appendChild(btn1)
    })

    this.timer = serverInfo.timer

    // save the list of guesses
    socket.on('return-guesses', data => {
      serverInfo.guesses = data
    })

    console.log("Controller Guessing state");
  }

  shutdown() {
    serverInfo.socket.off('guess-already-exists')
    serverInfo.socket.off('return-guesses')
  }

  update () {
    controllerTimer(this, serverInfo, 'GuessingPick')
  }
}

export default ControllerGuessing
