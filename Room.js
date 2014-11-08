var Stack = require('./Stack.js');

module.exports = function Room(roomName,maxPlayer) {
    this.roomName=roomName;
    this.maxPlayer=maxPlayer;
    this.listPlayer = [];
    this.started = false;
    this.stack = null;
    this.lastTurn = false;
    this.finalCountDown = 0;
    this.currentPlayer = 0;
}
var Room = require('./Room.js');
Room.prototype.addPlayer = function(player) {
    player.number = this.listPlayer.length;
    this.listPlayer[player.number] = player;
    for (var i= 0; i < this.listPlayer.length; i++) {
        this.listPlayer[i].emitNewPlayer(player);
    }
};
Room.prototype.deletePlayer = function(player) {
    var listTmp = [];
    for (var i= 0; i < this.listPlayer.length; i++) {
        if (i != player.number) {
            var p = this.listPlayer[i];
            p.number = listTmp.length;
            listTmp[p.number] = p;
        }
    }
    this.listPlayer = listTmp;
    for (var i= 0; i < this.listPlayer.length; i++) {
        this.listPlayer[i].emitRefreshListPlayer();
    }
};
Room.prototype.start = function() {
    this.started = true;
    this.stack = new Stack();
    for (var i= 0; i < this.listPlayer.length; i++) {
        this.listPlayer[i].takeCards(4);
        this.listPlayer[i].emitStart();
    }
    this.listPlayer[this.currentPlayer].yourTurn();
};
Room.prototype.end = function() {
    for (var i= 0; i < this.listPlayer.length; i++) {
        this.listPlayer[i].emitEnd();
    }
}
Room.prototype.nextTurn = function() {
    this.currentPlayer++;
    if (this.currentPlayer >= this.maxPlayer) {
        this.currentPlayer = 0;
    }
    if (this.lastTurn) {
        this.finalCountDown++;
    }
    if (this.finalCountDown >= this.maxPlayer) {
        this.end();
    } else {
        this.listPlayer[this.currentPlayer].yourTurn();
    }

}
