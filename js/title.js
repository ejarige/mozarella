function preload() {
    var pnj2;
    var fenetre;

    var data = [
        {x:515, y:200, state:0}
    ]
}
var titleState = {
    create: function() {
        fond = game.add.sprite(0,0,'fond');
        game.add.image(400,120,'maison');
        pnj2 = game.add.group();

        game.add.text(523, 230, "^", { fontSize: '24px', fill: '#000'});
        game.add.text(450, 240, "[Commencer]", { fontSize: '24px', fill: '#000'});

        game.add.text(50, 640, "Eric JARRIGE", { fontSize: '24px', fill: '#000'});
        game.add.text(50, 670, "Maylis LELIEPAULT", { fontSize: '24px', fill: '#000'});
        game.add.text(50, 700, "Anthony MARIN", { fontSize: '24px', fill: '#000'});

        pnj2.enableBody = true;
        pnj2.body = true;
        pnj2.body.collideWorldBounds = true;
        for (var i = 0; i < 1; i++)
        {
            var rand = Math.floor(100+Math.random() *770 );
            var pnj2s = pnj2.create(i*70+100,rand, 'pnj2');
        }

        game.physics.arcade.enable(pnj2);

        game.sound.stopAll();
        game.add.audio('music_title').play();


        pnj2.callAll('animations.add','animations','left',[0,1,2],10,true);
        pnj2.callAll('animations.add','animations','right',[6,7,8],10,true);
        pnj2.callAll('animations.add','animations','down',[3,4,5],10,true);
        pnj2.callAll('animations.add','animations','up',[9,10,11],10,true);

        fenetre = game.add.group();
        fenetre.enableBody = true
        var fenetres = fenetre.create(515,200, 'fenetre');
        fenetres.frame = 0;
        game.physics.arcade.enable(fenetre);
        fenetre.setAll('body.collideWorldBounds',true);
        fenetre.setAll('body.immovable',true);

        pnj3 = game.add.sprite(420, 220,'pnj3');
        game.physics.arcade.enable(pnj3);
        pnj3.body.collideWorldBounds = true;
        pnj3.animations.add('stay',[3,4,5],10,true);

        scoreText = game.add.text(280, 300, "Qu'est ce qu'on mange ?", { fontSize: '48px', fill: '#910'});
        scoreText.fixedToCamera = true

    },
    update: function() {
        pnj3.animations.play('stay');

        game.physics.arcade.collide(pnj2,fenetre,ouvre,null,this);

        if (game.input.mousePointer)
        {
            //  First is the callback
            //  Second is the context in which the callback runs, in this case game.physics.arcade
            //  Third is the parameter the callback expects - it is always sent the Group child as the first parameter
            pnj2.forEach(game.physics.arcade.moveToPointer, game.physics.arcade, false, 200);
            if(game.input.mousePointer.x < 500){
                pnj2.callAll('animations.play','animations','left',[0,1,2],10,true);

            }
            if(game.input.mousePointer.x >500 ){
                pnj2.callAll('animations.play','animations','right',[6,7,8],10,true);
            }
        }
        else
        {
            pnj2.setAll('body.velocity.x', 0);
            pnj2.setAll('body.velocity.y', 0);
            pnj2.callAll('animations.play','animations','down',[3,4,5],10,true);
        }

        function ouvre(pnj2,fen){
            rand = Math.random();
            if(fen.frame == 0){
                fen.frame = 1;
                game.state.start('tutorial');
            }

        }
    }
};
