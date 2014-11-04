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
    this.room;
}
Player.prototype.emmitNewPlayer = function(player) {
    if (this != player) {
        this.socket.emit("newPlayer", {pseudo: player.pseudo});
    }
};
Player.prototype.emmitRefreshListPlayer = function(listPlayer) {
    this.socket.emit("refreshListPlayer", {listPlayer: listPlayer});
};


function Room(roomName,maxPlayer) {
    this.roomName=roomName;
    this.maxPlayer=maxPlayer;
    this.listPlayer = [];

}
Room.prototype.addPlayer = function(player) {
    player.number = this.listPlayer.length;
    this.listPlayer[player.number] = player;
    for (var i= 0; i < this.listPlayer.length; i++) {
        this.listPlayer[i].emmitNewPlayer(player);
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
        this.listPlayer[i].emmitRefreshListPlayer(this.listPlayer);
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
            console.log("VIDE");
            socket.emit("rspTestJRoomName", {rsp: false});
        } else {
            var rsp = (data.room in listRoom);
            console.log("rsp " + rsp);
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
        }
    });

    socket.on('quit', function (data) {
        player.room.deletePlayer(player);
    });

    socket.on('disconnect', function () {
        player.room.deletePlayer(player);
        console.log("disconnected");
    });
});
