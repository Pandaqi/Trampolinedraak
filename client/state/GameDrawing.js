import { serverInfo } from './sockets/serverInfo'
import dynamicLoadImage from './drawing/dynamicLoadImage'
import { gameTimer } from './utils/timers'
import { playerColors } from './utils/colors'
import loadWatchRoom from './sockets/watchRoomModule'
import { mainStyle } from './utils/styles'
import loadGUIOverlay from './utils/loadGUIOverlay'

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

    let text = gm.add.text(gm.width*0.5, 20, serverInfo.translate('game-drawing-1'), mainStyle.mainText(gm.width*0.8));
    text.anchor.setTo(0.5, 0)

    this.timerText = gm.add.text(gm.width*0.5, gm.height*0.5, "", mainStyle.timerText())
    this.timer = serverInfo.timer

    loadWatchRoom(socket, serverInfo)

    loadGUIOverlay(gm, serverInfo, mainStyle.mainText(), mainStyle.subText())

    console.log("Game Drawing state")
  }

  shutdown() {

  }

  update () {
    gameTimer(this, serverInfo)
  }
}

export default GameDrawing
