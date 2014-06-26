'use strict';

var zanataMain = angular.module('zanataMain', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('main', {
        url: "/",
        templateUrl: "main/main.html",
        controller: 'MainCtrl'
      });

  });
