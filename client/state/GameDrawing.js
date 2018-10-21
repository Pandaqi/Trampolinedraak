import { serverInfo } from './sockets/serverInfo'

/**
 * GAME DRAWING
 * 
 * In this state, all players get a suggestion (on their Controller device) which they must draw
 * A timer runs down; once finished, the phase ends. (The phase also ends immediately when all drawings have been submitted)
 * Whenever a user submitted their drawing, that is made known on this screen.
 */

class GameDrawing extends Phaser.State {
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
    let newItem = gm.add.text(gm.width*0.5, 20, "Draw the suggestion shown on your screen!", style);

    this.timerText = gm.add.text(gm.width*0.5, gm.height*0.5, "", style)

    this.timer = 15;

    console.log("Game Drawing state")
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

export default GameDrawing
