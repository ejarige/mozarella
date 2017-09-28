var tutorialState = {
    create: function() {
        game.stage.backgroundColor = "#7C9FFF";

        game.add.text(200, 110, "Votre objectif est d'amener chaque étudiant dans le restaurant", { fontSize: '24px', fill: '#fff'});
        game.add.text(350, 140, "convenant le mieux à ses attentes.", { fontSize: '24px', fill: '#fff'});
        game.add.text(160, 200, "Pour cela, cliquez sur un étudiant pour le selectionner, puis cliquez", { fontSize: '24px', fill: '#fff'});
        game.add.text(240, 230, "sur un restaurant correspondant à ses demandes.", { fontSize: '24px', fill: '#fff'});
        game.add.text(140, 260, "Vous pouvez voir toutes les informations concernant chaque restaurant", { fontSize: '24px', fill: '#fff'});
        game.add.text(250, 310, "simplement en passant votre curseur dessus.", { fontSize: '24px', fill: '#fff'});
        game.add.text(130, 340, "Envoyez un maximum d'étudiants à bon port avant la fin du temps imparti !", { fontSize: '24px', fill: '#fff'});
        game.add.text(200, 440, "Attention : chaque erreur sera sanctionnée sur votre score.", { fontSize: '24px', fill: '#fff'});
        game.add.text(130, 470, "De plus, les étudiants ont un temps limité pour déjeuner, ils pourraient", { fontSize: '24px', fill: '#fff'});
        game.add.text(90, 500, "donc se résigner et ne pas prendre de repas si vous les ignorez trop longtemps.", { fontSize: '24px', fill: '#fff'});
        game.add.text(360, 530, "Ne les faites pas trop attendre !", { fontSize: '24px', fill: '#fff'});
        game.add.text(390, 620, "(Cliquez pour commencer)", { fontSize: '24px', fill: '#fff'});
		        
		pnj3 = game.add.sprite(544, 700,'pnj3');
        game.physics.arcade.enable(pnj3);
        pnj3.body.collideWorldBounds = true;
        pnj3.animations.add('stay',[3,4,5],10,true);
		
		tutosprite = game.add.sprite(0, 10,'tutosprite');
        game.physics.arcade.enable(tutosprite);
        tutosprite.body.collideWorldBounds = true;
        tutosprite.animations.add('anim',[0,1,2],10,true);
        
		this.onLeftDown = function() {
            game.state.start('play');
            game.input.activePointer.leftButton.onDown.removeAll();
        };
        game.input.activePointer.leftButton.onDown.add(this.onLeftDown, this);
    },
	update: function(){
		    pnj3.animations.play('stay');
			tutosprite.animations.play('anim',5);
	},
};