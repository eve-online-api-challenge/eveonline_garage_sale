
define(
  [ 'jquery',
    'underscore',
    'backbone',
    'model/eveapiauth',
    'model/eveapichar']
    function($,_,Backbone, M_EVEAPIAUTH, M_EVEAPICHAR){
      var APP = (function(){
        var App = function(){
          this.auth = null;
          this.character = null;
        }

        App.prototype.setAuth = function(auth){
          this.auth = M_EVEAPIAUTH.Model(auth);
        }

        App.prototype.getAuth = function(){
          return this.auth;
        }

        App.prototype.setCharacter = function(chardata){
          this.character = M_EVEAPICHAR.Model(chardata);
        }

        App.prototype.getCharacter = function(){
          return this.character;
        }

        return new App();
      })();
      return APP;
    });
