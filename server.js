var express = require('express');
var app = express();

app.set('views', './views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function (req, res) {
    res.render('index',{title:"my home page"});
})

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

