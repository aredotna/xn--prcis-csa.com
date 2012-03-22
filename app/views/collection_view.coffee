{SingleView}     = require 'views/single_view'
{SingleTemplate} = require './templates/single'


class exports.CollectionView extends Backbone.View
  id: 'collection'

  initialize: ->
    # Set the page title
    document.title = @model.get('title')
    # Possible values: ['compact', 'list', 'grid', 'slideshow', 'scatter']
    @template = require "./templates/#{@options.mode}"

  addAll: () ->
    @collection.each(@addOne)
    
  addOne: (block) =>
    view = new SingleView model: block, collection: @model.blocks, channel: @model
    @$('#blocks').append(view.render().el)

  render: ->
    $(@el).html(@template channel: @model.toJSON(), blocks: @collection.toJSON())
    @addAll()
    this
