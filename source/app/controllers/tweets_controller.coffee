App.TweetsController = Ember.Controller.extend
  logout: ->
    twitterAuth.logout()