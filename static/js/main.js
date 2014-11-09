// 1 - Start enchant.js
enchant();

// 2 - On document load 
window.onload = function() {
    // 3 - Starting point
    var game = new Game(600, 585);
    // 4 - Preload resources
    game.preload('res/tapis.jpg',
        'res/cards.png',
        'res/penguinSheet.png');
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
            var game, label, bg, penguin;

            // 1 - Call superclass constructor
            Scene.apply(this);
            // 2 - Access to the game singleton instance
            game = Game.instance;
            // 3 - Create child nodes
            label = new Label("Hi, Ocean!");
            bg = new Sprite(600, 585);
            bg.image = game.assets['res/tapis.jpg'];
            penguin = new Penguin(2, 0, false);
            penguin.x = penguin.xInit = game.width/2 - penguin.width/2;
            penguin.y = penguin.yInit = 280;
            this.penguin = penguin;

            // 4 - Add child nodes
            this.addChild(bg);
            this.addChild(penguin);
            this.addChild(label);
//            this.addEventListener(Event.TOUCH_START,this.handleTouchControl);
//            this.addEventListener(Event.TOUCH_MOVE, this.handleMoveControl);
//            this.addEventListener(Event.TOUCH_END, this.handleEndControl);
        },
        handleTouchControl: function (evt) {
            var laneWidth, lane;
            laneWidth = 320/3;
            lane = Math.floor(evt.x/laneWidth);
            lane = Math.max(Math.min(2,lane),0);
            this.penguin.switchToLaneNumber(lane);
        },
        handleMoveControl: function (evt) {
            if (this.penguin.select || this.penguin.colision(evt.x, evt.y)) {
                this.penguin.select = true;
                this.penguin.x = evt.x - 15;
                this.penguin.y = evt.y - 43 / 2;
            }
        },
        handleEndControl: function (evt) {
            this.penguin.select = false;
            this.penguin.goInit();
        }
    });

    var Penguin = Class.create(Sprite, {
        // The player character.
        initialize: function(value, color, hiden) {
            // 1 - Call superclass constructor
            Sprite.apply(this,[192, 279]);
            this.image = Game.instance.assets['res/cards.png'];
            this.scale(.25,.25);
            this.animationDuration = 0;
            this.select = false;
            this.hiden = hiden;
            this.xInit = this.x;
            this.yInit = this.y;
            this.value = value - 1;
            this.color = color;
            if (this.hide) {
                this.hide();
            } else {
                this.show();
            }
            console.log("frame " + this.frame);
            this.addEventListener(Event.TOUCH_START, this.touch);
            this.addEventListener(Event.TOUCH_MOVE, this.move);
//            this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
        },
        touch: function(evt) {
            if (this.hiden) {
                this.show();
            } else {
                this.hide();
            }
        },
        move: function(evt) {
            this.select = true;
            this.x = evt.x - 192 * .5;
            this.y = evt.y - 279 * .5;
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