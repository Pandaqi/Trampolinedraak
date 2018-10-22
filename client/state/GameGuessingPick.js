import { serverInfo } from './sockets/serverInfo'

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

    let style = { font: "bold 32px Arial", fill: "#333"};
    let text = gm.add.text(gm.width*0.5, 20, "Hmm, which one is the correct title?", style);
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
    // guesses[i].guess is necessary, because guesses[i] is an object that also contains WHO made the guess
    let guesses = serverInfo.guesses
    for(let i = 0; i < guesses.length; i++) {
      let angle = i / guesses.length * 2 * Math.PI
      let guessText = gm.add.text(gm.width*0.5 + Math.cos(angle)*finalImageWidth, gm.height*0.5 + Math.sin(angle)*finalImageWidth*1.3, guesses[i].guess, style);
      guessText.anchor.setTo(0.5, 0.5)
    }

    // set timer, load timer text
    this.timerText = gm.add.text(gm.width*0.5, gm.height*0.5, "", style)
    this.timer = serverInfo.timer

    console.log("Game Guessing Pick state")
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

export default GameGuessingPick
