!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=4)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.serverInfo={SERVER_IP:"https://trampolinedraak.herokuapp.com",socket:null,server:null,roomCode:"",vip:!1,rank:-1,playerCount:-1,timer:0,drawing:null,guesses:null,finalGuessResults:null,finalScores:null}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.playerColors=["#e6194b","#3cb44b","#ffe119","#4363d8","#f58231","#911eb4","#46f0f0","#f032e6","#bcf60c","#fabebe","#008080","#e6beff","#9a6324","#800000","#aaffc3","#808000","#ffd8b1","#000075","#808080","#000000"]},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.gameTimer=function(e){e.timer>0?(e.timer-=e.game.time.elapsed/1e3,e.timerText.text=Math.ceil(e.timer)):e.timerText.text="Time's up!"},t.controllerTimer=function(e,t,n){t.vip&&(e.timer>0?e.timer-=e.game.time.elapsed/1e3:t.socket.emit("timer-complete",{nextState:n}))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(8),o=function(e){return e&&e.__esModule?e:{default:e}}(r),i=function(e,t,n,r,i){if(e.cache.checkKey(Phaser.Cache.IMAGE,r))(0,o.default)(e,t,n,r);else{var a=new Phaser.Loader(e);a.image(r,i+""),a.onLoadComplete.addOnce(o.default,void 0,0,e,t,n,r),a.start()}};t.default=i},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=(n(5),n(6)),s=r(u),c=n(7),l=r(c),f=n(10),d=r(f),p=n(11),h=r(p),m=n(12),y=r(m),v=n(13),b=r(v),g=n(14),w=r(g),_=n(15),O=r(_),P=n(16),k=r(P),E=n(17),I=r(E),j=n(18),T=r(j),x=n(19),C=r(x),M=n(20),S=r(M),L=n(21),R=r(L),G=n(22),H=r(G),B=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,"100%","100%",Phaser.AUTO,"canvas-container"));return e.state.add("Menu",s.default),e.state.add("GameWaiting",l.default),e.state.add("GameSuggestions",d.default),e.state.add("GameDrawing",h.default),e.state.add("GameGuessing",y.default),e.state.add("GameGuessingPick",b.default),e.state.add("GameGuessingResults",w.default),e.state.add("GameOver",O.default),e.state.add("ControllerWaiting",k.default),e.state.add("ControllerSuggestions",I.default),e.state.add("ControllerDrawing",T.default),e.state.add("ControllerGuessing",C.default),e.state.add("ControllerGuessingPick",S.default),e.state.add("ControllerGuessingResults",R.default),e.state.add("ControllerOver",H.default),e.state.start("Menu"),e}return a(t,e),t}(Phaser.Game),W=new B;Element.prototype.remove=function(){this.parentElement.removeChild(this)},NodeList.prototype.remove=HTMLCollection.prototype.remove=function(){for(var e=this.length-1;e>=0;e--)this[e]&&this[e].parentElement&&this[e].parentElement.removeChild(this[e])},t.default=W},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.WINDOW_WIDTH=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,t.WINDOW_HEIGHT=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,t.WORLD_SIZE={width:1600,height:1200},t.ASSETS_URL="../assets"},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){this.game.load.crossOrigin="Anonymous",this.game.stage.backgroundColor="#EEEEEE",this.game.stage.disableVisibilityChange=!0}},{key:"create",value:function(){console.log("Menu state");var e=this.game;document.getElementById("createRoomBtn").onclick=function(){this.disabled=!0,u.serverInfo.socket=io(u.serverInfo.SERVER_IP);var t=u.serverInfo.socket;t.on("connect",function(){t.emit("new-room",{})}),t.on("room-created",function(t){u.serverInfo.roomCode=t.roomCode,document.getElementById("main").style.display="none",e.state.start("GameWaiting")})},document.getElementById("joinRoomBtn").onclick=function(){var t=this;t.disabled=!0;var n=document.getElementsByClassName("joinInput"),r=n[0].value.toUpperCase(),o=n[1].value.toUpperCase();console.log(r+" || "+o),u.serverInfo.socket=io(u.serverInfo.SERVER_IP);var i=u.serverInfo.socket;i.on("connect",function(){i.emit("join-room",{roomCode:r,userName:o})}),i.on("join-response",function(n){n.success?(document.getElementById("main").style.display="none",u.serverInfo.vip=n.vip,u.serverInfo.roomCode=r,u.serverInfo.rank=n.rank,e.state.start("ControllerWaiting")):(document.getElementById("err-message").innerHTML=n.err,t.disabled=!1,i.disconnect(!0))})},document.getElementById("watchRoomBtn").onclick=function(){var t=this;t.disabled=!0;var n=document.getElementsByClassName("joinInput")[2].value.toUpperCase();u.serverInfo.socket=io(u.serverInfo.SERVER_IP);var r=u.serverInfo.socket;r.on("connect",function(){r.emit("watch-room",{roomCode:n})}),r.on("watch-response",function(n){n.success?(document.getElementById("overlay").remove(),e.state.start("Game")):(document.getElementById("err-message").innerHTML=n.err,t.disabled=!1,r.disconnect(!0))})}}},{key:"update",value:function(){}}]),t}(Phaser.State);t.default=s},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),c=n(3),l=r(c),f=n(1),d=n(9),p=r(d),h=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return a(t,e),u(t,[{key:"preload",value:function(){var e=this.game;e.scale.scaleMode=Phaser.ScaleManager.RESIZE,window.addEventListener("resize",function(){e.scale.refresh()}),e.scale.refresh()}},{key:"create",value:function(){var e=this.game,t={font:"bold 32px Arial",fill:"#333"};e.add.text(.5*e.width,20,"ROOM: "+s.serverInfo.roomCode,t).anchor.setTo(.5,0);var n=s.serverInfo.socket;n.on("new-player",function(n){console.log(f.playerColors),console.log(n.rank),t={font:"bold 32px Arial",fill:f.playerColors[n.rank]};var r=.5*e.width,o=100+60*n.rank;e.add.text(r,o,n.name,t).anchor.setTo(0,.5)}),n.on("player-updated-profile",function(t){if(null!=t.profile){var n=t.profile,r="profileImage"+t.name,o=.5*e.width,i=100+60*t.rank;(0,l.default)(e,{x:o-100,y:i},{width:60,height:78},r,n)}}),n.on("setup-info",function(e){s.serverInfo.playerCount=e}),n.on("player-done",function(t){console.log("Player done ("+t.name+")");var n=t.rank/s.serverInfo.playerCount*2*Math.PI,r=.5*e.height/1.3,o=.5*e.width,i=.8*Math.min(r,o);(0,p.default)(e,.5*e.width+Math.cos(n)*i,.5*e.height+Math.sin(n)*i*1.3,f.playerColors[t.rank],t)}),n.on("next-state",function(t){s.serverInfo.timer=t.timer,e.state.start("Game"+t.nextState)}),n.on("return-drawing",function(e){s.serverInfo.drawing=e}),n.on("force-disconnect",function(e){n.disconnect(!0),window.location.reload(!1)}),console.log("Game waiting state")}},{key:"shutdown",value:function(){var e=s.serverInfo.socket;e.off("new-player"),e.off("player-updated-profile"),e.off("setup-info")}},{key:"update",value:function(){}}]),t}(Phaser.State);t.default=h},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(e,t,n,r){var o=e.add.sprite(t.x,t.y,r);o.width=n.width,o.height=n.height,o.anchor.setTo(.5,.5)};t.default=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(3),o=function(e){return e&&e.__esModule?e:{default:e}}(r),i=function(e,t,n,r,i){var a={font:"bold 32px Arial",fill:r};if(e.add.text(t,n,i.name,a).anchor.setTo(0,.5),null!=i.profile){var u=i.profile,s="profileImage"+i.name;(0,o.default)(e,{x:t-100,y:n},{width:60,height:78},s,u)}};t.default=i},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=n(2),c=(n(1),function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=(u.serverInfo.socket,{font:"bold 32px Arial",fill:"#333",wordWrap:!0,wordWrapWidth:.8*e.width});e.add.text(.5*e.width,20,"Look at your screen. Fill in the suggestions and submit!",t).anchor.setTo(.5,0),this.timerText=e.add.text(.5*e.width,.5*e.height,"",t),this.timer=u.serverInfo.timer,console.log("Game Suggestions state")}},{key:"shutdown",value:function(){}},{key:"update",value:function(){(0,s.gameTimer)(this)}}]),t}(Phaser.State));t.default=c},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=n(3),c=(function(e){e&&e.__esModule}(s),n(2)),l=(n(1),function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=(u.serverInfo.socket,{font:"bold 32px Arial",fill:"#333",wordWrap:!0,wordWrapWidth:.8*e.width});e.add.text(.5*e.width,20,"Draw the suggestion shown on your screen!",t).anchor.setTo(.5,0),this.timerText=e.add.text(.5*e.width,.5*e.height,"",t),this.timer=u.serverInfo.timer,console.log("Game Drawing state")}},{key:"shutdown",value:function(){}},{key:"update",value:function(){(0,c.gameTimer)(this)}}]),t}(Phaser.State));t.default=l},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=n(3),c=function(e){return e&&e.__esModule?e:{default:e}}(s),l=n(2),f=(n(1),function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=u.serverInfo.socket,n={font:"bold 32px Arial",fill:"#333"};e.add.text(.5*e.width,20,"What do you think this drawing represents?",n).anchor.setTo(.5,0);var r=.5*e.height/1.3,o=.5*e.width,i=Math.min(r,o),a="finalImage"+u.serverInfo.drawing.name,s=u.serverInfo.drawing.dataURI;(0,c.default)(e,{x:.5*e.width,y:.5*e.height},{width:i,height:1.3*i},a,s),this.timerText=e.add.text(.5*e.width,60,"",n),this.timer=u.serverInfo.timer,t.on("return-guesses",function(e){u.serverInfo.guesses=e}),console.log("Game Guessing state")}},{key:"shutdown",value:function(){u.serverInfo.socket.off("return-guesses")}},{key:"update",value:function(){(0,l.gameTimer)(this)}}]),t}(Phaser.State));t.default=f},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=n(3),c=function(e){return e&&e.__esModule?e:{default:e}}(s),l=n(2),f=(n(1),function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=u.serverInfo.socket,n={font:"bold 32px Arial",fill:"#333"};e.add.text(.5*e.width,20,"Hmm, which one is the correct title?",n).anchor.setTo(.5,0);var r=.5*e.height/1.3,o=.5*e.width,i=Math.min(r,o),a="finalImage"+u.serverInfo.drawing.name,s=u.serverInfo.drawing.dataURI;(0,c.default)(e,{x:.5*e.width,y:.5*e.height},{width:i,height:1.3*i},a,s);for(var l=u.serverInfo.guesses,f=0;f<l.length;f++){var d=f/l.length*2*Math.PI;e.add.text(.5*e.width+Math.cos(d)*i,.5*e.height+Math.sin(d)*i*1.3,l[f],n).anchor.setTo(.5,.5)}this.timerText=e.add.text(.5*e.width,60,"",n),this.timer=u.serverInfo.timer,t.on("final-guess-results",function(e){u.serverInfo.finalGuessResults=e}),console.log("Game Guessing Pick state")}},{key:"shutdown",value:function(){u.serverInfo.socket.off("final-guess-results")}},{key:"update",value:function(){(0,l.gameTimer)(this)}}]),t}(Phaser.State));t.default=f},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=n(3),c=(function(e){e&&e.__esModule}(s),n(1),function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=u.serverInfo.socket,n={font:"bold 32px Arial",fill:"#333"};e.add.text(.5*e.width,20,"Let's see how you did!",n).anchor.setTo(.5,0);var r=u.serverInfo.finalGuessResults;console.log(r);var o=0;for(var i in r){n={font:"bold 32px Arial",fill:"#333"},r[i].correct&&(n.fill="#237a23");e.add.text(.5*e.width,80+80*o,i,n).anchor.setTo(.5,.5),n={font:"16px Arial",fill:"#333"};if(e.add.text(.5*e.width,80+80*o+32,"Guessed by: "+r[i].whoGuessedIt.join(", "),n).anchor.setTo(.5,.5),!r[i].correct){n={font:"16px Arial",fill:"#333"};e.add.text(.5*e.width,80+80*o+50,"Written by: "+r[i].name,n).anchor.setTo(.5,.5)}o++}t.on("final-scores",function(e){u.serverInfo.finalScores=e}),console.log("Game Guessing Results state")}},{key:"shutdown",value:function(){u.serverInfo.socket.off("final-scores")}},{key:"update",value:function(){}}]),t}(Phaser.State));t.default=c},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=n(1),c=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=(u.serverInfo.socket,{font:"bold 32px Arial",fill:"#333"});e.add.text(.5*e.width,20,"FINAL SCORE",t).anchor.setTo(.5,0);for(var n=u.serverInfo.finalScores,r=Object.keys(n).sort(function(e,t){return n[t].score-n[e].score}),o=0,i=0;i<r.length;i++){var a=n[r[i]];t.fill=s.playerColors[a.rank];e.add.text(.5*e.width,60+40*o,"Player: "+a.name+" | Score: "+a.score,t).anchor.setTo(.5,.5),o++}console.log("Game Over state")}},{key:"update",value:function(){}}]),t}(Phaser.State);t.default=c},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=n(1),c=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=u.serverInfo.socket,n=document.getElementById("main-controller"),r=document.createElement("p");r.innerHTML="Draw yourself a profile pic!",n.appendChild(r);var o=document.getElementById("canvas-container");n.appendChild(o);var i=document.getElementById("main-controller").clientWidth,a=1.3*i;e.scale.setGameSize(i,a),this.bmd=e.add.bitmapData(e.width,e.height),this.bmd.ctx.strokeStyle=s.playerColors[u.serverInfo.rank],this.bmd.ctx.lineWidth=10,this.bmd.ctx.lineCap="round",this.bmd.ctx.fillStyle="#ff0000",this.sprite=e.add.sprite(0,0,this.bmd),this.bmd.isDragging=!1,this.bmd.lastPoint=null;var c=this.bmd,l=document.createElement("button");if(l.innerHTML="Submit drawing",l.addEventListener("click",function(e){var n=c.canvas.toDataURL();t.emit("submit-drawing",{dataURI:n,type:"profile"}),l.remove(),o.style.display="none",u.serverInfo.vip||(r.innerHTML="Waiting for game to start ...")}),n.appendChild(l),u.serverInfo.vip){var f=document.createElement("p");f.innerHTML="You are VIP. Start the game when you're ready.",n.appendChild(f);var d=document.createElement("button");d.innerHTML="START GAME",d.addEventListener("click",function(e){d.disabled||(d.disabled=!0,t.emit("start-game",{}))}),n.appendChild(d)}t.on("next-state",function(t){u.serverInfo.timer=t.timer,o.style.display="none",document.body.appendChild(o),n.innerHTML="",e.state.start("Controller"+t.nextState)}),t.on("return-drawing",function(e){u.serverInfo.drawing=e}),t.on("force-disconnect",function(e){t.disconnect(!0),window.location.reload(!1)}),console.log("Controller Waiting state")}},{key:"update",value:function(){if(this.game.input.activePointer.isUp&&(this.bmd.isDragging=!1,this.bmd.lastPoint=null),this.game.input.activePointer.isDown){console.log("down"),this.bmd.isDragging=!0,this.bmd.ctx.beginPath();var e=new Phaser.Point(this.game.input.x,this.game.input.y);this.bmd.lastPoint&&(this.bmd.ctx.moveTo(this.bmd.lastPoint.x,this.bmd.lastPoint.y),this.bmd.ctx.lineTo(e.x,e.y)),this.bmd.lastPoint=e,this.bmd.ctx.stroke(),this.bmd.dirty=!0}}}]),t}(Phaser.State);t.default=c},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=n(2),c=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=(this.game,u.serverInfo.socket),t=document.getElementById("main-controller"),n=(document.getElementById("canvas-container"),document.createElement("p"));n.innerHTML="Please give me a noun, verb, adjective and adverb (in that order)",t.appendChild(n);var r=document.createElement("input");r.type="text",r.placeholder="noun (e.g. elephant)",t.appendChild(r);var o=document.createElement("input");o.type="text",o.placeholder="verb with -ing (e.g. swimming)",t.appendChild(o);var i=document.createElement("input");i.type="text",i.placeholder="adjective (e.g. beautiful)",t.appendChild(i);var a=document.createElement("input");a.type="text",a.placeholder="adverb (e.g. carefully)",t.appendChild(a);var s=document.createElement("button");s.innerHTML="Submit",s.addEventListener("click",function(t){for(var u=[r.value,o.value,i.value,a.value],c=0;c<u.length;c++)if(""==u[c]||u[c].length<1)return;e.emit("submit-suggestion",{suggestion:u}),r.remove(),o.remove(),i.remove(),a.remove(),s.remove(),n.innerHTML="Thanks for your suggestions!"}),t.appendChild(s),this.timer=u.serverInfo.timer,e.on("drawing-title",function(e){u.serverInfo.drawingTitle=e.title}),console.log("Controller Suggestions state")}},{key:"shutdown",value:function(){u.serverInfo.socket.off("drawing-title")}},{key:"update",value:function(){(0,s.controllerTimer)(this,u.serverInfo,"Drawing")}}]),t}(Phaser.State);t.default=c},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=n(2),c=n(1),l=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=u.serverInfo.socket,n=document.getElementById("main-controller"),r=!1,o=document.createElement("p");o.innerHTML='Draw this: <span class="titleSuggestion">'+u.serverInfo.drawingTitle+"</span>",n.appendChild(o);var i=document.getElementById("canvas-container");i.style.display="block",n.appendChild(i);var a=document.getElementById("main-controller").clientWidth,s=1.3*a;e.scale.setGameSize(a,s),this.bmd=e.add.bitmapData(e.width,e.height),this.bmd.ctx.strokeStyle=c.playerColors[u.serverInfo.rank],this.bmd.ctx.lineWidth=10,this.bmd.ctx.lineCap="round",this.bmd.ctx.fillStyle="#ff0000",this.sprite=e.add.sprite(0,0,this.bmd),this.bmd.isDragging=!1,this.bmd.lastPoint=null;var l=this.bmd,f=document.createElement("button");f.innerHTML="Submit drawing",f.addEventListener("click",function(e){f.remove();var n=l.canvas.toDataURL();t.emit("submit-drawing",{dataURI:n,type:"ingame"}),i.style.display="none",o.innerHTML="That drawing is ... let's say, something special.",r=!0}),n.appendChild(f),t.on("fetch-drawing",function(e){if(!r){var n=l.canvas.toDataURL();t.emit("submit-drawing",{dataURI:n,type:"ingame"}),t.off("fetch-drawing")}}),this.timer=u.serverInfo.timer,console.log("Controller Drawing state")}},{key:"shutdown",value:function(){}},{key:"update",value:function(){if(this.game.input.activePointer.isUp&&(this.bmd.isDragging=!1,this.bmd.lastPoint=null),this.game.input.activePointer.isDown){console.log("down"),this.bmd.isDragging=!0,this.bmd.ctx.beginPath();var e=new Phaser.Point(this.game.input.x,this.game.input.y);this.bmd.lastPoint&&(this.bmd.ctx.moveTo(this.bmd.lastPoint.x,this.bmd.lastPoint.y),this.bmd.ctx.lineTo(e.x,e.y)),this.bmd.lastPoint=e,this.bmd.ctx.stroke(),this.bmd.dirty=!0}(0,s.controllerTimer)(this,u.serverInfo,"Guessing")}}]),t}(Phaser.State);t.default=l},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=n(2),c=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=(this.game,u.serverInfo.socket),t=document.getElementById("main-controller");document.getElementById("canvas-container");if(u.serverInfo.drawing.id==e.id){var n=document.createElement("p");n.innerHTML="This is your drawing. I hope you're happy with yourself.",t.appendChild(n)}else{var r=document.createElement("p");r.innerHTML="What do you think this drawing means?",t.appendChild(r);var o=document.createElement("input");o.type="text",o.placeholder="your guess ...",t.appendChild(o);var i=document.createElement("button");i.innerHTML="Submit guess",i.addEventListener("click",function(t){e.emit("submit-guess",o.value),i.remove(),o.remove(),r.innerHTML="Wow ... you're so creative!"}),t.appendChild(i)}this.timer=u.serverInfo.timer,e.on("return-guesses",function(e){u.serverInfo.guesses=e}),console.log("Controller Guessing state")}},{key:"shutdown",value:function(){u.serverInfo.socket.off("return-guesses")}},{key:"update",value:function(){(0,s.controllerTimer)(this,u.serverInfo,"GuessingPick")}}]),t}(Phaser.State);t.default=c},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=n(2),c=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=(this.game,u.serverInfo.socket),t=document.getElementById("main-controller"),n=(document.getElementById("canvas-container"),u.serverInfo.guesses);if(u.serverInfo.drawing.id==e.id){var r=document.createElement("p");r.innerHTML="Still your drawing. Sit back and relax.",t.appendChild(r)}else!function(){var r=document.createElement("p");r.innerHTML="Which of these do you think is the correct title?",t.appendChild(r);var o=document.createElement("span");t.appendChild(o);for(var i=0;i<n.length;i++)!function(t){var i=document.createElement("button"),a=n[t];i.innerHTML=a,i.value=a,i.addEventListener("click",function(t){e.emit("vote-guess",a),r.innerHTML="Really? You think it's that?!",o.remove()}),o.appendChild(i)}(i)}();this.timer=u.serverInfo.timer,console.log("Controller Guessing Pick state")}},{key:"update",value:function(){(0,s.controllerTimer)(this,u.serverInfo,"GuessingResults")}}]),t}(Phaser.State);t.default=c},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=(this.game,u.serverInfo.socket),t=document.getElementById("main-controller");document.getElementById("canvas-container");if(u.serverInfo.vip)if(u.serverInfo.drawing.lastDrawing){var n=document.createElement("p");n.innerHTML="That was it for this round! At the game over screen, you can play another round or stop the game.",t.appendChild(n);var r=document.createElement("button");r.innerHTML="Go to game over",r.addEventListener("click",function(t){e.emit("timer-complete",{nextState:"Over",certain:!0})}),t.appendChild(r)}else{var o=document.createElement("p");o.innerHTML="Tap the button below whenever you want to start the next drawing",t.appendChild(o);var i=document.createElement("button");i.innerHTML="Load next drawing!",i.addEventListener("click",function(t){e.emit("timer-complete",{nextState:"Guessing",certain:!0})}),t.appendChild(i)}else{var a=document.createElement("p");a.innerHTML="That was it for this round! Please wait for the VIP to start the next round.",t.appendChild(a)}console.log("Controller Guessing Results state")}},{key:"update",value:function(){}}]),t}(Phaser.State);t.default=s},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=(this.game,u.serverInfo.socket),t=document.getElementById("main-controller"),n=(document.getElementById("canvas-container"),document.createElement("p"));if(n.innerHTML="Are you happy with your score? If not, TOO BAD.",t.appendChild(n),u.serverInfo.vip){var r=document.createElement("p");r.innerHTML="You can either start the next round (same room, same players, you keep your score), or end the game.",t.appendChild(r);var o=document.createElement("button");o.innerHTML="Start next round!",o.addEventListener("click",function(t){e.emit("timer-complete",{nextState:"Suggestions",certain:!0})}),t.appendChild(o);var i=document.createElement("button");i.innerHTML="Destroy the game!",i.addEventListener("click",function(t){e.emit("destroy-game",{})}),t.appendChild(i)}console.log("Controller Over state")}},{key:"update",value:function(){}}]),t}(Phaser.State);t.default=s}]);