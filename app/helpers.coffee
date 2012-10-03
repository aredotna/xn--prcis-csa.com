class exports.BrunchApplication
  constructor: ->
    $ =>
      @initialize this
      Backbone.history.start()

  initialize: ->
    null

  parseReferrer: ->
    parser = document.createElement('a')
    parser.href = document.referrer
    return parser

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
        