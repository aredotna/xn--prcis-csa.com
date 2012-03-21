class exports.CollectionView extends Backbone.View
  id: 'collection'

  initialize: ->
    # Set the page title
    document.title = @model.get('title')

    # Possible values: ['compact', 'list', 'grid', 'slideshow', 'scatter']
    @template = require("./templates/#{@options.mode}")

  render: ->
    $(@el).html(@template(channel: @model.toJSON(), blocks: @collection.toJSON()))
    this
