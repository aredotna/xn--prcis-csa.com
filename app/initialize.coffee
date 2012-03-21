{BrunchApplication} = require 'helpers'
{MainRouter}        = require 'routers/main_router'

class exports.Application extends BrunchApplication
  initialize: ->
    @loading().start()
    @router = new MainRouter

  loading: ->
    start: ->
      $('body').addClass('loading')
    stop: ->
      $('body').removeClass('loading')

window.app = new exports.Application
