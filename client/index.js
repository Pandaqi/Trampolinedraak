import { WINDOW_WIDTH, WINDOW_HEIGHT } from './config'

import Menu from './state/Menu' // menu is the waiting menu, where players either create or join a room
import Game from './state/Game' // game merely *displays* the game on the monitor
import Controller from './state/Controller' // controller means the handheld device a player uses

class App extends Phaser.Game {
  constructor () {
    super(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.AUTO)
    this.state.add('Menu', Menu)
    this.state.add('Game', Game)
    this.state.add('Controller', Controller)
    this.state.start('Menu')
  }
}

const SimpleGame = new App()

// augmenting standard JavaScript functions to make removal of overlay easier
// (we don't need the overlay at any point after the menu)
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

export default SimpleGame
