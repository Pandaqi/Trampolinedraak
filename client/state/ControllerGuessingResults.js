import { serverInfo } from './sockets/serverInfo'
import loadRejoinRoom from './sockets/rejoinRoomModule'

class ControllerGuessingResults extends Phaser.State {
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

    // the vip can continue to the next cycle (or game over) whenever he or she pleases
    // this allows for skipping "boring" animations or reveal phases
    // but also for pausing the game (by NOT pressing it) if someone needs food/a bathroom break/fresh air
    if(serverInfo.vip) {
      // if it's the last drawing, go to game over screen
      if(serverInfo.drawing.lastDrawing) {
        let p1 = document.createElement("p")
        p1.innerHTML = serverInfo.translate("controller-guessing-results-1")
        div.appendChild(p1)

        let btn1 = document.createElement("button")
        btn1.innerHTML = serverInfo.translate('go-game-over') 

        btn1.addEventListener('click', function(event) {
          // tell the server that we want to continue
          socket.emit('timer-complete', { nextState: 'Over', certain: true })

          // destroy the interface
          btn1.remove()
          p1.innerHTML = serverInfo.translate('loading-next-screen')
        })
        div.appendChild(btn1)
      } else {
        let p1 = document.createElement("p")
        p1.innerHTML = serverInfo.translate("controller-guessing-results-2")
        div.appendChild(p1)

        let btn1 = document.createElement("button")
        btn1.innerHTML = serverInfo.translate("load-next-drawing")

        btn1.addEventListener('click', function(event) {
          // tell the server that we want to continue
          socket.emit('timer-complete', { nextState: 'Guessing', certain: true })

          // destroy interface
          btn1.remove()
          p1.innerHTML = serverInfo.translate('loading-next-screen')
        })
        div.appendChild(btn1)
      }
    } else {
      let p1 = document.createElement("p")
      p1.innerHTML = serverInfo.translate("controller-guessing-results-3")
      div.appendChild(p1)
    } 

    console.log("Controller Guessing Results state");
  }

  update () {
  }
}

export default ControllerGuessingResults
