import { serverInfo } from './sockets/serverInfo'

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

    if(serverInfo.vip) {
      let p1 = document.createElement("p")
      p1.innerHTML = "Tap the button below whenever you want to start the next drawing";
      div.appendChild(p1)

      let btn1 = document.createElement("button")
      btn1.innerHTML = "Load next drawing!"

      btn1.addEventListener('click', function(event) {
        // tell the server that we want to continue
        socket.emit('timer-complete', { nextState: 'Guessing', certain: true })
      })
      div.appendChild(btn1)
    }

    // save whose drawing is displayed on screen, so we know if this controller is the owner or not
    socket.on('return-drawing', data => {
      serverInfo.drawing = data
    })

    // when next state is called, clean the GUI, move the canvas somewhere safe, and start the next state
    socket.on('next-state', data => {
      serverInfo.timer = data.timer;
      canvas.style.display = 'none';
      document.body.appendChild(canvas)
      document.getElementById('main-controller').innerHTML = '';
      gm.state.start('ControllerGuessing')
    })

    console.log("Controller Guessing Results state");
  }

  update () {
    // Perform countdown, if we're VIP
  }
}

export default ControllerGuessingResults
