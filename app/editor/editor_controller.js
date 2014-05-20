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
