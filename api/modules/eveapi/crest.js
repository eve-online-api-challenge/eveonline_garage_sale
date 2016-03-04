var https = require('https');
/*
  Eve crest API NodeJS client
*/


//TODO need to fetch/update endpoints on start
var endpoints = {

};

var crest = function(client){
  if(!client){ //TODO need to validate object is of type client
    throw new Error('Crest API requires a valid client');
  }
  this.client = client;
}

/*
  List contacts for a character
*/
crest.prototype.getContacts = function(args, callback){
  var options = {
    hostname: 'crest-tq.eveonline.com',
    method: 'GET',
    headers: {
      Authorization:　'Bearer ' + this.client.access_token
    },
    path: '/characters/'+args.charid+'/contacts/'
  }
  var data = '';
  var req = https.request(options, function(res){
    res.on('data', function(d){
      data += d;
    })

    res.on('end',function(){
      callback(null, data);
    })
  });
  req.end();
}

crest.prototype.getCharacterInfo = function(args, callback){
  var options = {
    hostname: 'api.eveonline.com',
    method: 'GET',
    path: '/char/CharacterSheet.xml.aspx?vCode='+args.vCode+'&keyID='+args.keyID+'&characterID='+args.characterID
  }
  var data = '';
  var req = https.request(options, function(res){
    res.on('data', function(d){
      data += d;
    })

    res.on('end',function(){
      callback(null, data);
    })
  });
  req.end();
}

crest.prototype.getCharacterBalance = function(args, callback){
  var options = {
    hostname: 'api.eveonline.com',
    method: 'GET',
    path: '/char/AccountBalance.xml.aspx?vCode='+args.vCode+'&keyID='+args.keyID+'&characterID='+args.characterID
  }
  var data = '';
  var req = https.request(options, function(res){
    res.on('data', function(d){
      data += d;
    })

    res.on('end',function(){
      callback(null, data);
    })
  });
  req.end();
}

crest.prototype.getAssets = function(args, callback){
  var options = {
    hostname: 'api.eveonline.com',
    method: 'GET',
    path: '/char/AssetList.xml.aspx?flat=1&vCode='+args.vCode+'&keyID='+args.keyID+'&characterID='+args.characterID
  }
  var data = '';
  var req = https.request(options, function(res){
    res.on('data', function(d){
      data += d;
    })

    res.on('end',function(){
      callback(null, data);
    })
  });
  req.end();
}

crest.prototype.getMarketPrices = function(callback){
  var options = {
    hostname: 'public-crest.eveonline.com',
    method: 'GET',
    path: '/market/prices/'
  }
  var data = '';
  var req = https.request(options, function(res){
    res.on('data', function(d){
      data += d;
    })

    res.on('end',function(){
      callback(null, data);
    })
  });
  req.end();
}

crest.prototype.getUserInfo  = function(args, callback){
  this.client.oauthclient.get(this.client.baseurl+'/oauth/verify', this.client.access_token, callback);
}

exports.Crest = crest;
