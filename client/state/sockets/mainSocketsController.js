const loadMainSockets = (socket, gm, serverInfo) => {
  /***
   * MAIN SOCKETS
   * Some sockets are persistent across states
   * They are defined ONCE here, in the waiting area, and uses throughout the game
   */

  socket.on('next-state', data => {
    // we're going to a new state, so the player is not done with that state yet
    serverInfo.playerDone = false

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

  socket.on('pause-resume-game', data => {
    if(!serverInfo.vip) {
      return;
    }

    if(data) {
      // if we're already paused, don't add another set of buttons and options for the vip
      // so, first check if this is our first pause
      if(!serverInfo.paused) {
        let div = document.getElementById("main-controller")

        let span = document.createElement("span")
        div.insertBefore(span, div.firstChild)

        // 1. add text to explain the situation
        let p1 = document.createElement("p")
        p1.innerHTML = serverInfo.translate("player-disconnect-1")
        span.appendChild(p1)

        let p2 = document.createElement("p")
        p2.innerHTML = serverInfo.translate("player-disconnect-2") 
        span.appendChild(p2)

        // 2. add buttons for continuing without player, or stopping game altogether
        let btn1 = document.createElement("button")
        btn1.innerHTML = serverInfo.translate('continue-game')
        btn1.addEventListener('click', function(event) {
          socket.emit('continue-without-disconnects', {})

          // remove the pause GUI
          gm.pauseObject.innerHTML = '';
          gm.pauseObject.remove()

          // unpause the game
          serverInfo.paused = false
        })
        span.appendChild(btn1)

        let btn2 = document.createElement("button")
        btn2.innerHTML = serverInfo.translate('destroy-game')
        btn2.addEventListener('click', function(event) {
          socket.emit('destroy-game', {})
        })
        span.appendChild(btn2)

        // 3. Add a horizontal rule to separate GUIs and add more space
        let hr = document.createElement("hr")
        span.appendChild(hr)

        // 4. and save all these somewhere so they can be removed (on button click, or when the game resumes)
        gm.pauseObject = span

        serverInfo.paused = true
      }
    } else {
      // remove the GUI that displays when the game is paused
      gm.pauseObject.innerHTML = '';
      gm.pauseObject.remove()

      serverInfo.paused = false
    }
  })

  /***
   * END MAIN SOCKETS
   */
}   

export default loadMainSockets 