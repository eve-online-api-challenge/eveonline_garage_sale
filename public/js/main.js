/* main.js used to setup requirejs and other modules */
require.config({
  paths: {
    jquery: '/lib/jquery/dist/jquery.min',
    jqueryui: '/lib/jquery-ui/jquery-ui.min',
    underscore: '/lib/underscore/underscore-min',
    backbone: '/lib/backbone/backbone-min',
  },
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    }
  }
});

require([
	'jquery', 'underscore', 'backbone'
], function ($, _, Backbone) {
	// Initialize routing and start Backbone.history()
	Backbone.history.start();  
});
