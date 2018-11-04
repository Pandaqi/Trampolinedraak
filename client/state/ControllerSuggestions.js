import { serverInfo } from './sockets/serverInfo'
import { controllerTimer } from './utils/timers'

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
    let canvas = document.getElementById("canvas-container")

    // THIS IS THE CODE FOR THE "GIVE SUGGESTIONS"-state only
    let p1 = document.createElement("p")
    p1.innerHTML = "Please give me a noun, verb, adjective and adverbial clause (in that order)"
    div.appendChild(p1)

    let inp1 = document.createElement("input")
    inp1.type = "text";
    inp1.placeholder = "noun (e.g. elephant, tables, etc.)"
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
    inp4.placeholder = "adverb (e.g. carefully, to the beach, while sleeping, etc.)"
    div.appendChild(inp4)

    let btn1 = document.createElement("button")
    btn1.innerHTML = 'Submit'
    btn1.addEventListener('click', function(event) {
      let sug = [inp1.value.toLowerCase(), inp2.value.toLowerCase(), inp3.value.toLowerCase(), inp4.value.toLowerCase()]

      // empty suggestions are not welcome!
      for(let i = 0; i < sug.length; i++) {
        if(sug[i] == "" || sug[i].length < 1) {
          return;
        }
      }

      // send the suggestion to the server 
      // always make the suggestions completely lowercase (otherwise you often know the correct answer by punctuation)
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
    this.timer = serverInfo.timer

    socket.on('drawing-title', data => {
      serverInfo.drawingTitle = data.title
    })

    console.log("Controller Suggestions state")
  }

  shutdown () {
    let socket = serverInfo.socket

    socket.off('drawing-title')
  }

  update () {
    controllerTimer(this, serverInfo, 'Drawing')
  }
}

export default ControllerSuggestions
