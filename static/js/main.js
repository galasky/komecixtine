// 1 - Start enchant.js
enchant();

// 2 - On document load 
window.onload = function() {
    // 3 - Starting point
    var game = new Game(600, 585);
    // 4 - Preload resources
    game.preload('/static/res/tapis.jpg',
        '/static/res/cards.jpg');
    // 5 - Game settings
    game.fps = 60;
    game.scale = 1;
    game.onload = function() {
        // 6 - Once Game finishes loading
        console.log("Hi, Ocean!");
        var scene = new SceneGame();
        game.pushScene(scene);
    }
    // 7 - Start
    game.start();

    // SceneGame
    var SceneGame = Class.create(Scene, {
        // The main gameplay scene.
        initialize: function() {
            var game, label, bg;

            // 1 - Call superclass constructor
            Scene.apply(this);
            // 2 - Access to the game singleton instance
            game = Game.instance;
            // 3 - Create child nodes
            label = new Label("Hi, Ocean!");
            bg = new Sprite(600, 585);
            bg.image = game.assets['/static/res/tapis.jpg'];

            // 4 - Add child nodes
            this.addChild(bg);
            this.stack = new Stack(this, game.width * .5 - 192 * .5 - 192 / 2 * .25, game.height * .25);
            this.addChild(this.stack);
            this.addChild(new Carte(this, game.width * .5 - 192 * .5 - 192 / 2 * .25, 585 - 279, 2, 0, true));
            this.addChild(new Carte(this, game.width * .5 - 192 * .5 + 192 / 2 * .25, 585 - 279, 5, 2, true));
            this.addChild(new Carte(this, game.width * .5 - 192 * .5 - 192 / 2 * .25, 585 - 279 + 279 * .25, 8, 1, false));
            this.addChild(new Carte(this, game.width * .5 - 192 * .5 + 192 / 2 * .25, 585 - 279 + 279 *.25, 1, 3, false));
            this.addChild(label);
//            this.addEventListener(Event.TOUCH_START,this.handleTouchControl);
//            this.addEventListener(Event.TOUCH_MOVE, this.handleMoveControl);
//            this.addEventListener(Event.TOUCH_END, this.handleEndControl);
        },
        pioche: function() {
            var c = new Carte(this, game.width * .5 - 192 * .5 - 192 / 2 * .25, game.height * .25 - 279 * .25, 1, 3, false);
            this.addChild(c);
        },
        up: function(node) {
            this.removeChild(node);
            this.addChild(node);
        }

    });

    var Stack = Class.create(Sprite, {
        initialize: function(scene, x, y) {
            Sprite.apply(this,[192, 279]);
            this.image = Game.instance.assets['/static/res/cards.jpg'];
            this.frame = 54;
            this.scene = scene;
            this.x = x;
            this.y = y;
            this.scale(.25,.25);
            this.addEventListener(Event.TOUCH_START, this.touch);
        },
        touch: function(evt) {
            this.scene.pioche();
        }
    });

    var Carte = Class.create(Sprite, {
        // The player character.
        initialize: function(scene, x, y, value, color, hiden) {
            // 1 - Call superclass constructor
            Sprite.apply(this,[192, 279]);
            this.image = Game.instance.assets['/static/res/cards.jpg'];
            this.scene = scene;
            this.animationDuration = 0;
            this.select = false;
            this.hiden = hiden;
            this.x = x;
            this.y = y;
            this.xInit = this.x;
            this.yInit = this.y;
            this.value = value - 1;
            this.color = color;
            if (this.hiden) {
                this.hide();
            } else {
                this.show();

            }
            this.scale(.25,.25);
            console.log("frame " + this.frame);
            this.addEventListener(Event.TOUCH_START, this.touch);
            this.addEventListener(Event.TOUCH_MOVE, this.move);
            this.addEventListener(Event.TOUCH_END, this.end);
//            this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
        },
        touch: function(evt) {

        },
        move: function(evt) {
            this.select = true;
            this.x = evt.x - 192 * .5;
            this.y = evt.y - 279 * .5;
            if (this.x > 303 && this.x < 303 + 42 && this.y > 252 && this.y < 252 + 67) {
                console.log("ok");
            }
        },
        end: function(evt) {
            if(this.within(this.scene.stack, 192 * .25)) {
                this.xInit = this.scene.stack.x;
                this.yInit = this.scene.stack.y;
                this.show();
                this.scene.up(this);
            }
            console.log("x = " + this.x + " y = " + this.y);
            this.x = this.xInit;
            this.y = this.yInit;
        },
        updateAnimation: function (evt) {
            this.animationDuration += evt.elapsed * 0.001;
            if (this.animationDuration >= 0.25) {
                this.frame = (this.frame + 1) % 2;
                this.animationDuration -= 0.25;
            }
        },
        switchToLaneNumber: function(lane){
            var targetX = 160 - this.width/2 + (lane-1)*90;
            this.x = targetX;
        },
        colision: function(x, y) {
            return (x < this.x + 30 && x > this.x && y < this.y + 43 && y > this.y);
        },
        hide: function() {
            this.frame = 54;
            this.hiden = true;
        },
        show: function() {
            this.frame = this.value + 13 * this.color;
            this.hiden = false;
        },
        goInit: function() {
            this.x = this.xInit;
            this.y = this.yInit;
        }
    });

};