class exports.Block extends Backbone.Model
  
  initialize: -> @checkIfMissingImage()
    
  checkIfMissingImage: ->
    # Check if the image actually is missing
    # Will have to fix this in the actual API response
    missing = '/assets/interface/missing.png'
    @set('image_thumb', null) if @get('image_thumb') is missing

  next: -> @collection.next this

  prev: -> @collection.prev this