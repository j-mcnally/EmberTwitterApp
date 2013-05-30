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
    logout: function() {
      $.jStorage.set('oauth_token');
      $.jStorage.set('oauth_token_secret');
      return document.location = '/';
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
