var NB_PNJ = 8;
var loadState = {
	preload: function() {
		game.load.image('map', 'assets/map.png');
		game.load.image('bulle_pnj', 'assets/bulle_pnj.png');
		game.load.image('bulle_resto', 'assets/bulle_resto.png');
        game.load.spritesheet('pnj2','assets/pnj/002.png',32,48);
        game.load.spritesheet('pnj3','assets/pnj/003.png',32,48);
        game.load.spritesheet('fenetre','assets/fenetre.png',32,32,2);
        game.load.image('fond','assets/fond_titre.jpg');
        game.load.image('maison','assets/maison.png');

		for(var r in restos){
			game.load.image(restos[r].image, 'assets/restos/'+restos[r].image+'.png');

			for(var f in restos[r].food)
				game.load.image(restos[r].food[f]+'_bulle', 'assets/food/'+restos[r].food[f]+'_bulle.png');

		}

		for(var i=1;i<=NB_PNJ;i++)
			game.load.spritesheet('pnj-'+i, 'assets/pnj/00'+i+'.png', 32, 48);
	},
	
	create: function() {
		game.state.start('title');
	}
};