{BrunchApplication} = require 'helpers'
{MainRouter}        = require 'routers/main_router'
{Shortcuts}         = require 'views/shortcuts'

class exports.Application extends BrunchApplication
  initialize: ->
    @loading().start()
    @router = new MainRouter
    @shortcuts = new Shortcuts

window.app = new exports.Application
