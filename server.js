var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use("/static", express.static(__dirname + '/static'));
app.set('view engine', 'jade');



server.listen(80, function() {
    console.log("the server is started");
});

function Player(pseudo, sock) {
    this.pseudo = pseudo;
    this.socket = sock;
    this.number = -1;
    this.room = null;
    this.hands = [];
}
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
        this.socket.emit("start");
};
Player.prototype.takeCards = function(number) {
    console.log("takeCards " + this.pseudo);
    this.hands = room.stack.pop(number);
};

function Card(value, color) {
    this.value = value;
    this.color = color;
}

function Stack() {
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
Stack.prototype.pop = function (number) {
    var cards = [];
    for (var i = 0; i < number; i++) {
        var card = this.cards.pop();
        console.log("pop " + card.value + " " + card.color);
        cards.push(card);
    }
    return cards;
};

function Room(roomName,maxPlayer) {
    this.roomName=roomName;
    this.maxPlayer=maxPlayer;
    this.listPlayer = [];
    this.started = false;
    this.stack = null;
}
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
};

var listRoom = {};

app.get('/komecixtine', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/komecixtine/create', function (req, res) {
    var room = req.param("room");

    if (room in listRoom) {
        console.log("error : room already exist");
    } else {
        console.log("create room : " + room);
        listRoom[room] = new Room(room, 4);
    }
    res.render(__dirname + '/views/create', { room: room, pseudo: req.param("pseudo")});
});

app.get('/komecixtine/join', function (req, res) {
    var room = req.param("room");

    if (room in listRoom) {
        console.log("join room : " + room);
    } else {
        console.log("error : room doesn't exist");
    }
    res.render(__dirname + '/views/join', { room: room, pseudo: req.param("pseudo")});
});

app.get('/profil', function (req, res) {
  res.render(__dirname + '/views/profil.html');
});



io.on('connection', function (socket) {
    console.log("connection");
    var player = new Player("unknow", socket);

    socket.on("testCRoomName", function(data){
        if (data.room == "") {
            console.log("VIDE");
            socket.emit("rspTestCRoomName", {rsp: false});
        } else {
            var rsp = !(data.room in listRoom);
            console.log("rsp " + rsp);
            socket.emit("rspTestCRoomName", {rsp: rsp});
        }
    });

    socket.on("testCPseudo", function(data){
        if (data.pseudo == "") {
            socket.emit("rspTestCPseudo", {rsp: false});
        } else {
            socket.emit("rspTestCPseudo", {rsp: true});
        }
    });

    socket.on("testJRoomName", function(data){
        if (data.room == "") {
            socket.emit("rspTestJRoomName", {rsp: false});
        } else {
            var rsp = (data.room in listRoom && listRoom[data.room].listPlayer.length < 4 && listRoom[data.room].started == false);
            socket.emit("rspTestJRoomName", {rsp: rsp});
        }
    });

    socket.on("testJPseudo", function(data){
        if (data.pseudo == "") {
            socket.emit("rspTestJPseudo", {rsp: false});
        } else {
            socket.emit("rspTestJPseudo", {rsp: true});
        }
    });


    socket.on("hello", function(data) {
        console.log("hello!");
    });

    socket.on('create', function (data) {
//        console.log("creation de la room " + data.room);
        if (data.room in listRoom) {
            console.log("error : room already exist");
        } else {
            console.log("create room : " + data.room);
            var room = new Room(data.room, 4);
            player.pseudo = data.pseudo;
            player.room = room;
            room.addPlayer(player);
            listRoom[data.room] = room;
        }
    });

    socket.on('join', function (data) {
//        console.log("join de la room " + data.room);
        if (data.room in listRoom) {
            var room = listRoom[data.room];
            var list = [];
            for (var i = 0; i < room.listPlayer.length; i++) {
                list[i] = room.listPlayer[i].pseudo;
            }
            socket.emit("listPlayer", {listPlayer: list});
            player.room = room;
            player.pseudo = data.pseudo;
            room.addPlayer(player);
            if (room.listPlayer.length == 4) {
                room.start();
            }
        }
    });

    socket.on('quit', function (data) {
        if (player.room != null) {
            player.room.deletePlayer(player);
        }
    });

    socket.on('disconnect', function () {
        if (player.room != null) {
            player.room.deletePlayer(player);
        }
        console.log("disconnected");
    });
});
