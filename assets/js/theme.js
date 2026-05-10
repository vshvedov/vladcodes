(function () {
  'use strict';

  var KEY = 'vladcodes:theme';
  var ORDER = ['auto', 'light', 'dark'];

  function readStored() {
    try {
      var v = localStorage.getItem(KEY);
      return (v === 'light' || v === 'dark' || v === 'auto') ? v : 'auto';
    } catch (e) {
      return 'auto';
    }
  }

  function writeStored(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  function systemPrefersDark() {
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function resolve(theme) {
    if (theme === 'auto') {
      return systemPrefersDark() ? 'dark' : 'light';
    }
    return theme;
  }

  function apply(theme) {
    var resolved = resolve(theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme-resolved', resolved);
    var icon = document.querySelector('[data-theme-icon]');
    if (icon) icon.textContent = theme;
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label',
        'Toggle color theme (current: ' + theme + ', resolved: ' + resolved + ')');
    }
  }

  function next(theme) {
    var i = ORDER.indexOf(theme);
    return ORDER[(i + 1) % ORDER.length];
  }

  function init() {
    var current = readStored();
    apply(current);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        current = next(current);
        writeStored(current);
        apply(current);
      });
    }

    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var listener = function () {
        if (current === 'auto') apply('auto');
      };
      if (mq.addEventListener) {
        mq.addEventListener('change', listener);
      } else if (mq.addListener) {
        mq.addListener(listener);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
