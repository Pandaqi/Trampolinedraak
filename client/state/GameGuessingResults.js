import { serverInfo } from './sockets/serverInfo'
import dynamicLoadImage from './drawing/dynamicLoadImage'
import { playerColors } from './utils/colors'

/**
 * GAME GUESSING RESULTS
 * 
 * In this state, the GAME GUESSING and GAME GUESSING PICK states have already been played.
 * A picture is shown, including all suggestions, and now it is made known (one by one) who voted on what, and what is the correct title!
 * There's no timer here - the phase ends once the results have been displayed. 
 *      (... but how? I don't want to give these game states any important things to do, only the Controller)
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

    let style = { font: "bold 32px Arial", fill: "#333"};
    let newItem = gm.add.text(gm.width*0.5, 20, "Let's see how you did!", style);
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
    for(let key in fg) {
      // highlight the correct title
      style = { font: "bold 32px Arial", fill: "#333"};
      if(fg[key].correct) { style.fill = '#237a23' }

      let text = gm.add.text(gm.width*0.5, 80 + counter*80, key, style)
      text.anchor.setTo(0.5, 0.5)

      style = { font: "16px Arial", fill: "#333"};
      let text2 = gm.add.text(gm.width*0.5, 80 + counter*80 + 32, 'Guessed by: ' + fg[key].whoGuessedIt.join(", "), style)
      text2.anchor.setTo(0.5, 0.5)

      if(!fg[key].correct) {
        style = { font: "16px Arial", fill: "#333"};
        let text3 = gm.add.text(gm.width*0.5, 80 + counter*80 + 50, 'Written by: ' + fg[key].name, style)
        text3.anchor.setTo(0.5, 0.5)
      }

      counter++;
    }

    socket.on('final-scores', data => {
      serverInfo.finalScores = data
    })

    console.log("Game Guessing Results state")
  }

  shutdown() {
    serverInfo.socket.off('final-scores')
  }

  update () {
  }
}

export default GameGuessingResults
