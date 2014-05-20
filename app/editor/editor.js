'use strict';

var zanataEditor = angular.module('zanataEditor',
  ['ngRoute',
   'ui.router',
   'componentPhrase',
   'componentEditItem',
   'componentClickElsewhere',
   'highlight',
   'cfp.hotkeys'])
  .config(function ($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /editor
    $urlRouterProvider.otherwise("/editor");

    $stateProvider
      .state('editor', {
        url: "/editor",
        templateUrl: "editor/editor.html",
        controller: 'EditorCtrl'
      });

  });
