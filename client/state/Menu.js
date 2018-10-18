class Menu extends Phaser.State {
  constructor () {
    super()
    // construct stuff here, if needed
  }

  preload () {
    // load stuff here, if needed
  }

  create () {
    // do nothing, because we're waiting on players to make a choice
    console.log("Menu state");

    let gm = this.game;

    // Scale game to fit the entire window
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

    //import SimpleGame from './index'
    // TO DO: Find a neater way to write these functions. (Now they're global, which they don't need to be.)

    // function for creating a room (from start GUI overlay)
    document.getElementById('createRoomBtn').onclick = function () {
      document.getElementById("overlay").remove();

      // Starts the "game" state
      gm.state.start('Game');
    }

    // function for joining a room (from start GUI overlay)
    document.getElementById('joinRoomBtn').onclick = function() {
      // fetches the inputs (which will be handed to the server on first connection)
      // to join the correct room
      let inputs = document.getElementsByClassName("joinInput");
      let roomCode = inputs[0].value;
      let userName = inputs[1].value;
      console.log(roomCode + " || " + userName);

      document.getElementById("overlay").remove();

      // Starts the "controller" state
      gm.state.start('Controller');
    }
  }

  update () {
    // This is where we listen for input!
  }
}

export default Menu
