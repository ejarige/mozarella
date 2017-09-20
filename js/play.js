var tipsy;

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
	
	Character: function(manager, x, y) {
		this.sprite = game.add.sprite(x, y, 'star');
		game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.inputEnabled = true;
		this.sprite.anchor.setTo(0.5, 0.75);

		this.request = getPnj();

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

		this.unselect = function() {
		    this.isSelected = false;
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
		this.obj = resto;
		this.sprite = game.add.sprite(resto.x, resto.y, resto.image);

		this.sprite.anchor.setTo(0.5, 0.5);
		game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.inputEnabled = true;

		this.isSelected = false;

		this.showInfo = function(){
			tipsy = game.add.sprite('');
		};

		this.onDown = function () {
			if ((game.input.pointer1.isDown || game.input.activePointer.leftButton.isDown) && manager.selectedCharacter != null) {
				//move NPC to restaurant
				this.isSelected = true;
				manager.selectRestaurant(this);
			} else {
				this.showInfo();
			}
		};

		this.sprite.events.onInputDown.add(this.onDown, this);

		this.onOver = function () {
			//console.log("open restaurant infos")
		};
        this.sprite.events.onInputOver.add(this.onOver, this);

        this.onOut = function () {
            //console.log("close restaurant infos")
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
		
		this.npc_test0 = new this.Character(this.selectionManager, 300, 650);
		this.npc_test1 = new this.Character(this.selectionManager, 300, 650);

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
				this.movingCharacters.push([this.selectionManager.selectedCharacter, this.selectionManager.selectedRestaurant]);
				this.selectionManager.unselectAll();
			}
		}
		this.moveCharacters();
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
		//from uni to restaurant
		if (!goBack) {
            if (character.pathIndex < path.length-1) {
                game.physics.arcade.moveToXY(character.sprite, path[character.pathIndex].x, path[character.pathIndex].y, character.speed);
                if (game.physics.arcade.distanceToXY(character.sprite, path[character.pathIndex].x, path[character.pathIndex].y) < 8) {
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
            if (character.pathIndex > 0) {
                game.physics.arcade.moveToXY(character.sprite, path[character.pathIndex].x, path[character.pathIndex].y, character.speed);
                if (game.physics.arcade.distanceToXY(character.sprite, path[character.pathIndex].x, path[character.pathIndex].y) < 8) {
                    character.pathIndex--;
                }
            }
            else {
                character.sprite.body.velocity.x = 0;
                character.sprite.body.velocity.y = 0;
                this.movingCharacters[index][0].unselect();
                delete this.movingCharacters[index];
            }
        }
	},

	//checks whether the restaurant the character's arrived at is one that fulfills his request
	checkRestaurant: function(index) {
		var character = this.movingCharacters[index][0];
		var restaurant = this.movingCharacters[index][1];
		for (var i=0; i<character.request.results.length; i++) {
			if (character.request.results[i] == restaurant.obj) {
			    //right restaurant
                this.killCharacter(index);
                return;
			}
		}
		//wrong restaurant
        this.movingCharacters[index][0].goBack();
	},

	killCharacter: function(index) {
        var character = this.movingCharacters[index][0];
        character.sprite.kill();
        delete this.movingCharacters[index];
		character = null;
	},
};