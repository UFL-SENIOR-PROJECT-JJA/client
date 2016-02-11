var Phaser = Phaser || {};
var Platformer = Platformer || {};

Platformer.MenuState = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.MenuState;

Platformer.MenuState.prototype.init = function () {
    "use strict";

};

Platformer.MenuState.prototype.preload = function () {
    this.load.image('menubg', 'assets/images/menu/galaxybg.jpg');
    this.load.spritesheet('createGame', 'assets/images/menu/creategame.png', 192, 42);
};

Platformer.MenuState.prototype.create = function () {
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'menubg');
    this.background.autoScroll(-20, 0);
    console.log(this.game);
    var createGame = this.game.add.button(this.game.width/2 - (192/2), this.game.height/2 - (42/2) - 45, 'createGame', onClickCreateGame, this, 1, 0, 2);
    var createGame = this.game.add.button(this.game.width/2 - (192/2), this.game.height/2 - (42/2) + 45, 'createGame', onClickJoinGame, this, 1, 0, 2);


};

var onClickCreateGame = function() {
    this.game.state.start("CreateGameState", true, false);
};

var onClickJoinGame = function() {
    this.game.state.start("JoinGameState", true, false);
};
