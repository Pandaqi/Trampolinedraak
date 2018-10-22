import { serverInfo } from './sockets/serverInfo'
import dynamicLoadImage from './drawing/dynamicLoadImage'

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

    // go to next state
    socket.on('next-state', data => {
      serverInfo.timer = data.timer
      gm.state.start('GameGuessingResults')
    })

    console.log("Game Guessing Results state")
  }

  update () {
  }
}

export default GameGuessingResults
