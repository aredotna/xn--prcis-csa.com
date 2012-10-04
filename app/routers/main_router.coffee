{IndexView}      = require 'views/index_view'
{BlockView}      = require 'views/block_view'
{SingleView}     = require 'views/single_view'
{CollectionView} = require 'views/collection_view'
{Channel}        = require 'models/channel'

class exports.MainRouter extends Backbone.Router
  routes:
    ''                  : 'index'
    '/:slug'            : 'collection'
    '/:slug/overview'   : 'overview'
    '/:slug/show::id'   : 'single'

  initialize: ->
    @channel = new Channel()

  redirectToChannel: ->
    # Test if coming from are.na
    if app.parseReferrer().host is 'are.na'
      # Extract out the channel slug
      path = app.parseReferrer().pathname.split("/")[1]
      # Ensure the slug isn't really a block show: action
      unless /show:/.test(path)
        @navigate "//#{path}/overview", { trigger: true }

  index: ->
    @indexView = new IndexView()
    
    $('body')
      .html @indexView.render().el
    app.loading().stop()

    @redirectToChannel()

  collection: (slug) ->
    $.when(@channel.maybeLoad slug).then =>
      @navigate "//#{slug}/show:#{@channel.blocks.at(0).id}", { trigger: true }

  overview: (slug) ->
    $.when(@channel.maybeLoad slug).then =>
      
      app.currentChannel = @channel
      app.currentCollection = @channel.blocks

      @collectionView = new CollectionView
        model      : @channel
        collection : @channel.blocks
        mode       : 'grid'

      $('body')
        .attr('class', 'collection')
        .html @collectionView.render().el
       
  single: (slug, id) ->
    $.when(@channel.maybeLoad slug).then =>
      @singleView = new SingleView
        model      : @channel.blocks.get id
        collection : @channel.blocks
        channel    : @channel

      $('body')
        .attr('class', 'single')
        .html @singleView.render().el
