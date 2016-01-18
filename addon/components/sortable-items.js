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
  tagName: "div",
  classNames: ['sortable-items'],
  classNameBindings: ['class'],

  itemCollection: [],
  _itemCollection: [],
  _itemCollectionSorted: [],

  /**
    Sortable properties with reasonable defaults
    @properties
    @public
  */
  group: null,
  sort: true,
  delay: 10,
  disabled: false,
  store: null,
  animation: 200,
  handle: '.item',
  filter: '',
  draggable: '.item',
  ghostClass: 'sortable-ghost',
  chosenClass: 'sortable-chosen',
  scroll: true,
  scrollSensitivity: 30, // px
  scrollSpeed: 10, // px

  /**
    @method setup
    Initializes Sortable with given properties and binds
    callbacks to private methods
  */
  setup: Ember.on('didInsertElement', function() {

    var options = {
      group: this.get('group'),
      sort: this.get('sort'),
      delay: this.get('delay'),
      disabled: this.get('disabled'),
      store: this.get('store'),
      animation: this.get('animation'),
      handle: this.get('handle'),
      filter: this.get('filter'),
      draggable: this.get('draggable'),
      ghostClass: this.get('ghostClass'),
      chosenClass: this.get('chosenClass'),
      dataIdAttr: 'data-id',
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

    var instance = new Sortable(this.$()[0], options);
    var collection = this.get('itemCollection');

    function collectionUpdated() {
      Ember.run.scheduleOnce('afterRender', function() {
        Array.prototype.forEach.call(instance.el.children, function(item, i) {
          if (item.dataset) {
            item.dataset['item'] = collection.objectAt(i);
            item.dataset['id'] = i;
          }
        });
      });
    }

    this.set('_itemCollection', collection.map(function(item, i) {
      return {
        item: item,
        id: i
      };
    }));
    this.set('_itemCollectionSorted', collection.slice());
    this.set('_sortableInstance', instance);
    collectionUpdated();

    this.addObserver('itemCollection.[]', function() {
      var collection = this.get('itemCollection');
      var sortedCollection = this.get('_itemCollectionSorted');
      if (collection.length && collection.some(function(item, i) {
        var sortedItem = sortedCollection.objectAt(i);
        return !sortedItem || item !== sortedItem.item;
      })) {
        this.set('_itemCollectionSorted', collection.slice());
        this.set('_itemCollection', collection.map(function(item, i) {
          return {
            item: item,
            id: i
          };
        }));
      } else {
        this.get('_itemCollection').forEach(function(item) {
          var newOrder = sortedCollection.getEach('id');
          var oldId = item.id.toString();
          Ember.set(item, 'id', newOrder.indexOf(oldId));
        });
      }
    });

    this.addObserver('_itemCollection', collectionUpdated);
  }),


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
    var sortedCollection  = Array.prototype.map.call(this.$().children(), function(item, i) {
      var sortedItem = {
        item: item.dataset.item,
        id: item.dataset.id
      };
      item.dataset.id = i;
      return sortedItem;
    });
    this.set('_itemCollectionSorted', sortedCollection);
    this.set('itemCollection', sortedCollection.getEach('item'));
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
  _updateOptionDisabled: Ember.observer('disabled', function() {
    var _sortableInstance = this.get('_sortableInstance');
    _sortableInstance.option('disabled', this.get('disabled'));
  }),

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

  teardown: Ember.on('willDestroyElement', function() {
    var _sortableInstance = this.get('_sortableInstance');
    if (_sortableInstance) {
      _sortableInstance.destroy();
    }
  })

});

export default SortableItems;
