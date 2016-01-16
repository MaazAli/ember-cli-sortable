# ember-cli-sortable

This is an ember-cli addon that integrates [RubaXa's Sortable](https://github.com/RubaXa/Sortable) plugin with Ember.
It is still rough around the edges but works pretty well and is currently being used in production.

## Installation

```sh
npm install ember-cli-sortable --save
```

## Usage

```handlebars
{{#sortable-items
  itemCollection=someArray
  animation=100
  handle=".item__handle"
  filter=".item--pinned"
  draggable=".item"
  ghostClass="item--ghost"
  onItemMoveAction="itemMoved"
  noItemText="<div style='text-align:center'>No items found</div>"
  as |item index|
}}
  <div>
    <div class="item__handle">{{item.name}}</div>
    <div class="item__sub">{{item.content}}</div>
  </div>
{{/sortable-items}}
```

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
