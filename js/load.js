var NB_PNJ = 3;
var loadState = {
	preload: function() {
		game.load.image('map', 'assets/map.png');
		game.load.image('pizza', 'assets/restos/pizza.png');
		game.load.image('kebab', 'assets/restos/pizza.png');
		game.load.image('raclette', 'assets/restos/pizza.png');
		game.load.image('chinois', 'assets/restos/chinois.png');
		game.load.image('homard', 'assets/restos/pizza.png');
		game.load.image('sandwich', 'assets/restos/sandwich.png');

		for(var i=1;i<=NB_PNJ;i++)
			game.load.spritesheet('pnj-'+i, 'assets/pnj/00'+i+'.png', 32, 48);
	},
	
	create: function() {
		game.state.start('title');
	}
};