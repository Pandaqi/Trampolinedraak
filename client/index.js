import { WINDOW_WIDTH, WINDOW_HEIGHT } from './config'

import Menu from './state/Menu' // menu is the waiting menu, where players either create or join a room

import GameWaiting from './state/GameWaiting' // game merely *displays* the game on the monitor
import GameSuggestions from './state/GameSuggestions' 
import GameDrawing from './state/GameDrawing'
import GameGuessing from './state/GameGuessing'
import GameGuessingPick from './state/GameGuessingPick'
import GameGuessingResults from './state/GameGuessingResults'
import GameOver from './state/GameOver'     

import ControllerWaiting from './state/ControllerWaiting' // controller means the handheld device a player uses
import ControllerSuggestions from './state/ControllerSuggestions' 
import ControllerDrawing from './state/ControllerDrawing'



class App extends Phaser.Game {
  constructor () {
    super('100%', '100%', Phaser.AUTO, 'canvas-container')
    // menu state
    this.state.add('Menu', Menu)
 
    // game monitor states
    this.state.add('GameWaiting', GameWaiting)
    this.state.add('GameSuggestions', GameSuggestions)
    this.state.add('GameDrawing', GameDrawing)
    this.state.add('GameGuessing', GameGuessing)
    this.state.add('GameGuessingPick', GameGuessingPick)
    this.state.add('GameGuessingResults', GameGuessingResults)
    this.state.add('GameOver', GameOver)

    // game controller states
    this.state.add('ControllerWaiting', ControllerWaiting)
    this.state.add('ControllerSuggestions', ControllerSuggestions)
    this.state.add('ControllerDrawing', ControllerDrawing)
    
    // start the game! (at the menu)
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
