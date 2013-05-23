###
window.twitter =
  
  basePath: "https://#{config.twitter.twitter_url}"
  twitterPath: "http://api.twitter.com"
  consumerKey: config.twitter.key
  consumerSecret: config.twitter.secret
  credentials:
    oauth_token: ""
    oauth_secret: ""

  api_endpoints:
    home_timeline: "/1.1/statuses/home_timeline.json"


  getTimeline: (callback) ->
    authHeader = @signatureString(@signRequest({}, "#{@twitterPath}#{@api_endpoints.home_timeline}"))
    jQuery.ajax
      type: "GET"
      url: "#{@basePath}#{@api_endpoints.home_timeline}"
      headers: {
        Authorization: authHeader
      }
      processData: false,
      complete: (xhr, status) =>
        console.log(xhr)


  setToken: (token, secret) ->
    @credentials.oauth_token = token
    @credentials.oauth_secret = secret


  signRequest: (params, url, method="GET") ->
    message =
      action: url
      method: method
      parameters: []

    accessor =
      consumerSecret: @consumerSecret
      tokenSecret: @credentials.oauth_secret

    generic =
      oauth_consumer_key: @consumerKey
      oauth_version: "1.0" 
      oauth_token: @credentials.oauth_token

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
###