/* import { createText } from './utils'
import fileLoader from '../config/fileloader'
import player from './player'
import newPlayer from './sockets/newPlayer'
import updatePlayers from './sockets/updatePlayers'
import playerMovementInterpolation from './predictions/playerMovementInterpolation'
let otherPlayers = {}
*/

import { serverInfo } from './sockets/serverInfo'
import dynamicLoadImage from './drawing/dynamicLoadImage'
import { playerColors } from './utils/colors'
import loadPlayerVisuals from './drawing/loadPlayerVisuals'


class GameWaiting extends Phaser.State {
  constructor () {
    super()
  }

  preload () {
    // Set scaling (as game monitors can also be any size)
    // Scale game to fit the entire window (and rescale when window is resized)
    let gm = this.game

    gm.scale.scaleMode = Phaser.ScaleManager.RESIZE
    window.addEventListener('resize', function () {  
      gm.scale.refresh();
    });
    gm.scale.refresh();

    // Loads files
    //fileLoader(this.game)
  }

  create () {
    let gm = this.game

    // display room code
    var style = { font: "bold 32px Arial", fill: "#333"};
    var text = gm.add.text(gm.width*0.5, 20, "ROOM: " + serverInfo.roomCode, style);
    text.anchor.setTo(0.5, 0)

    let socket = serverInfo.socket

    socket.on('new-player', data => {
      console.log(playerColors)
      console.log(data.rank)

      style = { font: "bold 32px Arial", fill: playerColors[data.rank]};
      let x = gm.width*0.5
      let y = 100 + data.rank*60
      let newItem = gm.add.text(x, y, data.name, style);
      newItem.anchor.setTo(0, 0.5)
    })

    socket.on('player-updated-profile', data => {
      if(data.profile != null) {
        let dataURI = data.profile
        let imageName = 'profileImage' + data.name // creates unique name by appending the username

        let x = gm.width*0.5
        let y = 100 + data.rank*60

        dynamicLoadImage(gm, {x: (x - 100), y: y }, { width:60, height:78 }, imageName, dataURI)
      }

      // create a bubble at random location for each player
      //let randPos = [gm.width*Math.random(), (gm.height-300)*Math.random()];
      //var graphics = gm.add.graphics(0, 0);
      //graphics.beginFill(0xFF0000, 1);
      //graphics.drawCircle(randPos[0], randPos[1], 100);
    })

    socket.on('setup-info', data => {
      serverInfo.playerCount = data
    })

    /***
     * MAIN SOCKETS
     * Some sockets are persistent across states
     * They are defined ONCE here, in the waiting area, and used throughout the game
     */

    // if a player is done -> show it by loading the player name + profile onscreen
    // do so in a circle (it works the best for any screen size AND any player count)
    socket.on('player-done', data => {
      console.log("Player done (" + data.name + ")")

      let angle = (data.rank / serverInfo.playerCount) * 2 * Math.PI
      let maxXHeight = gm.height*0.5/1.3;
      let maxXWidth = gm.width*0.5;
      let finalImageWidth = Math.min(maxXHeight, maxXWidth) * 0.8 // to make sure everything's visible and not too spaced out

      loadPlayerVisuals(gm, gm.width*0.5 + Math.cos(angle)*finalImageWidth, gm.height*0.5 + Math.sin(angle)*finalImageWidth*1.3, playerColors[data.rank], data)
    })

    // go to next state
    // the server gives us (within data) the name of this next state
    socket.on('next-state', data => {
      serverInfo.timer = data.timer
      gm.state.start('Game' + data.nextState)
    })

    // get a drawing from the server, which starts the next Guess-Pick-Result cycle
    // we could turn it on/off at start/end of cycle, but this seems easier and cleaner
    socket.on('return-drawing', data => {
      serverInfo.drawing = data
    })

    // force disconnect (because game has been stopped/removed)
    socket.on('force-disconnect', data => {
      socket.disconnect(true)
      window.location.reload(false)
    })

    /***
     * END MAIN SOCKETS
     */

    console.log("Game waiting state")
  }

  // The shutdown function is called when we switch from one state to another
  // In it, I can clean up this state (e.g. by removing eventListeners) before we go to another
  shutdown() {
    let socket = serverInfo.socket

    socket.off('new-player')
    socket.off('player-updated-profile')
    socket.off('setup-info')
  }

  update () {
    // This is where we listen for input!
  }
}

export default GameWaiting
