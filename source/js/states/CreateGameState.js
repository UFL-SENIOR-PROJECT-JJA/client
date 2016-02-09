var Phaser = Phaser || {};
var Platformer = Platformer || {};
var Connection = Connection || {};

Platformer.CreateGameState = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.CreateGameState;

Platformer.CreateGameState.prototype.init = function () {
    "use strict";

};

Platformer.CreateGameState.prototype.preload = function () {

};

Platformer.CreateGameState.prototype.create = function () {
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'menubg');
    this.background.autoScroll(-20, 0);
    //this.game.state.start("LobbyState", true, false);
    var createLobby = this.game.add.button(this.game.width/2 - (192/2), this.game.height/2 - (42/2) - 45, 'createGame', onClickCreateLobby, this, 1, 0, 2);
    Platformer["createLobby"] = this;
    console.log(Platformer["createLobby"]);
};

var moveToLobbyState = function () {
        //move to lobby state after callback is recieved
        Platformer["createLobby"].game.state.start("LobbyState", true, false);
};

var onClickCreateLobby = function() {
    //Connection send socket signal to create LobbyState with callback to open lobbyState
    //Connection.Socket.prototype.onCreateLobby("Test Lobby", 1, 4, Platformer.CreateGameState.prototype.moveToLobbyState);
    data = {
        name: "TestLobby",
        mapID: 1,
        numPlayers: 4
    };
    Connection.socket.emit('createLobby', data, moveToLobbyState);

    console.log('clicked');
};
