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
    //Buttons.add(this.game.add.button(this.game.width/2 - (192/2), this.game.height/2 - (42/2) - 45, 'createGame', onClickCreateLobby, this, 1, 0, 2));
    //this.game.state.start("LobbyState", true, false);
    Platformer["joinLobby"] = this;
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
    for(var i = 0; i < Platformer['joinButtons'].buttons.length; ++i) {
            Platformer['joinButtons'].buttons[i].buttonObject.destroy();
    }
    Platformer['joinButtons'].buttons = [];

    for(var i = 0; i < lobbies.length; ++i) {
            var button = makeLobbyButton(lobbies[i]);
            button.buttonObject = Platformer['joinButtons'].game.add.button(this.game.width/2 - (192/2), this.game.height/2 - (42/2) - 45 + i*50, 'createGame', button.buttonFunction, this, 1, 0, 2);
            Platformer['joinButtons'].buttons.push(button);
    }

};
var joinLobbyState = function () {
        //move to lobby state after callback is recieved
        console.log("joinLobbyState Method");
        Platformer["joinLobby"].game.state.start("LobbyState", true, false, {
            lobbyName: "Test",
            lobbyID: "Test",
            owner: "Me"
        });
};


var onClickJoinLobby = function() {
    console.log('clicked');
};

var makeLobbyButton = function(lobbyID) {

    var button = {
        buttonFunction: function () {
            console.log(lobbyID);
            Connection.socket.emit('playerJoinLobby', lobbyID, joinLobbyState);
        },
        buttonObject: null
    };
    return button;
};
