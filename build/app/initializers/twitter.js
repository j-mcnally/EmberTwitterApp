(function() {

  window.twitter = new Codebird;

  twitter.setConsumerKey(config.twitter.key, config.twitter.secret);

}).call(this);
