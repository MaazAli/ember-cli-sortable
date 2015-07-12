import Ember from 'ember';
import layout from '../templates/components/sortable-items';
/* global Sortable */

var pid,
    frozen,
    frozenObjects,
    positions;

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
  group: null,
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

    var options = {
      group: this.get('group'),
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
      onFilter: Ember.run.bind(this, this._onFilter),
      onMove: Ember.run.bind(this, this._onMove)
    };

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

    Ember.run(this, function() {
      var freezeSelector = this.get('freeze');

      if (freezeSelector) {
        var _sortableInstance = this.get('_sortableInstance');
        var itemCollection = this.get('itemCollection');
        frozenObjects = [];

        frozen = [].slice.call(_sortableInstance.el.querySelectorAll(freezeSelector));
        positions = frozen.map(function (el) {
          return Sortable.utils.index(el);
        });

        positions.forEach(function(position) {
          frozenObjects.pushObject(itemCollection.objectAt(position));
        });
      }
    });

    this._sendOutAction('onStartAction', evt);
  },

  /**
    @method _onEnd
    @private
    The user has stopped draggging an item
  */
  _onEnd: function(evt) {
    this._sendOutAction('onEndAction', evt);
  },

  /**
    @method _onAdd
    @private
    An item is dropped into the list from another list
  */
  _onAdd: function(evt) {
    this._sendOutAction('onAddAction', evt);
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
      var list = evt.to;
      var freezeSelector = this.get('freeze');
      collection.removeAt(evt.oldIndex);
      collection.insertAt(evt.newIndex, item);
      // Remove the duplicate
      evt.item.parentNode.removeChild(evt.item);

      if (freezeSelector) {
        var duplicates = 0;
        frozenObjects.forEach(function(obj, i) {
          var pos = positions[i];
          if (collection.objectAt(pos) !== obj) {
            var realPos = collection.indexOf(obj);
            collection.removeAt(realPos);
            collection.insertAt(pos, obj);
            // Remove the duplicate
            if (realPos > pos) {
              list.children[pos - 1 - duplicates].remove();
            } else {
              list.children[pos + duplicates].remove();
            }
            duplicates++;
          }
        });
      }


      this.sendAction('onItemMoveAction', item, evt.oldIndex, evt.newIndex);

    });
  },

  /**
    @method _onSort
    @private
    Called when any change occurs within the list (add, update, remove)
  */
  _onSort: function(evt) {
    this._sendOutAction('onSortAction', evt);
  },


  /**
    @method _onRemove
    @private
    An item is removed from the list and added into another
  */
  _onRemove: function(evt) {
    this._sendOutAction('onRemoveAction', evt);
  },

  /**
    @method _onFilter
    @private
    Called when an attempt is made to drag a filtered item
  */
  _onFilter: function(evt) {
    this._sendOutAction('onFilterAction', evt);
  },

  /**
    @method _onMove
    @private
    Called when re-ordering the list during drag
  */
  _onMove: function(evt) {
    this._sendOutAction('onMoveAction', evt);

    var vector;
    var freeze = false;
    var freezeSelector = this.get('freeze');

    if (freezeSelector) {
      clearTimeout(pid);

      pid = setTimeout(function () {
        var list = evt.to;
        frozen.forEach(function (el, i) {
          var idx = positions[i];

          if (list.children[idx] !== el) {
            var realIdx = Sortable.utils.index(el);
            list.insertBefore(el, list.children[idx + (realIdx < idx)]);
          }
        });
      }, 0);

      frozen.forEach(function (el) {
        if (el === evt.related) {
          freeze = true;
        }

        if (evt.related.nextElementSibling === el &&
            evt.relatedRect.top < evt.draggedRect.top) {
          vector = -1;
        }
      });
      return freeze ? false : vector;
    }
  },

  /**
    @method _updateOptionDisabled
    @private
    Used to update sortable properties
  */
  _updateOptionDisabled: function() {
    var _sortableInstance = this.get('_sortableInstance');
    _sortableInstance.option('disabled', this.get('disabled'));
  }.observes('disabled'),

  /**
    @method _sendOutAction
    @private
    Used as an interface for the sendAction method, checks if consumer defined
    an action before sending one out
  */
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
