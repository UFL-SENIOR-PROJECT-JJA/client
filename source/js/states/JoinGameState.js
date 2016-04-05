var Phaser = Phaser || {};
var Platformer = Platformer || {};

Platformer.JoinGameState = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.JoinGameState;

Platformer.JoinGameState.prototype.init = function () {
    "use strict";
    this.buttons = [];

    Platformer['joinButtons'] = this;
    this.startListening();
};

Platformer.JoinGameState.prototype.preload = function () {

};

Platformer.JoinGameState.prototype.create = function () {
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'menubg');
    this.background.autoScroll(-20, 0);
    this.label = game.add.bitmapText(this.game.width/2, 100, 'font', "Choose Lobby",50);
    this.label.stroke = '#000000';
    this.label.strokeThickness = 6;
    this.label.anchor.setTo( 0.5, 0.5 );

    backButtonJoinGameState();

    Platformer["joinLobby"] = this;
    Platformer["joinLobby"].joined = false;
    console.log("Join Lobby This");
    console.log(this);

};

Platformer.JoinGameState.prototype.startListening = function(){
    Connection['socket'].emit('requestForLobbies');
    Connection['socket'].on('updatedLobbies', function(lobbies){
        console.log(lobbies);
        reloadLobbies(lobbies);
    });
};

var reloadLobbies = function(lobbies){
    if(Platformer["joinLobby"].joined) { return; }
    for(var i = 0; i < Platformer['joinButtons'].buttons.length; ++i) {
            Platformer['joinButtons'].buttons[i].buttonObject.destroy();
    }
    Platformer['joinButtons'].buttons = [];
    var btnScale = .30;
    for(var i = 0; i < lobbies.length; ++i) {
        if(lobbies[i].started) {
            console.log("lobby started");
            return;
        }
        var button = makeLobbyButton(lobbies[i]);
        button.buttonObject = new LabelButton(this.game,this.game.width/2, this.game.height/3  + (i*60), "blueButton", lobbies[i].lobbyName,  button.buttonFunction, this, 1, 0, 0, 0, 75); // button frames 1=over, 0=off, 2=down
        button.buttonObject.scale.setTo(btnScale, btnScale);
        Platformer['joinButtons'].buttons.push(button);
    }

};
var joinLobbyState = function (data) {
        //move to lobby state after callback is recieved
        console.log("joinLobbyState Method");
        console.log(data);
        Platformer["joinLobby"].joined = true;
        Connection['socket'].removeListener('updatedLobbies');
        Platformer["joinLobby"].game.state.start("LobbyState", true, false, data);
};


var onClickJoinLobby = function() {
    console.log('clicked');
};

var makeLobbyButton = function(lobby) {
    lobbyID = lobby.lobbyID;
    var button = {
        buttonFunction: function () {
            console.log(lobbyID);
            Connection.socket.emit('playerJoinLobby', lobbyID, joinLobbyState);
        },
        buttonObject: null
    };
    return button;
};

var backButtonJoinGameState = function() {
    this.backButton = new LabelButton(this.game, 75, 25, "blueButton", 'BACK',  returnToMenuFromJoinGameState, this, 1, 0, 0, 0, 90); // button frames 1=over, 0=off, 2=down
    this.backButton.scale.setTo(.20, .20);
}
var returnToMenuFromJoinGameState = function() {
    Connection['socket'].removeListener('updatedLobbies');
    Platformer["joinLobby"].game.state.start("MenuState", true, false);
}
