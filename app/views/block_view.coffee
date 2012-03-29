{LightboxView} = require 'views/lightbox_view'

class exports.BlockView extends Backbone.View
  className: 'block'
  events:
    'click .enlarge' : 'enlarge'

  initialize: ->
    @template = require "./templates/single/#{@options.mode}"

  enlarge: (e) ->
    e.preventDefault()

    @view = new LightboxView
        model       : @model
        channel     : @options.channel
        mode        : @options.mode
      $('#modal')
        .html @view.render().el
  
  render: ->
    @$el.html @template
      mode    : @options.mode
      channel : @options.channel.toJSON()
      block   : @model.toJSON()
    this
