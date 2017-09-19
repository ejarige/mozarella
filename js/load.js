var loadState = {
	preload: function() {
		game.load.image('map', 'assets/map.png');
		game.load.image('pizza', 'assets/pizza.png');
		game.load.image('kebab', 'assets/pizza.png');
		game.load.image('raclette', 'assets/pizza.png');
		game.load.image('chinois', 'assets/chinois.png');
		game.load.image('homard', 'assets/pizza.png');
		game.load.image('sandwich', 'assets/sandwich.png');
	},
	
	create: function() {
		game.state.start('title');
	}
};