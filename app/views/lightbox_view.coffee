template = require './templates/single/lightbox'

class exports.LightboxView extends Backbone.View
  className: 'lightbox'
  events:
    'click *' : 'remove'
  
  initialize: ->
    console.log @$el
    @$el.removeClass 'hide'

  render: ->
    @$el.html template
      channel : @options.channel.toJSON()
      block   : @model.toJSON()
    this
