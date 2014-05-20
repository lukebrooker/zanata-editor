angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("editor/editor.html","<div class=\"l--push-all-half\">\n  <h3 class=\"l--push-all-0\">Test</h3>\n</div>\n<ul class=\"list--no-bullets txt--select-none\" click-elsewhere=\"selectNone()\">\n  <li ng-repeat=\"phrase in (filteredPhrases = (phrases | limitTo: phrasesOptions.limit | orderBy: phrasesOptions.order))\">\n    <edit-item\n      phrase=\"phrase\"\n      editor=\"editor\"\n      index=\"$index\"\n      selected=\"editor.selectedIndex == $index\"\n      settings=\"currentUser.settings.editor\"\n      ng-click=\"activate($index, $event)\">\n    </edit-item>\n  </li>\n</ul>\n<!-- <div class=\"l--push-h-half l--push-v-2\">\n  <a ui-sref=\"main\">Go home</a>\n</div> -->\n");
$templateCache.put("editor/editor.list.html","<ul class=\"list--no-bullets txt--select-none\" click-elsewhere=\"selectNone()\">\n  <li ng-repeat=\"phrase in (filteredPhrases = (phrases | limitTo: phraseLimit | orderBy: phraseOrder))\">\n    <edit-item phrase=\"phrase\" editor=\"editor\" index=\"filteredPhrases[$index]\"></edit-item>\n  </li>\n</ul>\n");
$templateCache.put("main/main.html","<h3>List of Awesome Things</h3>\n<ul>\n    <li ng-repeat=\"thing in awesomeThings\">\n    {{thing}}\n    </li>\n</ul>\n\n<a ui-sref=\"editor\">Go to editor</a>\n<!-- <a ng-href=\"./editor\">Go to editor</a> -->\n");
$templateCache.put("components/edit-field/edit-field.html","<div class=\"edit-field\">\n  <textarea\n    rows=\"1\"\n    placeholder=\"Enter a translation…\"\n    msd-elastic\n    class=\"edit-field__underlay mousetrap\"\n    spellcheck=\"true\"\n    ng-model=\"source\"\n    ng-focus=\"updateCursor($event)\"\n    ng-blur=\"updateCursor($event)\"\n    ng-keydown=\"keydown($event)\"\n    ng-keyup=\"updateCursor($event)\"\n    ng-mousedown=\"updateCursor($event)\"\n    ng-mouseup=\"updateCursor($event)\"\n    ng-mousemove=\"updateCursor($event)\"\n    ng-trim=\"false\">\n  </textarea>\n  <highlight class=\"edit-field__overlay\" source=\"display\"></highlight>\n  <div class=\"edit-field__overlay edit-field__cursor-text\" ng-show=\"focus\" ng-bind-html=\"cursor | trusted\"></div>\n</div>\n");
$templateCache.put("components/edit-item/edit-item.html","<ul class=\"edit-item\"\n  ng-class=\"{\n    \'is-focused\': selected,\n    \'is-unfocused\': !selected && editor.anItemSelected,\n    \'edit-item--translated\': phrase.status == \'translated\',\n    \'edit-item--unsure\': phrase.status == \'fuzzy\'\n  }\">\n  <li class=\"edit-item__panel edit-item__source\">\n    <header class=\"edit-item__header toolbar\" ng-show=\"selected\">\n      <h3 class=\"edit-item__heading\">Source</h3>\n      <div class=\"l--float-right\">\n      <button class=\"toolbar__button toolbar__button--top l--float-right\" title=\"Copy source to translation\" ng-click=\"phrase.translation = phrase.source\"><i class=\"i i--arrow-right\"></i></button>\n      </div>\n    </header>\n    <div class=\"edit-field edit-item__field\">\n      <div highlight source=\"phrase.source\" class=\"edit-field__readonly\"></div>\n    </div>\n    <footer class=\"edit-item__footer toolbar\" ng-show=\"selected\">\n\n    </footer>\n  </li>\n  <li class=\"edit-item__panel edit-item__source edit-item__source--vertical\" ng-show=\"settings.verticalSource && selected\">\n    <header class=\"edit-item__header toolbar\">\n      <h3 class=\"edit-item__heading\">Source</h3>\n      <div class=\"l--float-right\">\n      <button class=\"toolbar__button toolbar__button--top l--float-right\" ng-click=\"phrase.translation = phrase.source\"><i class=\"i i--arrow-right\"></i></button>\n      </div>\n    </header>\n    <div class=\"edit-field edit-item__field\">\n      <div highlight source=\"phrase.source\" class=\"edit-field__readonly\"></div>\n    </div>\n  </li>\n  <li class=\"edit-item__panel edit-item__translation\">\n    <div class=\"edit-item__status\" title=\"{{phrase.status}}\">{{status}}</div>\n    <header class=\"edit-item__header toolbar\" ng-show=\"selected\">\n      <h3 class=\"edit-item__heading\">Translation</h3>\n      <button class=\"toolbar__button toolbar__button--top l--float-right\" ng-click=\"settings.verticalSource = !settings.verticalSource\" ng-class=\"{\'is-active\': settings.verticalSource}\"><i class=\"i i--code\"></i></button>\n    </header>\n    <edit-field edit-source=\"phrase.translation\" selected=\"selected\" index=\"$index\" editor=\"editor\" class=\"edit-item__field\"></edit-field>\n    <footer class=\"edit-item__footer toolbar\" ng-show=\"selected\">\n      <div class=\"l--float-right\">\n        <div class=\"dropdown\" ng-class=\"{\'is-active\': showDropdown}\">\n          <button class=\"toolbar__button toolbar__button--success\" title=\"ctrl + enter\">Save as translated</button>\n          <button type=\"button\" class=\"toolbar__button toolbar__button--success toolbar__button__toggle\" data-toggle=\"dropdown\" ng-click=\"showDropdown = !showDropdown\">\n            <i class=\"i i--arrow-down\"></i>\n            <span class=\"is-sr-only\">Toggle Dropdown</span>\n          </button>\n          <ul class=\"dropdown__content\" role=\"menu\">\n            <li><a href=\"#\">Save as fuzzy</a></li>\n            <li><a href=\"#\">Save as approved</a></li>\n            <li><a href=\"#\">Save as suggestion</a></li>\n          </ul>\n        </div>\n      </div>\n    </footer>\n  </li>\n</ul>\n");}]);