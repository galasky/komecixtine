var express = require('express');
var app = express();

app.set('views', './views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.get('/', function (req, res) {
    res.render('index.html');
})

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

