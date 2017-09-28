var game = new Phaser.Game(1088, 770, Phaser.AUTO, 'gameDiv');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('title', titleState);
game.state.add('tutorial', tutorialState);
game.state.add('play', playState);
game.state.add('score', scoreState);

game.state.start('boot');
