import { serverInfo } from './sockets/serverInfo'
import dynamicLoadImage from  './drawing/dynamicLoadImage'
import { gameTimer } from './utils/timers'
import { playerColors } from './utils/colors'
import loadWatchRoom from './sockets/watchRoomModule'
import { mainStyle } from './utils/styles'
import loadGUIOverlay from './utils/loadGUIOverlay'

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

    let newItem = gm.add.text(gm.width*0.5, 20, serverInfo.translate('game-guessing-1'), mainStyle.mainText(gm.width*0.8));
    newItem.anchor.setTo(0.5, 0)

    // Load the drawing given to us (from the previous state; should be in serverInfo.drawing)
    // determine the max width we can use, depending on window size
    let maxXHeight = gm.height*0.5/1.3;
    let maxXWidth = gm.width*0.5;
    let finalImageWidth = Math.min(maxXHeight, maxXWidth)

    let imageName = 'finalImage' + serverInfo.drawing.name
    let dataURI = serverInfo.drawing.dataURI

    dynamicLoadImage(gm, {x: gm.width*0.5, y:gm.height*0.5}, { width: finalImageWidth, height: finalImageWidth*1.3}, imageName, dataURI)

    this.timerText = gm.add.text(gm.width*0.5, 60, "", mainStyle.timerText())
    this.timer = serverInfo.timer

    loadWatchRoom(socket, serverInfo)

    loadGUIOverlay(gm, serverInfo, mainStyle.mainText(), mainStyle.subText())
    
    console.log("Game Guessing state")
  }

  shutdown () {
  }

  update () {
    gameTimer(this, serverInfo)
  }
}

export default GameGuessing
