import { serverInfo } from './sockets/serverInfo'
import { controllerTimer } from './utils/timers'

class ControllerGuessingPick extends Phaser.State {
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
    let guesses = serverInfo.guesses

    if(serverInfo.drawing.id == socket.id) {
      let p1 = document.createElement("p")
      p1.innerHTML = "Still your drawing. Sit back and relax.";
      div.appendChild(p1)
    } else {
      let buttonArr = []

      let p1 = document.createElement("p")
      p1.innerHTML = "Which of these do you think is the correct title?";
      div.appendChild(p1)

      // hold all the buttons in a container; much cleaner
      let container = document.createElement("span")
      div.appendChild(container)

      for(let i = 0; i < guesses.length; i++) {
        // display button for each guess
        let btn1 = document.createElement("button")
        btn1.innerHTML = guesses[i]
        btn1.value = guesses[i]

        btn1.addEventListener('click', function(event) {
          // send the guess to the server
          socket.emit('vote-guess', { guess: this.value })

          // Inform user that it was succesful
          p1.innerHTML = "Really? You think it's that?!"

          // Remove all buttons
          container.remove();
        })
        container.appendChild(btn1)
      }
    }

    this.timer = serverInfo.timer;

    console.log("Controller Guessing Pick state");
  }

  update () {
    controllerTimer(this, serverInfo, 'GuessingResults')
  }
}

export default ControllerGuessingPick
