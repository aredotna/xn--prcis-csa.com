{Block} = require "models/block"

class exports.Blocks extends Backbone.Collection
  model: Block
  
  # comparator: (block) ->
  #     block.channelConnection().position