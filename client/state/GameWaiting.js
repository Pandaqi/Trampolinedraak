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
        style = { font: "bold 32px Arial", fill: colors[counter]};
        let x = gm.width*0.5
        let y = 80 + counter*60
        let newItem = gm.add.text(x, y, data[key].name, style);
        ths.listSprites.push(newItem)

        if(data[key].profile != null) {
          let dataURI = data[key].profile
          let imageName = 'profileImage' + data[key].name // creates unique name by appending the username

          let doesKeyExist = gm.cache.checkKey(Phaser.Cache.IMAGE, imageName)

          if(!doesKeyExist) {
            // load the image; display once loaded
            var loader = new Phaser.Loader(gm); 
            loader.image(imageName, dataURI+'');
            loader.onLoadComplete.addOnce(this.loadImageComplete, this, 0, gm, ths.listSprites, (x - 100), y - 30, imageName);
            loader.start();
          } else {
            // if image was already in cache, just add the sprite (but don't load it again)
            this.loadImageComplete(gm, ths.listSprites, (x - 100), (y - 30), imageName)
          }

        }

        counter++
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

  loadImageComplete(gm, lst, x, y, name) {
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
