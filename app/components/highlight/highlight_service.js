componentHighlight
  .provider('highlightService', function () {
    var _hljsOptions = {};

    return {
      setOptions: function (options) {
        angular.extend(_hljsOptions, options);
      },
      getOptions: function () {
        return angular.copy(_hljsOptions);
      },
      $get: ['$window', function ($window) {
        ($window.hljs.configure || angular.noop)(_hljsOptions);
        return $window.hljs;
      }]
    };
  })

  .factory('highlightCache', [
           '$cacheFactory',
  function ($cacheFactory) {
    return $cacheFactory('highlightCache');
  }]);
