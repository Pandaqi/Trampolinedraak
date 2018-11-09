import { serverInfo } from './sockets/serverInfo'
import dynamicLoadImage from './drawing/dynamicLoadImage'
import { playerColors } from './utils/colors'
import loadWatchRoom from './sockets/watchRoomModule'
import { mainStyle } from './utils/styles'
import loadGUIOverlay from './utils/loadGUIOverlay'

/**
 * GAME GUESSING RESULTS
 * 
 * In this state, the GAME GUESSING and GAME GUESSING PICK states have already been played.
 * A picture is shown, including all suggestions, and now it is made known (one by one) who voted on what, and what is the correct title!
 * There's no timer here - the phase ends once the results have been displayed (and the VIP chooses to continue)
 *
 */

class GameGuessingResults extends Phaser.State {
  constructor () {
    super()
  }

  preload () {
    // Loads files
  }

  create () {
    let gm = this.game
    let socket = serverInfo.socket

    let newItem = gm.add.text(gm.width*0.5, 20, serverInfo.translate("game-guessing-results-1"), mainStyle.mainText(gm.width*0.8));
    newItem.anchor.setTo(0.5, 0)

    // Load the drawing given to us (from the previous state; should be in serverInfo.drawing)
    // determine the max width we can use, depending on window size
    let maxXHeight = gm.height*0.5/1.3;
    let maxXWidth = gm.width*0.5;
    let finalImageWidth = Math.min(maxXHeight, maxXWidth)

    let imageName = 'finalImage' + serverInfo.drawing.name
    let dataURI = serverInfo.drawing.dataURI

    dynamicLoadImage(gm, {x: gm.width*0.5, y:gm.height*0.5}, { width: finalImageWidth, height: finalImageWidth*1.3}, imageName, dataURI)

    // List all titles, including who guessed the title (+ score bonus), and who wrote it (+score bonus)
    // Mark the correct title specifically
    // TO DO: Score bonusses ??
    let fg = serverInfo.finalGuessResults
    console.log(fg)

    let counter = 0
    let totalLength = Object.keys(fg).length
    for(let key in fg) {
      let angle = ( (counter + 0.25) / totalLength) * 2 * Math.PI
      let maxXHeight = gm.height*0.5/1.3;
      let maxXWidth = gm.width*0.5;
      let finalImageWidth = Math.min(maxXHeight, maxXWidth) * 0.66

      let xPos = gm.width*0.5 + Math.cos(angle)*finalImageWidth
      let yPos = gm.height*0.5 + Math.sin(angle)*finalImageWidth*1.3

      let fillColor = '#333'
      let writtenByText = 'Written by: ' + fg[key].name
      // highlight the correct title
      if(fg[key].correct) { 
        fillColor = '#237a23'
        writtenByText = 'The correct answer!'
      }

      let text = gm.add.text(xPos, yPos, key, mainStyle.mainText(250, fillColor))
      text.anchor.setTo(0.5, 1.0)

      let text3 = gm.add.text(xPos, yPos + 32, writtenByText, mainStyle.subText(250))
      text3.anchor.setTo(0.5, 0.5)

      if(fg[key].whoGuessedIt.length > 0) {
        let text2 = gm.add.text(xPos, yPos + 50, 'Guessed by: ' + fg[key].whoGuessedIt.join(", "), mainStyle.subText(250))
        text2.anchor.setTo(0.5, 0.5)
      }

      counter++;
    }

    loadWatchRoom(socket, serverInfo)

    loadGUIOverlay(gm, serverInfo, mainStyle.mainText(), mainStyle.subText())

    console.log("Game Guessing Results state")
  }

  shutdown() {
  }

  update () {
  }
}

export default GameGuessingResults
