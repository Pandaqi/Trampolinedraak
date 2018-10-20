import { serverInfo } from './sockets/serverInfo'

class Game extends Phaser.State {
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
    let newItem = gm.add.text(gm.width*0.5, 20, "Please submit as many suggestions as you can!", style);

    this.timerText = gm.add.text(gm.width*0.5, gm.height*0.5, "", style)

    this.timer = 15;

    console.log("Game state")
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

export default Game
