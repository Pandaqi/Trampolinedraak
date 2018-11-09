import { serverInfo } from './sockets/serverInfo'
import { controllerTimer } from './utils/timers'
import { playerColors } from './utils/colors'
import loadRejoinRoom from './sockets/rejoinRoomModule'

class ControllerDrawing extends Phaser.State {
  constructor () {
    super()
    // construct stuff here, if needed
  }

  preload () {
    // load stuff here, if needed
  }

  create () {    
    let gm = this.game
    let socket = serverInfo.socket

    let div = document.getElementById("main-controller")

    // Create some text to explain rejoining was succesfull. 
    // If the player was already done for this round, the function returns true, and we stop loading the interface
    if( loadRejoinRoom(socket, serverInfo, div) ) {
      return;
    }
    
    let drawingSubmitted = false;

    let p1 = document.createElement("p")
    p1.innerHTML = serverInfo.translate('controller-drawing-1') + ': <span class="titleSuggestion">' + serverInfo.drawingTitle + '</span>'
    div.appendChild(p1)

    // move canvas inside GUI (and bring it back to life from display=none)
    let canvas = document.getElementById("canvas-container")
    canvas.style.display = 'block';
    div.appendChild(canvas)

    // make canvas the correct size
    // check what's the maximum width or height we can use
    let maxWidth = document.getElementById('main-controller').clientWidth
    // calculate height of the viewport, subtract the space lost because of text above the canvas, subtract space lost from button (height+padding+margin)
    let maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - canvas.getBoundingClientRect().top - (16+8*2+4*2)
    // determine the greatest width we can use (either the original width, or the width that will lead to maximum allowed height)
    let finalWidth = Math.min(maxWidth, maxHeight / 1.3)
    // scale the game immediately (both stage and canvas simultaneously)
    gm.scale.setGameSize(finalWidth, finalWidth * 1.3)

    // add a bitmap for drawing
    this.bmd = gm.add.bitmapData(gm.width, gm.height);
    this.bmd.ctx.strokeStyle = playerColors[serverInfo.rank]; // THIS is the actual drawing color      
    this.bmd.ctx.lineWidth   = 10;     
    this.bmd.ctx.lineCap     = 'round';      
    this.bmd.ctx.fillStyle = '#ff0000';      
    this.sprite = gm.add.sprite(0, 0, this.bmd); 
    this.bmd.isDragging = false;
    this.bmd.lastPoint = null;
    //this.bmd.smoothed = false;
    let bmdReference = this.bmd

    // display button to submit drawing
    let btn1 = document.createElement("button")
    btn1.innerHTML = serverInfo.translate('submit-drawing')
    btn1.addEventListener('click', function(event) {
      // Remove submit button
      btn1.remove();

      let dataURI = bmdReference.canvas.toDataURL()

      // send the drawing to the server (including the information that it's a profile pic)
      socket.emit('submit-drawing', { dataURI: dataURI, type: "ingame"})

      // Disable canvas
      canvas.style.display = 'none';

      p1.innerHTML = serverInfo.translate('controller-drawing-2')

      drawingSubmitted = true;
    })
    div.appendChild(btn1)

    // just to be sure, the computer auto-fetches all unsubmitted drawings
    socket.on('fetch-drawing', data => {
      // if we already submitted: no need to waste internet bandwidth
      if(drawingSubmitted) { return; }

      // if not, send it!
      let dataURI = bmdReference.canvas.toDataURL()
      socket.emit('submit-drawing', { dataURI: dataURI, type: "ingame"})

      drawingSubmitted = true;
    })

    this.timer = serverInfo.timer;

    console.log("Controller Drawing state");
  }

  shutdown () {
    serverInfo.socket.off('fetch-drawing')
  }

  update () {
    /***
     * DRAW STUFF
     ***/
    if(this.game.input.activePointer.isUp) {        
      this.bmd.isDragging = false;        
      this.bmd.lastPoint = null;      
    }      

    if (this.game.input.activePointer.isDown) {              
      this.bmd.isDragging = true;        
      this.bmd.ctx.beginPath();                        
      var newPoint = new Phaser.Point(this.game.input.x, this.game.input.y);        

      if(this.bmd.lastPoint) {          
        this.bmd.ctx.moveTo(this.bmd.lastPoint.x, this.bmd.lastPoint.y);          
        this.bmd.ctx.lineTo(newPoint.x, newPoint.y);        
      }        

      this.bmd.lastPoint = newPoint;        
      this.bmd.ctx.stroke();        
    
      this.bmd.dirty = true;
    }

    // Update timer
    controllerTimer(this, serverInfo, 'Guessing')
  }
}

export default ControllerDrawing
