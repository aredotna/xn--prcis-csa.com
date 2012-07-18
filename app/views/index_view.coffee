template    = require './templates/index'
class exports.IndexView extends Backbone.View
  id: 'index'
  className: 'home'
  events:
    'submit #channel' : 'go'

  initialize: -> document.title = 'Précis'

  go: (e) ->
    # Doesn't work...
    e.preventDefault()
    app.router.navigate "//#{@$('#channel_slug').val()}"

  render: ->
    @$el.html template
    
    return this
