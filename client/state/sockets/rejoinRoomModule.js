const loadRejoinRoom = (socket, serverInfo, div) => {
	// if we have rejoined the room ...
	if(serverInfo.rejoin) {
		let p1 = document.createElement("p")
	    p1.innerHTML = "Succesfully rejoined the room!"
	    div.appendChild(p1)

	    serverInfo.rejoin = false

	    // if we were already done for this phase
		if(serverInfo.playerDone) {
			let p2 = document.createElement("p")
		    p2.innerHTML = "You already did your job for this game phase, so you can relax."
		    div.appendChild(p2)

			return true
		} else {
			return false
		}
	}
	return false
} 

export default loadRejoinRoom 