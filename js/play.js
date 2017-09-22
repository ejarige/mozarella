var tipsy;

var MAX_WAITING = 5;
var WAITING = [];

var playState = {

	SelectionManager: function() {
		this.selectedCharacter = null;
		this.selectedRestaurant = null;

		this.selectCharacter = function(character) {
			this.selectedCharacter = character;
		};
		this.selectRestaurant = function(restaurant) {
			this.selectedRestaurant = restaurant;
		};
		this.unselectCharacter = function() {
            this.selectedCharacter = null;
		};
		this.unselectRestaurant = function() {
			this.selectedRestaurant = null;
		};
		this.unselectAll = function() {
    		this.selectedCharacter = null;
    		this.selectedRestaurant = null;
		};

		this.onRightDown = function() {
			this.selectedCharacter = null;
		};
		game.input.activePointer.rightButton.onDown.add(this.onRightDown, this);
	},
	
	Character: function(manager) {
		this.id = Date.now();

		this.request = getPnj();

		this.x = getRand(199,416);
		this.y = getRand(608,650);

		this.sprite = game.add.sprite(this.x, this.y, 'pnj-'+getRand(1,NB_PNJ));

		this.sprite.animations.add('left', [0,1,2], 10, true);
		this.sprite.animations.add('down', [3,4,5], 10, true);
		this.sprite.animations.add('right', [6,7,8], 10, true);
		this.sprite.animations.add('up', [9,10,11], 10, true);

		this.sprite.play('down');

		this.sprite.inputEnabled = true;
		this.sprite.input.useHandCursor = true;
		this.sprite.anchor.setTo(0.5, 0.75);

		this.info = game.add.sprite(this.x, this.y-62, 'bulle_pnj');
		this.info.anchor.setTo(.5,.5);

		if(this.request.price){
			this.price = game.add.text(this.info.position.x, this.info.position.y+5, this.request.price+'€', {font: "24px Arial", fontWeight: 'bold', fill: "green"})
			this.price.anchor.setTo(.5,.5);
		}

		if(this.request.food){
			this.food = game.add.sprite(this.info.position.x, this.info.position.y, this.request.food+'_bulle');
			this.food.anchor.setTo(.5,.5);
		}

		if(this.price && this.food){
			this.food.position.x += 20;
			this.food.scale.setTo(.75,.75);

			this.price.position.x -= 10;
			this.price.fontSize = 16;
		}

		game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

		//path
		this.pathIndex = 0;
		
		//speed
		this.speed = 200;

		this.isSelected = false;
		this.isMoving = false;
		this.isGoingBack = false;

		this.goBack = function() {
		    this.isGoingBack = true;
        };

		this.stopGoingBack = function() {
			this.isGoingBack = false;
		};

		this.unselect = function() {
		    this.isSelected = false;
        };

		this.kill = function(){
			if(this.food) this.food.kill();
			if(this.price) this.price.kill();

			this.info.kill();
			this.sprite.kill();
		};

		this.toggleInfo = function(){
			if(this.food) this.food.alpha = !this.food.alpha;
			if(this.price) this.price.alpha = !this.price.alpha;

			this.info.alpha = !this.info.alpha;
		};

		this.onDown = function() {
			if (game.input.activePointer.leftButton.isDown && !this.isMoving) {
				if (!this.isSelected) {
                    manager.selectCharacter(this);
                    this.isSelected = true;
                    console.log(this.request);
                }
                else {
					manager.unselectCharacter();
					this.isSelected = false;
				}
			}
		};
		this.sprite.events.onInputDown.add(this.onDown, this);
	},
	
	Restaurant: function(manager, resto) {
		this.x = resto.x;
		this.y = resto.y;

		this.obj = resto;
		this.sprite = game.add.sprite(this.x, this.y, resto.image);

		this.sprite.anchor.setTo(0.5, 0.5);
		game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.inputEnabled = true;
		this.sprite.input.useHandCursor = true;

		// info -->

		this.info = game.add.sprite(this.x-30, this.y-85, 'bulle_resto');
		this.info.anchor.setTo(.5,.5);

		this.name = game.add.text(this.info.x-60, this.info.y-50, resto.name, {font: "12px Arial", fontWeight: 'bold', fill:"red"});

		if(this.y < 250){
			this.info.position.x += 60;
			this.info.position.y += 170;
			this.info.angle = 180;

			this.name.position.x += 60;
			this.name.position.y += 190;
		}

		this.prixMin = game.add.text(this.name.x, this.name.y+18, 'Prix min : '+resto.priceMin+'€', {font: "12px Arial"});
		this.prixMax = game.add.text(this.name.x, this.name.y+36, 'Prix max : '+resto.priceMax+'€', {font: "12px Arial"});

		this.food = [];
		for(var i=0;i<resto.food.length;i++){
			var food = game.add.sprite(this.name.x+i*40, this.name.y+50, resto.food[i]+'_bulle');
			food.scale.setTo(.75,.75);
			this.food.push(food);
		}


		// <-- info

		this.isSelected = false;

		this.toggleInfo = function(){
			this.info.alpha = !this.info.alpha; this.info.bringToTop();
			this.name.alpha = !this.name.alpha; this.name.bringToTop();
			this.prixMin.alpha = !this.prixMin.alpha; this.prixMin.bringToTop();
			this.prixMax.alpha = !this.prixMax.alpha; this.prixMax.bringToTop();

			for(var f in this.food){
				this.food[f].alpha = !this.food[f].alpha; this.food[f].bringToTop();
			}
		};
		this.toggleInfo();

		this.onDown = function () {
			if ((game.input.pointer1.isDown || game.input.activePointer.leftButton.isDown) && manager.selectedCharacter != null) {
				//move NPC to restaurant
				this.isSelected = true;
				manager.selectRestaurant(this);
			}
		};

		this.sprite.events.onInputDown.add(this.onDown, this);

		this.onOver = function () {
			this.toggleInfo();
		};
        this.sprite.events.onInputOver.add(this.onOver, this);

        this.onOut = function () {
			this.toggleInfo();
        };
        this.sprite.events.onInputOut.add(this.onOut, this);
	},

	preload: function() {
		game.load.image('star', 'assets/star.png');
	},
	
	create: function() {
		//disable context menu (for right clicks)
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
		
		game.add.image(0, 0, 'map');

		game.physics.startSystem(Phaser.Physics.ARCADE);

		//singleton manager
		this.selectionManager = new this.SelectionManager();

		//all characters currently moving
		this.movingCharacters = [];

		//create restaurants
		for(var r in restos){
			restos[r].obj = new this.Restaurant(this.selectionManager, restos[r]);
		}

		//CONSTANTS
        this.TIMER_MINUTES = 2;
        this.TIMER_SECONDS = 0;
        this.SCORE_BONUS = 100;
        this.spawn_time = 7; //in seconds
        this.NB_STARTING_CHARACTERS = 3;

        //spawn characters timer
        this.spawnTimer = game.time.events.loop(Phaser.Timer.SECOND * this.spawn_time, this.spawnCharacter, this);
        /*this.spawnTimer = game.time.create();
        this.spawnTimer = this.timer.add(Phaser.Timer.SECOND * this.spawn_time, this.spawnCharacter, this);
        this.spawnTimer.start();*/

        //game over timer
        this.timer = game.time.create();
        this.timerEvent = this.timer.add(Phaser.Timer.MINUTE * this.TIMER_MINUTES + Phaser.Timer.SECOND * this.TIMER_SECONDS, this.endTimer, this);
        this.timer.start();
        this.timerLabel = game.add.text(960, 32, this.formatTime(this.TIMER_MINUTES*60+this.TIMER_SECONDS), {font: "48px Arial", fill: "#fff"});

        //score
        this.score = 0;
        this.scoreLabel = game.add.text(32, 32, 'Score : 0', {font: "48px Arial", fill: "#fff"});

        //spawn starting characterss
		this.spawnStartingCharacters();

		game.input.mouse.capture = true;
	},
	
	update: function() {
		//character selection
		if (this.selectionManager.selectedCharacter == null) {
			//console.log("a");
		}
		//restaurant selection
		else {
			if (this.selectionManager.selectedRestaurant == null) {
				//console.log("b");
			}
			else {
				//console.log('c');
				this.selectionManager.selectedCharacter.toggleInfo();
				this.movingCharacters.push([this.selectionManager.selectedCharacter, this.selectionManager.selectedRestaurant]);
				this.selectionManager.unselectAll();
			}
		}
		this.moveCharacters();

        playState.timerLabel.text = this.formatTime(Math.round((playState.timerEvent.delay - playState.timer.ms) / 1000));
	},

    modScore: function(modifier) {
        playState.score += modifier;
        if (playState.score < 0) { playState.score = 0; }
        playState.scoreLabel.text = 'Score : ' + playState.score;
    },

	endTimer: function() {
		this.timer.stop();
        game.state.start('title');
	},

	formatTime: function(time) {
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;
        if (seconds < 10) { seconds = '0' + seconds; }
        return minutes + ":" + seconds;
    },

	spawnCharacter: function() {
		new this.Character(this.selectionManager);
	},

	spawnStartingCharacters:function() {
		for (var i = 0; i < this.NB_STARTING_CHARACTERS; i++) {
			this.spawnCharacter();
		}
	},


	//return path leading to selected restaurant
	getPath: function(restaurant) {
		//temp test
		var path = [];
		for(var p in restaurant.obj.path)
			path.push(new Phaser.Point(restaurant.obj.path[p][0], restaurant.obj.path[p][1]));
		return path;
	},

	moveCharacters: function() {
		for(var c in this.movingCharacters) {
            this.moveCharacter(c, this.movingCharacters[c][0].isGoingBack);
		}
	},

	//goBack = true if the character is going back after a mistake
	moveCharacter: function(index, goBack) {
		var character = this.movingCharacters[index][0];
		var restaurant = this.movingCharacters[index][1];
		var path = this.getPath(restaurant);
		if(goBack)
			path.unshift(new Phaser.Point(character.x,character.y));

		// get animation direction
		var isLeft = character.sprite.body.velocity.x < 0;
		var isDown = character.sprite.body.velocity.y > 0;
		var isVertical = Math.abs(character.sprite.body.velocity.x) - Math.abs(character.sprite.body.velocity.y) < 0;

		if(isVertical){
			if(isDown)
				character.sprite.play('down');
			else
				character.sprite.play('up');
		} else{
			if(isLeft)
				character.sprite.play('left');
			else
				character.sprite.play('right');
		}

		//from uni to restaurant
		if (!goBack) {
            if (character.pathIndex <= path.length-1) {
                game.physics.arcade.moveToXY(character.sprite, path[character.pathIndex].x, path[character.pathIndex].y, character.speed);
                if (game.physics.arcade.distanceToXY(character.sprite, path[character.pathIndex].x, path[character.pathIndex].y) < 4) {
                    character.pathIndex++;
                }
            }
            else {
                character.sprite.body.velocity.x = 0;
                character.sprite.body.velocity.y = 0;
                this.checkRestaurant(index);
            }
        }

        //from restaurant to uni
        else {
            if (character.pathIndex >= 0) {
                game.physics.arcade.moveToXY(character.sprite, path[character.pathIndex].x, path[character.pathIndex].y, character.speed);
                if (game.physics.arcade.distanceToXY(character.sprite, path[character.pathIndex].x, path[character.pathIndex].y) < 4) {
                    character.pathIndex--;
                }
            }
            else {
                character.sprite.body.velocity.x = 0;
                character.sprite.body.velocity.y = 0;
                character.sprite.play('down');
				character.toggleInfo();
                character.pathIndex = 0;
                this.movingCharacters[index][0].stopGoingBack();
                this.movingCharacters[index][0].unselect();
                delete this.movingCharacters[index];
            }
        }
	},

	//checks whether the restaurant the character's arrived at is one that fulfills his request & acts accordingly
	checkRestaurant: function(index) {
		var character = this.movingCharacters[index][0];
		var restaurant = this.movingCharacters[index][1];
		for (var i=0; i<character.request.results.length; i++) {
			if (character.request.results[i] == restaurant.obj) {
			    //right restaurant
                this.modScore(playState.SCORE_BONUS);
                this.killCharacter(index);
                if (this.spawn_time > 3) {
                	this.spawn_time -= 0.5;
                	this.spawnTimer.delay = this.spawn_time * Phaser.Timer.SECOND;
				}
                return;
			}
		}
		//wrong restaurant
        this.modScore(-50);
        this.movingCharacters[index][0].goBack();
	},

	killCharacter: function(index) {
        var character = this.movingCharacters[index][0];
        character.kill();
        delete this.movingCharacters[index];
		character = null;
	},
};