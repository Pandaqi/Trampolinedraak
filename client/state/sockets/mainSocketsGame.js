import loadPlayerVisuals from '../drawing/loadPlayerVisuals'
import { playerColors } from '../utils/colors'

const loadMainSockets = (socket, gm, serverInfo) => {
  /***
 * MAIN SOCKETS
 * Some sockets are persistent across states
 * They are defined ONCE here, in the waiting area, and used throughout the game
 */

  // if a player is done -> show it by loading the player name + profile onscreen
  // do so in a circle (it works the best for any screen size AND any player count)
  socket.on('player-done', data => {
    console.log("Player done (" + data.name + ")")

    // offset the angle just a little bit, to make sure stuff doesn't clash
    let angle = ( (data.rank / serverInfo.playerCount) + 0.25*(1 / serverInfo.playerCount)) * 2 * Math.PI
    let maxXHeight = gm.height*0.5/1.3;
    let maxXWidth = gm.width*0.5;
    let finalImageWidth = Math.min(maxXHeight, maxXWidth) * 0.66 // to make sure everything's visible and not too spaced out

    loadPlayerVisuals(gm, gm.width*0.5 + Math.cos(angle)*finalImageWidth, gm.height*0.5 + Math.sin(angle)*finalImageWidth*1.3, playerColors[data.rank], data)
  })

  // go to next state
  // the server gives us (within data) the name of this next state
  socket.on('next-state', data => {
    serverInfo.timer = data.timer
    gm.state.start('Game' + data.nextState)
  })

  // presignals always have the following format ['variable name', value]
  // they always set a variable on the server info (before a state change)
  socket.on('pre-signal', data => {
    serverInfo[data[0]] = data[1]
  })


  // force disconnect (because game has been stopped/removed)
  socket.on('force-disconnect', data => {
    socket.disconnect(true)
    window.location.reload(false)
  })

  /***
   * END MAIN SOCKETS
   */

  /***
   * PAUSING (main socket + pause message text object)
   */

  // This signal pauses/resumes the game
  socket.on('pause-resume-game', data => {
    if(data) {
      serverInfo.paused = true
      
      let style = { font: "bold 32px Arial", fill: "#FF0000" };
      let text = gm.add.text(20, 20, serverInfo.translate('game-paused').toUpperCase(), style);
      text.anchor.setTo(0, 0)

      gm.pauseObject = text
    } else {
      serverInfo.paused = false

      if(gm.pauseObject != null) {
        gm.pauseObject.destroy()
      }
    }
  })

}    

export default loadMainSockets