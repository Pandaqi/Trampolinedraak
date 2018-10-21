import { serverInfo } from './sockets/serverInfo'

/**
 * GAME SUGGESTIONS
 * 
 * In this state, everyone may submit as many suggestion words as they can
 * A timer runs down; once it's done, the phase is over.
 * The suggestions are collected on the server, rearranged and combined, and then one of them is sent to each player
 */

class GameSuggestions extends Phaser.State {
  constructor () {
    super()
  }

  preload () {
    // Loads files
  }

  create () {
    let gm = this.game
    let socket = serverInfo.socket

    let style = { font: "bold 32px Arial", fill: "#333", wordWrap:true, wordWrapWidth: gm.width*0.8 };
    let text = gm.add.text(gm.width*0.5, 20, "Please submit as many suggestions as you can!", style);
    text.anchor.setTo(0.5, 0)

    this.timerText = gm.add.text(gm.width*0.5, gm.height*0.5, "", style)
    this.timer = serverInfo.timer

    console.log("Game Suggestions state")

    socket.on('next-state', data => {
      serverInfo.timer = data.timer
    	gm.state.start('GameDrawing')
    })
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

export default GameSuggestions
