template = require('./templates/home')

class exports.HomeView extends Backbone.View
  id: 'home'

  initialize: ->
    document.title = @model.get('title')

  render: ->
    $(@el).html template channel: @model.toJSON(), blocks: @collection.toJSON()
    this
