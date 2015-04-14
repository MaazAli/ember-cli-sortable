import Ember from 'ember';
/* global Sortable */

var SortableItems = Ember.Component.extend({
  tagName: "ul",
  classNames: ['sortable-items'],
  setup: function() {
    var sortable = new Sortable(this.$(), {
      animation: 150,
      handle: this.get('handle'),
      filter: this.get('filterClass'),
      draggable: this.get('draggableClass'),
      ghostClass: this.get('ghostClass')
    });

    debugger;
  }.on('didInsertElement'),

  teardown: function() {

  }.on('willDestroyElement')

});

export default SortableItems;
