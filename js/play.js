/*var tipsy;

var MAX_WAITING = 5;
var WAITING = [];*/

var playState = {

	SelectionManager: function() {
		this.selectedCharacter = null;
		this.selectedRestaurant = null;

		this.selectCharacter = function(character) {
			if (this.selectedCharacter != null) {
				this.selectedCharacter.isSelected = false;
			}
			this.selectedCharacter = character;
            this.selectedCharacter.isSelected = true;
		};
		this.selectRestaurant = function(restaurant) {
            if (this.selectedRestaurant != null) {
                this.selectedRestaurant.isSelected = false;
            }
			this.selectedRestaurant = restaurant;
            this.selectedRestaurant.isSelected = true;
		};
		this.unselectCharacter = function() {
            if (this.selectedCharacter != null) {
                this.selectedCharacter.isSelected = false;
            }
            this.selectedCharacter = null;
		};
		/*this.unselectRestaurant = function() {
			if (this.selectedRestaurant != null) {
                this.selectedRestaurant.isSelected = false;
            }
			this.selectedRestaurant = null;
		};*/
		this.unselectAll = function() {
            if (this.selectedCharacter != null) {
                this.selectedCharacter.isSelected = false;
            }
            if (this.selectedRestaurant != null) {
                this.selectedRestaurant.isSelected = false;
            }
    		this.selectedCharacter = null;
    		this.selectedRestaurant = null;
		};

		this.onRightDown = function() {
			this.selectedCharacter = null;
		};
		game.input.activePointer.rightButton.onDown.add(this.onRightDown, this);
	},

	PositionManager: function() {
		this.MAX_POSITION_ID = 7;

		this.allocatedPositions = [];
		for (var i=0; i<=this.MAX_POSITION_ID; i++) {
			this.allocatedPositions[i] = false;
		}

		this.getX = function(id) {
			var posX;
			switch (id) {
				case 0:
					posX = 200;
					break;
				case 1:
                    posX = 240;
					break;
				case 2:
                    posX = 280;
					break;
				case 3:
                    posX = 320;
					break;
				case 4:
                    posX = 360;
					break;
				case 5:
                    posX = 400;
					break;
				case 6:
                    posX = 220;
					break;
				case 7:
                    posX = 380;
					break;
			}
			return posX;
		};

        this.getY = function(id) {
            var posY;
            switch (id) {
                case 0:
				case 2:
				case 4:
                    posY = 640;
                    break;
                case 1:
				case 3:
				case 5:
                    posY = 680;
                    break;
				case 6:
				case 7:
					posY = 720;
					break;
            }
            return posY;
        };

		this.getAssignedPosID = function() {
			var posID = game.rnd.integerInRange(0, this.MAX_POSITION_ID);
			if (this.allocatedPositions[posID]) {
				while (this.allocatedPositions[posID]) {
					if (posID == this.MAX_POSITION_ID) {
						posID = 0;
					}
					else {
						posID++;
					}
				}
			}
			this.allocatedPositions[posID] = true;
			return posID;
		};

		this.clearAllocatedPosID = function(id) {
			this.allocatedPositions[id] = false;
		};
	},
	
	Character: function(selectionManager, positionManager) {
		//this.id = Date.now();
		this.id = 0;

		this.request = getPnj();

		this.tween = null;

		//this.x = getRand(199,416);
		//this.y = getRand(608,650);
		//this.x = 200;
		//this.y = 640;
		this.posID = positionManager.getAssignedPosID();
		this.x = positionManager.getX(this.posID);
        this.y = positionManager.getY(this.posID);
		this.baseX = this.x;
		this.baseY = this.y;
		//this.z = -this.y;

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
		this.sprite.addChild(this.info);
		this.info.x = 0;
		this.info.y = -62;

		if(this.request.price){
			this.price = game.add.text(this.info.position.x, this.info.position.y+5, this.request.price+'€', {font: "24px Arial", fontWeight: 'bold', fill: "green"});
			this.price.anchor.setTo(.5,.5);
			this.info.addChild(this.price);
			this.price.x = 0;
			this.price.y = 5;
		}

		if(this.request.food){
			this.food = game.add.sprite(this.info.position.x, this.info.position.y, this.request.food+'_bulle');
			this.food.anchor.setTo(.5,.5);
			this.info.addChild(this.food);
			this.food.x = 0;
			this.food.y = 0;
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

		//timer
		this.timer = 25; //in seconds

		this.isSelected = false;
		this.isMoving = false;
		this.isGoingBack = false;
		this.isJumping = false;
		this.isEmoting = false;
		this.hasPlayedEmotion = false;

		this.goBack = function() {
		    this.isGoingBack = true;
        };

		this.stopGoingBack = function() {
			this.isGoingBack = false;
		};

		this.unselect = function() {
			this.isJumping = false;
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

		this.stopJumping = function() {
            if (this.tween != null) {
                this.tween.stop();
            }
            this.isJumping = false;
            this.sprite.x = this.baseX;
            this.sprite.y = this.baseY;
		};

		this.clearPosID = function() {
			positionManager.clearAllocatedPosID(this.posID);
		};

		this.onDown = function() {
			if (game.input.activePointer.leftButton.isDown && !this.isMoving) {
				if (!this.isSelected) {
					if (selectionManager.selectedCharacter != null) {
                        selectionManager.selectedCharacter.stopJumping();
					}
                    selectionManager.selectCharacter(this);
                }
                else {
					selectionManager.unselectCharacter();
					this.stopJumping();
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
			if ((game.input.pointer1.isDown || game.input.activePointer.leftButton.isDown) && manager.selectedCharacter !== null) {
				//move NPC to restaurant
                manager.selectedCharacter.stopJumping();
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
	},
	
	create: function() {
		//disable context menu (for right clicks)
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
		
		game.add.image(0, 0, 'map');

        game.sound.stopAll();
		game.add.audio('music_game').play();

		game.physics.startSystem(Phaser.Physics.ARCADE);

		//singleton managers
		this.selectionManager = new this.SelectionManager();
		this.positionManager = new this.PositionManager();

		//all characters currently moving
		this.movingCharacters = [];

		//characters group
		this.characters = [];

		//create restaurants
		for(var r in restos){
			restos[r].obj = new this.Restaurant(this.selectionManager, restos[r]);
		}

		//CONSTANTS
		this.MAX_CHARACTERS_NUMBER = 8;
        this.GAME_TIMER_MINUTES = 2;
        this.GAME_TIMER_SECONDS = 0;
        this.SCORE_BONUS = 100;
        this.spawn_time = 7; //in seconds
        this.NB_STARTING_CHARACTERS = 3;

        this.gameEnded = false;

        //spawn characters timer
        this.spawnTimer = game.time.events.loop(Phaser.Timer.SECOND * this.spawn_time, this.spawnCharacter, this);
        /*this.spawnTimer = game.time.create();
        this.spawnTimer = this.spawnTimer.add(Phaser.Timer.SECOND * this.spawn_time, this.spawnCharacter, this);
        this.spawnTimer.start();*/

        //game over timer
        this.gameTimer = game.time.create();
        this.timerEvent = this.gameTimer.add(Phaser.Timer.MINUTE * this.GAME_TIMER_MINUTES + Phaser.Timer.SECOND * this.GAME_TIMER_SECONDS, this.endGameTimer, this);
        this.gameTimer.start();
        this.gameTimerLabel = game.add.text(960, 32, this.formatTime(this.GAME_TIMER_MINUTES*60+this.GAME_TIMER_SECONDS), {font: "48px Arial", fill: "#fff"});

        //character timer
		game.time.events.loop(Phaser.Timer.SECOND, this.updateCharacterTimer, this);

        //score
        this.score = 0;
        this.scoreLabel = game.add.text(32, 32, 'Score : 0', {font: "48px Arial", fill: "#fff"});

        //spawn starting characterss
		this.spawnStartingCharacters();

		game.input.mouse.capture = true;
	},
	
	update: function() {
		//character selection
		if (this.selectionManager.selectedCharacter === null) {
			//console.log("a");
		}
		//restaurant selection
		else {
			if (this.selectionManager.selectedRestaurant === null) {
				//console.log("b");
			}
			else {
				//console.log('c');
				this.selectionManager.selectedCharacter.toggleInfo();
				this.selectionManager.selectedCharacter.isMoving = true;
				this.movingCharacters.push([this.selectionManager.selectedCharacter, this.selectionManager.selectedRestaurant]);
				this.selectionManager.unselectAll();
			}
		}
		this.moveCharacters();
		this.selectedCharacterJump();

        this.gameTimerLabel.text = this.formatTime(Math.round((this.timerEvent.delay - this.gameTimer.ms) / 1000));
	},

    modScore: function(modifier) {
        this.score += modifier;
        if (this.score < 0) { this.score = 0; }
        this.scoreLabel.text = 'Score : ' + this.score;
    },

	endGameTimer: function() {
        game.sound.stopAll();
        var ding = game.add.audio('ding');
        ding.volume = 2;
        ding.play();
		this.gameEnded = true;
		this.killAllCharacters();
        game.input.activePointer.leftButton.onDown.removeAll();
        game.time.events.add(Phaser.Timer.SECOND * 2, this.goToScoreState, this);
	},

	goToScoreState: function() {
        game.state.start('score');
	},

	formatTime: function(time) {
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;
        if (seconds < 10) { seconds = '0' + seconds; }
        return minutes + ":" + seconds;
    },

	spawnCharacter: function() {
		if (this.characters.length < this.MAX_CHARACTERS_NUMBER && !this.gameEnded) {
            game.add.audio('pop').play();
            var character = new this.Character(this.selectionManager, this.positionManager);
            this.characters.push(character);
            this.characters = this.updateArray(this.characters);
            this.updateCharactersID();
        }
	},

	updateArray: function(array) {
		var array_defragmented = [];
		for (var i = 0; i < array.length; i++) {
			if (array[i] !== null) {
				array_defragmented.push(array[i]);
			}
		}
        return array_defragmented;
	},

	updateCharactersID: function() {
        for (var i = 0; i < this.characters.length; i++) {
            this.characters[i].id = i;
            console.log(i);
        }
	},

	spawnStartingCharacters:function() {
		for (var i = 0; i < this.NB_STARTING_CHARACTERS; i++) {
			this.spawnCharacter();
		}
	},

	updateCharacterTimer: function() {
		for (var i = 0; i < this.characters.length; i++) {
			if (this.characters[i] != null && !this.characters[i].isMoving) {
                if (this.characters[i].timer > 1) {
                    this.characters[i].timer--;
                    if (this.characters[i].timer == 10) {
                    	this.characters[i].info.frame = 1;
                        game.add.tween(this.characters[i].info).from( { y: this.characters[i].info.y-20 }, 100, Phaser.Easing.Bounce.Out, true);
					}
					else if (this.characters[i].timer == 5) {
                        this.characters[i].info.frame = 2;
                        game.add.tween(this.characters[i].info).from( { y: this.characters[i].info.y-20 }, 100, Phaser.Easing.Bounce.Out, true);
					}
                }
                else {
                    //this.killCharacter(this.characters[i]);
                    //this.modScore(-50);

                    if (!this.characters[i].hasPlayedEmotion) {
                        this.playEmotion(this.characters[i], 'emotion_angry');
                        this.characters[i].toggleInfo();
                        this.modScore(-50);
                        this.characters[i].hasPlayedEmotion = true;
                    }

                    if (!this.characters[i].isEmoting) {
                        this.killCharacter(this.characters[i]);
                    }
                }
            }
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
		for (var c in this.movingCharacters) {
            if (!this.gameEnded) {
                this.moveCharacter(c, this.movingCharacters[c][0].isGoingBack);
            }
			else {
            	this.movingCharacters[c][0].sprite.body.velocity.x = 0;
                this.movingCharacters[c][0].sprite.body.velocity.y = 0;
			}
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
                character.isMoving = false;
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
			if (character.request.results[i] === restaurant.obj) {
			    //right restaurant
				if (!character.hasPlayedEmotion) {
					this.playEmotion(character, 'emotion_love');
                    this.modScore(this.SCORE_BONUS);
                    character.hasPlayedEmotion = true;
                }
                if (!character.isEmoting) {
                    this.killMovingCharacter(index);
                    if (this.spawn_time > 2) {
                        this.spawn_time -= 0.5;
                        this.spawnTimer.delay = this.spawn_time * Phaser.Timer.SECOND;
                    }
                }
                return;
			}
		}
		//wrong restaurant
		if (!character.hasPlayedEmotion) {
			this.playEmotion(character, 'emotion_angry');
            this.modScore(-50);
            character.hasPlayedEmotion = true;
		}
		if (!character.isEmoting) {
            this.movingCharacters[index][0].goBack();
            character.hasPlayedEmotion = false;
		}
	},

	playEmotion: function(character, emotion) {
		character.isEmoting = true;
		var emote = game.add.sprite(character.sprite.body.x+4, character.sprite.body.y-32, emotion);
		var anim = emote.animations.add();
		anim.play(10, false, true);
    	anim.onComplete.add(function () { character.isEmoting = false; }, this);
	},

	killMovingCharacter: function(index) {
        var character = this.movingCharacters[index][0];
        delete this.movingCharacters[index];
        this.killCharacter(character);
	},

	killCharacter: function(character) {
		character.clearPosID();
        character.kill();
        this.characters[character.id] = null;
        character = null;
        this.characters = this.updateArray(this.characters);
        this.updateCharactersID();
	},

	killAllCharacters: function() {
		var nbCharacters = this.characters.length;
		for (var i=0; i<nbCharacters; i++) {
			this.killCharacter(this.characters[0]);
		}
	},

	selectedCharacterJump: function() {
		if (this.selectionManager.selectedCharacter != null) {
            if (!this.selectionManager.selectedCharacter.isJumping) {
                this.selectionManager.selectedCharacter.tween = game.add.tween(this.selectionManager.selectedCharacter.sprite).from({y: this.selectionManager.selectedCharacter.sprite.y - 10}, 500, Phaser.Easing.Bounce.Out, true);
                this.selectionManager.selectedCharacter.isJumping = true;
                this.selectionManager.selectedCharacter.tween.onComplete.add(function() { this.selectionManager.selectedCharacter.isJumping = false; }, this);
            }
        }
	},
};