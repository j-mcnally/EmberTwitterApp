App.TweetsIndexController = Ember.Controller.extend
  tweets: []
  prepareData: ->
    twitter.__call "statuses_homeTimeline", (reply) =>
      unless reply['errors']?
        @set('tweets', reply)
      else
        @set('tweets',[
          {user: {name: 'twitter'}, text: reply['errors'][0].message}
        ]);
