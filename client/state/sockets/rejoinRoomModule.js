const loadRejoinRoom = (socket, serverInfo, div) => {
	// if we have rejoined the room ...
	if(serverInfo.rejoin) {
		let p1 = document.createElement("p")
	    p1.innerHTML = serverInfo.translate("succesful-rejoin") 
	    div.appendChild(p1)

	    serverInfo.rejoin = false

	    // if we were already done for this phase
		if(serverInfo.playerDone) {
			let p2 = document.createElement("p")
		    p2.innerHTML = serverInfo.translate('player-already-done')
		    div.appendChild(p2)

			return true
		} else {
			return false
		}
	}
	return false
} 

export default loadRejoinRoom 