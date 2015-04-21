# ember-cli-sortable

This is an ember-cli addon that integrates [RubaXa's Sortable](https://github.com/RubaXa/Sortable) plugin with Ember.
It is still rough around the edges but works pretty well and is currently being used in production.

## Installation

```sh
ember install:npm ember-cli-sortable
ember generate ember-cli-sortable
```

## Usage

```handlebars
{{sortable-items
  itemCollection=someArray
  animation=100
  handle=".item__handle"
  filter=".item--pinned"
  draggable=".item"
  ghostClass="item--ghost"
  onItemMoveAction="itemMoved"
  templateName="sortable-items-partial"
  noItemText="<div style='text-align:center'>No items found</div>"
}}
```

You'll then need a partial named `sortable-items-partial` that will have access to `item`
This template will be looped over all the items in the array.

`sortable-items-partial.hbs`
```handelbars
<div class="item">
  <div class="item__handle">{{item.name}}</div>
  <div class="item__sub">{{item.content}}</div>
</div>
```

You'll also need an `itemMoved` action handler in your controller / parent component as per the example above.

####Supports all properties and callbacks from [RubaXa's Sortable](https://github.com/RubaXa/Sortable)

####Properties
```
sort
disabled
store
animation
handle
filter
draggable
ghostClass
scroll
scrollSensitivity
scrollSpeed
```
####Callbacks
```
onStart
onAdd
onEnd
onUpdate
onSort
onRemove
onFilter
```

Add `Action` at the end of each callback to specify your own action handlers

Example
```handlebars
{{sortable-items
  onStartAction="myStartAction"
  onAddAction="myAddAction"
  ...
  ...
  ...
}}
```

## Contribution
Fork this repository, make a feature branch and send in a pull request.
