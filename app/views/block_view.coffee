template = require './templates/single'

class exports.BlockView extends Backbone.View
  render: (id) ->
    $(@el).html template
      channel : @options.channel.toJSON()
      block   : @model.toJSON()
      blocks  : @collection.toJSON()
      next    : @collection.next(@model)
      prev    : @collection.prev(@model)
    this
