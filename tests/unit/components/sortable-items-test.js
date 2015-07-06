import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('sortable-items', 'Sortable Item Component',
  { integration: true }
);

test('it allows setting a group', function(assert) {
  const component = this.subject({group: 'MyGroup', itemCollection: []});

  this.$();

  const groupName = component.get('_sortableInstance').options.group.name;
  assert.equal(groupName, 'MyGroup');
});

test('it sends the proper data for the onAddAction', function(assert) {
  assert.expect(3);

  const itemCollection = [ { id: 1 } ];

  const targetObject = {
    itemAdded: function(item, oldIndex, newIndex) {
      assert.equal(item, itemCollection[0]);
      assert.equal(oldIndex, 0);
      assert.equal(newIndex, 1);
    }
  };

  const component = this.subject({
    itemCollection: itemCollection,
    onAddAction: 'itemAdded',
    targetObject: targetObject,
  });

  this.$();
  const fakeEvent = {
    oldIndex: 0,
    newIndex: 1,
  };
  component._onAdd(fakeEvent);
});
