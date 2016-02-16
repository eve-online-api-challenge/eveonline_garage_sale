var express = require('express'),
		http = require('http'),
		https = require('https');

//var config = require('config');
var server_options = {
	port:45480
}

var secure_options = {
	port: 45443,
	key: null,
	cert: null
}

// ====  initialize basic objects ====
var app = module.exports = express();
var server = http.createServer(app);
//var sserver = https.createServer(secure_options, app);

// ==== initialize session ====


// ==== initialize middleware ====


// ==== initialize routes ====

app.get('/', function(req, res){
	console.log('get');
	res.send('hello test 4');
	res.end();
});


// ==== start server non secure ====
server.listen(server_options.port, function(){
	console.log('listening on *:' + server.address().port);
})

// ==== start server secure ====
