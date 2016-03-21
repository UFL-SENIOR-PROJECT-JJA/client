var Platformer = Platformer || {};
var Connection = Connection || {};

Platformer.Bullet = function (game_state, position, properties) {
    "use strict";
    console.log("in the bullet constructor");

    //console.log(Platformer);
    var timeMade = game.time.now;
    Connection.Socket.prototype.alertBulletFired(position.x, position.y, position.direction, timeMade);
    if(position.direction === 'right'){
      console.log("firing right: x= " + position.x + ", y= " + position.y);
      Phaser.Sprite.call(this, game_state.game, position.x + 24, position.y + 14, 'bullet');
      this.game_state = game_state;
      this.game_state.groups['bullets'].add(this);
      game.physics.enable(this, Phaser.Physics.ARCADE);
      this.body.setSize(8,4,-12,1);
      this.body.velocity.x = 400;
    }else{
      console.log("firing left: x= " + position.x + ", y= " + position.y);
      Phaser.Sprite.call(this, game_state.game, position.x - 24, position.y + 14, 'bullet');
      this.game_state = game_state;
      this.game_state.groups['bullets'].add(this);
      game.physics.enable(this, Phaser.Physics.ARCADE);
      this.body.setSize(8,4,12,1);
      this.body.velocity.x = -400;
    }
    this.body.gravity.y = -1000;
    this.anchor.setTo(0.5, 0.5);
    this.body.velocity.y = 0;

    this.id = timeMade + Connection.socket.name;
    console.log("bullet " + this.id + " has been fired");
};

Platformer.Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Platformer.Bullet.prototype.constructor = Platformer.Bullet;


Platformer.Bullet.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision, this.hit_wall, null, this);
};
Platformer.Bullet.prototype.hit_wall = function(bullet){
  console.log("bullet hit a wall and died");
  Connection.Socket.prototype.deleteBullet(this.id);
  bullet.kill();
};
