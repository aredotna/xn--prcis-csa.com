class exports.Shortcuts extends Backbone.Shortcuts
  shortcuts:
    'left'  : 'prev'
    'right' : 'next'
    'up'    : 'up'
    
  next: ->
    _next = app.currentCollection.next(app.currentBlock)
    window.location.hash =
      "#/#{app.currentChannel.get('slug')}/show:#{_next.id}"

  prev: ->
    _prev = app.currentCollection.prev(app.currentBlock)
    window.location.hash =
      "#/#{app.currentChannel.get('slug')}/show:#{_prev.id}"

  up: ->
    window.location.hash =
      "#/#{app.currentChannel.get('slug')}/overview"