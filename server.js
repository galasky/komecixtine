var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use("/static", express.static(__dirname + '/static'));
app.set('view engine', 'jade');



server.listen(80, function() {
    console.log("the server is started");
});

function Room(roomName,maxPlayer) {
    this.roomName=roomName;
    this.maxPlayer=maxPlayer;
}

var listRoom = {};

app.get('/komecixtine', function (req, res) {
  res.sendfile(__dirname + '/views/index.html');
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
  res.sendfile(__dirname + '/views/profil.html');
});


io.on('connection', function (socket) {
    console.log("connection");
    socket.emit('news', { hello: 'world' });

    socket.on('create', function (data) {
//        console.log("creation de la room " + data.room);
    });

    socket.on('join', function (data) {
//        console.log("join de la room " + data.room);
    });
});
