/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-sortable',
  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/Sortable/Sortable.js');
    app.import(app.bowerDirectory + '/Sortable/jquery.binding.js');
  }
};
