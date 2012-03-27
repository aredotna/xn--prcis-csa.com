{BrunchApplication} = require 'helpers'
{MainRouter}        = require 'routers/main_router'
{Channel}           = require 'models/channel'

class exports.Application extends BrunchApplication
  initialize: ->
    @loading().start()
    @router = new MainRouter

window.app = new exports.Application
