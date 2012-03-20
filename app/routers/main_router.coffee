class exports.MainRouter extends Backbone.Router
  routes:
    ''          : 'collection'
    'view/:id'  : 'single'

  collection: ->
    $('body').html app.collectionView.render().el

  single: ->
    $('body').html app.singleView.render().el