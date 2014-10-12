var express = require('express');
var app = express();
var fs = require('fs');

app.use("/static", express.static(__dirname + '/static'));

app.get('/', function(req, res){
    fs.readFile(__dirname + '/views/index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
});

var server = app.listen(8888, function() {
    console.log("dirname : " + __dirname);
    console.log('Listening on port %d', server.address().port);
});
