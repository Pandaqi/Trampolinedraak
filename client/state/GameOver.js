import { serverInfo } from './sockets/serverInfo'
import { playerColors } from './utils/colors'

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

    let style = { font: "bold 32px Arial", fill: "#333"};
    let newItem = gm.add.text(gm.width*0.5, 20, "FINAL SCORE", style);
    newItem.anchor.setTo(0.5, 0)

    let scores = serverInfo.finalScores
    let keysSorted = Object.keys(scores).sort(function(a,b){return scores[b].score - scores[a].score })

    // display all players and their score
    let counter = 0
    for(let i= 0; i < keysSorted.length; i++ ) {
      let p = scores[keysSorted[i]]

      style.fill = playerColors[p.rank]
      let text = gm.add.text(gm.width*0.5, 80 + counter*40, 'Player: ' + p.name + " | Score: " + p.score, style)
      text.anchor.setTo(0.5, 0.5)

      counter++
    }

    console.log("Game Over state")
  }

  update () {
  }
}

export default GameOver
