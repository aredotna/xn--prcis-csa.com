class exports.BrunchApplication
  constructor: ->
    $ =>
      @initialize this
      Backbone.history.start()

  initialize: ->
    null

  loading: ->
    start: ->
      $('body').
        html('').
        addClass('loading')
    stop: ->
      $('body').
        removeClass('loading')
    error: ->
      $('body').
        removeClass('loading').
        addClass('error')