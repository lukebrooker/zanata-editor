'use strict';

componentEditItem.directive('editItem', function(hotkeys) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      phrase: '=',
      editor: '=',
      index: '=',
      selected: '=',
      settings: '='
    },
    controller: 'EditItemCtrl',
    templateUrl: 'components/edit-item/edit-item.html'
  };
});
