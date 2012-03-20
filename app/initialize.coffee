{BrunchApplication} = require 'helpers'
{MainRouter}        = require 'routers/main_router'
{CollectionView}    = require 'views/collection_view'
{Channel}           = require 'models/channel'
{Blocks}            = require 'collections/blocks'

class exports.Application extends BrunchApplication

  initialize: ->
    # Get data source for a slug from the parameter 'source'
    # Or default to FAQ channel
    source = $.getParam('source') 
    source ?= 'frequently-asked-questions-faqs'

    @loading().start()

    $.getJSON "http://are.na/api/v1/channels/#{source}.json?callback=?", (data) =>
      @channel        = new Channel(data)
      @blocks         = new Blocks(@channel.get('blocks'))
      
      @collectionView = new CollectionView(model: @channel, collection: @blocks)
      @router         = new MainRouter
      
      Backbone.history.start()
      
      @loading().stop()

  loading: ->
    start: ->
      $('body').addClass('loading')
    stop: ->
      $('body').removeClass('loading')

window.app = new exports.Application
