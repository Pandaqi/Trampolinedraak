import { serverInfo } from './sockets/serverInfo'
import { controllerTimer } from './utils/timers'
import loadRejoinRoom from './sockets/rejoinRoomModule'

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

    // Create some text to explain rejoining was succesfull. 
    // If the player was already done for this round, the function returns true, and we stop loading the interface
    if( loadRejoinRoom(socket, serverInfo, div) ) {
      return;
    }

    // THIS IS THE CODE FOR THE "GIVE SUGGESTIONS"-state only
    let p1 = document.createElement("p")
    p1.innerHTML = serverInfo.translate('controller-suggestions-1')
    div.appendChild(p1)

    let inp1 = document.createElement("input")
    inp1.type = "text";
    inp1.placeholder = serverInfo.translate('controller-suggestions-noun')
    div.appendChild(inp1)

    let inp2 = document.createElement("input")
    inp2.type = "text";
    inp2.placeholder = serverInfo.translate('controller-suggestions-verb')
    div.appendChild(inp2)

    let inp3 = document.createElement("input")
    inp3.type = "text";
    inp3.placeholder = serverInfo.translate('controller-suggestions-adjective')
    div.appendChild(inp3)

    let inp4 = document.createElement("input")
    inp4.type = "text";
    inp4.placeholder = serverInfo.translate('controller-suggestions-adverb')
    div.appendChild(inp4)

    let btn1 = document.createElement("button")
    btn1.innerHTML = serverInfo.translate('submit')
    btn1.addEventListener('click', function(event) {
      // always make the suggestions completely lowercase (otherwise you often know the correct answer by punctuation)
      let sug = [inp1.value.toLowerCase().trim(), inp2.value.toLowerCase().trim(), inp3.value.toLowerCase().trim(), inp4.value.toLowerCase().trim()]

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

      p1.innerHTML = serverInfo.translate('controller-suggestions-2')
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
