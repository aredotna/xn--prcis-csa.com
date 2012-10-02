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
        removeClass('error').
        addClass('loading')
    stop: ->
      $('body').
        removeClass('error').
        removeClass('loading')
    error: ->
      $('body').
        removeClass('loading').
        addClass('error')