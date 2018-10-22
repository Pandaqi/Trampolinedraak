import { serverInfo } from './sockets/serverInfo'

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
    let colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', 
    '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', 
    '#9a6324', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#000000']

    let div = document.getElementById("main-controller")
    let drawingSubmitted = false;

    let p1 = document.createElement("p")
    p1.innerHTML = 'Draw this: <span class="titleSuggestion">' + serverInfo.drawingTitle + '</span>'
    div.appendChild(p1)

    // move canvas inside GUI (and bring it back to life from display=none)
    let canvas = document.getElementById("canvas-container")
    canvas.style.display = 'block';
    div.appendChild(canvas)

    // make canvas the correct size
    let desiredWidth = document.getElementById('main-controller').clientWidth
    let desiredHeight = desiredWidth * 1.3
    gm.scale.setGameSize(desiredWidth, desiredHeight)

    // add a bitmap for drawing
    this.bmd = gm.add.bitmapData(gm.width, gm.height);
    this.bmd.ctx.strokeStyle = colors[serverInfo.rank]; // THIS is the actual drawing color      
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
    btn1.innerHTML = 'Submit drawing'
    btn1.addEventListener('click', function(event) {
      // Remove submit button
      btn1.remove();

      let dataURI = bmdReference.canvas.toDataURL()

      // send the drawing to the server (including the information that it's a profile pic)
      socket.emit('submit-drawing', { dataURI: dataURI, type: "ingame"})

      // Disable canvas
      canvas.style.display = 'none';

      p1.innerHTML = "That drawing is ... let's say, something special.";

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

      socket.off('fetch-drawing')
    })

    this.timer = serverInfo.timer;

    // save whose drawing is displayed on screen, so we know if this controller is the owner or not
    socket.on('return-drawing', data => {
      serverInfo.drawing = data
    })

    // when next state is called, clean the GUI, move the canvas somewhere safe, and start the next state
    socket.on('next-state', data => {
      serverInfo.timer = data.timer;
      canvas.style.display = 'none';
      document.body.appendChild(canvas)
      document.getElementById('main-controller').innerHTML = '';
      gm.state.start('ControllerGuessing')
    })

    console.log("Controller Drawing state");
  }

  update () {
    // This is where we listen for input!

    /***
     * DRAW STUFF
     ***/
    if(this.game.input.activePointer.isUp) {        
      this.bmd.isDragging = false;        
      this.bmd.lastPoint = null;      
    }      

    if (this.game.input.activePointer.isDown) {        
      console.log('down');        
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

    // Perform countdown, if we're VIP
    if(serverInfo.vip) {
      if(this.timer > 0) {
        this.timer -= this.game.time.elapsed/1000;
      } else {
        // TIMER IS DONE!
        // Send message to the server that the next phase should start
        let socket = serverInfo.socket
        socket.emit('timer-complete', { nextState: 'Guessing' })
      }
    }
  }
}

export default ControllerDrawing
