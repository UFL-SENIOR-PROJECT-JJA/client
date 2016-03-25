var LabelButton = function(game,x,y,key,label,
                            callback,callbackContext,
                            overFrame, outFrame,
                            downFrame,
                            upFrame, size){
    Phaser.Button.call(this, game, x, y, key, callback,callbackContext, overFrame, outFrame, downFrame, upFrame);
    this.anchor.setTo( 0.5, 0.5 );
    console.log(size);
    this.label = game.add.bitmapText(0, 0, 'font', label, size);
    console.log(this.label);
    /*
    this.label = new Phaser.Text(game, 0, 0, label, this.style);    //puts the label in the center of the button
    this.label.stroke = '#000000';
    this.label.strokeThickness = 6;
    */
    this.label.anchor.setTo( 0.5, 0.5 );
    this.addChild(this.label);
    this.setLabel( label );    //adds button to game
    game.add.existing( this );
};
LabelButton.prototype = Object.create(Phaser.Button.prototype);
LabelButton.prototype.constructor = LabelButton;
LabelButton.prototype.setLabel = function( label ) {
    this.label.setText(label);
};
