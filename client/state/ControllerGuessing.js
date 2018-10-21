import { serverInfo } from './sockets/serverInfo'

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

    socket.on('next-state', data => {
      document.getElementById('main-controller').innerHTML = '';
      gm.state.start('ControllerGuessingPick')
    })

    console.log("Controller Guessing state");
  }

  update () {
    // Perform countdown, if we're VIP
    if(serverInfo.vip) {
      if(this.timer > 0) {
        this.timer -= this.game.time.elapsed/1000;
      } else {
        // TIMER IS DONE!
        // Send message to the server that the next phase should start
        // TO DO: Create the other Controller states, uncomment emit below
        let socket = serverInfo.socket
        //socket.emit('timer-complete', { nextState: 'Guessing' })
      }
    }
  }
}

export default ControllerGuessing
