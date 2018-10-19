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
    var style = { font: "bold 16px Arial", fill: "#fff"};
    var text = gm.add.text(gm.width*0.5, 20, "You've joined the game!", style);

    console.log("Controller state");
  }

  update () {
    // This is where we listen for input!
  }
}

export default Controller
