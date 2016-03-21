var Phaser = Phaser || {};
var Platformer = Platformer || {};

Platformer.LoadingState = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.LoadingState;

Platformer.LoadingState.prototype.init = function (level_data) {
    "use strict";
    this.level_data = level_data;
};

Platformer.LoadingState.prototype.preload = function () {
    "use strict";
    var assets, asset_loader, asset_key, asset;
    assets = this.level_data.assets;
    this.load.image('bullet', "assets/images/bullet_long.png");
    this.load.image('gravestone', "assets/images/grave_stone.png");
    this.load.image('jetpack_bar', "assets/images/jetpack_bar.png");
    this.load.spritesheet('player_32bit_flipped', "assets/images/player_32bit_flipped.png",32,32,4,0,0);

    for (asset_key in assets) { // load assets according to asset key
        if (assets.hasOwnProperty(asset_key)) {
            asset = assets[asset_key];
            switch (asset.type) {
            case "image":
                this.load.image(asset_key, asset.source);
                break;
            case "spritesheet":
                this.load.spritesheet(asset_key, asset.source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
                break;
            case "tilemap":
                this.load.tilemap(asset_key, asset.source, null, Phaser.Tilemap.TILED_JSON);
                break;
            }
        }
    }
};

Platformer.LoadingState.prototype.create = function () {
    "use strict";
    console.log("Loading State Created");
    this.game.state.start("GameState", true, false, this.level_data);
};
