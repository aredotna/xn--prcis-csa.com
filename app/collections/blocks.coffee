{Block} = require "models/block"

class exports.Blocks extends Backbone.Collection
  model: Block
  
  comparator: (model) ->
    model.get('channel_connection').position

  next: (model) ->
    @at((@indexOf(model) + 1) % _.size(@models))

  prev: (model) ->
    index = @indexOf(model) - 1
    @at(if index > -1 then index else _.size(@models) - 1)