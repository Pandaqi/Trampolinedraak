// replace this with 'http://localhost:8000' to test locally
// use 'https://trampolinedraak.herokuapp.com' for production
const serverInfo = {
  SERVER_IP: /*'http://localhost:8000',*/ 'https://trampolinedraak.herokuapp.com',
  socket: null,
  server: null,
  roomCode: '',
  vip: false,
  rank: -1,
  playerCount: -1,

  timer: 0,

  drawingTitle: "",
  drawing: null,
  guesses: null,
  finalGuessResults: null,
  finalScores: null,

  gameLoading: false,
  paused: false,
  playerDone: false,
  rejoin: false,

  language: 'en',
}

// language/translator object
// serverInfo gets the language used in-game from the server, and also provides the translate function
// not the cleanest approach ...
let LANG = {}

// english
LANG['en'] = {
  'room': 'room',

  'game-waiting-1': 'Players can now join the game!',
  'game-suggestions-1': "Look at your screen. Fill in the suggestions and submit!",
  'game-drawing-1': "Draw the suggestion shown on your screen!",
  'game-guessing-1': "What do you think this drawing represents?",
  'game-guessing-pick-1': "Hmm, which one is the correct title?",
  'game-guessing-results-1': "Let's see how you did!",
  'game-over-1': "Final scores",

  'game-paused': "Game paused",
  'player': 'Player',
  'score': 'Score',
  'succesful-rejoin': "Succesfully rejoined the room!",
  'player-already-done': "You already did your job for this game phase, so you can relax.",
  'submit-guess': 'Submit guess',
  'guess-placeholder': "your guess ...",

  'vip-message-waiting': "You are VIP. Start the game when you're ready.",
  'start-game': "Start game",
  'submit-drawing': "Submit drawing",
  'submit': 'Submit',
  'controller-waiting-1': "Draw yourself a profile pic!",
  'controller-waiting-2': 'Waiting for game to start ...',

  'controller-suggestions-1': "Please give me a noun, verb, adjective and adverbial clause (in that order)",
  'controller-suggestions-noun': "noun (e.g. elephant, tables, etc.)",
  'controller-suggestions-verb': "verb with -ing (e.g. swimming)",
  'controller-suggestions-adjective': "adjective (e.g. beautiful)",
  'controller-suggestions-adverb': "adverb (e.g. carefully, to the beach, while sleeping, etc.)",
  'controller-suggestions-2': 'Thanks for your suggestions!',

  'controller-drawing-1': "Draw this",
  'controller-drawing-2': "That drawing is ... let's say, something special.",

  'controller-guessing-1': "This is your drawing. I hope you're happy with yourself.",
  'controller-guessing-2': 'What do you think this drawing means?',
  'guess-already-exists': "Oh no! Your guess already exists (or you guessed the correct title immediately)! Try something else.",
  'controller-guessing-3': "Wow ... you're so creative!",

  'controller-guessing-pick-1': "Still your drawing. Sit back and relax.",
  'controller-guessing-pick-2': "Which of these do you think is the correct title?",
  'controller-guessing-pick-3': "Really? You think it's that?!",

  'go-game-over': "Go to game over",
  'load-next-drawing': "Load next drawing!",
  'loading-next-screen': 'Loading next screen ...',

  "controller-guessing-results-1": "That was it for this round! At the game over screen, you can play another round or stop the game.",
  "controller-guessing-results-2": "Tap the button below whenever you want to start the next drawing",
  "controller-guessing-results-3": "That was it for this round! Please wait for the VIP to start the next round.",

  'controller-over-1': "Are you happy with your score? If not, TOO BAD.",
  'controller-over-2': "You can either start the next round (same room, same players, you keep your score), or end the game.",
  'start-next-round': "Start next round!",
  'destroy-game': "Destroy the game!",
  'continue-game': 'Continue game',

  'player-disconnect-1': "Oh no! Player(s) disconnected!",
  'player-disconnect-2': "You can wait until the player(s) rejoin. (To do so, they must rejoin the same room with the exact same name.) You can also continue without them, or stop the game completely.",
}

// dutch
LANG['nl'] = {
  'room': 'kamercode',

  'game-waiting-1': 'Spelers kunnen zich nu aanmelden!',
  'game-suggestions-1': "Kijk op je scherm. Vul de suggesties in en klik op versturen!",
  'game-drawing-1': "Teken de suggestie die nu op je scherm verschijnt!",
  'game-guessing-1': "Wat denk jij dat de onderstaande tekening moet voorstellen?",
  'game-guessing-pick-1': "Hmm, welke van onderstaande titels is de juiste volgens jou?",
  'game-guessing-results-1': "Laten we eens kijken hoe iedereen het gedaan heeft ...",
  'game-over-1': 'Eindstand',

  'game-paused': 'Spel gepauzeerd',
  'player': 'Speler',
  'score': 'Score',
  'succesful-rejoin': "Rejoinen met de kamer was succesvol!",
  'player-already-done': "Je hebt je actie al gedaan voor deze spelfase, dus relax en wacht op de rest.",
  'submit-guess': 'Verstuur gok',
  'guess-placeholder': "jouw gok ..",

  'vip-message-waiting': "Jij bent de VIP (spelleider). Start het spel wanneer alle spelers gereed zijn.",
  'start-game': "Start het spel",
  'submit-drawing': "Verstuur tekening",
  'submit': 'Verstuur',
  'controller-waiting-1': "Teken een leuke profielfoto voor jezelf!",
  'controller-waiting-2': 'Aan het wachten todat de VIP het spel begint ...',

  'controller-suggestions-1': "Vul hieronder een zelfstandig naamwoord, werkwoord, bijvoeglijk naamwoord en bijzin in (op die volgorde)",
  'controller-suggestions-noun': "znw (olifant, tafels, etc.)",
  'controller-suggestions-verb': "ww op -de (zwemmende, springende, etc.)",
  'controller-suggestions-adjective': "bnw (mooie, domme, snelle, etc.)",
  'controller-suggestions-adverb': "bijzin (voorzichtig, naar het strand, etc.)",
  'controller-suggestions-2': 'Dank voor je suggesties!',

  'controller-drawing-1': 'Probeer dit te tekenen',
  'controller-drawing-2': "Die tekening is ... laten we zeggen, artistiek.",

  'controller-guessing-1': "Deze tekening heb jij gemaakt. Ik hoop dat je er blij mee bent.",
  'controller-guessing-2': 'Wat denk je dat deze tekening voorstelt?',
  'guess-already-exists': "Oh nee! Jouw gok is al door iemand anders gegokt, óf je hebt de juiste titel in één keer geraden. Probeer iets nieuws.",
  'controller-guessing-3': "Wow ... je bent zoooo creatief!",

  'controller-guessing-pick-1': "Dit is nog steeds jouw tekening. Leun achterover en relax.",
  'controller-guessing-pick-2': "Welke van deze titels is volgens jou de juiste?",
  'controller-guessing-pick-3': "... serieus? Je denkt dat dat de echte titel is?!",

  'go-game-over': "Ga naar game over",
  'load-next-drawing': "Laad de volgende tekening!",
  'loading-next-screen': 'Volgende scherm is aan het laden ...',

  "controller-guessing-results-1": "Dit is het eind van de ronde! Op het game over scherm kun jij kiezen om nog een ronde te spelen, of te stoppen.",
  "controller-guessing-results-2": "Klik op de knop hieronder wanneer je de volgende tekening wilt laden.",
  "controller-guessing-results-3": "Dit is het eind van deze ronde! Wacht aub totdat de VIP de volgende ronde begint.",

  'controller-over-1': "Ben je blij met je score? Zo ja, doe een dansje. Zo niet, JAMMER DAN.",
  'controller-over-2': "Je kunt de volgende ronde beginnen (zelfde kamer, zelfde spelers, score blijft behouden), óf het spel geheel eindigen",
  'start-next-round': "Start de volgende ronde!",
  'destroy-game': "Vernietig dit spel!",
  'continue-game': 'Ga door met het spel',

  'player-disconnect-1': "Oh nee! Een of meerdere speler(s) zijn hun verbinding verloren!",
  'player-disconnect-2': "Je kunt wachten tot alle spelers weer opnieuw verbonden zijn. (Om dat te doen, moeten ze exact dezelfde kamer met exact dezelfde gebruikersnaam joinen.) Je kunt ook kiezen om zonder hen verder te spelen, of het spel compleet te beëindigen.",
}

serverInfo.translate = function(key) {
  let curlang = this.language

  // if language doesn't exist, use english as default
  if(LANG[curlang] == undefined || LANG[curlang][key] == undefined) {
    curlang = 'en'
  }

  if(LANG[curlang][key] == undefined) {
    return ' <- string cannot be translated ->'
  } else {
    return LANG[curlang][key]
  }
}

export { serverInfo }
