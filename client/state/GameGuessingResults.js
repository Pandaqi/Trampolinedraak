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

    // List all titles, including who guessed the title (+ score bonus), and who wrote it (+score bonus)
    // Mark the correct title specifically
    // TO DO: Score bonusses ??
    let fg = serverInfo.finalGuessResults
    let counter = 0
    for(let key in fg) {
      // highlight the correct title
      style = { font: "bold 32px Arial", fill: "#333"};
      if(fg.correct) { style.fill = '#237a23' }

      let text = gm.add.text(gm.width*0.5, 50 + counter*80, key, style)
      text.anchor.setTo(0.5, 0.5)

      style = { font: "16px Arial", fill: "#333"};
      let text2 = gm.add.text(gm.width*0.5, 50 + counter*80 + 32, 'Guessed by: ' + fg[key].whoGuessedIt, style)
      text2.anchor.setTo(0.5, 0.5)

      if(!fg.correct) {
        style = { font: "16px Arial", fill: "#333"};
        let text3 = gm.add.text(gm.width*0.5, 50 + counter*80 + 50, 'Written by: ' + fg[key].name, style)
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
