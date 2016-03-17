var Phaser = Phaser || {};
var Platformer = Platformer || {};
var Connection = Connection || {};



Connection.Socket = function () {
  "use strict";
  Phaser.State.call(this);

};

Connection.Socket.prototype = Object.create(Phaser.State.prototype);
Connection.Socket.prototype.constructor = Connection.Socket;


Connection.Socket.prototype.init = function (level_data) {
    "use strict";
    this.level_data = level_data;
    console.log("LOL");
};

Connection.Socket.prototype.preload = function () {
  console.log("Connection Created");
  this.socket = io('http://localhost:3000');

  console.log(this.socket.id);
  Connection.socket = this.socket;
  this.socket.name = username;
  this.socket.emit('onLogin', this.socket.name, function (data){
      console.log("recieved call back from login " + data.id);
      Connection.socket.id = data.id;
      //Connection.socket.emit('requestUsers', Connection.socket.id);
  });
  console.log("You've logged in as: " + this.socket.name);
};

Connection.Socket.prototype.alertBulletFired = function(x, y, dir) {
  var data = {
    id: Connection.socket.ID,
    name: Connection.socket.name,
    x: x,
    y: y,
    dir: dir
  };
  Connection.socket.emit('onBulletFired', data);
};

Connection.Socket.prototype.onMove = function(x, y, dir) {
  var data = {
    id: Connection.socket.ID,
    name: Connection.socket.name,
    x: x,
    y: y,
    dir: dir
  };
  Connection.socket.emit('onMove', data);
};

Connection.Socket.prototype.onCreateLobby = function(name, mapID, numPlayers, joinLobby) {
    data = {
        name: name,
        mapID: mapID,
        numPlayers: numPlayers
    };
    Connection.socket.emit('createLobby', data, joinLobby);
};

Connection.Socket.prototype.create = function () {
    "use strict";
    this.game.state.start("MenuState", true, false);
};
//this.level_data
