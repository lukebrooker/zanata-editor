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
