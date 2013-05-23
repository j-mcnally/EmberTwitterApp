(function() {

  App.Router.map(function() {
    this.route('index', {
      path: '/'
    });
    this.route('login');
    return this.resource('tweets', {
      path: '/tweets'
    }, function() {
      this.route('new');
      return this.route('show', {
        path: '/:id'
      });
    });
  });

  App.IndexRoute = Ember.Route.extend({
    redirect: function() {
      var _this = this;
      return twitterAuth.handleCallbacks(function() {
        if (twitterAuth.getCredentials()) {
          return _this.transitionTo('tweets');
        } else {
          return _this.transitionTo('login');
        }
      });
    }
  });

  App.LoginRoute = Ember.Route.extend({
    setupController: function(controller, model) {
      if (twitterAuth.getCredentials()) {
        return this.transitionTo('tweets');
      }
    },
    model: function(params) {}
  });

  App.TweetsIndexRoute = Ember.Route.extend({
    setupController: function(controller, model) {
      return controller.prepareData();
    }
  });

  App.TweetsShowRoute = Ember.Route.extend({
    setupController: function(controller, model) {
      var object;
      object = {
        tweet_id: model
      };
      return controller.prepareData(object);
    },
    model: function(params) {
      return params.id;
    }
  });

}).call(this);
