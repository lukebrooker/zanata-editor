'use strict';

var zanataApp = angular.module('zanataApp',
    ['ui.router',
    'zanataMain',
    'zanataEditor',
    'componentUser',
    'templates',
    'cfp.hotkeys'])
  .config(function ($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /editor
    $urlRouterProvider.otherwise("/");

    // $locationProvider
    //   .html5Mode(true)
    //   .hashPrefix('!');

    // RestangularProvider.setBaseUrl('https://api.mongolab.com/api/1/databases/zanata/collections');
    // RestangularProvider.setDefaultRequestParams({ apiKey: '50b8aa50e4b041fc01c5a1ec' })
    // RestangularProvider.setRestangularFields({
    //   id: '_id.$oid'
    // });

    // RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
    //   if (operation === 'put') {
    //     elem._id = undefined;
    //     return elem;
    //   }
    //   return elem;
    // });
  });
