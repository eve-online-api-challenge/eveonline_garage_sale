var express 		= require('express'),
		cookieParser 	= require('cookie-parser'),
		http 				= require('http'),
		path		      = require("path"),
		https  			= require('https'),
		models 			= require('./models'),
		evemarket 	= require('./routers/eveapi');


var publicfolder = path.join(__dirname, '..', 'public');

//var config = require('config');
var server_options = {
	port:45480
}

var secure_options = {
	port: 443,
	key: null,
	cert: null
}



// ====  initialize basic objects ====
var app = module.exports = express();
var server = http.createServer(app);
//var sserver = https.createServer(secure_options, app);
app.use(cookieParser());



// ==== initialize middleware ====


// ==== initialize routes ====
app.use('/eve', require('./routers/eveapi'));

app.get('/', function(req, res){
	res.sendFile(publicfolder + '/html/index.html');
});

app.get('/user', function(req, res){
	res.sendFile(publicfolder + '/html/user.html');
});

app.get('/character', function(req, res){
	res.sendFile(publicfolder + '/html/character.html');
});

app.use('/', express.static(publicfolder));

// ==== start server non secure ====
server.listen(server_options.port, function(){
	console.log('listening on *:' + server.address().port);
	//evemarket.updateMarketData();
})

// ==== start server secure ====
