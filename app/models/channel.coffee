{Blocks} = require 'collections/blocks'

class exports.Channel extends Backbone.Model

  url: -> "http://api.are.na/v2/channels/#{@get('slug')}"

  maybeLoad: (slug) ->
    if slug is @get('slug')
      return true
    else
      @clear()
      app.loading().start()
      @set 'slug', slug
      @set 'fetching', true
      @fetch
        success: =>
          @setupBlocks()
          @set 'fetching', false
          app.loading().stop()
          return true
        error:  -> app.loading().error()

  setupBlocks: -> @blocks = new Blocks @get('contents')