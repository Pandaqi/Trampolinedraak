import { serverInfo } from './sockets/serverInfo'

class ControllerWaiting extends Phaser.State {
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
    /* Show succesful join
    let p1 = document.createElement("p")
    p1.innerHTML = "You've joined the game!"
    div.appendChild(p1)
    */

    // ask user to draw their own profile pic
    let p3 = document.createElement("p")
    p3.innerHTML = "Draw yourself a profile pic!"
    div.appendChild(p3)

    // move canvas inside GUI
    let canvas = document.getElementById("canvas-container")
    div.appendChild(canvas)

    // make canvas the correct size
    let desiredWidth = document.getElementById('main-controller').clientWidth
    console.log(desiredWidth)
    let desiredHeight = desiredWidth * 1.3
    gm.scale.setGameSize(desiredWidth, desiredHeight)

    // add a bitmap for drawing
    this.bmd = gm.add.bitmapData(gm.width, gm.height);
    this.bmd.ctx.strokeStyle = 'rgb( 77, 77, 77)'; // THIS is the actual drawing color      
    this.bmd.ctx.lineWidth   = 10;     
    this.bmd.ctx.lineCap     = 'round';      
    this.bmd.ctx.fillStyle = '#ff0000';      
    this.sprite = gm.add.sprite(0, 0, this.bmd); 
    this.bmd.isDragging = false;
    this.bmd.lastPoint = null;
    //this.bmd.smoothed = false;
    let bmdReference = this.bmd

    // display button to submit drawing
    let btn2 = document.createElement("button")
    btn2.innerHTML = 'Submit drawing'
    btn2.addEventListener('click', function(event) {
      let dataURI = bmdReference.canvas.toDataURL()

      // send the drawing to the server (including the information that it's a profile pic)
      socket.emit('submit-drawing', { dataURI: dataURI, type: "profile"})

      // Remove submit button
      btn2.remove();

      // Disable canvas
      document.getElementById('canvas-container').style.display = 'none';

      if(!serverInfo.vip) {
        p3.innerHTML = 'Waiting for game to start ...';
      }

    })
    div.appendChild(btn2)

    // display VIP message
    // and start button
    if(serverInfo.vip) {
      let p2 = document.createElement("p")
      p2.innerHTML = "You are VIP. Start the game when you're ready."
      div.appendChild(p2)

      let btn1 = document.createElement("button")
      btn1.innerHTML = 'START GAME'
      btn1.addEventListener('click', function(event) {
        // send message to server that we want to start
        socket.emit('start-game', { roomCode: serverInfo.roomCode })
        
        // we don't need to go to the next state; that happens automatically when the server responds with "okay! we start!"
      })
      div.appendChild(btn1)
    }

    socket.on('game-started', data => {
      gm.state.start('Controller')
    })

    console.log("Controller Waiting state");
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
  }
}

export default ControllerWaiting
