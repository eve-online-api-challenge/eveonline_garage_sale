'use strict';
define(['jquery',
  'underscore',
  'backbone'],
  function($,_,Backbone){
    var M_EVEAPICHAR = (function(){
      var EveApiChar = function(){
        this._model = Backbone.Model.extend({
          defaults: {
          }
        });
      };
      EveApiChar.prototype.Model = function(model){ return new this._model(model); }
      return new EveApiChar();
    })();
    return M_EVEAPICHAR;
  });
