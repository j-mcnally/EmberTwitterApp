#= require_self
#= require_tree ./config
#= require "codebirds"
#= require_tree ./initializers
#= require_tree ./lib
#= require_tree ./models 
#= require_tree ./controllers
#= require_tree ./views
#= require_tree ./templates
#= require      ./routes



window.A = window.App = Ember.Application.create
  rootElement : "#ember-application-root"
  LOG_TRANSITIONS: true





