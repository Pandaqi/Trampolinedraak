const loadGUIOverlay = (gm, serverInfo, style1, style2) => {
  	// display the room code
	let text = gm.add.text(gm.width - 20, 20, serverInfo.roomCode, style1);
	text.anchor.setTo(1.0, 0)

	//display text above it to make clear that this is a room code
	let text2 = gm.add.text(gm.width - 20, 20 + 12, serverInfo.translate('room').toUpperCase(), style2);
	text2.anchor.setTo(1.0, 1.0)
} 

export default loadGUIOverlay