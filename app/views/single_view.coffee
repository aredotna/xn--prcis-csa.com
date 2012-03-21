class exports.SingleView extends Backbone.View
  id: 'single'

  initialize: ->
    # # Set the page title
    document.title = @model.get('title')

    @template = require("./templates/single")

  render: (id) ->
    $(@el).html @template block: @model.toJSON(), blocks: @collection.toJSON()
    this
