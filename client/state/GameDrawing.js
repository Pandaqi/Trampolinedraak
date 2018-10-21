import { serverInfo } from './sockets/serverInfo'

/**
 * GAME DRAWING
 * 
 * In this state, all players get a suggestion (on their Controller device) which they must draw
 * A timer runs down; once finished, the phase ends. (The phase also ends immediately when all drawings have been submitted)
 * Whenever a user submitted their drawing, that is made known on this screen.
 */

class GameDrawing extends Phaser.State {
  constructor () {
    super()
  }

  preload () {
    // Loads files
  }

  create () {
    let gm = this.game
    let socket = serverInfo.socket
    let colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', 
    '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', 
    '#9a6324', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#000000']

    let style = { font: "bold 32px Arial", fill: "#333", wordWrap: true, wordWrapWidth: gm.width*0.8};
    let text = gm.add.text(gm.width*0.5, 20, "Draw the suggestion shown on your screen!", style);
    text.anchor.setTo(0.5, 0)

    this.timerText = gm.add.text(gm.width*0.5, gm.height*0.5, "", style)
    this.timer = serverInfo.timer

    // if a player is done -> show it by loading the player name + profile onscreen
    let playersDoneCounter = 0
    socket.on('player-done', data => {
      this.loadPlayerVisuals(gm, gm.width*0.5, 80 + playersDoneCounter*60, colors[playersDoneCounter], data)
      playersDoneCounter++;
    })

    socket.on('next-state', data => {
      serverInfo.timer = data.timer
      gm.state.start('GameGuessing')
    })

    console.log("Game Drawing state")
  }

  update () {
    if(this.timer > 0) {
      this.timer -= this.game.time.elapsed/1000;
      this.timerText.text = Math.ceil(this.timer);
    } else {
      this.timerText.text = "Time's up!";
    }
  }

  loadPlayerVisuals(gm, x, y, color, data) {
    style = { font: "bold 32px Arial", fill: color};
    let newItem = gm.add.text(x, y, data[key].name, style);

    if(data[key].profile != null) {
      let dataURI = data[key].profile
      let imageName = 'profileImage' + data[key].name // creates unique name by appending the username

      let doesKeyExist = gm.cache.checkKey(Phaser.Cache.IMAGE, imageName)

      if(!doesKeyExist) {
        // load the image; display once loaded
        var loader = new Phaser.Loader(gm); 
        loader.image(imageName, dataURI+'');
        loader.onLoadComplete.addOnce(this.loadImageComplete, this, 0, gm, (x - 100), y - 30, imageName);
        loader.start();
      } else {
        // if image was already in cache, just add the sprite (but don't load it again)
        this.loadImageComplete(gm, (x - 100), (y - 30), imageName)
      }

    }
  }

  loadImageComplete(gm, x, y, name) {
    let newSprite = gm.add.sprite(x, y, name)
    newSprite.width = 60
    newSprite.height = 78
  }
}

export default GameDrawing
