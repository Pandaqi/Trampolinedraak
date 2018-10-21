!function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.serverInfo={SERVER_IP:"http://localhost:8000",socket:null,server:null,roomCode:"",vip:!1}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s=(n(2),n(3)),u=o(s),l=n(4),c=o(l),f=n(5),p=o(f),d=n(6),h=o(d),m=n(7),b=o(m),y=n(8),v=o(y),g=n(9),w=o(g),_=n(10),O=o(_),P=n(11),E=o(P),j=n(12),x=o(j),k=n(13),T=o(k),I=function(e){function t(){r(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,"100%","100%",Phaser.AUTO,"canvas-container"));return e.state.add("Menu",u.default),e.state.add("GameWaiting",c.default),e.state.add("GameSuggestions",p.default),e.state.add("GameDrawing",h.default),e.state.add("GameGuessing",b.default),e.state.add("GameGuessingPick",v.default),e.state.add("GameGuessingResults",w.default),e.state.add("GameOver",O.default),e.state.add("ControllerWaiting",E.default),e.state.add("ControllerSuggestions",x.default),e.state.add("ControllerDrawing",T.default),e.state.start("Menu"),e}return a(t,e),t}(Phaser.Game),C=new I;Element.prototype.remove=function(){this.parentElement.removeChild(this)},NodeList.prototype.remove=HTMLCollection.prototype.remove=function(){for(var e=this.length-1;e>=0;e--)this[e]&&this[e].parentElement&&this[e].parentElement.removeChild(this[e])},t.default=C},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.WINDOW_WIDTH=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,t.WINDOW_HEIGHT=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,t.WORLD_SIZE={width:1600,height:1200},t.ASSETS_URL="../assets"},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(0),u=function(e){function t(){return o(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){this.game.load.crossOrigin="Anonymous",this.game.stage.backgroundColor="#EEEEEE",this.game.stage.disableVisibilityChange=!0}},{key:"create",value:function(){console.log("Menu state");var e=this.game;document.getElementById("createRoomBtn").onclick=function(){this.disabled=!0,s.serverInfo.socket=io(s.serverInfo.SERVER_IP);var t=s.serverInfo.socket;t.on("connect",function(){t.emit("new-room",{})}),t.on("room-created",function(t){s.serverInfo.roomCode=t.roomCode,document.getElementById("main").style.display="none",e.state.start("GameWaiting")})},document.getElementById("joinRoomBtn").onclick=function(){var t=this;t.disabled=!0;var n=document.getElementsByClassName("joinInput"),o=n[0].value.toUpperCase(),r=n[1].value.toUpperCase();console.log(o+" || "+r),s.serverInfo.socket=io(s.serverInfo.SERVER_IP);var i=s.serverInfo.socket;i.on("connect",function(){i.emit("join-room",{roomCode:o,userName:r})}),i.on("join-response",function(n){n.success?(document.getElementById("main").style.display="none",s.serverInfo.vip=n.vip,s.serverInfo.roomCode=o,e.state.start("ControllerWaiting")):(document.getElementById("err-message").innerHTML=n.err,t.disabled=!1,i.disconnect(!0))})},document.getElementById("watchRoomBtn").onclick=function(){var t=this;t.disabled=!0;var n=document.getElementsByClassName("joinInput")[2].value.toUpperCase();s.serverInfo.socket=io(s.serverInfo.SERVER_IP);var o=s.serverInfo.socket;o.on("connect",function(){o.emit("watch-room",{roomCode:n})}),o.on("watch-response",function(n){n.success?(document.getElementById("overlay").remove(),e.state.start("Game")):(document.getElementById("err-message").innerHTML=n.err,t.disabled=!1,o.disconnect(!0))})}}},{key:"update",value:function(){}}]),t}(Phaser.State);t.default=u},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(0),u=function(e){function t(){o(this,t);var e=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.playerlist=null,e.listSprites=[],e}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this,t=["#e6194b","#3cb44b","#ffe119","#4363d8","#f58231","#911eb4","#46f0f0","#f032e6","#bcf60c","#fabebe","#008080","#e6beff","#9a6324","#800000","#aaffc3","#808000","#ffd8b1","#000075","#808080","#000000"],n=this.game,o={font:"bold 32px Arial",fill:"#333"};n.add.text(.5*n.width,20,"ROOM: "+s.serverInfo.roomCode,o).anchor.setTo(.5,0);var r=s.serverInfo.socket,i=this;r.on("update-playerlist",function(r){i.playerlist=r;for(var a=0;a<i.listSprites;a++)i.listSprites[a].destroy();i.listSprites=[];var s=0;for(var u in i.playerlist){o={font:"bold 32px Arial",fill:t[s]};var l=.5*n.width,c=80+60*s,f=n.add.text(l,c,r[u].name,o);if(i.listSprites.push(f),null!=r[u].profile){var p=r[u].profile,d="profileImage"+r[u].name;if(n.cache.checkKey(Phaser.Cache.IMAGE,d))e.loadImageComplete(n,i.listSprites,l-100,c-30,d);else{var h=new Phaser.Loader(n);h.image(d,p+""),h.onLoadComplete.addOnce(e.loadImageComplete,e,0,n,i.listSprites,l-100,c-30,d),h.start()}}s++}}),r.on("game-started",function(e){n.state.start("GameSuggestions")}),console.log("Game waiting state")}},{key:"loadImageComplete",value:function(e,t,n,o,r){var i=e.add.sprite(n,o,r);i.width=60,i.height=78,t.push(i)}},{key:"update",value:function(){}}]),t}(Phaser.State);t.default=u},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(0),u=function(e){function t(){return o(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=s.serverInfo.socket,n={font:"bold 32px Arial",fill:"#333"};e.add.text(.5*e.width,20,"Please submit as many suggestions as you can!",n).anchor.setTo(.5,0),this.timerText=e.add.text(.5*e.width,.5*e.height,"",n),this.timer=15,console.log("Game Suggestions state"),t.on("next-state",function(t){e.state.start("Game"+t.nextState)})}},{key:"update",value:function(){this.timer>0?(this.timer-=this.game.time.elapsed/1e3,this.timerText.text=Math.ceil(this.timer)):this.timerText.text="Time's up!"}}]),t}(Phaser.State);t.default=u},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(0),u=function(e){function t(){return o(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=(s.serverInfo.socket,{font:"bold 32px Arial",fill:"#333"});e.add.text(.5*e.width,20,"Draw the suggestion shown on your screen!",t);this.timerText=e.add.text(.5*e.width,.5*e.height,"",t),this.timer=15,console.log("Game Drawing state")}},{key:"update",value:function(){this.timer>0?(this.timer-=this.game.time.elapsed/1e3,this.timerText.text=Math.ceil(this.timer)):this.timerText.text="Time's up!"}}]),t}(Phaser.State);t.default=u},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(0),u=function(e){function t(){return o(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=(s.serverInfo.socket,{font:"bold 32px Arial",fill:"#333"});e.add.text(.5*e.width,20,"What do you think this drawing represents?",t).anchor.setTo(.5,0),this.timerText=e.add.text(.5*e.width,.5*e.height,"",t),this.timer=15,console.log("Game Guessing state")}},{key:"update",value:function(){this.timer>0?(this.timer-=this.game.time.elapsed/1e3,this.timerText.text=Math.ceil(this.timer)):this.timerText.text="Time's up!"}}]),t}(Phaser.State);t.default=u},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(0),u=function(e){function t(){return o(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=(s.serverInfo.socket,{font:"bold 32px Arial",fill:"#333"});e.add.text(.5*e.width,20,"Hmm, which one is the correct title?",t).anchor.setTo(.5,0),this.timerText=e.add.text(.5*e.width,.5*e.height,"",t),this.timer=15,console.log("Game Guessing Pick state")}},{key:"update",value:function(){this.timer>0?(this.timer-=this.game.time.elapsed/1e3,this.timerText.text=Math.ceil(this.timer)):this.timerText.text="Time's up!"}}]),t}(Phaser.State);t.default=u},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(0),u=function(e){function t(){return o(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=(s.serverInfo.socket,{font:"bold 32px Arial",fill:"#333"});e.add.text(.5*e.width,20,"Let's see how you did!",t).anchor.setTo(.5,0),console.log("Game Guessing Results state")}},{key:"update",value:function(){}}]),t}(Phaser.State);t.default=u},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(0),u=function(e){function t(){return o(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=(s.serverInfo.socket,{font:"bold 32px Arial",fill:"#333"});e.add.text(.5*e.width,20,"FINAL RESULTS",t).anchor.setTo(.5,0),console.log("Game Over state")}},{key:"update",value:function(){}}]),t}(Phaser.State);t.default=u},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(0),u=function(e){function t(){return o(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=s.serverInfo.socket,n=document.getElementById("main-controller"),o=document.createElement("p");o.innerHTML="Draw yourself a profile pic!",n.appendChild(o);var r=document.getElementById("canvas-container");n.appendChild(r);var i=document.getElementById("main-controller").clientWidth;console.log(i);var a=1.3*i;e.scale.setGameSize(i,a),this.bmd=e.add.bitmapData(e.width,e.height),this.bmd.ctx.strokeStyle="rgb( 77, 77, 77)",this.bmd.ctx.lineWidth=10,this.bmd.ctx.lineCap="round",this.bmd.ctx.fillStyle="#ff0000",this.sprite=e.add.sprite(0,0,this.bmd),this.bmd.isDragging=!1,this.bmd.lastPoint=null;var u=this.bmd,l=document.createElement("button");if(l.innerHTML="Submit drawing",l.addEventListener("click",function(e){var n=u.canvas.toDataURL();t.emit("submit-drawing",{dataURI:n,type:"profile"}),l.remove(),r.style.display="none",s.serverInfo.vip||(o.innerHTML="Waiting for game to start ...")}),n.appendChild(l),s.serverInfo.vip){var c=document.createElement("p");c.innerHTML="You are VIP. Start the game when you're ready.",n.appendChild(c);var f=document.createElement("button");f.innerHTML="START GAME",f.addEventListener("click",function(e){f.disabled||(f.disabled=!0,t.emit("start-game",{roomCode:s.serverInfo.roomCode}))}),n.appendChild(f)}t.on("game-started",function(t){document.body.appendChild(r),n.innerHTML="",e.state.start("ControllerSuggestions")}),console.log("Controller Waiting state")}},{key:"update",value:function(){if(this.game.input.activePointer.isUp&&(this.bmd.isDragging=!1,this.bmd.lastPoint=null),this.game.input.activePointer.isDown){console.log("down"),this.bmd.isDragging=!0,this.bmd.ctx.beginPath();var e=new Phaser.Point(this.game.input.x,this.game.input.y);this.bmd.lastPoint&&(this.bmd.ctx.moveTo(this.bmd.lastPoint.x,this.bmd.lastPoint.y),this.bmd.ctx.lineTo(e.x,e.y)),this.bmd.lastPoint=e,this.bmd.ctx.stroke(),this.bmd.dirty=!0}}}]),t}(Phaser.State);t.default=u},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(0),u=function(e){function t(){return o(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=s.serverInfo.socket,n=document.getElementById("main-controller"),o=document.createElement("p");o.innerHTML="Please give me a noun, verb, adjective and adverb (in that order)",n.appendChild(o);var r=document.createElement("input");r.type="text",r.placeholder="noun (e.g. elephant)",n.appendChild(r);var i=document.createElement("input");i.type="text",i.placeholder="verb with -ing (e.g. swimming)",n.appendChild(i);var a=document.createElement("input");a.type="text",a.placeholder="adjective (e.g. beautiful)",n.appendChild(a);var u=document.createElement("input");u.type="text",u.placeholder="adverb (e.g. carefully)",n.appendChild(u);var l=document.createElement("button");l.innerHTML="Submit",l.addEventListener("click",function(e){for(var n=[r.value,i.value,a.value,u.value],s=0;s<n.length;s++)if(""==n[s]||n[s].length<1)return;t.emit("submit-suggestion",{suggestion:n}),r.remove(),i.remove(),a.remove(),u.remove(),l.remove(),o.innerHTML="Thanks for your suggestions!"}),n.appendChild(l),this.timer=15,t.on("drawing-title",function(e){s.serverInfo.drawingTitle=e.title}),t.on("next-state",function(t){n.innerHTML="",e.state.start("Controller"+t.nextState)}),console.log("Controller Suggestions state")}},{key:"update",value:function(){if(s.serverInfo.vip)if(this.timer>0)this.timer-=this.game.time.elapsed/1e3;else{var e=s.serverInfo.socket;e.emit("timer-complete",{nextState:"Drawing"})}}}]),t}(Phaser.State);t.default=u},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(0),u=function(e){function t(){return o(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this))}return i(t,e),a(t,[{key:"preload",value:function(){}},{key:"create",value:function(){var e=this.game,t=s.serverInfo.socket,n=document.getElementById("main-controller"),o=document.createElement("p");o.innerHTML='Draw this: <span class="titleSuggestion">'+s.serverInfo.drawingTitle+"</span>",n.appendChild(o);var r=document.getElementById("canvas-container");r.style.display="block",n.appendChild(r);var i=document.getElementById("main-controller").clientWidth,a=1.3*i;e.scale.setGameSize(i,a),this.bmd=e.add.bitmapData(e.width,e.height),this.bmd.ctx.strokeStyle="rgb( 77, 77, 77)",this.bmd.ctx.lineWidth=10,this.bmd.ctx.lineCap="round",this.bmd.ctx.fillStyle="#ff0000",this.sprite=e.add.sprite(0,0,this.bmd),this.bmd.isDragging=!1,this.bmd.lastPoint=null;var u=this.bmd,l=document.createElement("button");l.innerHTML="Submit drawing",l.addEventListener("click",function(e){var n=u.canvas.toDataURL();t.emit("submit-drawing",{dataURI:n,type:"ingame"}),l.remove(),document.getElementById("canvas-container").style.display="none",o.innerHTML="That drawing is ... let's say, something special."}),n.appendChild(l),t.on("next-state",function(t){document.body.appendChild(r),document.getElementById("main-controller").innerHTML="",e.state.start("ControllerGuessing")}),console.log("Controller Drawing state")}},{key:"update",value:function(){if(this.game.input.activePointer.isUp&&(this.bmd.isDragging=!1,this.bmd.lastPoint=null),this.game.input.activePointer.isDown){console.log("down"),this.bmd.isDragging=!0,this.bmd.ctx.beginPath();var e=new Phaser.Point(this.game.input.x,this.game.input.y);this.bmd.lastPoint&&(this.bmd.ctx.moveTo(this.bmd.lastPoint.x,this.bmd.lastPoint.y),this.bmd.ctx.lineTo(e.x,e.y)),this.bmd.lastPoint=e,this.bmd.ctx.stroke(),this.bmd.dirty=!0}if(s.serverInfo.vip)if(this.timer>0)this.timer-=this.game.time.elapsed/1e3;else{s.serverInfo.socket}}}]),t}(Phaser.State);t.default=u}]);