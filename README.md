# Ember-cli-sortable

This README outlines the details of collaborating on this Ember addon.

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
  draggable=".item--sortable"
  ghostClass="item--ghost"
  onUpdateAction="itemMoved"
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

## Contribution
Fork this repository, make a feature branch and send in a pull request.
