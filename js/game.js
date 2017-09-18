var game = new Phaser.Game(1080, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload(){

    game.load.image('map', 'assets/map.png');
    game.load.image('pizza', 'assets/pizza.png');
    game.load.image('kebab', 'assets/pizza.png');
    game.load.image('raclette', 'assets/pizza.png');
    game.load.image('chinois', 'assets/chinois.png');
    game.load.image('homard', 'assets/pizza.png');
    game.load.image('sandwich', 'assets/sandwich.png');
}

function create(){
    game.add.sprite(0,0,'map');

    for(var r in restos){
        game.add.sprite(restos[r].x, restos[r].y, restos[r].image);
    }

    var pnj = getPnj();
    game.debug.text(JSON.stringify(pnj));


}

function update(){

}

