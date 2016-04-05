var Phaser = Phaser || {};
var Platformer = Platformer || {};

Platformer.GameOverState = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.GameOverState;

Platformer.GameOverState.prototype.init = function () {
    "use strict";
    Platformer['lastState'] = {};
    Platformer['lastState'].name = "GameState";
    Platformer['lastState'].reference = this;
};

Platformer.GameOverState.prototype.preload = function () {

    game.load.bitmapFont('font', 'assets/font/font.png', 'assets/font/font.fnt');

    this.load.image('menubg', 'assets/images/Galaxy-Backgrounds.jpg');
    this.load.image('overlay', 'assets/images/transparent.png');

    this.load.spritesheet('createGame', 'assets/images/menu/creategame.png', 192, 42);
    this.load.spritesheet('greenButton', 'assets/images/menu/greenButton.png', 635, 190);
    this.load.spritesheet('purpleButton', 'assets/images/menu/purpleButton.png', 635, 190);
    this.load.spritesheet('blueButton', 'assets/images/menu/blueButton.png', 635, 190);


};

Platformer.GameOverState.prototype.create = function () {
    this.background = this.game.add.tileSprite(0, 0, 5680, 1800, 'menubg');
    this.background.autoScroll(-20, 0);
    this.background.scale.setTo(.3, .3);
    this.background1 = this.game.add.tileSprite(0, 0, 2880, 1800, 'overlay');
    this.background1.scale.setTo(.5, .5);
    this.label = game.add.bitmapText(this.game.width/2, 100, 'font', "Game Over!",55);

    this.label.anchor.setTo( 0.5, 0.5 );



    var btnScale = .50;
    this.btnCreateLobby = new LabelButton(this.game,this.game.width/4, this.game.height/2 - ((190*btnScale)/2) + 175, "greenButton", "Exit Game!", onClickEndGame, this, 1, 0, 0, 0, 50); // button frames 1=over, 0=off, 2=down
    this.btnCreateLobby.scale.setTo(btnScale, btnScale);



};

var onClickEndGame = function() {
    this.game.state.start("MenuState", true, false);
};
