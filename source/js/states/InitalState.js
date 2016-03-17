var Phaser = Phaser || {};
var Platformer = Platformer || {};

Platformer.InitalState = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.InitalState;

Platformer.InitalState.prototype.init = function () {
    "use strict";
    this.game.stage.disableVisibilityChange = true;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

};

Platformer.InitalState.prototype.preload = function () {
};

Platformer.InitalState.prototype.create = function () {
    console.log(username);
    game.stage.backgroundColor = 0x000000;
    //  this.game.stage.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
     //
    //  this.game.scale.minWidth = 240;
    //  this.game.scale.minHeight = 170;
    //  this.game.scale.maxWidth = 2880;
    //  this.game.scale.maxHeight = 1920;
     //
    //  this.game.scale.pageAlignHorizontally = true;
    //  this.game.scale.setScreenSize(true);
     //

    this.game.state.start("ConnectionState", true, false);
};
