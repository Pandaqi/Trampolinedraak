import { serverInfo } from './sockets/serverInfo'
import { playerColors } from './utils/colors'
import loadWatchRoom from './sockets/watchRoomModule'
import { mainStyle } from './utils/styles'
import loadGUIOverlay from './utils/loadGUIOverlay'

/**
 * GAME OVER
 * 
 * In this state, the final results are shown and the winner is revealed!
 * On top of that, there are buttons to play a next round, or stop/leave the game
 * 
 */

class GameOver extends Phaser.State {
  constructor () {
    super()
  }

  preload () {
    // Loads files
  }

  create () {
    let gm = this.game
    let socket = serverInfo.socket

    let newItem = gm.add.text(gm.width*0.5, 20, serverInfo.translate('game-over-1').toUpperCase(), mainStyle.mainText(gm.width*0.8));
    newItem.anchor.setTo(0.5, 0)

    let scores = serverInfo.finalScores
    let keysSorted = Object.keys(scores).sort(function(a,b){return scores[b].score - scores[a].score })

    // display all players and their score
    let counter = 0
    for(let i= 0; i < keysSorted.length; i++ ) {
      let p = scores[keysSorted[i]]

      let text = gm.add.text(gm.width*0.5, 100 + counter*40, serverInfo.translate('player') + ': ' + p.name + " | " + serverInfo.translate('score') + ": " + p.score, mainStyle.mainText(gm.width*0.8, playerColors[p.rank]))
      text.anchor.setTo(0.5, 0.5)

      counter++
    }

    loadWatchRoom(socket, serverInfo)

    loadGUIOverlay(gm, serverInfo, mainStyle.mainText(), mainStyle.subText())

    console.log("Game Over state")
  }

  update () {
  }
}

export default GameOver
