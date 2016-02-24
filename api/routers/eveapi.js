var express       = require('express'),
    router        = express.Router(),
    jsonwebtoken 	= require('jsonwebtoken'),
    bodyParser    = require('body-parser'),
    EveClient 	  = require('../modules/eveapi/client').EveClient,
    Scope         = EveClient.Scope;

var jwtkey = 'testkey';  //TODO need to move this

var createClient = function(args){
	var clientdata = args || {};
	clientdata.clientid = '0b4e5d8399b84598bade7484629b1ed0';
	clientdata.secretkey = 'hQJbbbCOUi2NKUB7jrRJxVrqLDWbTMiDGNJ5Xnqy';
	clientdata.callbackurl = 'http://192.168.33.10:45480/eve/callback';
	clientdata.productionmode = true;

	return new EveClient(clientdata);
}

router.get('/login', function(req, res){
	var stateToken = jsonwebtoken.sign({valid: 0}, jwtkey, {expiresIn: "20m"});
	var client = createClient({state: stateToken});

	var requestScope = [Scope.CHARCONTRACTREAD,
		 									Scope.CHARCONTRACTWRITE,
											Scope.CHARLOCATIONREAD];

	console.log(client.getAuthorizeUrl(requestScope));
	res.redirect(302, client.getAuthorizeUrl(requestScope));
});

router.get('/callback', function(req, res){
	console.log('token: ' + req.query.code);
	if(req.query.state && req.query.state.length > 0){
		try{
			jsonwebtoken.verify(req.query.state, jwtkey);
		}catch(err){
			res.status(401).json({error: 'token not valid'}).end();
		}
	}
	var client = createClient();

	client.getRefreshToken(req.query.code, function(err, access_token, refresh_token, results){
		var authtoken = jsonwebtoken.sign({access_token: access_token}, jwtkey, {expiresIn: results.expires_in});
		var refreshtoken = jsonwebtoken.sign({refresh_token: refresh_token}, jwtkey);
		var payload = {
			access_token: authtoken,
			refresh_token: refreshtoken,
			expiresIn: results.expires_in,
			status: 0
		}
		//TODO redirect user
		res.status(200).json(payload).end();
	});
});

router.get('/access', function(req, res){
	var refresh_token = req.query.refresh_token || null;
	if(!refresh_token){
		res.status(400).json({error: 'need a refresh token', status: 9}).end();
	}
	try{
		var decode = jsonwebtoken.verify(refresh_token, jwtkey);
		var client = createClient({refresh_token: decode.refresh_token});

		client.getAccessToken(function(err, access_token, refresh_token, results){
			var authtoken = jsonwebtoken.sign({access_token: access_token}, jwtkey, { expiresIn: results.expires_in });
			var payload = {
				access_token: authtoken,
				expiresIn: results.expires_in,
				status: 0
			}
			res.status(200).json(payload).end();
		});
	}catch(err){
		console.log('token not correct: ' + err);
		res.status(400).json({error: 'token expired', status: 9}).end();
	}
})

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use('/', function(req, res, next){
  var refresh_token = req.query.refresh_token || null;
  var access_token = req.query.access_token || null;

  if(refresh_token){
    req.body.refresh = jsonwebtoken.verify(refresh_token, jwtkey);
  }
  if(access_token){
    try{
      req.body.token = jsonwebtoken.verify(access_token, jwtkey);
      next();
      return;
    }catch(err){
      console.log(err);
    }
  }
  res.status(400).json({error: 'needs access_token', status: 1});
})

router.get('/user', function(req, res){
  var client = createClient({access_token: req.body.token.access_token});
  var crest = client.getCrestClient();
  crest.getUserInfo(null, function(err, results){
    console.log(results);
  });
})

router.get('/contract', function(req, res){
  var client = createClient({access_token: req.body.token.access_token});
  var crest = client.getCrestClient();
  crest.getContracts({charid: '145800005'}, function(err, results){
    console.log(results);
  });
});

router.post('/contract', function(req, res){

});

router.get('/location', function(req, res){

});



module.exports = router;
