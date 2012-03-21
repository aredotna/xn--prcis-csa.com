{Channel}        = require 'models/channel'
{SingleView}     = require 'views/single_view'
{CollectionView} = require 'views/collection_view'

class exports.MainRouter extends Backbone.Router
  routes:
    ''                  : 'collection'
    '/:slug'            : 'collection'
    '/:slug/mode::mode' : 'collection'
    '/:slug/view::id'   : 'single'

  initialize: ->
    @channel = new Channel()

  collection: (slug, mode = 'grid') ->
    $.when(@channel.maybeLoad(slug)).then =>
      @collectionView = new CollectionView(model: @channel, collection: @channel.blocks, mode: mode)
      $('body').html @collectionView.render().el

  single: (slug, id) ->
    $.when(@channel.maybeLoad(slug)).then =>
      @singleView = new SingleView model: @channel.blocks.get(id), collection: @channel.blocks
      $('body').html @singleView.render().el