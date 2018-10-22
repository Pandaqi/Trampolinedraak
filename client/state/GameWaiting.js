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


class GameWaiting extends Phaser.State {
  constructor () {
    super()
  }

  preload () {
    // Loads files
    //fileLoader(this.game)
  }

  create () {
    let colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', 
    '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', 
    '#9a6324', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#000000']

    let gm = this.game

    // Scale game to fit the entire window (and rescale when window is resized)
    gm.scale.scaleMode = Phaser.ScaleManager.RESIZE
    window.addEventListener('resize', function () {  
      gm.scale.refresh();
    });
    gm.scale.refresh();

    // display room code
    var style = { font: "bold 32px Arial", fill: "#333"};
    var text = gm.add.text(gm.width*0.5, 20, "ROOM: " + serverInfo.roomCode, style);
    text.anchor.setTo(0.5, 0)

    let socket = serverInfo.socket

    socket.on('new-player', data => {
      style = { font: "bold 32px Arial", fill: colors[data.rank]};
      let x = gm.width*0.5
      let y = 80 + data.rank*60
      let newItem = gm.add.text(x, y, data.name, style);
      newItem.anchor.setTo(0, 0.5)
    })

    socket.on('player-updated-profile', data => {
      if(data.profile != null) {
        let dataURI = data.profile
        let imageName = 'profileImage' + data.name // creates unique name by appending the username

        let x = gm.width*0.5
        let y = 80 + data.rank*60

        dynamicLoadImage(gm, {x: (x - 100), y: y }, { width:60, height:78 }, imageName, dataURI)
      }

      // create a bubble at random location for each player
      //let randPos = [gm.width*Math.random(), (gm.height-300)*Math.random()];
      //var graphics = gm.add.graphics(0, 0);
      //graphics.beginFill(0xFF0000, 1);
      //graphics.drawCircle(randPos[0], randPos[1], 100);
    })

    socket.on('next-state', data => {
      serverInfo.timer = data.timer
      gm.state.start('GameSuggestions')
    })

    console.log("Game waiting state")
  }

  update () {
    // This is where we listen for input!
  }
}

export default GameWaiting
