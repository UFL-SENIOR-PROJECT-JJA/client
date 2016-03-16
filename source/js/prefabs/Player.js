var Platformer = Platformer || {};
var Connection = Connection || {};

Platformer.Player = function (game_state, position, properties) {
    "use strict";
    Platformer.Prefab.call(this, game_state, position, properties);
    this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.walking_speed = +properties.walking_speed;
    this.jumping_speed = +properties.jumping_speed;
    this.bouncing = +properties.bouncing;

    this.game_state.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.immovable = true;

    this.direction;



    this.animations.add("walking", [0, 1, 2, 1], 6, true);

    this.timer = 0;

    //this.frame = 3;

    this.anchor.setTo(0.5, 0);

    this.cursors = this.game_state.game.input.keyboard.createCursorKeys();
};

Platformer.Player.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Player.prototype.constructor = Platformer.Player;

Platformer.Player.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    this.game_state.game.physics.arcade.collide(this, this.game_state.groups.enemies, this.hit_enemy, null, this);
    this.game_state.game.physics.arcade.collide(this, this.game_state.groups.players);


    if (this.cursors.right.isDown && this.body.velocity.x >= 0) {
        // move right
        this.direction = 'right';
        this.body.velocity.x = this.walking_speed;
        this.animations.play("walking");
        this.scale.setTo(-1, 1);
        this.isStopped = false;

    } else if (this.cursors.left.isDown && this.body.velocity.x <= 0) {
        // move left
        this.direction = 'left';
        this.body.velocity.x = -this.walking_speed;
        this.animations.play("walking");
        this.scale.setTo(1, 1);
        this.isStopped = false;

    } else {
        // stop
        this.body.velocity.x = 0;
        this.animations.stop();
        //this.frame = 3;
        //SEND STOP MOVEMENT

    }
    //SERVER MOVEMENT COMMUNICATION
    if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
        this.sendMovement();
    }
    if (!this.isStopped && (this.body.velocity.x == 0 || this.body.velocity.y == 0) && this.body.blocked.down) {
        this.sendMovement();
        this.isStopped = true;
    }

    // jump only if touching a tile
    if (this.cursors.up.isDown && this.body.blocked.down) {
        this.body.velocity.y = -this.jumping_speed;
        this.isStopped = false;
    }

    // dies if touches the end of the screen
    if (this.bottom >= this.game_state.game.world.height) {
        this.game_state.restart_level();
    }

    //allow the player to attack using spacebar
    if(this.spacebar.isDown && this.timer < game.time.now){
      //do attack
      this.timer = game.time.now + 500;
      this.create_bullet(this.direction);

    }
};

Platformer.Player.prototype.create_bullet = function(direction){
  var bullet;
  //console.log(Platformer);
  if(direction === 'right'){
    bullet = Platformer.groups['bullets'].create(this.body.x + this.body.width/2 + 5, this.y - 2, 'bullet');
    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullet.body.velocity.x = 400;
  }else{
    bullet = Platformer.groups['bullets'].create(this.body.x - this.body.width/2 - 5, this.y - 2, 'bullet');
    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullet.body.velocity.x = -400;
  }
  bullet.body.gravity.y = -1000;
  bullet.anchor.setTo(0.5, 0.5);
  bullet.body.velocity.y = 0;
}

Platformer.Player.prototype.hit_enemy = function (player, enemy) {
    "use strict";
    // if the player is above the enemy, the enemy is killed, otherwise the player dies
    if (enemy.body.touching.up) {
        enemy.kill();
        player.y -= this.bouncing;
    } else {
        this.game_state.restart_level();
    }
};

Platformer.Player.prototype.sendMovement = function() {
    if(this.body.velocity.x > 0) {
        Connection.Socket.prototype.onMove(this.x, this.y, -1);
    }else if(this.body.velocity.x < 0) {
        Connection.Socket.prototype.onMove(this.x, this.y, 1);
    }else {
        Connection.Socket.prototype.onMove(this.x, this.y, 0);
    }
};
