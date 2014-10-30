var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use("/static", express.static(__dirname + '/static'));
app.set('view engine', 'jade');



server.listen(80, function() {
    console.log("the server is started");
});



app.get('/komecixtine', function (req, res) {
  res.sendfile(__dirname + '/views/index.html');
});

app.get('/komecixtine/create', function (req, res) {
    console.log("create room : " + req.param("room"));
    res.render(__dirname + '/views/create', { room: req.param("room"), pseudo: req.param("pseudo")});
});

app.get('/komecixtine/join', function (req, res) {
    console.log("join room : " + req.param("room"));
    res.render(__dirname + '/views/join', { room: req.param("room"), pseudo: req.param("pseudo")});
});

app.get('/profil', function (req, res) {
  res.sendfile(__dirname + '/views/profil.html');
});


io.on('connection', function (socket) {
    console.log("connection");
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
