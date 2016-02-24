'use strict';
define(['jquery',
  'underscore',
  'backbone'],
  function($,_,Backbone){
    var M_EVEAPIAUTH = (function(){
      var EveApiAuth = function(){
        this._model = Backbone.Model.extend({
          defaults: {
            access_token: null,
            refresh_token: null,
            expiresIn: null,
          }
        });
      };
      EveApiAuth.prototype.Model = function(model){ return new this._model(model); }
      return new EveApiAuth();
    })();
    return M_EVEAPIAUTH;
  });
