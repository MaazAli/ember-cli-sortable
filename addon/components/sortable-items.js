import Ember from 'ember';
import layout from '../templates/components/sortable-items';
/* global Sortable */

var SortableItems = Ember.Component.extend({
  target: Ember.computed.alias('targetObject'), // Bubble up all actions
  layout: layout,
  tagName: "ul",
  classNames: ['sortable-items'],
  classNameBindings: ['class'],

  // Allowed properties
  sort: true,
  disabled: false,
  store: null,
  animation: 150,
  handle: '',
  filter: '',
  draggable: '',
  ghostClass: 'sortable-ghost',
  scroll: true,
  scrollSensitivity: 30, // px
  scrollSpeed: 10, // px

  setup: function() {
    var self = this;
    var options = {
      sort: this.get('sort'),
      disabled: this.get('disabled'),
      store: this.get('store'),
      animation: this.get('animation'),
      handle: this.get('handle'),
      filter: this.get('filter'),
      ghostClass: this.get('ghostClass'),
      scroll: this.get('scroll'),
      scrollSensitivity: this.get('scrollSensitivity'),
      scrollSpeed: this.get('scrollSpeed'),
      onUpdate: Ember.run.bind(this, this._onUpdate)

    }

    if (this.get('draggable')) {
      options.draggable = this.get('draggable');
    }

    this.set('_sortableInstance', new Sortable(this.$()[0], options));

  }.on('didInsertElement'),

  /**
    @method _onUpdate
    @private
    Changed sorting within list
  */
  _onUpdate: function(evt) {
    Ember.run(this, function() {
      var elements = this.$().children().clone();
      var collection = this.get('itemCollection');
      var item = collection.objectAt(evt.oldIndex);
      collection.removeObject(item);
      collection.insertAt(evt.newIndex, item);
      Ember.run.next(this, function() {
        // In the next run loop we'll have to remove the
        // extra item that's created because of the update
        // to the collection
        this.$().children()[evt.newIndex + 1].remove();
        this.sendAction('onUpdateAction', item, evt.oldIndex, evt.newIndex);
      });
    });
  },

  teardown: function() {
    var _sortableInstance = this.get('_sortableInstance');
    if (_sortableInstance) {
      _sortableInstance.destroy();
    }
  }.on('willDestroyElement')

});

export default SortableItems;
