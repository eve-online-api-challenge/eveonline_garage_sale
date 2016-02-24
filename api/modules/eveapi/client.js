var Oauth = require('./node_modules/oauth/lib/oauth2').OAuth2;
var Crest = require('./crest').Crest;

var productionurl   = 'https://login.eveonline.com/';
var testurl         = 'https://sisilogin.testeveonline.com/';

var oauthurl = 'oauth/authorize';
var tokenurl = 'oauth/token';

var response_type = 'code';

var ScopeMapping = {
    PUBLICDATA:         'publicData',
    CHARCONTRACTREAD:   'characterContactsRead',
    CHARCONTRACTWRITE:  'characterContactsWrite',
    CHARFITTINGSREAD:   'characterFittingsRead',
    CHARFITTINGSWRITE:  'characterFittingsWrite',
    CHARLOCATIONREAD:   'characterLocationRead',
    CHARNAVWRITE:       'characterNavigationWrite'
};

var eveclient = function(args){
  console.log('make client');
  this.clientid = args.clientid;
  this.secretkey = args.secretkey;
  this.callbackurl = args.callbackurl;
  this.refresh_token = args.refresh_token;
  this.access_token = args.access_token;
  this.state = args.state;
  this.baseurl = testurl;
  if(args.productionmode){
    this.baseurl = productionurl;
  }

  this.oauthclient = new Oauth(
    this.clientid,
    this.secretkey,
    this.baseurl,
    oauthurl,
    tokenurl);
  this.oauthclient.useAuthorizationHeaderforGET(true);
}

var setScopeAccess = function(scope){
  var scopestring = '';
  scope.forEach(function(s){
    scopestring += s + ' ';
  });
  return scopestring.trim();
}

eveclient.prototype.getCrestClient = function(){
  return new Crest(this);
}

eveclient.prototype.getAuthorizeUrl = function(requestScope){
  var scope = '';
  if(requestScope){
    scope = setScopeAccess(requestScope);
  }
  var requesturl = this.oauthclient.getAuthorizeUrl();
  requesturl += '&response_type=code&scope='+ scope +
                '&redirect_uri='+this.callbackurl;
  if(this.state){
    requesturl += '&state='+this.state;
  }
  return requesturl;
}

eveclient.prototype.getAccessToken = function(callback){
  if(!this.refresh_token){
    throw new Error('You need to set a refresh token first');
  }
  var postdata = {
    grant_type: 'refresh_token'
  }
  this.oauthclient.getOAuthAccessToken(this.refresh_token, postdata, function(err, access_token, refresh_token, results){
    if(err){
      callback(err);
      return;
    }
    var obj = {
      access_token: access_token,
    }
    this.access_token = access_token;
    callback(null, access_token, refresh_token, results);
  });

}

eveclient.prototype.getRefreshToken = function(code, callback){
  var postdata = {
    grant_type: 'authorization_code',
  }
  this.oauthclient.getOAuthAccessToken(code, postdata, function(err, access_token, refresh_token, results){
    if(err){
      callback(err);
      return;
    }
    console.log(results);
    var obj = {
      access_token: access_token,
      refresh_token: refresh_token
    }
    this.refresh_token = refresh_token;
    this.access_token = access_token;
    callback(null, access_token, refresh_token, results);
  });
};

eveclient.prototype.getBaseUrl = function(){
  return this.baseurl;
}

eveclient.prototype.getEncodedToken = function(){
  var authtoken = new Buffer(this.clientid+':'+this.secretkey).toString('base64');
  return authtoken;
}

exports.EveClient = eveclient;
exports.EveClient.Scope = ScopeMapping;
