class Controller extends Phaser.State {
  constructor () {
    super()
    // construct stuff here, if needed
  }

  preload () {
    // load stuff here, if needed
  }

  create () {
    // Connects the player to the server
    socket = io(SERVER_IP)
    
    console.log("Controller state");
  }

  update () {
    // This is where we listen for input!
  }
}

export default Controller
