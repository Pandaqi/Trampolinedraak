export const gameTimer = (ths, serverInfo) => {
  if(serverInfo.paused) {
    return;
  }

  if(ths.timer > 0) {
    ths.timer -= ths.game.time.elapsed/1000;
    ths.timerText.text = Math.ceil(ths.timer);
  } else {
    ths.timerText.text = "Time's up!";
  }
}    

export const controllerTimer = (ths, serverInfo, nextState) => {
  if(serverInfo.paused) {
    return;
  }

  // Perform countdown, if we're VIP
  if(serverInfo.vip) {
    if(ths.timer > 0) {
      ths.timer -= ths.game.time.elapsed/1000;
    } else {
      // TIMER IS DONE!
      // Send message to the server that the next phase should start
      serverInfo.socket.emit('timer-complete', { nextState: nextState })
    }
  }
} 