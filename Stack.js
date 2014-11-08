var Card = require('./Card.js');

module.exports = function Stack() {
    this.carpet = [];
    this.cards = [];
    for (var i = 0; i < 13; i++) {
        this.cards.push(new Card(i + 1, "pic"));
    }
    for (var i = 0; i < 13; i++) {
        this.cards.push(new Card(i + 1, "coeur"));
    }
    for (var i = 0; i < 13; i++) {
        this.cards.push(new Card(i + 1, "caro"));
    }
    for (var i = 0; i < 13; i++) {
        this.cards.push(new Card(i + 1, "trefle"));
    }
}
var Stack = require('./Stack.js');
Stack.prototype.pop = function (number) {
    var cards = [];
    for (var i = 0; i < number; i++) {
        var card = this.cards.pop();
        cards.push(card);
    }
    return cards;
};
Stack.prototype.drop = function (card) {
    this.carpet.push(card);
}
Stack.prototype.recup = function () {
    return this.carpet.pop();
}