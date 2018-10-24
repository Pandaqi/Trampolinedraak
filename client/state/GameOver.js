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

    // sort from HIGHEST score to LOWEST score
    scores.sort(function(a, b) { 
        return a.score - b.score;
    })

    // display all players and their score
    let counter = 0
    for(let key in scores) {
      let p = scores[key]

      style.fill = playerColors[p.rank]
      let text = gm.add.text(gm.width*0.5, 60 + counter*40, 'Player: ' + p.name + " | Score: " + p.score, style)
      text.anchor.setTo(0.5, 0.5)

      counter++
    }

    console.log("Game Over state")
  }

  update () {
  }
}

export default GameOver
