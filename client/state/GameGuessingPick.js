import { serverInfo } from './sockets/serverInfo'
import dynamicLoadImage from './drawing/dynamicLoadImage'
import { gameTimer } from './utils/timers'
import { playerColors } from './utils/colors'
import loadWatchRoom from './sockets/watchRoomModule'
import { mainStyle } from './utils/styles'
import loadGUIOverlay from './utils/loadGUIOverlay'

/**
 * GAME GUESSING PICK
 * 
 * In this state, one drawing from a player is shown on the screen, INCLUDING all suggestions made by people (and of course the correct answer)
 * People now vote (on their Controller device) which answer they think is true
 * A timer runs down; when done, the phase ends. (The phase also ends immediately once all votes are in.)
 */

class GameGuessingPick extends Phaser.State {
  constructor () {
    super()
  }

  preload () {
    // Loads files
  }

  create () {
    let gm = this.game
    let socket = serverInfo.socket

    let text = gm.add.text(gm.width*0.5, 20, serverInfo.translate('game-guessing-pick-1'), mainStyle.mainText(gm.width*0.8));
    text.anchor.setTo(0.5, 0)

    // Load the drawing given to us (from the previous state; should be in serverInfo.drawing)
    // determine the max width we can use, depending on window size
    let maxXHeight = gm.height*0.5/1.3;
    let maxXWidth = gm.width*0.5;
    let finalImageWidth = Math.min(maxXHeight, maxXWidth)

    let imageName = 'finalImage' + serverInfo.drawing.name
    let dataURI = serverInfo.drawing.dataURI

    dynamicLoadImage(gm, {x: gm.width*0.5, y:gm.height*0.5}, { width: finalImageWidth, height: finalImageWidth*1.3}, imageName, dataURI)

    // Display guesses around the image (just use a circle)
    let guesses = serverInfo.guesses
    let guessDisplayRadius = finalImageWidth*0.66
    for(let i = 0; i < guesses.length; i++) {
      let angle = (i + 0.75) / guesses.length * 2 * Math.PI
      let guessText = gm.add.text(gm.width*0.5 + Math.cos(angle)*guessDisplayRadius, gm.height*0.5 + Math.sin(angle)*guessDisplayRadius*1.3, guesses[i], mainStyle.mainText(250));
      guessText.anchor.setTo(0.5, 0.5)
    }

    // set timer, load timer text
    this.timerText = gm.add.text(gm.width*0.5, 60, "", mainStyle.timerText())
    this.timer = serverInfo.timer

    loadWatchRoom(socket, serverInfo)

    loadGUIOverlay(gm, serverInfo, mainStyle.mainText(), mainStyle.subText())
    
    console.log("Game Guessing Pick state")
  }

  shutdown() {
  }

  update () {
    gameTimer(this, serverInfo)
  }
}

export default GameGuessingPick
