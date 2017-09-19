var bootState = {
	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		game.input.onDown.add(goFull, this);

		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		
		game.state.start('load');
	}
};

var goFull = function gofull() {

	if (game.scale.isFullScreen)
	{
		game.scale.stopFullScreen();
	}
	else
	{
		game.scale.startFullScreen(false);
	}

};