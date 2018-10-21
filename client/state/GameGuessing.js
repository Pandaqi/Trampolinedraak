import { serverInfo } from './sockets/serverInfo'

/**
 * GAME GUESSING
 * 
 * In this state, one drawing from a player is shown on the screen, and people may guess (on their Controller device) what it represents
 * A timer runs down - guesses must be submitted before the timer runs out. (Otherwise, the server fetches the thing you've currently input??)
 * Whenever a user submitted their guess, make that visible on the screen (for all other players to know)
 */

class GameGuessing extends Phaser.State {
  constructor () {
    super()
  }

  preload () {
    // Loads files
  }

  create () {
    let gm = this.game
    let socket = serverInfo.socket

    let style = { font: "bold 32px Arial", fill: "#333"};
    let newItem = gm.add.text(gm.width*0.5, 20, "What do you think this drawing represents?", style);
    newItem.anchor.setTo(0.5, 0)

    // TO DO: Load the drawing given to us (from the previous state; should be in serverInfo.currentDrawing or something)

    this.timerText = gm.add.text(gm.width*0.5, gm.height*0.5, "", style)
    this.timer = serverInfo.timer

    console.log("Game Guessing state")
  }

  update () {
    if(this.timer > 0) {
      this.timer -= this.game.time.elapsed/1000;
      this.timerText.text = Math.ceil(this.timer);
    } else {
      this.timerText.text = "Time's up!";
    }
  }
}

export default GameGuessing
