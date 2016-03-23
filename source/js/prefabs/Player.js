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
    this.lives = 3;
    this.direction;

    //TODO: this life above player stuff
    // this.lifeIcons = [];
    // this.lifeIcons[0] = this.add.sprite();
    // this.lifeIcons[1] = this.add.sprite();
    // this.lifeIcons[2] = this.sprite();


    this.animations.add("walking", [0, 1, 0, 2], 12, true);
    this.animations.add("jumping", [3,0], 15, true);
    this.animations.add("stopped", [0], 1, true);

    this.timer = 0;
    this.jetpackFuel = 80;

    //this.frame = 3;
    this.rightPressed = false;
    this.leftPressed = false;
    this.upPressed = false;
    this.firePressed = false;
    Platformer.thisPlayer = this;



    if(!this.game.device.desktop){

      this.fireButton = game.add.button(700, 350, 'fire_button', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
      this.fireButton.fixedToCamera = true;  //our buttons should stay on the same place
      // this.fireButton.events.onInputOver.add(function(){Platformer.thisPlayer.firePressed=true;});
      // this.fireButton.events.onInputOut.add(function(){Platformer.thisPlayer.firePressed=false;});
      this.fireButton.events.onInputDown.add(function(){Platformer.thisPlayer.firePressed=true;});
      this.fireButton.events.onInputUp.add(function(){Platformer.thisPlayer.firePressed=false;});

      this.pointer = null;

      this.sprite = game.add.sprite(80,400,'right_arrow');
      this.sprite.anchor.setTo(0.5, 0.5);
      this.sprite.fixedToCamera = true;
    }


    this.bar = game_state.add.bitmapData(160, 12);
    this.testBar = game.add.sprite(50, 32, this.bar);
    this.bar.context.fillStyle = '#fff';
    this.testBar.fixedToCamera = true;
    this.anchor.setTo(0.5, 0);

    this.jetpackIcon = game.add.sprite(20,30,'jetpack_icon');
    this.jetpackIcon.fixedToCamera = true;
    this.hpIcon = game.add.sprite(20,10,'hp_icon');
    this.hpIcon.fixedToCamera = true;


    this.healthBar = game_state.add.bitmapData(160, 12);
    this.cameraHealthBar = game.add.sprite(50, 12, this.healthBar);
    this.healthBar.context.fillStyle = '#0f0';
    this.cameraHealthBar.fixedToCamera = true;
    this.anchor.setTo(0.5, 0);

    this.cursors = this.game_state.game.input.keyboard.createCursorKeys();
    this.game_state.camera.follow(this);
};

Platformer.Player.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Player.prototype.constructor = Platformer.Player;

Platformer.Player.prototype.update = function () {
    "use strict";



    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    this.game_state.game.physics.arcade.collide(this, this.game_state.groups.enemies, this.hit_enemy, null, this);
    this.game_state.game.physics.arcade.collide(this, this.game_state.groups.players);
    this.game_state.game.physics.arcade.collide(this, this.game_state.groups.bullets, this.bullet_hit_enemy, null, this);

    if(this.game.device.desktop) {

      if(this.cursors.right.isUp){
        this.rightPressed = false;
      }
      if(this.cursors.left.isUp){
        this.leftPressed = false;
      }
      if(this.cursors.up.isUp){
        this.upPressed = false;
      }
      if(this.spacebar.isUp){
        this.firePressed = false;
      }

      if (this.cursors.right.isDown && this.body.velocity.x >= 0) {
          // move right
          this.rightPressed = true;

      } else if (this.cursors.left.isDown && this.body.velocity.x <= 0) {
          // move left
          this.leftPressed = true;

      }

      if (this.cursors.up.isDown) {
          this.upPressed = true;
      }

      //allow the player to attack using spacebar
      if(this.spacebar.isDown){
        this.firePressed = true;
      }

    }else{
        //stuff for mobile here
        if(game.input.pointer1.x < 400){
          this.pointer = game.input.pointer1;
        }else if(game.input.pointer2.x < 400){
          this.pointer = game.input.pointer2;
        }else{
          this.pointer = null;
        }


        if(this.pointer !== null && this.pointer.isDown){

          this.sprite.rotation = game.physics.arcade.angleToPointer(this.sprite, this.pointer);

          if(this.sprite.rotation >= -0.3 && this.sprite.rotation < 1.6 ){
            //console.log('right');
            this.rightPressed = true;
            this.leftPressed = false;
            this.upPressed = false;
          }else if(this.sprite.rotation < -0.3 && this.sprite.rotation >= -1.0){
            //console.log('up-right');
            this.rightPressed = true;
            this.leftPressed = false;
            this.upPressed = true;
          }else if(this.sprite.rotation < -1.0 && this.sprite.rotation >= -2.0){
            //console.log('up');
            this.rightPressed = false;
            this.leftPressed = false;
            this.upPressed = true;
          }else if(this.sprite.rotation < -2.0 && this.sprite.rotation >= -2.8){
            //console.log('up-left');
            this.rightPressed = false;
            this.leftPressed = true;
            this.upPressed = true;
          }else if(this.sprite.rotation < -2.8 || this.sprite.rotation >= 1.6){
            //console.log('left');
            this.rightPressed = false;
            this.leftPressed = true;
            this.upPressed = false;
          }else{
            //console.log('nothing');
            this.rightPressed = false;
            this.leftPressed = false;
            this.upPressed = false;
          }
        }else{
          //console.log('not down');
          this.rightPressed = false;
          this.leftPressed = false;
          this.upPressed = false;
        }
    }



    //new move stuff
    if(this.rightPressed){
      console.log('bloop');
      this.moveRight();
    }else if(this.leftPressed){
      this.moveLeft();
    } else {
        // stop
        this.body.velocity.x = 0;
        if(this.body.velocity.y < 0){
          this.animations.play("jumping");
        }else{
          this.animations.play("stopped");
        }

    }

    if(this.upPressed){
      this.jump();
    }
    if (this.body.blocked.down && this.jetpackFuel < 80){
      this.jetpackFuel += 1;
    }

    if(this.firePressed){
      this.shoot();
    }

    //SERVER MOVEMENT COMMUNICATION
    if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
        this.sendMovement();
    }
    if (!this.isStopped && (this.body.velocity.x == 0 || this.body.velocity.y == 0) && this.body.blocked.down) {
        this.sendMovement();
        this.isStopped = true;
    }

    this.bar.context.clearRect(0, 0, this.bar.width, this.bar.height);
    this.bar.context.fillRect(0, 0, this.jetpackFuel*2, 16);
    this.bar.dirty = true;

    this.healthBar.context.clearRect(0, 0, this.healthBar.width, this.healthBar.height);
    this.healthBar.context.fillRect(0, 0, this.lives*53 + 1, 16);
    this.healthBar.dirty = true;
};

Platformer.Player.prototype.moveRight = function(){
  this.direction = 'right';
  this.body.velocity.x = this.walking_speed;
  if(this.body.velocity.y < 0){
    this.animations.play("jumping");
  }else{
    this.animations.play("walking");
  }
  this.scale.setTo(-1, 1);
  this.isStopped = false;
}

Platformer.Player.prototype.moveLeft = function(){
  this.direction = 'left';
  this.body.velocity.x = -this.walking_speed;
  if(this.body.velocity.y < 0){
    this.animations.play("jumping");
  }else{
    this.animations.play("walking");
  }
  this.scale.setTo(1, 1);
  this.isStopped = false;
}

Platformer.Player.prototype.jump = function(){
  if(this.jetpackFuel >= 1){
    this.jetpackFuel -= 1;
    this.body.velocity.y = -this.jumping_speed/2;
    this.animations.play("jumping");
    this.isStopped = false;
  }
}

Platformer.Player.prototype.shoot = function(){
  if(this.timer < game.time.now){
    //do attack
    this.timer = game.time.now + 400;
    this.create_bullet(this.direction);
  }
}

Platformer.Player.prototype.create_bullet = function(direction){
  // var bullet;
  // //console.log(Platformer);
  // var timeMade = game.time.now;
  // Connection.Socket.prototype.alertBulletFired(this.x, this.y, this.direction, timeMade);
  // if(direction === 'right'){
  //   bullet = Platformer.groups['bullets'].create(this.x + this.body.width/2 + 16, this.y + 10, 'bullet');
  //   game.physics.enable(bullet, Phaser.Physics.ARCADE);
  //   bullet.body.velocity.x = 400;
  // }else{
  //   bullet = Platformer.groups['bullets'].create(this.x - this.body.width/2 - 16, this.y + 10, 'bullet');
  //   game.physics.enable(bullet, Phaser.Physics.ARCADE);
  //   bullet.body.velocity.x = -400;
  // }
  // bullet.body.gravity.y = -1000;
  // bullet.anchor.setTo(0.5, 0.5);
  // bullet.body.velocity.y = 0;
  //
  // bullet.id = timeMade + Connection.socket.name;
  // console.log("bullet " + bullet.id + " has been fired");
  var position = {
    direction: direction,
    x: this.x,
    y: this.y
  }
  var properties = {
    texture:"bullet"
  };
  console.log(Platformer);
  bullet = new Platformer.Bullet(this.game_state, position, properties);
  //prefab = new Platformer.Player(this.game_state, position, properties);
}

Platformer.Player.prototype.bullet_hit_enemy = function (player, enemy) {
  "use strict";
  --this.lives;
  if(this.lives > 0){
      enemy.kill();
      console.log("the number of lives is " + this.lives);
      Connection.Socket.prototype.deleteBullet(enemy.id);
      Connection.Socket.prototype.updateLives(-1);
    }else{
      enemy.kill();
      Connection.Socket.prototype.deleteBullet(enemy.id);
      this.game_state.game.add.sprite(this.x,this.y, 'gravestone');
      player.kill();
      Connection.Socket.prototype.updateLives(-1);


      //gives a signal that they have lose the game/ grey screen?
    }
      //prompt("you died");
      console.log("A BULLET HIT ME, I AM DEAD X.X");
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
