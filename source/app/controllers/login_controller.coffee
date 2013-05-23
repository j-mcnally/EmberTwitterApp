App.LoginController = Ember.Controller.extend
  login: ->
    twitterAuth.login()