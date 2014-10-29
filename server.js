var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use("/static", express.static(__dirname + '/static'));

server.listen(80, function() {
    console.log("the server is started");
});

app.get('/komecixtine', function (req, res) {
  res.sendfile(__dirname + '/views/index.html');
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
