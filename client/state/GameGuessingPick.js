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
    let newItem = gm.add.text(gm.width*0.5, 20, "Hmm, which one is the correct title?", style);
    newItem.anchor.setTo(0.5, 0)

    this.timerText = gm.add.text(gm.width*0.5, gm.height*0.5, "", style)

    this.timer = 15;

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
