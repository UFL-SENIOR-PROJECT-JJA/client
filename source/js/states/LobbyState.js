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
    Platformer["joinLobby"] = this
    Platformer["joinLobby"].joined = true;
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

    //LOBBY NAME
    Platformer["lobby"].title = game.add.bitmapText(Platformer["lobby"].game.width/2, 100, 'font', "Lobby: " + Platformer["lobby"].lobbyName, 35);    //puts the label in the center of the button
    Platformer["lobby"].title.anchor.setTo( 0.5, 0.5 );

    //IF OWNER OF ROOM GIVE START GAME BUTTON TO THEM
    if(Connection['socket'].name === Platformer["lobby"].owner) {
        var btnScale = .50;
        this.btnCreateLobby = new LabelButton(this.game,this.game.width/2, this.game.height/2 - ((190*btnScale)/2) + 175, "greenButton", "Start Game!", joinGameOwner, this, 1, 0, 0, 0, 50); // button frames 1=over, 0=off, 2=down
        this.btnCreateLobby.scale.setTo(btnScale, btnScale);
        //tell everyone in the lobby to start
    }
    Platformer["lobby"].textOnScreen = [];
    backButtonLobbyState();
};

var updateUsersInRoom = function() {
    if(Platformer["lobby"].started) { return; }
    console.log("Updating Text");
    for(var i = 0; i < Platformer["lobby"].textOnScreen.length; ++i){
        Platformer["lobby"].textOnScreen[i].destroy();
        console.log("Destorying Text");
    }
    Platformer["lobby"].style = {
        'font': '35px Arial',
        'fill': 'white'
    };
    //ADD THE USER COUNT TO THE HEADER
    var userText = "Users: (" + Platformer["lobby"].lobbyUsersAmount + "/4)";
    var userLabel = game.add.bitmapText(Platformer["lobby"].game.width/2, 150, 'font', userText, 25);

    userLabel.anchor.setTo( 0.5, 0.5 );
    Platformer["lobby"].textOnScreen[0] = userLabel;

    Platformer["lobby"].style = {
        'font': '15px Arial',
        'fill': 'white'
    };
    //ADD EACH OF THE USERS TO THE LIST
    var k = 1;
    for(var i = 0; i < Platformer["lobby"].lobbyUsers.length; ++i) {
        Platformer["lobby"].textOnScreen[k] = game.add.bitmapText(Platformer["lobby"].game.width/2, 180  + (i*15), 'font', Platformer["lobby"].lobbyUsers[i].name, 15); //puts the label in the center of the button
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


var backButtonLobbyState = function() {
    this.backButton = new LabelButton(this.game, 75, 25, "blueButton", 'EXIT LOBBY',  returnToMenuFromLobbyState, this, 1, 0, 0, 0, 70); // button frames 1=over, 0=off, 2=down
    this.backButton.scale.setTo(.20, .20);
}
var returnToMenuFromLobbyState = function() {
    console.log("In LobbyState");
    Platformer["joinLobby"].joined = false;
    Connection['socket'].emit('playerLeaveLobby');
    Platformer["lobby"].game.state.start("MenuState", false, false);
}
