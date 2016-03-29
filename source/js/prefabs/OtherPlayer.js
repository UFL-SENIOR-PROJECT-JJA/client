var Platformer = Platformer || {};
var Connection = Connection || {};

Platformer.OtherPlayer = function (game_state, position, properties, name) {
    "use strict";

    Platformer.Prefab.call(this, game_state, position, properties);
    this.name = name;

    this.walking_speed = +properties.walking_speed;
    this.jumping_speed = +properties.jumping_speed;
    this.bouncing = +properties.bouncing;

    this.lives = 3;

    this.game_state.game.physics.arcade.enable(this);
    this.body.gravity.y = -1000;

    this.body.immovable = true;
    //  this.body.collideWorldBounds = true;

    this.animations.add("walking", [0, 1, 0, 2], 12, true);


    this.frame = 2;
    this.anchor.setTo(0.5, 0);

};

Platformer.OtherPlayer.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.OtherPlayer.prototype.constructor = Platformer.OtherPlayer;

Platformer.OtherPlayer.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    this.game_state.game.physics.arcade.collide(this, this.game_state.groups.enemies, this.hit_enemy, null, this);
    this.game_state.game.physics.arcade.collide(this, this.game_state.groups.players);


};

Platformer.OtherPlayer.prototype.move = function(x, y, dir) {
    //this.game_state.game.physics.arcade.moveToXY(this, x, y, 250);
    //this.x = x, this.y = y;
    //x = x - this.width/2*dir*(-1);
    this.game_state.game.add.tween(this).to({ x ,y }, 20, Phaser.Easing.Linear.None,true,0);
    this.animations.play("walking");
    if(dir != 0) {
        this.scale.setTo(dir, 1);
    }
};
