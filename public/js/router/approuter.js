'use strict';
define(['jquery', 'underscore', 'backbone', 'app'],
  function($,_,Backbone,APP){
    var EVE_ROUTER = (function(){
      var EveRouter = function(){
        this._app = APP;
        this._router = Backbone.Router.extend({
          routes:{
            'home': 'home', //Start page
            'login': 'login', //Start Oauth request
            'callback/:token': 'callback', //Oauth callback
            'manager': 'manager' //Char manager -- Add XML access
            'character': 'character', //Show char info
            'contracts': 'contracts', //Show char contracts
            'makelisting', 'makelisting', //Add items to the store
            'store': 'store', //Display open contracts
            'buy/:id': 'buy' //Init a new contact
          }
        });
      }
      EveRouter.prototype.Router = function(){return new this._router();}
      EveRouter.prototype.App = function(){ return this._app; }

      return new EveRouter();
    })();
    return EVE_ROUTER;
  });
