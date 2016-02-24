var https = require('https');
/*
  Eve crest API NodeJS client
*/

var crest = function(client){
  if(!client){ //TODO need to validate object is of type client
    throw new Error('Crest API requires a valid client');
  }
  this.client = client;
}

/*
  List contrants for a character
*/
crest.prototype.getContracts = function(args, callback){

  var options = {
    hostname: 'crest-tq.eveonline.com',
    method: 'GET',
    headers: {
      Authorization:　'Bearer ' + this.client.access_token,
      'Accept': 'application/vnd.ccp.eve.Api-v3+json; charset=utf-8'
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

  //this.client.oauthclient.get(this.client.baseurl+'/characters/'+args.charid+'/contrants/', this.client.access_token, callback);
}

/*
  Create a contract for a character
*/
crest.prototype.createContract = function(args){

}

crest.prototype.getUserInfo  = function(args, callback){
  this.client.oauthclient.get(this.client.baseurl+'/oauth/verify', this.client.access_token, callback);
}

exports.Crest = crest;
