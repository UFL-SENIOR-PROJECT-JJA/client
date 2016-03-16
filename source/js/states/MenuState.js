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
    this.load.image('menubg', 'assets/images/Galaxy-Backgrounds.jpg');
    this.load.spritesheet('createGame', 'assets/images/menu/creategame.png', 192, 42);
    this.load.spritesheet('greenButton', 'assets/images/menu/greenButton.png', 635, 190);
    this.load.spritesheet('purpleButton', 'assets/images/menu/purpleButton.png', 635, 190);

};

Platformer.MenuState.prototype.create = function () {
    this.background = this.game.add.tileSprite(0, 0, 2880, 1800, 'menubg');
    this.background.autoScroll(-20, 0);
    var backgroundScaleWidth = 4000 / this.background.texture.frame.width;
    var backgroundScaleHeight = backgroundScaleWidth/16 * 9;
    this.background.scale.setTo(backgroundScaleWidth, backgroundScaleHeight);
    console.log(this.game);
    var btnScale = .50;
    this.btnCreateLobby = new LabelButton(this.game,this.game.width/2, this.game.height/2 - ((190*btnScale)/2) - 25, "greenButton", "Start game!", onClickCreateGame, this, 1, 0, 2); // button frames 1=over, 0=off, 2=down
    this.btnCreateLobby.scale.setTo(btnScale, btnScale);
    this.btnLobbys = new LabelButton(this.game,this.game.width/2, this.game.height/2 - ((190*btnScale)/2) + 75, "purpleButton", "Search Lobbies", onClickJoinGame, this, 1, 0, 2); // button frames 1=over, 0=off, 2=down
    this.btnLobbys.scale.setTo(btnScale, btnScale);


};

var onClickCreateGame = function() {
    this.game.state.start("CreateGameState", true, false);
};

var onClickJoinGame = function() {
    this.game.state.start("JoinGameState", true, false);
};
