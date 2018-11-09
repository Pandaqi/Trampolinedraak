# Trampolinedraak

This game is being developed as an experiment. We, at home, really love the Jackbox games, where you start the game on the computer and use your smartphones/tablets as the game controllers. But, as always, we wanted more! So I am creating a framework for these kinds of games, hosted on a free Heroku server, and will build my own on top of it.

You can access the server [here](https://trampolinedraak.herokuapp.com).

# How to play the game?
Pick any monitor with browser capabilities. Go to the server (link above) and click "Create Room". This screen will now serve as the game screen. If succesful, it returns a room code.

Now, any player that wants to play, can grab their smartphone, go to the same website, fill in the correct room code (and pick a username), and press "Join Room".

Once everybody's in, the first player that connected to the room (who is called the VIP) can click a button to start the game.

From that moment on, everything is very straightforward and explained well in the game.


# Build Setup
```bash
# To install, just go to the root folder and run
npm i

# To build the files run
npm run build

# To run as dev
npm run dev

# To run as prod
npm run start
```
