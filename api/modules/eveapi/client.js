var oauth = require('oauth').OAuth;

var productionurl   = 'https://login.eveonline.com/';
var testurl         = 'https://sisilogin.testeveonline.com/';

var oauth = 'oauth/authorize';
var token = 'oauth/token';

var eveclient = function(args){
  this.clientid = args.clientid;
  this.secretkey = args.secretkey;
  this.callbackurl = args.callbackurl;
  if(args.testmode){
    this.baseurl = testurl;
  }else{
    this.baseurl = productionurl;
  }
  this.token = args.token;

  this.oauthclient = new OAuth(
    this.baseurl+oauth,
    this.baseurl+token,
    this.clientid,
    this.secretkey,
    "1.0",
    this.callbackurl,
    "HMAC-SHA1");

}

eveclient.prototype.getOauthUrl = function(){
  var self = this;
  var p = new Promise(function(resolve, reject){
    self.oauthclient.getOAuthRequestToken(function(err, oauthToken, oauthTokenSecret, results) {
    callback(err, oauthToken, oauthTokenSecret, results);
  });

  })
  return p;
}



exports.EveClient = eveclient;
