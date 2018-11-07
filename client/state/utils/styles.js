export const mainStyle = {
	mainText: function(wordWrapWidth = 1000, fill = "#333") { 
		return {font: "bold 32px Arial", fill: fill, wordWrap: true, wordWrapWidth: wordWrapWidth }
	},

	subText: function(wordWrapWidth = 1000, fill = "#666") {
		return {font: "bold 16px Arial", fill: fill, wordWrap: true, wordWrapWidth: wordWrapWidth }
	},

	timerText: function() {
		return {font: "bold 32px Arial", fill: "#FF0000" }
	}
}