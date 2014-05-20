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
