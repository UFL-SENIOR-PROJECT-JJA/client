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
    Platformer["lobby"] = this;
    //Connection['socket'].emit('requestForLobbies');
    Connection['socket'].on('lobby', function(lobbies){
        console.log("this is a private message");
    });

    Connection['socket'].on('startGame', function(){
        if(Platformer["lobby"].started) {return; }
        console.log("Starting Lobby");
        Platformer["lobby"].started = true;
        joinGame();
    });

    Connection['socket'].on('lobbyPlayers', function(lobbyUsers){
        if(Platformer["lobby"].started) {return; }
        console.log("Getting Lobby Users");
        Platformer["lobby"].lobbyUsers = lobbyUsers;
        Platformer["lobby"].lobbyUsersAmount = lobbyUsers.length;
        console.log(lobbyUsers);
        updateUsersInRoom();
    });
    Platformer["lobby"].users = [];
    Platformer["lobby"].lobbyName = data.lobbyName;
    Platformer["lobby"].lobbyID = data.lobbyID;
    Platformer["lobby"].owner = data.owner;
    Platformer["lobby"].lobbyUsersAmount = 1;
    Platformer["lobby"].lobbyUsers = [];

    Connection['socket'].emit('lobbyGetPlayers', data.lobbyID);

    //this.game.state.start("BootState", true, false, "assets/levels/level1.json");

};

Platformer.LobbyState.prototype.preload = function () {

};

Platformer.LobbyState.prototype.create = function () {
    Platformer["lobby"] = this
    Platformer["lobby"].background = Platformer["lobby"].game.add.tileSprite(0, 0, 5680, 1800, 'menubg');
    Platformer["lobby"].background.autoScroll(-20, 0);
    Platformer["lobby"].background.scale.setTo(.3, .3);
    Platformer["lobby"].background1 = Platformer["lobby"].game.add.tileSprite(0, 0, 2880, 1800, 'overlay');
    Platformer["lobby"].background1.scale.setTo(.5, .5);
    //this.game.state.start("LobbyState", true, false);

    Platformer["lobby"].style = {
        'font': '35px Arial',
        'fill': 'white'
    };
    //LOBBY NAME
    Platformer["lobby"].title = Platformer["lobby"].game.add.text(Platformer["lobby"].game.width/2, 100, "Lobby: " + Platformer["lobby"].lobbyName, Platformer["lobby"].style);    //puts the label in the center of the button
    Platformer["lobby"].title.stroke = '#000000';
    Platformer["lobby"].title.strokeThickness = 6;
    Platformer["lobby"].title.anchor.setTo( 0.5, 0.5 );

    //IF OWNER OF ROOM GIVE START GAME BUTTON TO THEM
    if(Connection['socket'].name === Platformer["lobby"].owner) {
        var btnScale = .50;
        this.btnCreateLobby = new LabelButton(this.game,this.game.width/2, this.game.height/2 - ((190*btnScale)/2) + 175, "greenButton", "Start Game!", joinGameOwner, this, 1, 0, 2); // button frames 1=over, 0=off, 2=down
        this.btnCreateLobby.scale.setTo(btnScale, btnScale);
        //tell everyone in the lobby to start
    }
    Platformer["lobby"].textOnScreen = [];
};

var updateUsersInRoom = function() {
    if(Platformer["lobby"].started) { return; }
    console.log("Updating Text");
    for(var i = 0; i < Platformer["lobby"].textOnScreen.length; ++i){
        Platformer["lobby"].textOnScreen[i].destroy();
        console.log("Destorying Text");
    }
    Platformer["lobby"].style = {
        'font': '25px Arial',
        'fill': 'white'
    };
    //ADD THE USER COUNT TO THE HEADER
    var userLabel = Platformer["lobby"].game.add.text(Platformer["lobby"].game.width/2, 150, "Users: (" + Platformer["lobby"].lobbyUsersAmount + "/4)" , Platformer["lobby"].style);    //puts the label in the center of the button
    userLabel.stroke = '#000000';
    userLabel.strokeThickness = 4;
    userLabel.anchor.setTo( 0.5, 0.5 );
    Platformer["lobby"].textOnScreen[0] = userLabel;

    Platformer["lobby"].style = {
        'font': '15px Arial',
        'fill': 'white'
    };
    //ADD EACH OF THE USERS TO THE LIST
    var k = 1;
    for(var i = 0; i < Platformer["lobby"].lobbyUsers.length; ++i) {
        Platformer["lobby"].textOnScreen[k] = Platformer["lobby"].game.add.text(Platformer["lobby"].game.width/2, 180  + (i*15), Platformer["lobby"].lobbyUsers[i].name, Platformer["lobby"].style);    //puts the label in the center of the button
        Platformer["lobby"].textOnScreen[k].stroke = '#000000';
        Platformer["lobby"].textOnScreen[k].strokeThickness = 4;
        Platformer["lobby"].textOnScreen[k].anchor.setTo( 0.5, 0.5 );
        ++k
    }
}

var joinGameOwner = function() {
    Platformer["lobby"].started = true;
    console.log(Platformer["lobby"].lobbyID);
    Connection['socket'].emit('startLobby', Platformer["lobby"].lobbyID);
    joinGame();
}

var joinGame = function() {
    this.game.state.start("BootState", true, false, "assets/levels/level1.json");

};
