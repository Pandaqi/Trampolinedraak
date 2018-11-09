import { serverInfo } from './sockets/serverInfo'
import { controllerTimer } from './utils/timers'
import loadRejoinRoom from './sockets/rejoinRoomModule'

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

    // Create some text to explain rejoining was succesfull. 
    // If the player was already done for this round, the function returns true, and we stop loading the interface
    if( loadRejoinRoom(socket, serverInfo, div) ) {
      return;
    }

    let guesses = serverInfo.guesses

    if(serverInfo.drawing.id == socket.id) {
      let p1 = document.createElement("p")
      p1.innerHTML = serverInfo.translate('controller-guessing-pick-1')
      div.appendChild(p1)
    } else {
      let buttonArr = []

      let p1 = document.createElement("p")
      p1.innerHTML = serverInfo.translate('controller-guessing-pick-2') 
      div.appendChild(p1)

      // hold all the buttons in a container; much cleaner
      let container = document.createElement("span")
      div.appendChild(container)

      for(let i = 0; i < guesses.length; i++) {
        // display button for each guess
        let btn1 = document.createElement("button")
        let theGuess = guesses[i]
        btn1.innerHTML = theGuess
        btn1.value = theGuess

        btn1.addEventListener('click', function(event) {
          // send the guess to the server
          socket.emit('vote-guess', theGuess)

          // Inform user that it was succesful
          p1.innerHTML = serverInfo.translate('controller-guessing-pick-3') 

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
