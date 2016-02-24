'use strict';
define(['jquery',
  'underscore',
  'backbone'],
  function($,_,Backbone){
    var M_EVEAPICONTRACT = (function(){
      var EveApiContract = function(){
        this._model = Backbone.Model.extend({
          defaults: {
          }
        });
        this._collection = Backbone.Collection.extend({
          model: this._model
        });
      };
      EveApiContract.prototype.Model = function(model){ return new this._model(model); }
      EveApiContract.prototype.Collection = function() { return new this._collection(); }
      return new EveApiContract();
    })();
    return M_EVEAPICONTRACT;
  });
