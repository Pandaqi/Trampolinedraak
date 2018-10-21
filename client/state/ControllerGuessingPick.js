import { serverInfo } from './sockets/serverInfo'

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

    console.log("Controller Guessing Pick state");
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

export default ControllerGuessingPick
