'use strict';
define(['jquery',
  'underscore',
  'backbone'],
  function($,_,Backbone){
    var M_EVEAPI = (function(){
      var EveApi = function(){
        this._model = Backbone.Model.extend({
          defaults: {
          }
        });
      };
      EveApi.prototype.Model = function(model){ return new this._model(model); }
      return new EveApi();
    })();
    return M_EVEAPI;
  });
