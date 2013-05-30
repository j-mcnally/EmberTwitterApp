App.TweetList = Ember.VirtualListView.extend
  height: 500,
  width: 500,
  elementWidth: 500,
  rowHeight: 100,
  itemViewClass: Ember.ListItemView.extend({templateName: "application/tweets/components/tweet_item"})