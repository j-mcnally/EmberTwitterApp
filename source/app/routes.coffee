App.Router.map ->
  this.route 'index', { path: '/'}
  this.route 'login'
  this.resource 'tweets', { path: '/tweets' }, ->
    this.route 'new'
    this.route 'show', {path: '/:id'}
      
App.IndexRoute = Ember.Route.extend
  redirect: ->
    twitterAuth.handleCallbacks =>
      if (twitterAuth.getCredentials())
        this.transitionTo('tweets');
      else
        this.transitionTo('login');

App.LoginRoute = Ember.Route.extend
  setupController: (controller, model) ->
    if (twitterAuth.getCredentials())
      this.transitionTo('tweets');

  model: (params) ->
    #return a model here

App.TweetsIndexRoute = Ember.Route.extend
  setupController: (controller, model) ->
    controller.prepareData()

App.TweetsShowRoute = Ember.Route.extend
  setupController: (controller, model) ->
    object =
      tweet_id: model
    controller.prepareData(object)

  model: (params) ->
    params.id
