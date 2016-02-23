var Phaser = Phaser || {};
var Platformer = Platformer || {};

Platformer.LobbyState = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.LobbyState;

Platformer.LobbyState.prototype.init = function () {
    "use strict";
    //Connection['socket'].emit('requestForLobbies');
    Connection['socket'].on('lobby', function(lobbies){
        console.log("this is a private message");
    });
    this.game.state.start("BootState", true, false, "assets/levels/level1.json");

};

Platformer.LobbyState.prototype.preload = function () {

};

Platformer.LobbyState.prototype.create = function () {
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'menubg');
    this.background.autoScroll(20, 0);
    //this.game.state.start("LobbyState", true, false);
};

var actionOnClick = function() {
    console.log('clicked');
};