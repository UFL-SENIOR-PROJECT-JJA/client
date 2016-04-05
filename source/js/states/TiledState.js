var Phaser = Phaser || {};
var Platformer = Platformer || {};
var Connection = Connection || {};


Platformer.TiledState = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.TiledState.prototype = Object.create(Phaser.State.prototype);
Platformer.TiledState.prototype.constructor = Platformer.TiledState;

Platformer.TiledState.prototype.init = function (level_data) {
    "use strict";

    this.game.stage.disableVisibilityChange = true;

    this.level_data = level_data;

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;

    // create map and set tileset
    this.map = this.game.add.tilemap(level_data.map.key);
    this.map.addTilesetImage(this.map.tilesets[0].name, level_data.map.tileset);
    Platformer.map = this.map;
    console.log(Platformer.map);
    console.log(this);
};

Platformer.TiledState.prototype.create = function () {
    "use strict";
    console.log("TiledState Created");
    var group_name, object_layer, collision_tiles;

    //if its mobile create the touch buttons

    // create map layers
    this.layers = {};
    this.map.layers.forEach(function (layer) {
        this.layers[layer.name] = this.map.createLayer(layer.name);
        if (layer.properties.collision) { // collision layer
            collision_tiles = [];
            layer.data.forEach(function (data_row) { // find tiles used in the layer
                data_row.forEach(function (tile) {
                    // check if it's a valid tile index and isn't already in the list
                    if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
                        collision_tiles.push(tile.index);
                    }
                }, this);
            }, this);
            this.map.setCollision(collision_tiles, true, layer.name);
        }
    }, this);
    // resize the world to be the size of the current layer
    this.layers[this.map.layer.name].resizeWorld();

    // create groups
    this.groups = {};
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);
    this.groups['bullets'] = this.game.add.group();
    game.physics.enable(this.groups['bullets'], Phaser.Physics.ARCADE); //not sure if necessary
    Platformer.groups = this.groups;

    this.prefabs = {};

    for (object_layer in this.map.objects) {
        if (this.map.objects.hasOwnProperty(object_layer)) {
            // create layer objects
            this.map.objects[object_layer].forEach(this.create_object, this);
        }
    }
    Platformer.game = this.game;
    Platformer.TiledState.prototype.getOnlinePlayers(this);
};

Platformer.TiledState.prototype.create_object = function (object) {
    "use strict";
    var position, prefab;
    // tiled coordinates starts in the bottom left corner

    position = {"x": object.x + (this.map.tileHeight / 2), "y": object.y - (this.map.tileHeight / 2)};
    // create object according to its type
    switch (object.type) {
    case "player":
        prefab = new Platformer.Player(this, {"x":37,"y":237}, object.properties);
        break;
    case "other_player":
        prefab = new Platformer.OtherPlayer(this, position, object.properties);
        break;
    case "ground_enemy":
        prefab = new Platformer.Enemy(this, position, object.properties);
        break;
    case "flying_enemy":
        prefab = new Platformer.FlyingEnemy(this, position, object.properties);
        break;
    case "goal":
        prefab = new Platformer.Goal(this, position, object.properties);
        break;
    }
    this.prefabs[object.name] = prefab;
};


Platformer.TiledState.prototype.create_server_objects = function (type, data, tilemap) {
    "use strict";
    var position, prefab;
    // tiled coordinates starts in the bottom left corner
    position = {"x": data.x, "y": data.y};
    // create object according to its type
    /*"bouncing":"20",
    "group":"players",
    "jumping_speed":"500",
    "texture":"player_spritesheet",
    "walking_speed":"200"
    */
    var properties = {bouncing:"20",
    group:"players",
    jumping_speed:"500",
    texture:"player_32bit_flipped",
    walking_speed:"200"};
    prefab = new Platformer.OtherPlayer(tilemap, position, properties, data.name);
    tilemap.prefabs[data.name] = prefab;
};
Platformer.TiledState.prototype.getOnlinePlayers = function (tilemap) {
    this.tilemap = tilemap;

    Connection['socket'].emit('requestLobbyUsers', function(data) {
        for (var user in data) {
            // skip loop if the property is from prototype
            if (!data.hasOwnProperty(user)) continue;
            //get that user
            console.log(data[user]);

            if(data[user].name != null && data[user].name != Connection['socket'].name) {
              Platformer.TiledState.prototype.create_server_objects("other_player", data[user], tilemap);
            }
            console.log(data[user].name + " Connected");

        }
    });
    Connection['socket'].on('onPlayerConnect', function(data) {
        //we need to have a player connect...
        //To connect, a player will start their game, send notification to server, server notifies every other player
        //Clients create prefab for otherPlayer indexed by player name, when otherPlayer moves, server sends emission with player name,
        //other player object is called and updates players position
        console.log(data);
        if(data.name != null && data.name != Connection['socket'].name) {
          Platformer.TiledState.prototype.create_server_objects("other_player", data, tilemap);
          var name = data.name;

        }
        console.log(data.name + " Connected");

    });
    Connection['socket'].on('onOtherPlayerMove', function(data) {
        prefabs = Platformer.TiledState.prototype.tilemap.prefabs;
        prefabs[data.name].move(data.x, data.y, data.dir);

    });

    Connection['socket'].on('onUpdateLives', function(data) {
        prefabs[data.name].lives = data.numLives;
        console.log("in tiled state the num lives = " + data.numLives);
        if(data.numLives <= 0){
          Platformer.game.add.sprite(prefabs[data.name].x, prefabs[data.name].y, 'gravestone');
          prefabs[data.name].kill();

        }

    });

    Connection['socket'].on('onReceiveBullet', function(data) {
      if(data.dir === 'right'){
        bullet = Platformer.groups['bullets'].create(data.x + 10 , data.y + 14, 'bullet');
        game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.body.setSize(4,4,-12,1);
        bullet.body.velocity.x = 400;
      }else{
        bullet = Platformer.groups['bullets'].create(data.x - 10, data.y + 14, 'bullet');
        game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.body.setSize(4,4,12,1);
        bullet.body.velocity.x = -400;
      }
      bullet.id = data.uID;
      bullet.body.gravity.y = -1000;
      bullet.anchor.setTo(0.5, 0.5);
      bullet.body.velocity.y = 0;

    });
    Connection['socket'].on('onDeleteBullet', function(data) {
        for (var i = 0, len = Platformer.groups.bullets.children.length; i < len; i++) {
          console.log("this is a bullet id xxx: " + Platformer.groups.bullets.children[i].id);
          if(Platformer.groups.bullets.children[i].id === data.uID){
            console.log("removing bullet with id " + data.uID);
            //console.log(Platformer.groups.bullets.children[i]);
            Platformer.groups.bullets.children[i].kill();
          }
        }
    });

    Connection['socket'].on('onPlayerDisconnect', function(data) {
        console.log(data.name + " Disconnected");
        prefabs = Platformer.TiledState.prototype.tilemap.prefabs;
        prefabs[data.name].body = null;
        prefabs[data.name].destroy();
        delete prefabs[data.name];

    });

    Connection['socket'].on('gameOver', function(){
      game.state.start("GameOverState", true, false);
    })
};




Platformer.TiledState.prototype.restart_level = function () {
    "use strict";
    console.log("RESTART THE LEVEL");
    this.game.state.restart(true, false, this.level_data);
};
