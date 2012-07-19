template    = require './templates/index'
class exports.IndexView extends Backbone.View
  id: 'index'
  className: 'home'
  events:
    'submit #channel' : 'go'

  initialize: -> document.title = 'Précis'

  go: (e) ->
    e.preventDefault()
    app.router.navigate "//#{@$('#channel_slug').val()}", { trigger: true }

  render: ->
    @$el.html template
    
    return this
