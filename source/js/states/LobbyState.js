var Phaser = Phaser || {};
var Platformer = Platformer || {};

Platformer.LobbyState = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.LobbyState;

Platformer.LobbyState.prototype.init = function (data) {
    "use strict";
    //Connection['socket'].emit('requestForLobbies');
    Connection['socket'].on('lobby', function(lobbies){
        console.log("this is a private message");
    });

    this.lobbyName = data.lobbyName;
    this.lobbyID = data.lobbyID;
    this.lobbyUsersAmount = 1;
    this.lobbyUsers = [];
    this.lobbyUsers.push(data.owner);

    this.game.state.start("BootState", true, false, "assets/levels/level1.json");

};

Platformer.LobbyState.prototype.preload = function () {

};

Platformer.LobbyState.prototype.create = function () {

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

    this.label = this.game.add.text(this.game.width/2, 100, "Lobby: " + this.lobbyName, this.style);    //puts the label in the center of the button
    this.label.stroke = '#000000';
    this.label.strokeThickness = 6;
    this.label.anchor.setTo( 0.5, 0.5 );

    this.style = {
        'font': '25px Arial',
        'fill': 'white'
    };

    this.label = this.game.add.text(this.game.width/2, 150, "Users: (" + this.lobbyUsersAmount + "/4)" , this.style);    //puts the label in the center of the button
    this.label.stroke = '#000000';
    this.label.strokeThickness = 4;
    this.label.anchor.setTo( 0.5, 0.5 );

    this.style = {
        'font': '15px Arial',
        'fill': 'white'
    };
    for(var i = 0; i < this.lobbyUsers.length; ++i) {
        this.label = this.game.add.text(this.game.width/2, 180  + (i*15), this.lobbyUsers[i], this.style);    //puts the label in the center of the button
        this.label.stroke = '#000000';
        this.label.strokeThickness = 4;
        this.label.anchor.setTo( 0.5, 0.5 );
    }
};

var actionOnClick = function() {
    console.log('clicked');
};
