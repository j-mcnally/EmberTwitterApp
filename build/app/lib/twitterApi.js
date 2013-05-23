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
