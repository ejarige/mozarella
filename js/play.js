var playState = {
	CharacterManager: function() {
		this.selectedCharacter = null;
		
		this.selectCharacter = function(character) {
			this.selectedCharacter = character;
		};
		
		this.onRightDown = function() {
			this.isSelected = false;
			this.selectedCharacter = null;
		};
		game.input.activePointer.rightButton.onDown.add(this.onRightDown, this);
	},
	
	Character: function(manager, x, y) {
		this.sprite = game.add.sprite(x, y, 'star');
		game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.inputEnabled = true;
		this.sprite.anchor.setTo(0.5, 0.75);
		
		//path
		this.pathIndex = 0;
		
		//speed
		this.speed = 100;
		
		this.isSelected = false;
		
		this.onDown = function() {
			if (game.input.activePointer.leftButton.isDown) {
				this.isSelected = true;
				manager.selectCharacter(this);
			}
		};
		this.sprite.events.onInputDown.add(this.onDown, this);
	},
	
	Restaurant: function(x, y, sprite) {
		this.sprite = game.add.sprite(x, y, sprite);

		this.sprite.anchor.setTo(0.5, 0.5);
		game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.inputEnabled = true;
		
		this.isSelected = false;
		
		this.onDown = function() {
			if (game.input.activePointer.leftButton.isDown && this.characterManager.selectedCharacter != null) {
				//move NPC to restaurant
			}
		};

		this.sprite.events.onInputDown.add(this.onDown, this);
	},
	
	preload: function() {
		game.load.image('star', 'assets/star.png');
	},
	
	create: function() {
		//disable context menu (for right clicks)
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
		
		game.add.image(0, 0, 'map');

		for(var r in restos){
			restos[r].obj = new this.Restaurant(restos[r].x,restos[r].y,restos[r].image);
		}
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//singleton
		this.characterManager = new this.CharacterManager();
		
		this.npc_test = new this.Character(this.characterManager, 300, 650);
		this.resto_test = new this.Restaurant(500, 300);
		
		this.hasSelectedNPC = false;
		
		game.input.mouse.capture = true;
	},
	
	update: function() {
		//character selection
		if (this.characterManager.selectedCharacter == null) {
			console.log("a");
		}
		//restaurant selection
		else {
			console.log("b");
		}
	},
	
	/*moveCharacter: function(character, path) {
		if (character.pathIndex < path.length) {
			game.physics.arcade.moveToXY(character.sprite, path[character.pathIndex].x, path[character.pathIndex].y, character.speed);
			if (game.physics.arcade.distanceToXY(character.sprite, path[character.pathIndex].x, path[character.pathIndex].y) < 8) {
				character.pathIndex++;
			}
		}
	},*/
	
	
};