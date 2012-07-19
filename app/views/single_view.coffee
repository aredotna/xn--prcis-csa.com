template    = require './templates/single/list'
{BlockView} = require 'views/block_view'

class exports.SingleView extends BlockView
  id: 'single'
  className: 'block'

  initialize: ->
    @channel = @options.channel

    app.currentChannel = @channel
    app.currentBlock = @model
    app.currentCollection = @collection

    # Set the page title
    document.title = 
      if @model.get 'title'
        "#{@channel.get 'title'}: #{@model.get 'title'}"
      else
        @channel.get 'title'

  render: (id) ->
    @$el.html template
      channel : @channel.toJSON()
      block   : @model.toJSON()
      blocks  : @collection.toJSON()
      next    : @collection.next(@model)
      prev    : @collection.prev(@model)

    @$el.waitForImages(=>
      @$('.slide').removeClass('loading')
      @$('.slide').addClass('done')
    )
    
    return this
