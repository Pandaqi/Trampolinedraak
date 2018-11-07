export const mainStyle = {
	mainText: function(wordWrapWidth = 1000, fill = "#333") { 
		return {font: "bold 26px Arial", fill: fill, wordWrap: true, wordWrapWidth: wordWrapWidth }
	},

	subText: function(wordWrapWidth = 1000, fill = "#666") {
		return {font: "bold 12px Arial", fill: fill, wordWrap: true, wordWrapWidth: wordWrapWidth }
	},

	timerText: function() {
		return {font: "bold 26px Arial", fill: "#FF0000" }
	}
}