var express = require('express');
var app = express();
var path = require('path');

app.set('views', './views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use("/static", express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res, next) {
    res.render('index',{title:"my home page"}, function(err, html) {
	if (err) return next(err);
	res.end(html);
    });
})

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

