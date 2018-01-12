import Ember from 'ember';
import layout from '../templates/components/sortable-items';

/* global Sortable */

const {
  Component,
  computed,
  observer,
  run
} = Ember;

var pid,
    frozen,
    frozenObjects,
    positions;

export default Component.extend({
  target: computed.alias('targetObject'),
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

  didInsertElement() {
    this._super(...arguments);

    let options = {
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
      onStart: run.bind(this, this._onStart),
      onEnd: run.bind(this, this._onEnd),
      onAdd: run.bind(this, this._onAdd),
      onUpdate: run.bind(this, this._onUpdate),
      onSort: run.bind(this, this._onSort),
      onRemove: run.bind(this, this._onRemove),
      onFilter: run.bind(this, this._onFilter),
      onMove: run.bind(this, this._onMove)
    };

    if (this.get('draggable')) {
      options.draggable = this.get('draggable');
    }

    this.set('_sortableInstance', new Sortable(this.$()[0], options));

  },

  /**
    @method _onStart
    @private
    The user has started to drag an item
  */
  _onStart(evt) {

    run(this, function() {
      let freezeSelector = this.get('freeze');

      if (freezeSelector) {
        let _sortableInstance = this.get('_sortableInstance');
        let itemCollection = this.get('itemCollection');
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
  _onEnd(evt) {
    this._sendOutAction('onEndAction', evt);
  },

  /**
    @method _onAdd
    @private
    An item is dropped into the list from another list
  */
  _onAdd(evt) {
    this._sendOutAction('onAddAction', evt);
  },

  /**
    @method _onUpdate
    @private
    Changed sorting within list
  */
  _onUpdate(evt) {
    this._sendOutAction('onUpdateAction', evt);

    run(this, function() {
      let collection = this.get('itemCollection');
      let item = collection[evt.oldIndex];
      let freezeSelector = this.get('freeze');
      delete collection[evt.oldIndex];
      collection.splice(evt.newIndex, 0, item);

      if (freezeSelector) {
        frozenObjects.forEach(function(obj, i) {
          let pos = positions[i];
          if (collection[pos] !== obj) {
            let realPos = collection.indexOf(obj);
            delete collection[realPos];
            collection.splice(pos, 0, obj);
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
  _onSort(evt) {
    this._sendOutAction('onSortAction', evt);
  },


  /**
    @method _onRemove
    @private
    An item is removed from the list and added into another
  */
  _onRemove(evt) {
    this._sendOutAction('onRemoveAction', evt);
  },

  /**
    @method _onFilter
    @private
    Called when an attempt is made to drag a filtered item
  */
  _onFilter(evt) {
    this._sendOutAction('onFilterAction', evt);
  },

  /**
    @method _onMove
    @private
    Called when re-ordering the list during drag
  */
  _onMove(evt) {
    this._sendOutAction('onMoveAction', evt);

    let vector;
    let freeze = false;
    let freezeSelector = this.get('freeze');

    if (freezeSelector) {
      clearTimeout(pid);

      pid = setTimeout(function () {
        let list = evt.to;
        frozen.forEach(function (el, i) {
          let idx = positions[i];

          if (list.children[idx] !== el) {
            let realIdx = Sortable.utils.index(el);
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
  _updateOptionDisabled: observer('disabled', function() {
    let _sortableInstance = this.get('_sortableInstance');
    _sortableInstance.option('disabled', this.get('disabled'));
  }),

  /**
    @method _sendOutAction
    @private
    Used as an interface for the sendAction method, checks if consumer defined
    an action before sending one out
  */
  _sendOutAction(action, evt) {
    if (this.get(action)) {
      this.sendAction(action, evt);
    }
  },


  willDestroyElement() {
    this._super(...arguments);
    let _sortableInstance = this.get('_sortableInstance');
    if (_sortableInstance) {
      _sortableInstance.destroy();
    }
  }
});