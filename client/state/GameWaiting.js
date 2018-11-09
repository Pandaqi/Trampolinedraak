import { serverInfo } from './sockets/serverInfo'
import dynamicLoadImage from './drawing/dynamicLoadImage'
import { playerColors } from './utils/colors'
import loadPlayerVisuals from './drawing/loadPlayerVisuals'
import loadMainSockets from './sockets/mainSocketsGame'
import loadWatchRoom from './sockets/watchRoomModule'
import { mainStyle } from './utils/styles'


class GameWaiting extends Phaser.State {
  constructor () {
    super()
  }

  preload () {
    // Set scaling (as game monitors can also be any size)
    // Scale game to fit the entire window (and rescale when window is resized)
    let gm = this.game

    gm.scale.scaleMode = Phaser.ScaleManager.RESIZE
    window.addEventListener('resize', function () {  
      gm.scale.refresh();
    });
    gm.scale.refresh();
  }

  create () {
    let gm = this.game

    // display room code
    var text = gm.add.text(gm.width*0.5, 20, serverInfo.translate('room').toUpperCase() + ": " + serverInfo.roomCode, mainStyle.mainText(gm.width*0.8));
    text.anchor.setTo(0.5, 0)

    // explain that we're waiting for people to join
    let text2 = gm.add.text(gm.width*0.5, 60, serverInfo.translate('game-waiting-1'), mainStyle.subText(gm.width*0.8));
    text2.anchor.setTo(0.5, 0)

    let socket = serverInfo.socket

    socket.on('new-player', data => {
      let x = gm.width*0.5
      let y = 120 + data.rank*60
      let newItem = gm.add.text(x, y, data.name, mainStyle.mainText(gm.width, playerColors[data.rank]));
      newItem.anchor.setTo(0, 0.5)
    })

    socket.on('player-updated-profile', data => {
      if(data.profile != null) {
        let dataURI = data.profile
        let imageName = 'profileImage' + data.name // creates unique name by appending the username

        let x = gm.width*0.5
        let y = 120 + data.rank*60

        dynamicLoadImage(gm, {x: (x - 100), y: y }, { width:60, height:78 }, imageName, dataURI)
      }

      // create a bubble at random location for each player
      //let randPos = [gm.width*Math.random(), (gm.height-300)*Math.random()];
      //var graphics = gm.add.graphics(0, 0);
      //graphics.beginFill(0xFF0000, 1);
      //graphics.drawCircle(randPos[0], randPos[1], 100);
    })

    loadMainSockets(socket, gm, serverInfo)
    loadWatchRoom(socket, serverInfo)

    console.log("Game waiting state")
  }

  // The shutdown function is called when we switch from one state to another
  // In it, I can clean up this state (e.g. by removing eventListeners) before we go to another
  shutdown() {
    let socket = serverInfo.socket

    socket.off('new-player')
    socket.off('player-updated-profile')
  }

  update () {
    // This is where we listen for input!
  }
}

export default GameWaiting
