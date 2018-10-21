import { serverInfo } from './sockets/serverInfo'

/**
 * GAME OVER
 * 
 * In this state, the final results are shown and the winner is revealed!
 * On top of that, there are buttons to play a next round, or stop/leave the game
 * 
 */

class GameOver extends Phaser.State {
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
    let newItem = gm.add.text(gm.width*0.5, 20, "FINAL RESULTS", style);
    newItem.anchor.setTo(0.5, 0)

    console.log("Game Over state")
  }

  update () {
  }
}

export default GameOver
