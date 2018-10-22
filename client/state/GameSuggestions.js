import { serverInfo } from './sockets/serverInfo'

/**
 * GAME SUGGESTIONS
 * 
 * In this state, everyone may submit as many suggestion words as they can
 * A timer runs down; once it's done, the phase is over.
 * The suggestions are collected on the server, rearranged and combined, and then one of them is sent to each player
 */

class GameSuggestions extends Phaser.State {
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

    let style = { font: "bold 32px Arial", fill: "#333", wordWrap:true, wordWrapWidth: gm.width*0.8 };
    let text = gm.add.text(gm.width*0.5, 20, "Please submit as many suggestions as you can!", style);
    text.anchor.setTo(0.5, 0)

    this.timerText = gm.add.text(gm.width*0.5, gm.height*0.5, "", style)
    this.timer = serverInfo.timer

    // if a player is done -> show it by loading the player name + profile onscreen
    let playersDoneCounter = 0
    socket.on('player-done', data => {
      console.log("Player done (" + data.name + ") with drawing")

      this.loadPlayerVisuals(gm, gm.width*0.5, 80 + playersDoneCounter*60, colors[data.rank], data)
      playersDoneCounter++;
    })

    console.log("Game Suggestions state")

    socket.on('next-state', data => {
      serverInfo.timer = data.timer
    	gm.state.start('GameDrawing')
    })
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
    let style = { font: "bold 32px Arial", fill: color};
    let newItem = gm.add.text(x, y, data.name, style);
    newItem.anchor.setTo(0, 0.5)

    if(data.profile != null) {
      let dataURI = data.profile
      let imageName = 'profileImage' + data.name // creates unique name by appending the username

      dynamicLoadImage(gm, {x: (x - 100), y: y}, { width:60, height:78 }, imageName, dataURI)
    }
  }
}

export default GameSuggestions
