componentHighlight
  .directive('highlight', [function () {
    return {
      restrict: 'EA',
      controller: 'HighlightCtrl',
      compile: function(tElm, tAttrs, transclude) {
        // get static code
        // strip the starting "new line" character
        // var staticCode = tElm[0].innerHTML.replace(/^(\r\n|\r|\n)/m, '');
        var staticCode = tElm[0].innerHTML;

        // put template
        tElm.html('<pre><code class="hljs"></code></pre>');

        return function postLink(scope, iElm, iAttrs, ctrl) {
          ctrl.init(iElm.find('code'));

          if (iAttrs.onhighlight) {
            ctrl.highlightCallback(function () {
              scope.$eval(iAttrs.onhighlight);
            });
          }

          if (staticCode) {
            ctrl.highlight(staticCode);
          }

          scope.$on('$destroy', function () {
            ctrl.release();
          });
        };
      }
    };
  }])

  .directive('language', [function () {
    return {
      require: 'highlight',
      restrict: 'A',
      link: function (scope, iElm, iAttrs, ctrl) {
        iAttrs.$observe('language', function (lang) {
          if (angular.isDefined(lang)) {
            ctrl.setLanguage(lang);
          }
        });
      }
    };
  }])

  .directive('source', [function () {
    return {
      require: 'highlight',
      restrict: 'A',
      link: function(scope, iElm, iAttrs, ctrl) {

        scope.$watch(iAttrs.source, function (newCode, oldCode) {
          if (newCode) {
            ctrl.highlight(newCode);
          }
          else {
            ctrl.clear();
          }
        });
      }
    };
  }])

  .directive('include', [
           '$http', '$templateCache', '$q',
  function ($http,   $templateCache,   $q) {
    return {
      require: 'highlight',
      restrict: 'A',
      compile: function(tElm, tAttrs, transclude) {
        var srcExpr = tAttrs.include;

        return function postLink(scope, iElm, iAttrs, ctrl) {
          var changeCounter = 0;

          scope.$watch(srcExpr, function (src) {
            var thisChangeId = ++changeCounter;

            if (src && angular.isString(src)) {
              var templateCachePromise, dfd;

              templateCachePromise = $templateCache.get(src);
              if (!templateCachePromise) {
                dfd = $q.defer();
                $http.get(src, {
                  cache: $templateCache,
                  transformResponse: function(data, headersGetter) {
                    // Return the raw string, so $http doesn't parse it
                    // if it's json.
                    return data;
                  }
                }).success(function (code) {
                  if (thisChangeId !== changeCounter) {
                    return;
                  }
                  dfd.resolve(code);
                }).error(function() {
                  if (thisChangeId === changeCounter) {
                    ctrl.clear();
                  }
                  dfd.resolve();
                });
                templateCachePromise = dfd.promise;
              }

              $q.when(templateCachePromise)
              .then(function (code) {
                if (!code) {
                  return;
                }

                // $templateCache from $http
                if (angular.isArray(code)) {
                  // 1.1.5
                  code = code[1];
                }
                else if (angular.isObject(code)) {
                  // 1.0.7
                  code = code.data;
                }

                code = code.replace(/^(\r\n|\r|\n)/m, '');
                ctrl.highlight(code);
              });
            }
            else {
              ctrl.clear();
            }
          });
        };
      }
    };
  }]);

