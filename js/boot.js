var bootState = {
	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		
		game.state.start('load');
	}
};