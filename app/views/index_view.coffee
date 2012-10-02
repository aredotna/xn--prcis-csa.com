template    = require './templates/index'
class exports.IndexView extends Backbone.View
  id: 'index'
  className: 'home'
  events:
    'submit #channel' : 'go'

  initialize: -> document.title = 'Précis'

  to_slug: (str) ->
    str = str.replace(/^\s+|\s+$/g, "").toLowerCase() # trim and force lowercase
    from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;"
    to   = "aaaaeeeeiiiioooouuuunc------"
    for i in [i..from.length]
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i))
    # remove accents, swap ñ for n, etc  
    str = str.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
    # remove invalid chars, collapse whitespace and replace by -, collapse dashes
    return str # unnecessary line, but for clarity

  go: (e) ->
    e.preventDefault()

    slug = @$('#channel_slug').val()
    app.router.navigate "//#{@to_slug(slug)}/overview", { trigger: true }

  render: ->
    @$el.html template
    
    return this
