var express = require('express');
var app = require('express')();

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use("/static", express.static(__dirname + '/static'));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

server.listen(80, function() {
    console.log("the server is started");
});

app.get('/komecixtine', function (req, res) {
  res.sendfile('index.html');
});

app.get('/komecixtine/create', function (req, res) {
    console.log("create room : " + req.param("room"));
    res.render('create.html', { room: res.param("room"), name: "galasky"});
//    res.sendfile(__dirname + '/views/create.html');
});

app.get('/komecixtine/join', function (req, res) {
    console.log("join room : " + req.param("room"));
    res.render('join', { room: req.param("room"), name: "galasky"});
//    res.sendfile(__dirname + '/views/join.html');
});

app.get('/profil', function (req, res) {
  res.sendfile('profil.html');
});

io.on('connection', function (socket) {
    console.log("connection");
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
