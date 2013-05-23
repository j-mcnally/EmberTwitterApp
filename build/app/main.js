(function() {

  window.A = window.App = Ember.Application.create({
    rootElement: "#ember-application-root",
    LOG_TRANSITIONS: true
  });

}).call(this);
(function() {

  window.config = {};

}).call(this);
(function() {

  window.config.twitter = {
    key: "CDkkBdSwg0HrkX8TUImobQ",
    secret: "IceV47BwFWWKNeSsoqOacBvGhJYKgPuY593qDvjto",
    twitter_url: "embertweets.com/twitter"
  };

  if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
    window.config.twitter.twitter_url = "api.twitter.com";
  }

}).call(this);
(function() {

  window.twitter = {
    basePath: "https://" + config.twitter.twitter_url,
    twitterPath: "http://api.twitter.com",
    consumerKey: config.twitter.key,
    consumerSecret: config.twitter.secret,
    credentials: {
      oauth_token: "",
      oauth_secret: ""
    },
    api_endpoints: {
      home_timeline: "/1.1/statuses/home_timeline.json"
    },
    getTimeline: function(callback) {
      var authHeader,
        _this = this;
      authHeader = this.signatureString(this.signRequest({}, "" + this.twitterPath + this.api_endpoints.home_timeline));
      return jQuery.ajax({
        type: "GET",
        url: "" + this.basePath + this.api_endpoints.home_timeline,
        headers: {
          Authorization: authHeader
        },
        processData: false,
        complete: function(xhr, status) {
          return console.log(xhr);
        }
      });
    },
    setToken: function(token, secret) {
      this.credentials.oauth_token = token;
      return this.credentials.oauth_secret = secret;
    },
    signRequest: function(params, url, method) {
      var accessor, e, generic, k, message, p, parameterMap, signed, v;
      if (method == null) {
        method = "GET";
      }
      message = {
        action: url,
        method: method,
        parameters: []
      };
      accessor = {
        consumerSecret: this.consumerSecret,
        tokenSecret: this.credentials.oauth_secret
      };
      generic = {
        oauth_consumer_key: this.consumerKey,
        oauth_version: "1.0",
        oauth_token: this.credentials.oauth_token
      };
      e = 0;
      params = jQuery.extend(params, generic);
      for (k in params) {
        v = params[k];
        if ((k != null) && k !== "" && (v != null)) {
          message.parameters.push([k, v]);
        }
      }
      OAuth.setTimestampAndNonce(message);
      OAuth.SignatureMethod.sign(message, accessor);
      parameterMap = OAuth.getParameterMap(message.parameters);
      for (p in parameterMap) {
        if (p.substring(0, 6) === "oauth_" && (params[p] != null) && (params[p].name != null) && params[p].name !== "") {
          params[p].value = parameterMap[p];
        }
      }
      signed = {};
      _.each(message.parameters, function(i) {
        return signed[i[0]] = i[1];
      });
      return signed;
    },
    signatureString: function(message) {
      var body, i, k, keys, len, oary, v, _i;
      keys = [];
      for (k in message) {
        v = message[k];
        if (message.hasOwnProperty(k)) {
          keys.push(k);
        }
      }
      keys.sort();
      len = keys.length;
      oary = [];
      for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
        k = keys[i];
        oary.push("" + k + "=\"" + (OAuth.percentEncode(message[k])) + "\"");
      }
      body = oary.join(", ");
      return "OAuth " + body;
    }
  };

}).call(this);
(function() {

  window.twitterAuth = {
    handleCallbacks: function(callback) {
      var qsi;
      qsi = getUrlParameters(document.location.search.slice(1));
      if ((qsi['oauth_token'] != null) && (qsi['oauth_verifier'] != null)) {
        history.replaceState(null, null, "/");
        return twitterAuth.getToken(qsi, function() {
          if (callback != null) {
            return callback();
          }
        });
      } else if (qsi['denied']) {
        history.replaceState(null, null, "/");
        alert("User denied authorization.");
        if (callback != null) {
          return callback();
        }
      } else {
        if (callback != null) {
          return callback();
        }
      }
    },
    getCredentials: function() {
      var oauth_token, oauth_token_secret;
      oauth_token = $.jStorage.get('oauth_token');
      oauth_token_secret = $.jStorage.get('oauth_token_secret');
      if ((oauth_token != null) && (oauth_token_secret != null)) {
        twitter.setToken(oauth_token, oauth_token_secret);
        return true;
      } else {
        return false;
      }
    },
    consumer: {
      consumerKey: config.twitter.key,
      consumerSecret: config.twitter.secret,
      userKey: "",
      userSecret: "",
      serviceProvider: "twitter",
      signatureMethod: "HMAC-SHA1",
      basePath: "https://" + config.twitter.twitter_url,
      twitterPath: "https://api.twitter.com",
      requestTokenURL: "/oauth/request_token",
      userAuthorizationURL: "/oauth/authorize",
      accessTokenURL: "/oauth/access_token",
      echoURL: "/oauth/echo",
      signRequest: function(params, url, method, token, requestToken) {
        var accessor, e, generic, k, message, p, parameterMap, signed, v;
        if (method == null) {
          method = "GET";
        }
        if (token == null) {
          token = "";
        }
        if (requestToken == null) {
          requestToken = false;
        }
        message = {
          action: url,
          method: method,
          parameters: []
        };
        accessor = {
          consumerSecret: this.userKey,
          tokenSecret: this.userSecret
        };
        if (requestToken) {
          accessor.consumerSecret = this.consumerSecret;
        }
        generic = {
          oauth_consumer_key: this.consumerKey,
          oauth_version: "1.0",
          oauth_token: token != null ? token : void 0
        };
        e = 0;
        params = jQuery.extend(params, generic);
        for (k in params) {
          v = params[k];
          if ((k != null) && k !== "" && (v != null)) {
            message.parameters.push([k, v]);
          }
        }
        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);
        parameterMap = OAuth.getParameterMap(message.parameters);
        for (p in parameterMap) {
          if (p.substring(0, 6) === "oauth_" && (params[p] != null) && (params[p].name != null) && params[p].name !== "") {
            params[p].value = parameterMap[p];
          }
        }
        signed = {};
        _.each(message.parameters, function(i) {
          return signed[i[0]] = i[1];
        });
        return signed;
      },
      signatureString: function(message) {
        var body, i, k, keys, len, oary, v, _i;
        keys = [];
        for (k in message) {
          v = message[k];
          if (message.hasOwnProperty(k)) {
            keys.push(k);
          }
        }
        keys.sort();
        len = keys.length;
        oary = [];
        for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
          k = keys[i];
          oary.push("" + k + "=\"" + (OAuth.percentEncode(message[k])) + "\"");
        }
        body = oary.join(", ");
        return "OAuth " + body;
      }
    },
    getToken: function(rtoken, callback) {
      var authHeader, request_body,
        _this = this;
      request_body = {
        oauth_verifier: rtoken['oauth_verifier']
      };
      authHeader = this.consumer.signatureString(this.consumer.signRequest(request_body, "" + this.consumer.twitterPath + this.consumer.accessTokenURL, "POST", rtoken['oauth_token'], true));
      return jQuery.ajax({
        type: "POST",
        url: "" + this.consumer.basePath + this.consumer.accessTokenURL,
        headers: {
          Authorization: authHeader
        },
        processData: false,
        complete: function(xhr, status) {
          var params;
          if (xhr.statusText === "OK") {
            params = getUrlParameters(xhr.responseText);
            $.jStorage.set('oauth_token', params.oauth_token);
            $.jStorage.set('oauth_token_secret', params.oauth_token_secret);
            twitter.setToken(params.oauth_token, params.oauth_token_secret);
            if (callback != null) {
              return callback();
            }
          }
        }
      });
    },
    login: function() {
      var authHeader, request_body,
        _this = this;
      request_body = {
        oauth_callback: document.location.href.split("#")[0]
      };
      authHeader = this.consumer.signatureString(this.consumer.signRequest(request_body, "" + this.consumer.twitterPath + this.consumer.requestTokenURL, "POST", "", true));
      return jQuery.ajax({
        type: "POST",
        url: "" + this.consumer.basePath + this.consumer.requestTokenURL,
        headers: {
          Authorization: authHeader
        },
        processData: false,
        complete: function(xhr, status) {
          var params;
          if (xhr.statusText === "OK") {
            params = getUrlParameters(xhr.responseText);
            _this.consumer.userKey = params.oauth_token;
            _this.consumer.userSecret = params.oauth_token_secret;
            return document.location = "https://api.twitter.com/oauth/authenticate?oauth_token=" + params.oauth_token;
          }
        }
      });
    }
  };

  twitterAuth.getCredentials();

}).call(this);
(function() {

  App.Foo = Ember.Object.extend();

}).call(this);
(function() {

  App.ApplicationController = Ember.Controller.extend();

}).call(this);
(function() {

  App.IndexController = Ember.Controller.extend();

}).call(this);
(function() {

  App.LoginController = Ember.Controller.extend({
    login: function() {
      return twitterAuth.login();
    }
  });

}).call(this);
(function() {

  App.TweetsIndexController = Ember.Controller.extend({
    tweets: [],
    prepareData: function() {
      return twitter.getTimeline(function(reply) {
        return console.log(reply);
      });
    }
  });

}).call(this);
(function() {

  App.TweetsNewController = Ember.Controller.extend();

}).call(this);
(function() {

  App.TweetsShowController = Ember.Controller.extend({
    prepareData: function(model) {
      return console.log(model);
    }
  });

}).call(this);
(function() {

  App.TweetsController = Ember.Controller.extend();

}).call(this);
(function() {

  App.ApplicationView = Ember.View.extend({
    templateName: "application"
  });

}).call(this);
(function() {

  App.IndexView = Ember.View.extend({
    templateName: "application/index"
  });

}).call(this);
(function() {

  App.LoginView = Ember.View.extend({
    templateName: "application/login"
  });

}).call(this);
(function() {

  App.TweetsIndexView = Ember.View.extend({
    templateName: "application/tweets/index"
  });

}).call(this);
(function() {

  App.TweetsNewView = Ember.View.extend({
    templateName: "application/tweets/new"
  });

}).call(this);
(function() {

  App.TweetsShowView = Ember.View.extend({
    templateName: "application/tweets/show"
  });

}).call(this);
(function() {

  App.TweetsView = Ember.View.extend({
    templateName: "application/tweets"
  });

}).call(this);
Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<h1>EmberTweets</h1>");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  return buffer;
  
});
Ember.TEMPLATES["application/login"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<span><a ");
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "login", {hash:{
    'on': ("click")
  },contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">login with twitter</a></span>");
  return buffer;
  
});
Ember.TEMPLATES["application/tweets"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<span>tweets</span>");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  return buffer;
  
});
Ember.TEMPLATES["application/tweets/index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  


  data.buffer.push("<span>i am index?</span>");
  
});
Ember.TEMPLATES["application/tweets/new"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  


  data.buffer.push("<span>new page</span>");
  
});
Ember.TEMPLATES["application/tweets/show"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  


  data.buffer.push("<span>show</span>");
  
});
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
