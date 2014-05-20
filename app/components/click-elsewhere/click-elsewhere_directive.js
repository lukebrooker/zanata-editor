componentClickElsewhere.directive('clickElsewhere', function($document, $parse) {
  return {
    restrict: 'A',
    scope: {
      callback : '&clickElsewhere'
    },
    link: function(scope, element, attr, ctrl) {
      var handler = function(e) {
        if (!element[0].contains(e.target)) {
          scope.$apply(scope.callback(e));
        }
      };

      $document.on('click', handler);

      scope.$on('$destroy', function() {
        $document.off('click', handler);
      });
    }
  }
});
