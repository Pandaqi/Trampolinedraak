import { serverInfo } from './sockets/serverInfo'
import { gameTimer } from './utils/timers'
import { playerColors } from './utils/colors'
import loadWatchRoom from './sockets/watchRoomModule'

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
    let text = gm.add.text(gm.width*0.5, 20, "Look at your screen. Fill in the suggestions and submit!", style);
    text.anchor.setTo(0.5, 0)

    this.timerText = gm.add.text(gm.width*0.5, gm.height*0.5, "", style)
    this.timer = serverInfo.timer

    loadWatchRoom(socket, serverInfo)

    console.log("Game Suggestions state")
  }

  shutdown () {

  }

  update () {
    gameTimer(this)
  }
}

export default GameSuggestions
