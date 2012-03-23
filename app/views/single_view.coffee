template    = require './templates/single'
{BlockView} = require 'views/block_view'

class exports.SingleView extends BlockView
  id: 'single'

  initialize: ->
    # Set the page title
    document.title = 
      if @model.get 'title'
        "#{@options.channel.get 'title'}: #{@model.get 'title'}"
      else
        @options.channel.get 'title'