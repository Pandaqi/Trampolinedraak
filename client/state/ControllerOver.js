import { serverInfo } from './sockets/serverInfo'

class ControllerOver extends Phaser.State {
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

    console.log("Controller Over state");
  }

  update () {
    // update loopieloopie
  }
}

export default ControllerOver
