const loadWatchRoom = (socket, serverInfo) => {
  if(serverInfo.gameLoading) {
    socket.emit('finished-loading', {})

    serverInfo.gameLoading = false
  }
} 

export default loadWatchRoom   