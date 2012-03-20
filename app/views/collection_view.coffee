class exports.CollectionView extends Backbone.View
  id: 'collection'

  initialize: ->
    # Set the page title
    document.title = @model.get('title')

    # Get the desired format from the paramter or default to 'list'
    # Possible values: ['list', 'grid', 'slideshow', 'scatter']
    format = $.getParam('format')
    format ?= 'list'
    @template = require("./templates/#{format}")

  render: ->
    $(@el).html @template channel: @model.toJSON(), blocks: @collection.toJSON()
    this
