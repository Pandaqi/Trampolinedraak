import { serverInfo } from './sockets/serverInfo'
import { controllerTimer } from './utils/timers'

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

    if(serverInfo.drawing.id == socket.id) {
      // if the drawing is our own, do nothing
      let p1 = document.createElement("p")
      p1.innerHTML = "This is your drawing. I hope you're happy with yourself.";
      div.appendChild(p1)
    } else {
      // if it's someone else's drawing, guess what it represents!
      let p1 = document.createElement("p")
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
        socket.emit('submit-guess', { guess: inp1.value })

        // Remove submit button (and input text)
        btn1.remove()
        inp1.remove()

        p1.innerHTML = "Wow ... you're so creative!";
      })
      div.appendChild(btn1)

    }

    this.timer = serverInfo.timer

    // save the list of guesses
    socket.on('return-guesses', data => {
      serverInfo.guesses = data

      socket.off('return-guesses')
    })

    console.log("Controller Guessing state");
  }

  shutdown() {
  }

  update () {
    controllerTimer(this, serverInfo, 'GuessingPick')
  }
}

export default ControllerGuessing
