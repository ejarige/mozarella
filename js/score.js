var scoreState = {
    create: function() {
        game.sound.stopAll();
        game.add.audio('music_score').play();
        game.add.sprite(0, 0, 'fond');
        //var woosh = game.add.sprite(game.world.width / 2 - 420, game.world.height / 2 - 144, 'woosh');
        var woosh = game.add.sprite(0, game.world.height / 2 - 144, 'woosh');
        woosh.scale.setTo(1.2,1);
        var animWoosh = woosh.animations.add();
        animWoosh.play(10, false);

        game.time.events.add(Phaser.Timer.SECOND * 0.5, this.displayScoreText, this);
    },

    displayScoreText: function() {
        var score = game.add.sprite(200, game.world.height/2-60, 'score');
        var animScore = score.animations.add();
        animScore.play(10, false);
        game.time.events.add(Phaser.Timer.SECOND * 0.5, this.displayScore, this);
    },

    displayScore: function() {
        game.add.text(700, game.world.height/2-46, playState.score, { fontSize: '72px', fill: '#fff'});
        this.onLeftDown = function() {
            game.state.start('title');
            game.input.activePointer.leftButton.onDown.removeAll();
        };
        game.input.activePointer.leftButton.onDown.add(this.onLeftDown, this);
    },
};