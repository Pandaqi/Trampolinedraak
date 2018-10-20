/* import { createText } from './utils'
import fileLoader from '../config/fileloader'
import player from './player'
import newPlayer from './sockets/newPlayer'
import updatePlayers from './sockets/updatePlayers'
import playerMovementInterpolation from './predictions/playerMovementInterpolation'
let otherPlayers = {}
*/

import { serverInfo } from './sockets/serverInfo'


class GameWaiting extends Phaser.State {
  constructor () {
    super()
    this.playerlist = null
    this.listSprites = []
  }

  preload () {
    // Loads files
    //fileLoader(this.game)
  }

  create () {
    let colors = ['#c8ad55', '#d0fcb3', '#9bc59d', '#6c5a49', '#271f30', '#392f5a', '#f092dd', '#eb9486', '#7e7f9a', '#97a7b3', '#f3de8a']

    // display room code
    let gm = this.game
    var style = { font: "bold 32px Arial", fill: "#333"};
    var text = gm.add.text(gm.width*0.5, 20, serverInfo.roomCode, style);

    let socket = serverInfo.socket

    let ths = this

    socket.on('update-playerlist', data => {
      ths.playerlist = data

      // destroy the old list
      for(let i = 0; i < ths.listSprites; i++) {
        ths.listSprites[i].destroy();
      }
      ths.listSprites = []

      // make a new list
      let counter = 0
      for(var key in ths.playerlist) {
        style = { font: "bold 24px Arial", fill: colors[counter]};
        let newItem = gm.add.text(gm.width*0.5, 80 + counter*30, data[key].name, style);
        ths.listSprites.push(newItem)

        if(data[key].profile != null) {
          let dataURI = data[key].profile
          let imageName = 'profileImage' + data[key].name // creates unique name by appending the username

          // load the image; display once loaded
          var loader = new Phaser.Loader(gm); 
          loader.image(imageName, dataURI+'');
          loader.onLoadComplete.addOnce(this.loadImageComplete, this, 0, gm, ths.listSprites, (gm.width*0.5 - 100), (80 + counter*30), imageName);
          loader.start();
        }


        counter++
      }

      // create a bubble at random location for each player
      //let randPos = [gm.width*Math.random(), (gm.height-300)*Math.random()];
      //var graphics = gm.add.graphics(0, 0);
      //graphics.beginFill(0xFF0000, 1);
      //graphics.drawCircle(randPos[0], randPos[1], 100);

      
    })

    console.log("Game waiting state")


    // Sends a new-player event to the server
    //newPlayer(socket, this.player)

    // Update all players
    //updatePlayers(socket, otherPlayers, this.game)
  }

  loadImageComplete(gm, lst, x, y, name) {
    console.log("IMAGE LOAD COMPLETE")
    let newSprite = gm.add.sprite(x, y, name)
    newSprite.width = 60
    newSprite.height = 78
    lst.push(newSprite)
  }

  update () {
    // This is where we listen for input!
  }
}

export default GameWaiting
