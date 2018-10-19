import { serverInfo } from './sockets/serverInfo'

class Game extends Phaser.State {
  constructor () {
    super()
  }

  preload () {
    // Loads files
  }

  create () {
    console.log("Game state")
  }

  update () {
    // This is where we listen for input!
  }
}

export default Game
