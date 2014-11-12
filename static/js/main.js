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

            this.pioched = null;
            // 4 - Add child nodes
            this.addChild(bg);
            this.stack = new Stack(this, game.width * .5 - 192 * .5 - 192 / 2 * .25, game.height * .25);
            this.carpet = new Carpet(this, game.width * .5 - 192 * .5 - 192 / 2 * .25 + 192 *.25, game.height * .25);
            this.addChild(this.stack);
            this.addChild(this.carpet);
            this.malu = 0;
            this.hand = [];
            this.hand.push(new Carte(true, this, game.width * .5 - 192 * .5 - 192 / 2 * .25, 585 - 279, 1, 0, true));
            this.hand.push(new Carte(true, this, game.width * .5 - 192 * .5 + 192 / 2 * .25, 585 - 279, 5, 2, true));
            this.hand.push(new Carte(true, this, game.width * .5 - 192 * .5 - 192 / 2 * .25, 585 - 279 + 279 * .25, 8, 1, true));
            this.hand.push(new Carte(true, this, game.width * .5 - 192 * .5 + 192 / 2 * .25, 585 - 279 + 279 *.25, 1, 3, true));
            this.addChild(this.hand[0]);
            this.addChild(this.hand[1]);
            this.addChild(this.hand[2]);
            this.addChild(this.hand[3]);
            this.hand[2].timeVisible = 5;
            this.hand[3].timeVisible = 5;
//            this.addChild(this.hands);

//            this.addChild(label);
//            this.addEventListener(Event.TOUCH_START,this.handleTouchControl);
//            this.addEventListener(Event.TOUCH_END, this.handleEndControl);
        },
        pioche: function() {
            if (this.pioched == null) {
                var c = new Carte(false, this, game.width * .5 - 192 * .5 - 192 / 2 * .25, game.height * .25, 1, 3, false);
                c.yInit -=  279 * .25;
                c.droped = true;
                c.pioche = true;
                this.addChild(c);
                this.pioched = c;
            }
        },
        malus: function() {

            var m = new Carte(true, this, game.width * .5 - 192 * .5 - 192 / 2 * .25, game.height * .25, 1, 3, true);
            m.droped = true;
            this.hand.push(m);
            this.addChild(m);
            m.xInit = game.width * .5 - 192 * .5 + 192 / 2 * .25 + 192 * .25 * ((this.malu - (this.malu % 2)) / 2 + 1);
            m.yInit = 585 - 279 + (this.malu % 2 == 1 ? 279 * .25 : 0);
            this.malu++;
        },
        deletation: function(carte) {
            var tmp = [];
            for (var i = 0; i < this.hand.length; i++) {
                var c = this.hand[i];
                if (!(c.value == carte.value && c.color == carte.color)) {
                    tmp.push(c);
                }
            }
            this.hand = tmp;
            console.log(this.hand);
        },
        reverse: function(carte) {
            for (var i = 0; i < this.hand.length; i++) {
                var c = this.hand[i];
                if ((c.value == carte.value && c.color == carte.color)) {
                    this.hand[i] = this.pioched;
                    this.pioched.timeVisible = 2;
                    this.pioched.xInit = c.xInit;
                    this.pioched.yInit = c.yInit;
                    this.pioched.hand = true;
                    this.pioched.hiden = true;
                    this.pioched = null;
                }
            }
            carte.xInit = this.scene.carpet.x;
            carte.yInit = this.scene.carpet.y;
            carte.hand = false;
            carte.show();
            this.carpet.stack.push(carte);
        },
        drop: function(carte) {
            if (carte.hand) {
                if (this.pioched != null) {
                    this.reverse(carte);
                    return ;
                } else {
                    if (this.carpet.stack.length > 0) {
                        var last = this.carpet.stack[this.carpet.stack.length - 1];
                        if (carte.value == last.value) {
                            carte.xInit = this.scene.carpet.x;
                            carte.yInit = this.scene.carpet.y;
                            carte.hand = false;
                            carte.droped = true;
                            carte.show();
                            this.carpet.stack.push(carte);
                            this.deletation(carte);
                        } else {
                            carte.timeVisible = 3;
                            this.malus();
                        }
                    }
                }
            } else {
                carte.xInit = this.scene.carpet.x;
                carte.yInit = this.scene.carpet.y;
                carte.hand = false;
                carte.show();
                this.carpet.stack.push(carte);
            }
            if (carte.pioche == true) {
                this.pioched = null;
            }
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


    var Carpet = Class.create(Sprite, {
        initialize: function(scene, x, y) {
            Sprite.apply(this,[192, 279]);
            this.image = Game.instance.assets['/static/res/cards.jpg'];
            this.frame = 55;
            this.stack = [];
            this.scene = scene;
            this.x = x;
            this.y = y;
            this.scale(.25,.25);
        }
    });

    var Carte = Class.create(Sprite, {
        // The player character.
        initialize: function(hand, scene, x, y, value, color, hiden) {
            // 1 - Call superclass constructor
            Sprite.apply(this,[192, 279]);
            this.timeVisible = 0;
            this.image = Game.instance.assets['/static/res/cards.jpg'];
            this.droped = false;
            this.hand = hand;
            this.pioche = false;
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
//            this.addEventListener(Event.ACTION_TICK, this.tick);
            this.addEventListener(Event.ENTER_FRAME, this.tick);
        },
        touch: function(evt) {
            this.scene.up(this);
            this.droped = false;
        },
        move: function(evt) {
            if (!this.droped) {
                this.select = true;
                this.x = evt.x - 192 * .5;
                this.y = evt.y - 279 * .5;
            }
        },
        end: function(evt) {
            if(this.within(this.scene.carpet, 192 * .25)) {
                this.scene.drop(this);
            }
            this.droped = true;
        },
        tick: function (evt) {
            if (this.droped) {
                this.x += (this.xInit - this.x) / 5;
                this.y += (this.yInit - this.y) / 5;
            }
            if (this.timeVisible > 0) {
                this.timeVisible -= 1 / game.fps;
                this.show();
                if (this.timeVisible <= 0) {
                    if (this.hiden) {
                        this.hide();
                    }
                }
            }
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
        put: function(carte) {
            if (this.hand) {
                carte.x = this.x;
                carte.y = this.y;
                this.scene.drop(this);
            }
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