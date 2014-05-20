'use strict';

var componentEditField = angular.module('componentEditField', ['highlight', 'monospaced.elastic', 'componentTrusted'])
  .config(function (highlightServiceProvider) {
    highlightServiceProvider.setOptions({
      // tabReplace: '<span class="edit-field__tab">    </span>'
    });
  });
