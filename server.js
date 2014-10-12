var express = require('express');
var app = express();
var fs = require('fs');

app.get('/', function(req, res){
    fs.readFile('./views/index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
});

var server = app.listen(8888, function() {
    console.log('Listening on port %d', server.address().port);
});
