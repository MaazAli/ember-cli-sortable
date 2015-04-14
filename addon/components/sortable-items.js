import Ember from 'ember';
import layout from '../templates/components/sortable-items';
/* global Sortable */

var SortableItems = Ember.Component.extend({
  layout: layout,
  tagName: "ul",
  classNames: ['sortable-items'],

  // Allowed properties
  sort: true,
  disabled: false,
  store: null,
  animation: 150,
  handle: '',
  filter: '',
  draggable: '',
  ghostClass: '.sortable-ghost',
  scroll: true,
  scrollSensitivity: 30, // px
  scrollSpeed: 10, // px

  setup: function() {
    var self = this;
    this.$().sortable({
      sort: this.get('sort'),
      disabled: this.get('disabled'),
      store: this.get('store'),
      animation: this.get('animation'),
      handle: this.get('handle'),
      filter: this.get('filter'),
      draggable: this.get('draggable'),
      ghostClass: this.get('ghostClass'),
      scroll: this.get('scroll'),
      scrollSensitivity: this.get('scrollSensitivity'),
      scrollSpeed: this.get('scrollSpeed'),
      onStart: function(event) {
        if (self.get('onStartAction')) {
          self.sendAction('onStartAction', event);
        }
      },
      onEnd: function(event) {
        if (self.get('onEndAction')) {
          self.sendAction('onEndAction', event);
        }
      },
      onAdd: function(event) {
        if (self.get('onEndAction')) {
          self.sendAction('onEndAction', event);
        }
      },
      onUpdate: function(event) {
        if (self.get('onUpdateAction')) {
          self.sendAction('onUpdateAction', event);
        }
      },
      onSort: function(event) {
        if (self.get('onSortAction')) {
          self.sendAction('onSortAction', event);
        }
      },
      onRemove: function(event) {
        if (self.get('onRemoveAction')) {
          self.sendAction('onRemoveAction', event);
        }
      },
      onFilter: function(event) {
        if (self.get('onFilterAction')) {
          self.sendAction('onFilterAction', event);
        }
      }
    });
  }.on('didInsertElement'),

  teardown: function() {
    this.$().sortable("destroy");
  }.on('willDestroyElement')

});

export default SortableItems;
