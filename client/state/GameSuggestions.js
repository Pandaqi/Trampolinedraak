import { serverInfo } from './sockets/serverInfo'
import { gameTimer } from './utils/timers'
import { playerColors } from './utils/colors'
import loadWatchRoom from './sockets/watchRoomModule'
import { mainStyle } from './utils/styles'
import loadGUIOverlay from './utils/loadGUIOverlay'

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

    let text = gm.add.text(gm.width*0.5, 20, serverInfo.translate('game-suggestions-1'), mainStyle.mainText(gm.width*0.8));
    text.anchor.setTo(0.5, 0)

    this.timerText = gm.add.text(gm.width*0.5, gm.height*0.5, "", mainStyle.timerText())
    this.timer = serverInfo.timer

    loadWatchRoom(socket, serverInfo)

    loadGUIOverlay(gm, serverInfo, mainStyle.mainText(), mainStyle.subText())

    console.log("Game Suggestions state")
  }

  shutdown () {

  }

  update () {
    gameTimer(this, serverInfo)
  }
}

export default GameSuggestions
