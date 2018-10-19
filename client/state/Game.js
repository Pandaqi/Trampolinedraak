// import { createText } from './utils'
import fileLoader from '../config/fileloader'
import player from './player'
import newPlayer from './sockets/newPlayer'
import updatePlayers from './sockets/updatePlayers'
import playerMovementInterpolation from './predictions/playerMovementInterpolation'
import { serverInfo } from './sockets/serverInfo'

let otherPlayers = {}

class Game extends Phaser.State {
  constructor () {
    super()
    this.playerlist = {}
  }

  preload () {
    // Loads files
    //fileLoader(this.game)
  }

  create () {
    // display room code
    let gm = this.game
    var style = { font: "bold 32px Arial", fill: "#fff"};
    var text = gm.add.text(gm.width*0.5, 20, serverInfo.roomCode, style);

    let socket = serverInfo.socket

    socket.on('new-player-joined', data => {
      // create a bubble at random location for each player
      let randPos = [gm.width*Math.random(), (gm.height-300)*Math.random()];

      var graphics = gm.add.graphics(0, 0);
      graphics.beginFill(0xFF0000, 1);
      graphics.drawCircle(randPos[0], randPos[1], 100);

      style = { font: "16px Arial", fill: "#f00"};
      gm.add.text(randPos[0], randPos[1] + 120, data.name, style);
    })


    // Sends a new-player event to the server
    //newPlayer(socket, this.player)

    // Update all players
    //updatePlayers(socket, otherPlayers, this.game)
  }

  update () {
    // This is where we listen for input!
  }
}

export default Game
