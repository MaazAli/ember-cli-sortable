/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-sortable',

  _findHost() {
    let current = this;
    let app;

    do {
      app = current.app || app;      
    } while(current.parent.parent && (current = current.parent));

    return app;
  },

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/Sortable/Sortable.js');
    app.import(app.bowerDirectory + '/Sortable/jquery.binding.js');
  }
};
