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
    this.background = this.game.add.tileSprite(0, 0, 5680, 1800, 'menubg');
    this.background.autoScroll(-20, 0);
    this.background.scale.setTo(.3, .3);
    this.background1 = this.game.add.tileSprite(0, 0, 2880, 1800, 'overlay');
    this.background1.scale.setTo(.5, .5);
    //this.game.state.start("LobbyState", true, false);

    this.style = {
        'font': '35px Arial',
        'fill': 'white'
    };

    this.label = this.game.add.text(this.game.width/2, 100, "Lobby Settings Here", this.style);    //puts the label in the center of the button
    this.label.stroke = '#000000';
    this.label.strokeThickness = 6;
    this.label.anchor.setTo( 0.5, 0.5 );



    var btnScale = .50;
    this.btnCreateLobby = new LabelButton(this.game,this.game.width/2, this.game.height/2 - ((190*btnScale)/2) + 175, "greenButton", "Create Lobby!", onClickCreateLobby, this, 1, 0, 2); // button frames 1=over, 0=off, 2=down
    this.btnCreateLobby.scale.setTo(btnScale, btnScale);    Platformer["createLobby"] = this;
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
