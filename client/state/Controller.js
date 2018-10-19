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
    
    console.log("Controller state")
  }

  update () {
    // This is where we listen for input!
  }
}

export default Controller
