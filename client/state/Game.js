// import { createText } from './utils'
import fileLoader from '../config/fileloader'
import player from './player'
import newPlayer from './sockets/newPlayer'
import updatePlayers from './sockets/updatePlayers'
import playerMovementInterpolation from './predictions/playerMovementInterpolation'

// replace this with 'http://localhost:8000' to test locally
// use 'https://trampolinedraak.herokuapp.com' for production

const SERVER_IP = 'http://localhost:8000'
let socket = null
let otherPlayers = {}

class Game extends Phaser.State {
  constructor () {
    super()
    this.player = {}
  }

  preload () {
    // Loads files
    fileLoader(this.game)
  }

  create () {
    // Connects the player to the server
    socket = io(SERVER_IP)

    // Sends a new-player event to the server
    newPlayer(socket, this.player)

    // Update all players
    updatePlayers(socket, otherPlayers, this.game)

    // Scale game to fit the entire window
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  }

  update () {
    // This is where we listen for input!
  }
}

export default Game
