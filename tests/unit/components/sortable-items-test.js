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
