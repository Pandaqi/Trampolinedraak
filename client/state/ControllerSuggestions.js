import { serverInfo } from './sockets/serverInfo'

class ControllerSuggestions extends Phaser.State {
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
    p1.innerHTML = "Please give me a noun, verb, adjective and adverb (in that order)"
    div.appendChild(p1)

    let inp1 = document.createElement("input")
    inp1.type = "text";
    inp1.placeholder = "noun (e.g. elephant)"
    div.appendChild(inp1)

    let inp2 = document.createElement("input")
    inp2.type = "text";
    inp2.placeholder = "verb with -ing (e.g. swimming)"
    div.appendChild(inp2)

    let inp3 = document.createElement("input")
    inp3.type = "text";
    inp3.placeholder = "adjective (e.g. beautiful)"
    div.appendChild(inp3)

    let inp4 = document.createElement("input")
    inp4.type = "text";
    inp4.placeholder = "adverb (e.g. carefully)"
    div.appendChild(inp4)

    let btn1 = document.createElement("button")
    btn1.innerHTML = 'Submit'
    btn1.addEventListener('click', function(event) {
      let sug = [inp1.value, inp2.value, inp3.value, inp4.value]

      // empty suggestions are not welcome!
      for(let i = 0; i < sug.length; i++) {
        if(sug[i] == "" || sug[i].length < 1) {
          return;
        }
      }

      // send the suggestion to the server 
      socket.emit('submit-suggestion', { suggestion: sug })

      inp1.remove();
      inp2.remove();
      inp3.remove();
      inp4.remove();
      btn1.remove();

      p1.innerHTML = 'Thanks for your suggestions!';
    })
    div.appendChild(btn1)

    // how much time we have for the current phase
    // TO DO: Distribute this value from the server, to make sure it's all synced!
    this.timer = 15

    socket.on('drawing-title', data => {
      serverInfo.drawingTitle = data.title
    })

    socket.on('next-state', data => {
      div.innerHTML = ''
      gm.state.start('Controller' + data.nextState)
    })

    console.log("Controller Suggestions state")
  }

  update () {
    // Perform countdown, if we're VIP
    if(serverInfo.vip) {
      if(this.timer > 0) {
        this.timer -= this.game.time.elapsed/1000;
      } else {
        // TIMER IS DONE!
        // Send message to the server that the next phase should start
        let socket = serverInfo.socket
        socket.emit('timer-complete', { nextState: 'Drawing' })
      }
    }

  }
}

export default ControllerSuggestions
