module.exports = function Player(pseudo, sock) {
    this.pseudo = pseudo;
    this.socket = sock;
    this.number = -1;
    this.room = null;
    this.myTurn = false;
    this.hands = [];
}
var Player = require('./Player.js');

Player.prototype.emitNewPlayer = function(player) {
    if (this != player) {
        this.socket.emit("newPlayer", {pseudo: player.pseudo});
    }
};
Player.prototype.emitRefreshListPlayer = function() {
    var list = [];
    for (var i = 0; i < this.room.listPlayer.length; i++) {
        if (i != this.number) {
            list[i] = this.room.listPlayer[i].pseudo;
        }
    }
    this.socket.emit("refreshListPlayer", {listPlayer: list});
};
Player.prototype.emitStart = function() {
    this.socket.emit("start", {hands: this.hands});
};
Player.prototype.emitEnd = function() {
    this.socket.emit("end");
};
Player.prototype.yourTurn = function () {
    this.myTurn = true;
    this.socket.emit("yourTurn");
}
Player.prototype.endTurn = function() {
    this.myTurn = false;
    this.socket.emit("endTurn");
    this.room.nextTurn();
}
Player.prototype.takeCards = function(number) {
    this.hands = this.room.stack.pop(number);
    console.log("carte 1 : " + this.hands[0].value + " " + this.hands[0].color);
};
Player.prototype.change = function(card, number) {
    this.room.stack.drop(this.hands[number]);
    this.hands[number] = card;
    this.endTurn();
}
Player.prototype.lastTurn = function() {
    this.room.lastTurn = true;
}