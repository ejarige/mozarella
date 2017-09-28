var NB_PNJ = 8;
var loadState = {
	preload: function() {
		game.load.image('map', 'assets/map.png');
		game.load.spritesheet('bulle_pnj', 'assets/bulle_pnj.png',98,63,3);
		game.load.image('bulle_resto', 'assets/bulle_resto.png');
        game.load.spritesheet('pnj2','assets/pnj/002.png',32,48);
        game.load.spritesheet('pnj3','assets/pnj/003.png',32,48);
        game.load.spritesheet('fenetre','assets/fenetre.png',32,32,2);
        game.load.spritesheet('emotion_angry','assets/anim_angry.png',32,32,8);
        game.load.spritesheet('emotion_love','assets/anim_heart.png',32,32,8);
        game.load.image('fond','assets/fond_titre.jpg');
        game.load.image('maison','assets/maison.png');

        game.load.spritesheet('woosh','assets/woosh.png',840,288,11);
        game.load.spritesheet('score','assets/score.png',400,100,6);

        game.load.audio('music_game','assets/athletic_theme.mp3');
        game.load.audio('music_title','assets/flower_garden.mp3');
        game.load.audio('music_score','assets/map_theme.mp3');
        game.load.audio('pop','assets/pop.mp3');

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