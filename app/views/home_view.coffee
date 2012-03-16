template = require('./templates/home')

class exports.HomeView extends Backbone.View
  id: 'home-view'

  render: ->
    $(@el).html template channel: @model.toJSON(), blocks: @collection.toJSON()
    this
