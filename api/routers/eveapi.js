var express       = require('express'),
    router        = express.Router(),
    jsonwebtoken 	= require('jsonwebtoken'),
    models        = require('../models'),
    bodyParser    = require('body-parser'),
    bodyParser    = require('body-parser'),
    parseString   = require('xml2js').parseString,
    EveClient 	  = require('../modules/eveapi/client').EveClient,
    Scope         = EveClient.Scope;

var jwtkey = 'testkey';  //TODO need to move this

var createClient = function(args){
	var clientdata = args || {};
	clientdata.clientid = '0b4e5d8399b84598bade7484629b1ed0';
	clientdata.secretkey = 'hQJbbbCOUi2NKUB7jrRJxVrqLDWbTMiDGNJ5Xnqy';
	clientdata.callbackurl = 'http://192.168.33.11:45480/eve/callback';
	clientdata.productionmode = true;

	return new EveClient(clientdata);
}

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

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
    console.log(results);
		var authtoken = jsonwebtoken.sign({access_token: access_token}, jwtkey, {expiresIn: results.expires_in});
		var refreshtoken = jsonwebtoken.sign({refresh_token: refresh_token}, jwtkey);
		var payload = {
			access_token: authtoken,
			refresh_token: refreshtoken,
			expiresIn: results.expires_in,
			status: 0
		}
    res.cookie('access', authtoken, {maxAge: results.expires_in * 1000, httpOnly: true});
    res.cookie('refresh', refreshtoken, {httpOnly: true});
		//TODO redirect user
		res.redirect('/user');
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
      res.cookie('access', authtoken, {maxAge: results.expires_in * 1000, httpOnly: true});
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
  var refresh_token = req.query.refresh_token || req.cookies['refresh'] || null;
  var access_token = req.query.access_token || req.cookies['access'] || null;

  if(refresh_token){
    req.body.refresh = jsonwebtoken.verify(refresh_token, jwtkey);
    console.log(req.body.refresh);
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

var calculateNetvalue = function(charid, vCode, keyID, callback){
  models.User.find({
    where:{
      CharacterID: charid
    }
  }).then(function(character){
    var client = createClient();
    var crest = client.getCrestClient();

    var args = {
      characterID: charid,
      vCode: vCode,
      keyID: keyID
    }

    crest.getCharacterBalance(args, function(err, results){
      parseString(results, function(err, jsonresults){
        console.log(JSON.stringify(jsonresults));
        var value = new Number(jsonresults.eveapi.result[0].rowset[0].row[0].$.balance) || 0;
        console.log('account balance: ' + value);
        crest.getAssets(args, function(err, results){
          parseString(results, function(err, jsonresults){
            var count = 0;
            jsonresults.eveapi.result[0].rowset[0].row.forEach(function(item, index, arry){
              //console.log(item.$.typeID);

              models.Market.find({
                where: {
                  id: item.$.typeID
                }
              }).then(function(data){
                if(data.averagePrice){
                  value += item.$.quantity * data.averagePrice;
                }else{
                  value += item.$.quantity * data.adjustedPrice;
                }
                count++;
                //console.log(count + ' ' + arry.length);

                if(count == arry.length){
                  console.log(value);
                  character.set({
                    netvalue: value
                  })
                  character.save();
                  callback(null, value);
                }
              }).catch(function(err){
                count++;
              })
            });
          })
        });
      });
    });
  }).catch(function(err){
    callback('char id not found: ' + err);
  });
}

router.post('/user/', function(req, res){
  var vCode = req.body.vCode || '';
  var keyID = req.body.keyID || '';
  var charid = req.body.charid || '';

  models.User.find({
    where: {
      CharacterID: charid
    }
  }).then(function(character){
    character.set({
      vCode: vCode,
      keyID: keyID
    })
    character.save();
    calculateNetvalue(charid, vCode, keyID, function(value){
      console.log('char id(' + charid + ') is has ' + value);
      res.redirect('/character');
    })
  }).catch(function(err){
    res.redirect('/');
  });
});

router.get('/user', function(req, res){
  var vCode = req.query.vCode || '';
  var keyID = req.query.keyID || '';

  var client = createClient({access_token: req.body.token.access_token});
  var crest = client.getCrestClient();
  crest.getUserInfo(null, function(err, results){
    console.log(results);
    var jsonresults = JSON.parse(results);
    models.User.findOrCreate({
      where:{
        CharacterID: jsonresults.CharacterID
      },
      defaults: {
        CharacterID: jsonresults.CharacterID,
        CharacterName: jsonresults.CharacterName,
        refresh_token: req.body.refresh.refresh_token,
        vCode: vCode,
        keyID: keyID
      }
    }).spread(function(character, created){
      if(!created){
        character.set({
          refresh_token: req.body.refresh,
          vCode: vCode,
          keyID: keyID
        })
        character.save();
      }else{
        //calculateNetvalue(character.CharacterID, vCode, keyID, function(){});
      }
    }).catch(function(err){
      console.log('error saving DB: ' + err);
    });
    res.status(200).json(jsonresults).end();
  });
})

router.get('/contacts', function(req, res){
  var client = createClient({access_token: req.body.token.access_token});
  var crest = client.getCrestClient();
  console.log(req.query.charid);
  crest.getContacts({charid: req.query.charid}, function(err, results){
    res.status(200).json(JSON.parse(results)).end();
  });
});

router.get('/netvalue', function(req, res){
    var charid = req.query.charid || null;
    models.User.find({
      where:{
        CharacterID: charid
      }
    }).then(function(results){
      res.status(200).json({networth: results.netvalue});
    }).catch(function(error){
      res.status(400).json({status: 9, error: 'not found'});
    });
})

var updateMarketData = function(){
  var client = createClient();
  var crest = client.getCrestClient();
  crest.getMarketPrices(function(err, results){
    var jsonresults = JSON.parse(results);
    jsonresults.items.forEach(function(item){
      models.Market.findOrCreate({
        where:{
          id: item.type.id_str
        },
        defaults: {
          id: item.type.id_str,
          name: item.type.name,
          adjustedPrice: item.adjustedPrice,
          averagePrice: item.averagePrice
        }
      }).spread(function(resutls, created){
          if(!created){
            results.set({
              name: item.name,
              adjustedPrice: item.adjustedPrice,
              averagePrice: item.averagePrice
            })
            results.save();
          }
        }).catch(function(err){
          console.log(err);
        });
    });
  });
}



// router.get('/assets', function(req, res){
//   var charid = req.query.charid || null;
//
//
// });

// router.get('/market/prices/', function(req, res){
//   var client = createClient();
//   var crest = client.getCrestClient();
//   crest.getMarketPrices(function(err, results){
//     var jsonresults = JSON.parse(results);
//     jsonresults.items.forEach(function(item){
//       models.Market.findOrCreate({
//         where:{
//           id: item.type.id_str
//         },
//         defaults: {
//           id: item.type.id_str,
//           name: item.type.name,
//           adjustedPrice: item.adjustedPrice,
//           averagePrice: item.averagePrice
//         }
//       }).spread(function(resutls, created){
//           if(!created){
//             results.set({
//               name: item.name,
//               adjustedPrice: item.adjustedPrice,
//               averagePrice: item.averagePrice
//             })
//             results.save();
//           }
//         }).catch(function(err){
//           console.log(err);
//         });
//     });
//     res.status(200).json(jsonresults).end();
//   });
// });



module.exports = router;
module.exports.updateMarketData = updateMarketData;
