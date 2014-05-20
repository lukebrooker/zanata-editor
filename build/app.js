'use strict';

var zanataApp = angular.module('zanataApp',
    ['ngRoute',
    'ui.router',
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

zanataApp.controller('ZanataCtrl', function ($scope, hotkeys) {
  $scope.currentUser = {
    username: 'lukebrooker',
    fullName: 'Luke Brooker',
    settings: {
      editor: {
        verticalSource: false
      }
    }
  }
});


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

'use strict';

zanataEditor.controller('EditorCtrl', function ($scope, $timeout, hotkeys, PhraseService) {

  $scope.editor = {
    anItemSelected: false,
    selectedIndex: null
  },
  $scope.phrasesOptions = {
    order: 'id',
    limit: 20
  };

  function findAllPhrases(limit) {
    PhraseService.findAll(limit).then(function (phrases) {
      $scope.phrases = phrases;
    });
  }

  $scope.activate = function(index, event) {
    $scope.editor.anItemSelected = true;
    $scope.editor.selectedIndex = index;
  }

  $scope.selectNone = function() {
    // remove selection from all
    $scope.editor.selectedIndex = null;
    $scope.editor.anItemSelected = false;
  }

  $scope.savePhrase = function() {
    console.log('Saved');
  }

  $scope.nextPhrase = function() {
    var index = $scope.editor.selectedIndex != null ? $scope.editor.selectedIndex : -1;
    $scope.savePhrase();
    $scope.activate(index + 1);
    console.log(index);
  }

  $scope.prevPhrase = function() {
    var index = $scope.editor.selectedIndex != null ? $scope.editor.selectedIndex : -1;
    $scope.savePhrase();
    $scope.activate(index - 1);
  }

  /**
   * Hotkeys
   */

  hotkeys.add({
    combo: 'esc',
    description: 'Deselect all translations',
    callback: function(e, hotkey) {
      e.preventDefault();
      $scope.selectNone();
      console.log('Esc');
      $timeout(function() {
        e.target.blur();
      });
    }
  });

  hotkeys.add({
    combo: 'alt+down',
    description: 'Save and goto prev phrase',
    callback: function(e, hotkey) {
      $scope.nextPhrase();
    }
  });

  hotkeys.add({
    combo: 'alt+up',
    description: 'save and go to prev phrase',
    callback: function(e, hotkey) {
      $timeout(function() {
        $scope.prevPhrase();
      });
    }
  });

  hotkeys.add({
    combo: 'ctrl+enter',
    description: 'Save and goto prev phrase',
    callback: function(e, hotkey) {
      $timeout(function() {
        $scope.nextPhrase();
      });
    }
  });

  hotkeys.add({
    combo: 'ctrl+shift+enter',
    description: 'save and go to prev phrase',
    callback: function(e, hotkey) {
      $scope.prevPhrase();
    }
  });

  hotkeys.add({
    combo: 'alt+g',
    description: 'Copy source to translation',
    callback: function(e, hotkey) {
      console.log($scope.editor.selectedIndex);
      $scope.phrases[$scope.editor.selectedIndex].translation =
        $scope.phrases[$scope.editor.selectedIndex].source;
      e.preventDefault();
    }
  });

  findAllPhrases();

});

'use strict';

var zanataMain = angular.module('zanataMain', ['ngRoute', 'ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('main', {
        url: "/",
        templateUrl: "main/main.html",
        controller: 'MainCtrl'
      });

  });

'use strict';

zanataMain.controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

var componentClickElsewhere = angular.module('componentClickElsewhere', []);

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

'use strict';

var componentContentEditable = angular.module('componentContentEditable', [])
  .config(function () {
  });

componentContentEditable.directive('contenteditable', function () {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function (scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function () {
        element.html(ngModel.$viewValue || '');
      };

      // Listen for change events to enable binding
      element.on('blur keyup change', function () {
        scope.$apply(readViewText);
      });

      // No need to initialize, AngularJS will initialize the text based on ng-model attribute

      // Write data to the model
      function readViewText() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if (attrs.stripBr && html == '<br>') {
          html = '';
        }
        ngModel.$setViewValue(html);
      }
    }
  };
});

'use strict';

var componentEditField = angular.module('componentEditField', ['highlight', 'monospaced.elastic', 'componentTrusted'])
  .config(function (highlightServiceProvider) {
    highlightServiceProvider.setOptions({
      // tabReplace: '<span class="edit-field__tab">    </span>'
    });
  });


'use strict';

componentEditField.directive('editField', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      source: '=editSource',
      index: '=',
      selected: '=',
      editEvent: '=',
      // Editor state
      editor: "="
    },
    link: function (scope, element, attrs) {
      scope.mousedown = false;
      scope.focus = false;

      scope.$watch('source', function(newSource) {
        scope.display = newSource;
      });

      // scope.$watch('selected', function(newSelected) {
      //   // if (newSelected) {
      //     scope.setFocus();
      //   // }
      // });

      scope.updateCursor = function($event, keyChar) {

        // Make sure the textarea has been updated
        $timeout(function() {
          scope.currentSourceText = element.find('textarea')[0];
          scope.currentSourceValue = element.find('textarea')[0].value;
          scope.textStart = scope.currentSourceText.selectionStart;
          scope.textEnd = scope.currentSourceText.selectionEnd;
          scope.addCursor();

          switch ($event.type) {
            case 'focus':
              scope.focus = true;
              scope.actionInProgress = true;
              scope.editor.selectedIndex = scope.index;
              break;
            case 'blur':
              scope.focus = false;
              scope.actionInProgress = false;
              scope.removeCursor();
              break;
            case 'keydown':
              scope.actionInProgress = true;
              break;
            case 'keyup':
              scope.actionInProgress = false;
              break;
            case 'mouseup':
              scope.actionInProgress = false;
              break;
            case 'mousedown':
              scope.actionInProgress = true;
              break;
          }

          if (scope.focus && scope.textStart == scope.textEnd) {
            if (!scope.actionInProgress) {
              scope.addCursor();
            }
            else {
              scope.pauseCursor();
            }
          }
          else {
            scope.removeCursor();
          }
        });
      }

      scope.addCursor = function() {
        if (scope.currentSourceValue.substring(scope.textEnd) == '') {
          scope.cursor = scope.currentSourceValue + '<span class="edit-field__cursor is-blinking"></span>'
        }
        else {
          scope.cursor =
            scope.currentSourceValue.substring(0, scope.textStart)
            + '<span class="edit-field__cursor is-blinking"></span>'
            + scope.currentSourceValue.substring(scope.textEnd);
        }
      }

      scope.pauseCursor = function() {
        if (scope.currentSourceValue.substring(scope.textEnd) == '') {
          scope.cursor = scope.currentSourceValue + '<span class="edit-field__cursor"></span>'
        }
        else {
          scope.cursor =
            scope.currentSourceValue.substring(0, scope.textStart)
            + '<span class="edit-field__cursor"></span>'
            + scope.currentSourceValue.substring(scope.textEnd);
        }
      }

      scope.removeCursor = function() {
        scope.cursor = scope.currentSourceValue;
      }

      scope.setFocus = function() {
        $timeout(function() {
          if (scope.editor.selectedIndex != null) {
            element.find('textarea')[0].focus();
          }
          else {
            element.find('textarea')[0].blur();
          }
        });
      }

      scope.selectNone = function() {
        scope.editor.selectedIndex = null;
        scope.editor.anItemSelected = false;
        scope.setFocus();
      }

      scope.saveAndNext = function($event) {
        $event.preventDefault();
        scope.editor.selectedIndex = scope.editor.selectedIndex + 1;
        if (scope.editor.selectedIndex > 4) {
          scope.selectNone();
        }
      }

      scope.saveAndPrev = function($event) {
        $event.preventDefault();
        scope.editor.selectedIndex = scope.editor.selectedIndex - 1;
        if (scope.editor.selectedIndex < 0) {
          scope.selectNone();
        }
      }

      scope.saveAndDeselect = function($event) {
        $event.preventDefault();
        scope.selectNone();
      }

      scope.keydown = function($event) {
        scope.updateCursor($event, $event.which);
        // Which Key
        switch ($event.which) {
          // Tab
          case 9:
            $event.preventDefault();
            var textareaValue = element.find('textarea')[0];
            var start = textareaValue.selectionStart;
            var end = textareaValue.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            scope.source = textareaValue.value.substring(0, start)
                             + "\t"
                             + textareaValue.value.substring(end);

            // // put caret at right position again
            textareaValue.selectionStart = textareaValue.selectionEnd = start + 1;
            break;
          // Move these to editor ctrl
          // Enter
          case 13:
            if (($event.shiftKey && $event.ctrlKey) || ($event.shiftKey && $event.metaKey)) {
              scope.saveAndPrev($event);
            }
            else if ($event.ctrlKey || $event.metaKey) {
              scope.saveAndNext($event);
            }
            break;
          // // ESC
          // case 27:
          //   $timeout(function() {
          //     $event.target.blur();
          //   });
          //   scope.saveAndDeselect($event);
          //   break;
          // Arrow Up
          // Arrow Down
          case 40:
            if ($event.altKey) {
              scope.saveAndNext($event);
            }
            break;
        }
      }

    },

    templateUrl: 'components/edit-field/edit-field.html'
  };
});

'use strict';

var componentEditItem = angular.module('componentEditItem', ['componentEditField', 'cfp.hotkeys'])
  .config(function () {

  });

'use strict';

componentEditItem.controller('EditItemCtrl', function ($scope, hotkeys) {

  // Hotkeys

  // hotkeys.add({
  //   combo: 'alt+down',
  //   description: 'Next translation',
  //   callback: function(e, hotkey) {
  //     e.preventDefault();

  //   }
  // });

});

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

var componentHighlight = angular.module('highlight', []);

componentHighlight
  .controller('HighlightCtrl', [
                    'highlightCache', 'highlightService',
  function HighlightCtrl (highlightCache, highlightService) {
    var ctrl = this;

    var _elm = null,
        _lang = null,
        _code = null,
        _hlCb = null;

    ctrl.init = function (codeElm) {
      _elm = codeElm;
    };

    ctrl.setLanguage = function (lang) {
      _lang = lang;

      if (_code) {
        ctrl.highlight(_code);
      }
    };

    ctrl.highlightCallback = function (cb) {
      _hlCb = cb;
    };

    ctrl.highlight = function (code) {
      if (!_elm) {
        return;
      }

      var res, cacheKey;

      _code = code;

      if (_lang) {
        // language specified
        cacheKey = ctrl._cacheKey(_lang, _code);
        res = highlightCache.get(cacheKey);

        if (!res) {
          res = highlightService.highlight(_lang, highlightService.fixMarkup(_code), true);
          highlightCache.put(cacheKey, res);
        }
      }
      else {
        // language auto-detect
        cacheKey = ctrl._cacheKey(_code);
        res = highlightCache.get(cacheKey);

        if (!res) {
          res = highlightService.highlightAuto(highlightService.fixMarkup(_code));
          highlightCache.put(cacheKey, res);
        }
      }

      _elm.html(res.value);
      // language as class on the <code> tag
      _elm.addClass(res.language);

      if (_hlCb !== null && angular.isFunction(_hlCb)) {
        _hlCb();
      }
    };

    ctrl.clear = function () {
      if (!_elm) {
        return;
      }
      _code = null;
      _elm.text('');
    };

    ctrl.release = function () {
      _elm = null;
    };

    ctrl._cacheKey = function () {
      var args = Array.prototype.slice.call(arguments),
          glue = "!angular-highlightjs!";
      return args.join(glue);
    };
  }]);

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

var componentPhrase = angular.module('componentPhrase', []);

componentPhrase.factory('PhraseService', function($q, $filter) {
  var phrases = [
    {
      "id": 1,
      "source": "Ma pede, nonummy ut, molestie\n\nMore stuff",
      "translation": "dui quis accumsan",
      "status": "translated"
    },
    {
      "id": 2,
      "source": "ac facilisis facilisis, magna tellus faucibus leo, in lobortis tellus justo sit amet nulla. Donec non justo. Proin non massa non ante bibendum ullamcorper.",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 3,
      "source": "quam vel sapien imperdiet ornare.",
      "translation": "imperdiet",
      "status": "fuzzy"
    },
    {
      "id": 4,
      "source": "nibh. Donec est mauris, rhoncus id, mollis nec, cursus a, enim. Suspendisse aliquet, sem ut cursus luctus, ipsum",
      "translation": "orci. Ut sagittis",
      "status": "translated"
    },
    {
      "id": 5,
      "source": "non enim commodo hendrerit. Donec porttitor tellus non magna. Nam ligula elit, pretium et, rutrum non, hendrerit id, ante. Nunc mauris sapien, cursus in, hendrerit consectetuer, cursus et, magna. Praesent interdum ligula eu enim. Etiam imperdiet dictum magna. Ut tincidunt orci quis lectus. Nullam suscipit, est ac facilisis facilisis, magna tellus faucibus leo, in lobortis tellus justo sit amet nulla. Donec non justo. Proin non massa non",
      "translation": "vulputate",
      "status": "translated"
    },
    {
      "id": 6,
      "source": "velit. Sed malesuada augue ut lacus. Nulla tincidunt, neque vitae semper egestas, urna justo faucibus lectus, a sollicitudin orci sem eget massa. Suspendisse eleifend. Cras sed leo. Cras vehicula aliquet libero. Integer in magna. Phasellus dolor elit, pellentesque a, facilisis non, bibendum sed, est. Nunc",
      "translation": "orci, adipiscing non,",
      "status": "translated"
    },
    {
      "id": 7,
      "source": "montes, nascetur ridiculus mus.",
      "translation": "nisi dictum",
      "status": "translated"
    },
    {
      "id": 8,
      "source": "dictum eu, placerat eget, venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam laoreet, libero et tristique pellentesque, tellus sem mollis dui,",
      "translation": "vel,",
      "status": "translated"
    },
    {
      "id": 9,
      "source": "at pretium aliquet, metus",
      "translation": "fames",
      "status": "translated"
    },
    {
      "id": 10,
      "source": "lobortis tellus justo sit amet nulla. Donec non justo. Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at pretium aliquet, metus urna convallis erat, eget tincidunt dui augue",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 11,
      "source": "eu tempor erat neque non quam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam fringilla cursus purus. Nullam scelerisque neque sed sem egestas blandit. Nam nulla magna, malesuada vel, convallis in, cursus et, eros. Proin ultrices. Duis volutpat nunc sit",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 12,
      "source": "ultrices sit amet, risus. Donec nibh enim, gravida sit amet, dapibus id, blandit at, nisi. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin vel nisl. Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh vulputate mauris sagittis placerat. Cras dictum ultricies ligula. Nullam enim. Sed nulla ante, iaculis nec, eleifend non, dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc sed libero. Proin sed turpis nec mauris blandit",
      "translation": "risus. Nulla eget",
      "status": "fuzzy"
    },
    {
      "id": 13,
      "source": "aliquam, enim nec tempus scelerisque, lorem ipsum sodales purus, in molestie tortor nibh sit amet orci. Ut sagittis lobortis mauris. Suspendisse aliquet molestie tellus. Aenean egestas hendrerit neque. In ornare sagittis felis. Donec tempor, est ac mattis semper, dui lectus rutrum urna, nec luctus felis purus ac tellus. Suspendisse sed dolor. Fusce",
      "translation": "Nunc sed orci",
      "status": "fuzzy"
    },
    {
      "id": 14,
      "source": "tempor lorem, eget mollis lectus pede et risus. Quisque libero lacus, varius et, euismod et, commodo at, libero. Morbi accumsan laoreet ipsum. Curabitur consequat, lectus sit amet luctus vulputate, nisi sem semper erat, in consectetuer ipsum nunc id enim. Curabitur massa. Vestibulum accumsan neque et nunc. Quisque ornare",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 15,
      "source": "mauris. Morbi non sapien molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec tellus. Nunc lectus pede, ultrices",
      "translation": "id",
      "status": "fuzzy"
    },
    {
      "id": 16,
      "source": "amet, risus. Donec nibh enim, gravida sit amet, dapibus id, blandit at, nisi. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin vel nisl. Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh vulputate mauris sagittis placerat. Cras dictum ultricies ligula. Nullam enim. Sed nulla ante, iaculis nec,",
      "translation": "Sed auctor odio",
      "status": "translated"
    },
    {
      "id": 17,
      "source": "Nulla tempor augue ac ipsum. Phasellus vitae mauris sit amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 18,
      "source": "sapien imperdiet ornare. In faucibus. Morbi vehicula. Pellentesque tincidunt tempus risus.",
      "translation": "et",
      "status": "fuzzy"
    },
    {
      "id": 19,
      "source": "ac metus vitae velit egestas lacinia. Sed congue, elit sed consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin dolor. Nulla semper tellus id nunc interdum feugiat. Sed nec metus facilisis lorem tristique aliquet. Phasellus fermentum convallis ligula. Donec luctus aliquet odio. Etiam ligula tortor, dictum eu, placerat eget, venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer adipiscing",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 20,
      "source": "eu dui. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eget magna. Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum metus. Aenean sed pede nec",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 21,
      "source": "fringilla mi lacinia mattis. Integer eu lacus. Quisque imperdiet, erat nonummy ultricies ornare, elit elit fermentum risus, at fringilla purus mauris a nunc. In at pede. Cras vulputate velit eu sem. Pellentesque ut ipsum ac mi eleifend egestas. Sed pharetra,",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 22,
      "source": "lobortis mauris. Suspendisse aliquet molestie tellus. Aenean egestas hendrerit neque. In ornare sagittis felis.",
      "translation": "enim",
      "status": "fuzzy"
    },
    {
      "id": 23,
      "source": "quis, pede. Suspendisse dui. Fusce diam nunc, ullamcorper eu, euismod ac, fermentum vel, mauris. Integer sem elit, pharetra ut, pharetra sed, hendrerit a, arcu. Sed et libero. Proin mi. Aliquam gravida mauris ut mi. Duis risus odio, auctor vitae, aliquet nec, imperdiet nec, leo. Morbi neque tellus, imperdiet non, vestibulum nec,",
      "translation": "scelerisque",
      "status": "fuzzy"
    },
    {
      "id": 24,
      "source": "pellentesque, tellus sem mollis dui, in sodales elit erat vitae",
      "translation": "lobortis quis, pede.",
      "status": "fuzzy"
    },
    {
      "id": 25,
      "source": "Aliquam nec enim. Nunc ut erat. Sed nunc",
      "translation": "iaculis odio. Nam",
      "status": "fuzzy"
    },
    {
      "id": 26,
      "source": "imperdiet, erat nonummy ultricies ornare, elit elit fermentum risus, at fringilla purus mauris a nunc. In at pede. Cras vulputate velit eu sem. Pellentesque ut ipsum ac mi eleifend egestas. Sed pharetra, felis eget varius ultrices, mauris",
      "translation": "sagittis placerat.",
      "status": "fuzzy"
    },
    {
      "id": 27,
      "source": "elit fermentum risus,",
      "translation": "nascetur ridiculus",
      "status": "translated"
    },
    {
      "id": 28,
      "source": "gravida mauris ut mi. Duis risus odio, auctor vitae, aliquet nec, imperdiet nec, leo. Morbi neque tellus, imperdiet non, vestibulum nec, euismod in, dolor. Fusce feugiat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam auctor, velit eget laoreet posuere, enim nisl elementum purus, accumsan interdum libero dui nec",
      "translation": "nec",
      "status": "fuzzy"
    },
    {
      "id": 29,
      "source": "In lorem. Donec elementum, lorem ut aliquam iaculis, lacus pede sagittis augue, eu tempor erat neque non quam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam fringilla cursus purus. Nullam scelerisque neque sed sem egestas blandit. Nam nulla magna, malesuada vel, convallis",
      "translation": "congue. In scelerisque",
      "status": "translated"
    },
    {
      "id": 30,
      "source": "nibh dolor,",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 31,
      "source": "Aliquam nisl. Nulla eu neque pellentesque massa lobortis ultrices. Vivamus rhoncus. Donec est. Nunc ullamcorper, velit in aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu ac orci.",
      "translation": "porta",
      "status": "fuzzy"
    },
    {
      "id": 32,
      "source": "nostra, per inceptos hymenaeos. Mauris ut quam vel sapien imperdiet ornare. In faucibus. Morbi vehicula. Pellentesque tincidunt tempus risus. Donec egestas. Duis ac arcu. Nunc mauris. Morbi non sapien molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare",
      "translation": "tempus scelerisque,",
      "status": "fuzzy"
    },
    {
      "id": 33,
      "source": "lacus vestibulum lorem, sit amet ultricies sem magna nec quam. Curabitur vel lectus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec dignissim magna a tortor. Nunc commodo auctor velit. Aliquam nisl. Nulla eu neque pellentesque massa lobortis ultrices. Vivamus rhoncus. Donec est. Nunc ullamcorper, velit in aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu ac orci. Ut semper",
      "translation": "bibendum fermentum",
      "status": "translated"
    },
    {
      "id": 34,
      "source": "placerat. Cras dictum ultricies ligula. Nullam enim. Sed nulla ante, iaculis nec, eleifend non, dapibus",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 35,
      "source": "convallis in, cursus et, eros. Proin ultrices. Duis volutpat nunc sit amet metus. Aliquam erat volutpat. Nulla facilisis. Suspendisse commodo tincidunt nibh. Phasellus nulla. Integer vulputate, risus a ultricies adipiscing, enim mi tempor lorem, eget mollis lectus pede et risus. Quisque libero",
      "translation": "Praesent",
      "status": "translated"
    },
    {
      "id": 36,
      "source": "nulla. Integer urna. Vivamus molestie dapibus ligula. Aliquam erat volutpat. Nulla dignissim. Maecenas ornare egestas ligula. Nullam feugiat placerat velit. Quisque varius. Nam porttitor scelerisque neque. Nullam nisl. Maecenas malesuada fringilla est. Mauris eu turpis. Nulla aliquet. Proin velit. Sed malesuada augue ut lacus.",
      "translation": "felis, adipiscing",
      "status": "fuzzy"
    },
    {
      "id": 37,
      "source": "tincidunt pede ac urna. Ut tincidunt vehicula risus. Nulla eget metus eu erat semper rutrum. Fusce dolor quam, elementum at, egestas a, scelerisque sed, sapien. Nunc pulvinar arcu et pede. Nunc sed orci lobortis augue scelerisque mollis. Phasellus libero mauris,",
      "translation": "tincidunt congue turpis.",
      "status": "translated"
    },
    {
      "id": 38,
      "source": "eget, dictum placerat, augue. Sed molestie. Sed id risus quis diam luctus lobortis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Mauris ut quam vel sapien imperdiet ornare. In faucibus. Morbi vehicula. Pellentesque tincidunt tempus risus. Donec",
      "translation": "sollicitudin commodo",
      "status": "translated"
    },
    {
      "id": 39,
      "source": "In nec orci. Donec nibh. Quisque nonummy ipsum non arcu. Vivamus sit amet",
      "translation": "nulla ante,",
      "status": "fuzzy"
    },
    {
      "id": 40,
      "source": "consectetuer, cursus et, magna. Praesent interdum ligula eu enim. Etiam imperdiet dictum magna. Ut tincidunt orci quis lectus. Nullam suscipit, est ac facilisis facilisis, magna tellus faucibus leo,",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 41,
      "source": "commodo auctor velit. Aliquam nisl. Nulla eu neque pellentesque massa lobortis ultrices. Vivamus rhoncus. Donec est. Nunc ullamcorper, velit in aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu ac orci. Ut semper pretium neque. Morbi quis urna. Nunc quis arcu vel quam dignissim pharetra. Nam ac nulla. In tincidunt congue turpis. In condimentum. Donec at arcu. Vestibulum ante ipsum primis",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 42,
      "source": "litora torquent per conubia nostra, per",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 43,
      "source": "elit fermentum risus, at fringilla purus mauris a nunc. In at pede. Cras vulputate velit eu sem. Pellentesque ut ipsum ac mi eleifend egestas. Sed pharetra, felis eget varius ultrices, mauris ipsum porta elit, a feugiat tellus lorem eu metus. In lorem. Donec elementum, lorem ut aliquam iaculis, lacus pede sagittis augue, eu tempor erat neque non quam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam fringilla cursus purus. Nullam",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 44,
      "source": "rhoncus. Nullam velit dui, semper et, lacinia vitae, sodales at, velit. Pellentesque ultricies dignissim lacus. Aliquam rutrum lorem ac risus. Morbi metus. Vivamus euismod",
      "translation": "pede. Cum sociis",
      "status": "translated"
    },
    {
      "id": 45,
      "source": "eu eros. Nam consequat dolor vitae dolor. Donec fringilla. Donec feugiat metus sit amet ante. Vivamus non lorem vitae odio sagittis semper. Nam tempor diam dictum sapien. Aenean massa. Integer vitae",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 46,
      "source": "Sed molestie. Sed id risus quis diam luctus lobortis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 47,
      "source": "Sed eget lacus. Mauris non dui nec urna suscipit nonummy. Fusce fermentum fermentum arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus ornare. Fusce mollis. Duis sit amet diam eu dolor egestas rhoncus. Proin nisl sem, consequat nec, mollis vitae, posuere at, velit. Cras lorem lorem, luctus ut, pellentesque eget, dictum placerat, augue. Sed molestie. Sed id risus quis diam luctus lobortis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per",
      "translation": "euismod",
      "status": "translated"
    },
    {
      "id": 48,
      "source": "Integer mollis. Integer tincidunt aliquam arcu. Aliquam ultrices iaculis odio. Nam interdum enim non nisi. Aenean eget metus. In nec orci. Donec nibh. Quisque nonummy ipsum non arcu. Vivamus sit amet risus. Donec egestas. Aliquam nec enim. Nunc ut erat. Sed nunc est, mollis non, cursus non, egestas a, dui. Cras pellentesque. Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros. Nam consequat dolor vitae dolor. Donec fringilla. Donec feugiat metus sit amet ante.",
      "translation": "vulputate",
      "status": "translated"
    },
    {
      "id": 49,
      "source": "mattis. Cras eget nisi dictum augue malesuada malesuada. Integer id magna et ipsum cursus vestibulum. Mauris magna. Duis dignissim tempor arcu. Vestibulum ut eros non",
      "translation": "vehicula aliquet libero.",
      "status": "fuzzy"
    },
    {
      "id": 50,
      "source": "et tristique pellentesque, tellus sem mollis dui, in sodales elit erat vitae risus. Duis a mi fringilla mi lacinia mattis. Integer eu lacus. Quisque imperdiet, erat nonummy ultricies ornare, elit elit fermentum risus, at fringilla purus mauris a nunc. In at pede. Cras vulputate velit eu sem. Pellentesque ut ipsum ac mi eleifend egestas. Sed pharetra, felis eget varius ultrices, mauris ipsum porta elit, a feugiat tellus lorem eu metus. In lorem. Donec elementum, lorem ut aliquam iaculis,",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 51,
      "source": "diam eu dolor egestas rhoncus. Proin nisl sem, consequat nec, mollis vitae, posuere at, velit. Cras lorem lorem, luctus ut, pellentesque eget, dictum placerat, augue. Sed molestie. Sed id risus quis diam luctus lobortis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Mauris ut quam vel sapien imperdiet ornare. In faucibus. Morbi vehicula.",
      "translation": "nec tempus mauris",
      "status": "translated"
    },
    {
      "id": 52,
      "source": "nunc. In at pede. Cras vulputate velit eu sem. Pellentesque ut ipsum ac mi eleifend egestas. Sed pharetra, felis eget varius ultrices, mauris ipsum porta elit, a feugiat tellus lorem eu",
      "translation": "nascetur",
      "status": "fuzzy"
    },
    {
      "id": 53,
      "source": "fames ac turpis egestas. Aliquam fringilla cursus purus. Nullam scelerisque neque sed sem egestas blandit. Nam nulla magna, malesuada vel, convallis in, cursus et, eros. Proin ultrices. Duis volutpat nunc sit amet metus. Aliquam erat volutpat. Nulla facilisis. Suspendisse commodo tincidunt nibh. Phasellus nulla. Integer vulputate, risus a ultricies adipiscing, enim mi tempor lorem, eget mollis lectus pede et risus. Quisque libero lacus, varius et, euismod et, commodo",
      "translation": "Sed",
      "status": "fuzzy"
    },
    {
      "id": 54,
      "source": "Suspendisse sed dolor. Fusce mi lorem, vehicula et, rutrum eu, ultrices sit amet, risus. Donec nibh",
      "translation": "eget massa.",
      "status": "translated"
    },
    {
      "id": 55,
      "source": "consequat, lectus sit amet luctus vulputate, nisi sem semper",
      "translation": "arcu.",
      "status": "translated"
    },
    {
      "id": 56,
      "source": "vel lectus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec dignissim magna a tortor. Nunc commodo auctor velit. Aliquam nisl. Nulla eu neque pellentesque massa lobortis ultrices. Vivamus rhoncus. Donec est. Nunc ullamcorper, velit in aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu ac orci. Ut semper pretium neque. Morbi quis",
      "translation": "Proin dolor.",
      "status": "fuzzy"
    },
    {
      "id": 57,
      "source": "quis diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce aliquet magna a neque. Nullam ut",
      "translation": "pretium",
      "status": "fuzzy"
    },
    {
      "id": 58,
      "source": "orci luctus et ultrices posuere cubilia Curae; Phasellus ornare. Fusce mollis. Duis sit amet diam eu dolor egestas rhoncus. Proin nisl sem, consequat nec, mollis vitae, posuere at, velit. Cras lorem lorem, luctus ut, pellentesque eget, dictum placerat, augue. Sed molestie. Sed id risus",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 59,
      "source": "eu, odio. Phasellus at augue id ante dictum cursus. Nunc",
      "translation": "tempor augue ac",
      "status": "translated"
    },
    {
      "id": 60,
      "source": "massa lobortis ultrices. Vivamus rhoncus. Donec est.",
      "translation": "Cras eget nisi",
      "status": "translated"
    },
    {
      "id": 61,
      "source": "scelerisque neque sed sem egestas blandit. Nam nulla magna, malesuada vel, convallis in, cursus et, eros.",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 62,
      "source": "in magna. Phasellus dolor elit, pellentesque a, facilisis non, bibendum sed, est. Nunc laoreet lectus quis massa. Mauris vestibulum, neque sed dictum",
      "translation": "In",
      "status": "translated"
    },
    {
      "id": 63,
      "source": "feugiat metus sit amet ante. Vivamus non lorem vitae odio sagittis semper. Nam tempor diam dictum sapien. Aenean massa. Integer vitae nibh. Donec est mauris, rhoncus id, mollis nec, cursus a, enim. Suspendisse aliquet, sem ut cursus luctus, ipsum leo elementum sem, vitae aliquam eros turpis non enim. Mauris quis turpis vitae purus gravida sagittis. Duis gravida. Praesent",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 64,
      "source": "sed dui. Fusce aliquam, enim nec tempus scelerisque, lorem ipsum sodales purus, in molestie tortor nibh",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 65,
      "source": "urna justo faucibus lectus, a sollicitudin orci sem eget massa. Suspendisse eleifend. Cras sed leo. Cras vehicula aliquet libero. Integer in magna. Phasellus dolor elit, pellentesque a, facilisis non, bibendum sed, est. Nunc laoreet lectus quis massa. Mauris vestibulum, neque sed dictum eleifend, nunc risus varius orci, in consequat enim diam vel arcu. Curabitur ut odio",
      "translation": "pede blandit congue.",
      "status": "fuzzy"
    },
    {
      "id": 66,
      "source": "mauris sagittis placerat. Cras dictum ultricies ligula. Nullam enim. Sed nulla ante, iaculis nec, eleifend non, dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc sed libero. Proin sed turpis nec",
      "translation": "ridiculus",
      "status": "fuzzy"
    },
    {
      "id": 67,
      "source": "turpis egestas. Fusce aliquet magna a neque. Nullam ut nisi a",
      "translation": "aliquet",
      "status": "fuzzy"
    },
    {
      "id": 68,
      "source": "ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec tincidunt. Donec vitae erat vel pede blandit congue. In scelerisque scelerisque dui. Suspendisse ac metus vitae velit egestas lacinia. Sed congue, elit sed consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin dolor. Nulla semper tellus id nunc interdum feugiat. Sed nec metus",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 69,
      "source": "lacinia mattis. Integer eu lacus. Quisque imperdiet, erat nonummy ultricies ornare, elit elit fermentum risus, at fringilla purus",
      "translation": "nibh sit amet",
      "status": "translated"
    },
    {
      "id": 70,
      "source": "ac, feugiat non, lobortis quis, pede. Suspendisse dui. Fusce diam nunc, ullamcorper eu, euismod ac, fermentum vel, mauris. Integer sem elit, pharetra ut, pharetra sed, hendrerit a, arcu. Sed et libero. Proin mi. Aliquam gravida mauris ut mi. Duis risus odio, auctor vitae, aliquet nec, imperdiet nec, leo. Morbi neque tellus, imperdiet non, vestibulum nec, euismod in, dolor. Fusce feugiat. Lorem ipsum dolor sit amet, consectetuer adipiscing",
      "translation": "mus.",
      "status": "fuzzy"
    },
    {
      "id": 71,
      "source": "blandit viverra. Donec tempus, lorem fringilla ornare placerat, orci lacus vestibulum lorem, sit amet ultricies sem magna nec quam. Curabitur vel lectus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec dignissim",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 72,
      "source": "dictum eu, placerat eget, venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam laoreet, libero et tristique pellentesque, tellus sem mollis dui, in sodales elit erat vitae risus. Duis a mi fringilla mi lacinia mattis. Integer eu lacus. Quisque imperdiet, erat nonummy ultricies ornare, elit elit",
      "translation": "cursus non,",
      "status": "translated"
    },
    {
      "id": 73,
      "source": "egestas a, scelerisque sed, sapien. Nunc pulvinar arcu et pede. Nunc sed orci lobortis augue scelerisque mollis. Phasellus libero mauris, aliquam eu, accumsan sed, facilisis vitae, orci. Phasellus dapibus quam quis diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce aliquet magna a neque. Nullam ut nisi a",
      "translation": "velit eu",
      "status": "translated"
    },
    {
      "id": 74,
      "source": "Morbi sit amet massa. Quisque porttitor eros nec tellus. Nunc lectus pede, ultrices a, auctor non, feugiat nec,",
      "translation": "mattis",
      "status": "translated"
    },
    {
      "id": 75,
      "source": "fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh vulputate mauris sagittis placerat. Cras dictum ultricies ligula. Nullam enim. Sed nulla ante, iaculis nec, eleifend non, dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc sed libero. Proin sed turpis nec mauris blandit mattis. Cras eget nisi dictum augue malesuada malesuada. Integer id magna et ipsum cursus vestibulum. Mauris magna. Duis dignissim tempor arcu. Vestibulum ut eros",
      "translation": "eu, odio.",
      "status": "fuzzy"
    },
    {
      "id": 76,
      "source": "at, velit. Pellentesque ultricies dignissim lacus. Aliquam rutrum lorem ac risus. Morbi metus. Vivamus euismod urna. Nullam lobortis quam a felis ullamcorper viverra. Maecenas iaculis aliquet diam. Sed diam lorem, auctor quis, tristique ac, eleifend vitae, erat. Vivamus nisi. Mauris nulla. Integer urna. Vivamus molestie dapibus ligula. Aliquam erat volutpat. Nulla",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 77,
      "source": "a, facilisis",
      "translation": "Nunc quis arcu",
      "status": "fuzzy"
    },
    {
      "id": 78,
      "source": "Fusce diam nunc, ullamcorper eu, euismod ac, fermentum vel, mauris. Integer sem elit, pharetra ut, pharetra",
      "translation": "adipiscing lacus.",
      "status": "translated"
    },
    {
      "id": 79,
      "source": "Duis a mi fringilla mi lacinia mattis. Integer eu lacus. Quisque imperdiet, erat nonummy ultricies ornare, elit elit fermentum risus, at fringilla purus mauris a nunc. In at pede. Cras vulputate velit eu sem. Pellentesque ut ipsum ac mi eleifend egestas. Sed pharetra, felis eget varius ultrices, mauris ipsum porta elit, a feugiat tellus lorem eu",
      "translation": "Aliquam fringilla",
      "status": "untranslated"
    },
    {
      "id": 80,
      "source": "elit, dictum eu, eleifend nec, malesuada ut, sem. Nulla interdum. Curabitur dictum. Phasellus in felis. Nulla tempor augue ac ipsum. Phasellus vitae mauris sit amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing lobortis risus. In mi pede, nonummy ut, molestie in, tempus eu, ligula. Aenean euismod mauris eu elit.",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 81,
      "source": "faucibus id, libero. Donec consectetuer mauris id sapien. Cras dolor dolor, tempus non, lacinia at, iaculis quis, pede. Praesent eu dui. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eget magna. Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum metus. Aenean sed pede nec ante blandit viverra. Donec tempus, lorem fringilla ornare placerat, orci lacus vestibulum lorem, sit amet ultricies sem magna nec quam. Curabitur vel lectus. Cum sociis natoque penatibus et magnis dis parturient",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 82,
      "source": "sapien. Aenean massa. Integer vitae nibh. Donec est mauris, rhoncus id, mollis nec, cursus a, enim. Suspendisse aliquet, sem ut cursus luctus, ipsum leo elementum sem, vitae aliquam eros turpis non enim. Mauris quis turpis vitae purus gravida sagittis. Duis gravida. Praesent eu nulla at sem molestie sodales. Mauris blandit enim consequat purus. Maecenas libero est, congue a, aliquet vel, vulputate eu, odio. Phasellus at augue id ante dictum cursus. Nunc",
      "translation": "auctor, nunc",
      "status": "translated"
    },
    {
      "id": 83,
      "source": "Mauris quis turpis vitae purus gravida sagittis. Duis gravida. Praesent eu nulla at sem molestie sodales. Mauris blandit enim consequat purus. Maecenas libero est, congue a, aliquet vel, vulputate eu, odio. Phasellus at augue id ante dictum cursus. Nunc mauris elit, dictum eu, eleifend nec, malesuada ut, sem. Nulla interdum. Curabitur dictum. Phasellus in felis.",
      "translation": "in felis. Nulla",
      "status": "fuzzy"
    },
    {
      "id": 84,
      "source": "tempor diam dictum sapien. Aenean massa. Integer vitae nibh. Donec est mauris, rhoncus id, mollis nec, cursus a, enim. Suspendisse aliquet, sem ut cursus luctus, ipsum leo elementum sem, vitae aliquam eros turpis non enim. Mauris quis turpis vitae purus gravida sagittis. Duis gravida. Praesent eu nulla at sem molestie sodales. Mauris blandit enim consequat purus. Maecenas libero est, congue a, aliquet vel, vulputate eu, odio. Phasellus at augue id ante dictum cursus. Nunc mauris elit,",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 85,
      "source": "Phasellus nulla. Integer vulputate, risus a ultricies adipiscing, enim mi tempor lorem, eget mollis lectus pede et risus. Quisque libero lacus, varius et, euismod et, commodo at, libero. Morbi accumsan",
      "translation": "aliquam eu,",
      "status": "translated"
    },
    {
      "id": 86,
      "source": "eu lacus. Quisque imperdiet, erat nonummy ultricies ornare, elit elit fermentum risus, at fringilla purus mauris a nunc. In at pede. Cras vulputate velit eu sem. Pellentesque ut ipsum ac mi eleifend egestas.",
      "translation": "a, magna. Lorem",
      "status": "fuzzy"
    },
    {
      "id": 87,
      "source": "dui augue eu tellus. Phasellus elit pede, malesuada vel, venenatis vel, faucibus id, libero. Donec consectetuer mauris id sapien. Cras dolor dolor, tempus",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 88,
      "source": "mi eleifend egestas. Sed pharetra, felis eget varius ultrices, mauris",
      "translation": "eu",
      "status": "translated"
    },
    {
      "id": 89,
      "source": "morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam fringilla cursus",
      "translation": "mattis.",
      "status": "translated"
    },
    {
      "id": 90,
      "source": "Phasellus in felis. Nulla tempor augue ac ipsum. Phasellus vitae mauris sit amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing lobortis risus. In mi pede, nonummy ut, molestie in, tempus eu, ligula. Aenean euismod mauris eu elit. Nulla facilisi. Sed neque. Sed eget lacus.",
      "translation": "eget ipsum.",
      "status": "fuzzy"
    },
    {
      "id": 91,
      "source": "Nam ac nulla. In tincidunt congue turpis. In condimentum. Donec at arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec tincidunt. Donec vitae erat vel pede blandit",
      "translation": "suscipit,",
      "status": "fuzzy"
    },
    {
      "id": 92,
      "source": "auctor velit. Aliquam nisl. Nulla eu neque pellentesque massa lobortis ultrices. Vivamus rhoncus. Donec est. Nunc ullamcorper, velit in aliquet lobortis, nisi nibh",
      "translation": "Nulla",
      "status": "translated"
    },
    {
      "id": 93,
      "source": "tellus justo sit amet nulla. Donec non justo. Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at pretium aliquet, metus urna convallis erat, eget tincidunt dui",
      "translation": "rutrum urna, nec",
      "status": "translated"
    },
    {
      "id": 94,
      "source": "sed, hendrerit a, arcu. Sed et libero. Proin mi. Aliquam gravida mauris ut mi. Duis risus odio, auctor vitae, aliquet nec, imperdiet nec, leo. Morbi neque tellus, imperdiet non, vestibulum nec, euismod in, dolor. Fusce feugiat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam auctor, velit eget laoreet posuere, enim nisl elementum",
      "translation": "egestas ligula. Nullam",
      "status": "translated"
    },
    {
      "id": 95,
      "source": "augue eu tellus. Phasellus elit pede, malesuada vel, venenatis vel, faucibus id, libero. Donec consectetuer mauris id sapien. Cras dolor dolor, tempus non, lacinia at, iaculis quis, pede. Praesent eu dui. Cum sociis natoque penatibus et magnis dis parturient montes,",
      "translation": "sem",
      "status": "fuzzy"
    },
    {
      "id": 96,
      "source": "Cras vehicula aliquet libero. Integer in magna. Phasellus dolor elit, pellentesque a, facilisis non, bibendum sed, est. Nunc laoreet lectus quis massa. Mauris vestibulum, neque sed dictum eleifend,",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 97,
      "source": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;",
      "translation": "ac orci. Ut",
      "status": "translated"
    },
    {
      "id": 98,
      "source": "hendrerit id, ante. Nunc mauris sapien, cursus in, hendrerit consectetuer, cursus et, magna. Praesent interdum ligula eu enim. Etiam imperdiet dictum magna. Ut tincidunt orci quis lectus. Nullam suscipit, est ac facilisis facilisis, magna tellus faucibus leo, in lobortis tellus justo sit amet nulla. Donec non justo. Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at pretium aliquet, metus urna convallis erat, eget tincidunt dui augue eu tellus. Phasellus elit pede, malesuada vel, venenatis vel, faucibus id, libero.",
      "translation": "consectetuer",
      "status": "fuzzy"
    },
    {
      "id": 99,
      "source": "mauris ipsum porta elit, a feugiat tellus lorem eu metus. In lorem. Donec elementum, lorem ut aliquam iaculis, lacus pede sagittis",
      "translation": "",
      "status": "untranslated"
    },
    {
      "id": 100,
      "source": "nibh sit amet orci. Ut sagittis lobortis mauris. Suspendisse aliquet molestie tellus. Aenean egestas hendrerit neque. In ornare sagittis felis. Donec tempor, est ac mattis semper, dui lectus rutrum urna, nec luctus felis purus ac tellus. Suspendisse sed dolor. Fusce mi lorem, vehicula et, rutrum eu, ultrices sit amet, risus. Donec nibh enim, gravida sit amet, dapibus id, blandit at, nisi. Cum sociis",
      "translation": "eu",
      "status": "fuzzy"
    }
  ];

  // We use promises to make this api asynchronous. This is clearly not necessary when using in-memory data
  // but it makes this service more flexible and plug-and-play. For example, you can now easily replace this
  // service with a JSON service that gets its data from a remote server without having to changes anything
  // in the modules invoking the data service since the api is already async.

  return {
    findAll: function(limit) {
      var deferred = $q.defer(),
          limit = limit || false;
      if (limit) {
        phrases = $filter('limitTo')(phrases, limit);
      }
      deferred.resolve(phrases);
      return deferred.promise;
    },

    findById: function(phraseId) {
      var deferred = $q.defer();
      var phrase = phrases[phraseId];
      deferred.resolve(phrase);
      return deferred.promise;
    },

    // Other Examples

    // findByName: function(searchKey) {
    //   var deferred = $q.defer();
    //   var results = employees.filter(function(element) {
    //     var fullName = element.firstName + " " + element.lastName;
    //     return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
    //   });
    //   deferred.resolve(results);
    //   return deferred.promise;
    // },

    // findByManager: function (managerId) {
    //   var deferred = $q.defer(),
    //     results = employees.filter(function (element) {
    //       return parseInt(managerId) === element.managerId;
    //     });
    //   deferred.resolve(results);
    //   return deferred.promise;
    // }

  }
});

var componentTrusted = angular.module('componentTrusted', []);

componentTrusted.filter('trusted', ['$sce', function($sce){
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}]);

var componentUser = angular.module('componentUser', []);

