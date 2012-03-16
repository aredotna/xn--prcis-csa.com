{BrunchApplication} = require 'helpers'
{MainRouter}        = require 'routers/main_router'
{HomeView}          = require 'views/home_view'
{Channel}           = require 'models/channel'
{Blocks}            = require 'collections/blocks'

class exports.Application extends BrunchApplication

  initialize: ->
    @loading().start()
    $.getJSON 'http://are.na/api/v1/channels/damon-zucconi.json?callback=?', (data) =>
      
      @channel  = new Channel(data)
      @blocks   = new Blocks(@channel.get('blocks'), {channel: 'what'})

      @homeView = new HomeView(model: @channel, collection: @blocks)
      @router   = new MainRouter
      
      Backbone.history.start()
      
      @loading().stop()

  loading: ->
    start: ->
      $('body').addClass('loading')
    stop: ->
      $('body').removeClass('loading')

window.app = new exports.Application
