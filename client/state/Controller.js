import { serverInfo } from './sockets/serverInfo'

class Controller extends Phaser.State {
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

    // THIS IS THE CODE FOR THE "GIVE SUGGESTIONS"-state only
    let p1 = document.createElement("p")
    p1.innerHTML = "Fill in a random word (swimming, elephant, whatever) and click submit."
    div.appendChild(p1)

    let inp1 = document.createElement("input")
    inp1.type = "text";
    inp1.placeholder = "suggestion here ..."
    div.appendChild(inp1)

    let btn1 = document.createElement("button")
    btn1.innerHTML = 'Submit'
    btn1.addEventListener('click', function(event) {
      let sug = inp1.value

      // empty suggestions are not welcome!
      if(sug == "" || sug.length < 1) {
        return;
      }

      // send the drawing to the server (including the information that it's a profile pic)
      socket.emit('submit-suggestion', { suggestion: sug })
    })
    div.appendChild(btn1)

    // how much time we have for the current phase
    // TO DO: Distribute this value from the server, to make sure it's all synced!
    this.timer = 15

    console.log("Controller state")
  }

  update () {
    // Perform countdown, if we're VIP
    if(serverInfo.vip) {
      if(this.timer > 0) {
        this.timer -= this.game.time.elapsed/1000;
      } else {
        // TIMER IS DONE!
        // Send message to the server that the next phase should start
        // TO DO: Currently, the server has to figure out what the next phase is. We could help it by sending that info (or not ...)
        socket.emit('timer-complete', {})
      }
    }

  }
}

export default Controller
