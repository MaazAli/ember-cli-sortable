import Ember from 'ember';
import layout from '../templates/components/sortable-items';
/* global Sortable */

var SortableItems = Ember.Component.extend({
  target: Ember.computed.alias('targetObject'), // Bubble up all actions
  layout: layout,
  tagName: "ul",
  classNames: ['sortable-items'],
  classNameBindings: ['class'],

  /**
    Sortable properties with reasonable defaults

    @properties
    @public
  */
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

  /**
    @method setup
    Initializes Sortable with given properties and binds
    callbacks to private methods
  */
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
      onStart: Ember.run.bind(this, this._onStart),
      onEnd: Ember.run.bind(this, this._onEnd),
      onAdd: Ember.run.bind(this, this._onAdd),
      onUpdate: Ember.run.bind(this, this._onUpdate),
      onSort: Ember.run.bind(this, this._onSort),
      onRemove: Ember.run.bind(this, this._onRemove),
      onFilter: Ember.run.bind(this, this._onFilter)
    }

    if (this.get('draggable')) {
      options.draggable = this.get('draggable');
    }

    this.set('_sortableInstance', new Sortable(this.$()[0], options));

  }.on('didInsertElement'),


  /**
    @method _onStart
    @private
    The user has started to drag an item
  */
  _onStart: function(evt) {
    this._sendOutAction('onStartAction', evt)
  },

  /**
    @method _onEnd
    @private
    The user has stopped draggging an item
  */
  _onEnd: function(evt) {
    this._sendOutAction('onEndAction', evt)
  },

  /**
    @method _onAdd
    @private
    An item is dropped into the list from another list
  */
  _onAdd: function(evt) {
    this._sendOutAction('onAddAction', evt)
  },

  /**
    @method _onUpdate
    @private
    Changed sorting within list
  */
  _onUpdate: function(evt) {
    this._sendOutAction('onUpdateAction', evt);

    Ember.run(this, function() {
      var collection = this.get('itemCollection');
      var item = collection.objectAt(evt.oldIndex);
      collection.removeObject(item);
      collection.insertAt(evt.newIndex, item);
      Ember.run.scheduleOnce('afterRender', this, function() {
        // After the render we'll have to remove the
        // extra item that's created because of the update
        // to the collection
        this.$().children()[evt.newIndex + 1].remove();
        this.sendAction('onItemMoveAction', item, evt.oldIndex, evt.newIndex);
      });
    });
  },

  /**
    @method _onSort
    @private
    Called when any change occurs within the list (add, update, remove)
  */
  _onSort: function(evt) {
    this._sendOutAction('onSortAction', evt)
  },


  /**
    @method _onRemove
    @private
    An item is removed from the list and added into another
  */
  _onRemove: function(evt) {
    this._sendOutAction('onRemoveAction', evt)
  },

  /**
    @method _onFilter
    @private
    Called when an attempt is made to drag a filtered item
  */
  _onFilter: function(evt) {
    this._sendOutAction('onFilterAction', evt)
  },


  _sendOutAction: function(action, evt) {
    if (this.get(action)) {
      this.sendAction(action, evt);
    }
  },
  
  teardown: function() {
    var _sortableInstance = this.get('_sortableInstance');
    if (_sortableInstance) {
      _sortableInstance.destroy();
    }
  }.on('willDestroyElement')

});

export default SortableItems;
