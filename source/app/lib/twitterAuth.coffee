window.twitterAuth =


  handleCallbacks: (callback) ->
    qsi = getUrlParameters(document.location.search.slice(1));
    if (qsi['oauth_token']? && qsi['oauth_verifier']?)
      #whipe the query string via a historyReplace.
      history.replaceState(null, null, "/")
      twitterAuth.getToken qsi, ->
        callback() if callback?
    else if (qsi['denied'])
      history.replaceState(null, null, "/")
      alert "User denied authorization."
      callback() if callback?
    else
      callback() if callback?

  getCredentials: ->
    oauth_token = $.jStorage.get('oauth_token')
    oauth_token_secret = $.jStorage.get('oauth_token_secret')
    if (oauth_token? && oauth_token_secret?)
      twitter.setToken(oauth_token, oauth_token_secret)
      return true
    else
      return false

  consumer:
    consumerKey: config.twitter.key
    consumerSecret: config.twitter.secret
    userKey: ""
    userSecret: ""
    serviceProvider: "twitter"
    signatureMethod: "HMAC-SHA1"
    basePath: "https://#{config.twitter.twitter_url}"
    twitterPath: "https://api.twitter.com"
    requestTokenURL: "/oauth/request_token"
    userAuthorizationURL: "/oauth/authorize"
    accessTokenURL: "/oauth/access_token"
    echoURL: "/oauth/echo"


    signRequest: (params, url, method="GET", token="", requestToken=false) ->
      message =
        action: url
        method: method
        parameters: []

      accessor =
        consumerSecret: @userKey
        tokenSecret: @userSecret

      accessor.consumerSecret = @consumerSecret if requestToken

      generic =
        oauth_consumer_key: @consumerKey
        oauth_version: "1.0" 
        oauth_token: token if token?

      e = 0
      params = jQuery.extend(params, generic)

      for k,v of params
        message.parameters.push [k, v] if k? and k isnt "" and v?
 
      OAuth.setTimestampAndNonce message
      OAuth.SignatureMethod.sign message, accessor

      
      parameterMap = OAuth.getParameterMap(message.parameters)
      for p of parameterMap
        params[p].value = parameterMap[p]  if p.substring(0, 6) is "oauth_" and params[p]? and params[p].name? and params[p].name isnt ""
      

      signed = {}
      _.each message.parameters, (i) ->
          signed[i[0]]=i[1]
      signed
    signatureString: (message) ->
      keys = []
      for k,v of message
        if message.hasOwnProperty(k)
          keys.push(k)

      keys.sort()
      len = keys.length;
      oary = []
      for i in [0...len]
        k = keys[i]
        oary.push("#{k}=\"#{OAuth.percentEncode(message[k])}\"")
      body = oary.join(", ")
      "OAuth " + body 


  getToken: (rtoken, callback) ->
    request_body =
      oauth_verifier: rtoken['oauth_verifier']
    authHeader = @consumer.signatureString(@consumer.signRequest(request_body, "#{@consumer.twitterPath}#{@consumer.accessTokenURL}", "POST", rtoken['oauth_token'], true))
    jQuery.ajax
      type: "POST"
      url: "#{@consumer.basePath}#{@consumer.accessTokenURL}"
      headers: {
        Authorization: authHeader
      }
      processData: false,
      complete: (xhr, status) =>
        if (xhr.statusText == "OK")
          params = getUrlParameters(xhr.responseText)
          $.jStorage.set('oauth_token', params.oauth_token)
          $.jStorage.set('oauth_token_secret', params.oauth_token_secret)
          twitter.setToken(params.oauth_token, params.oauth_token_secret);
          callback() if callback?
  logout: ->
    $.jStorage.set('oauth_token')
    $.jStorage.set('oauth_token_secret')
    document.location = '/'

  login: ->
    #get code
    request_body =
      oauth_callback: document.location.href.split("#")[0]
    authHeader = @consumer.signatureString(@consumer.signRequest(request_body, "#{@consumer.twitterPath}#{@consumer.requestTokenURL}", "POST", "", true))
    jQuery.ajax
      type: "POST"
      url: "#{@consumer.basePath}#{@consumer.requestTokenURL}"
      headers: {
        Authorization: authHeader
      }
      processData: false,
      complete: (xhr, status) =>
        if (xhr.statusText == "OK")
          params = getUrlParameters(xhr.responseText)
          @consumer.userKey = params.oauth_token
          @consumer.userSecret = params.oauth_token_secret
          document.location = "https://api.twitter.com/oauth/authenticate?oauth_token=#{params.oauth_token}"

twitterAuth.getCredentials()
