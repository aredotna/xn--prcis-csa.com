template = require './templates/single/single'

class exports.BlockView extends Backbone.View
  render: (id) ->
    $(@el).html template
      channel : @options.channel.toJSON()
      block   : @model.toJSON()
    this
