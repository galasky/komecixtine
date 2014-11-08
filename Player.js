module.exports = function Player(pseudo, sock) {
    this.pseudo = pseudo;
    this.socket = sock;
    this.number = -1;
    this.room = null;
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
Player.prototype.takeCards = function(number) {
    this.hands = this.room.stack.pop(number);
    console.log("carte 1 : " + this.hands[0]);
};