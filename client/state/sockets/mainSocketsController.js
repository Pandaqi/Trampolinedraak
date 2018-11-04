const loadMainSockets = (socket, gm, serverInfo) => {
  /***
   * MAIN SOCKETS
   * Some sockets are persistent across states
   * They are defined ONCE here, in the waiting area, and uses throughout the game
   */

  socket.on('next-state', data => {
    // set the timer
    serverInfo.timer = data.timer

    // save the canvas (otherwise it is also removed when the GUI is removed)
    let cv = document.getElementById("canvas-container")
    cv.style.display = 'none'
    document.body.appendChild(cv)

    // clear the GUI
    document.getElementById("main-controller").innerHTML = '';

    // start the next state
    gm.state.start('Controller' + data.nextState)
  })

  // save whose drawing is displayed on screen, so we know if this controller is the owner or not
  socket.on('return-drawing', data => {
    serverInfo.drawing = data
  })

  // force disconnect (because game has been stopped/removed)
  socket.on('force-disconnect', data => {
    socket.disconnect(true)
    window.location.reload(false)
  })

  /***
   * END MAIN SOCKETS
   */
}   

export default loadMainSockets 