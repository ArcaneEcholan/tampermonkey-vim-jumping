// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-04-28
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  let vimMode = 'insert'; // 'insert' | 'normal'
  let activeInput = null;
  let indicator = null;

  function updateIndicator() {
    if (indicator) {
      indicator.textContent = vimMode === 'insert' ? '-- INSERT --' : '-- NORMAL --';
    }
  }

  function createIndicator() {
    indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.bottom = '10px';
    indicator.style.right = '10px';
    indicator.style.background = 'rgba(0,0,0,0.7)';
    indicator.style.color = 'white';
    indicator.style.padding = '4px 8px';
    indicator.style.borderRadius = '4px';
    indicator.style.fontFamily = 'monospace';
    indicator.style.zIndex = '9999';
    indicator.style.fontSize = '12px';
    indicator.textContent = '-- INSERT --';
    document.body.appendChild(indicator);
  }

  function handleKeydown(e) {
      console.log("key down detected")
      console.log(e)
    if (!activeInput) return;


    if (vimMode === 'insert') {
      if (e.key === 'Escape') {
console.log("esc triggered, the active input now is:")
          console.log(activeInput)
          e.preventDefault();
        vimMode = 'normal';
        updateIndicator();
          activeInput.focus();
      }
      return;
    }

    if (vimMode === 'normal') {
      if (e.key === 'i') {
        e.preventDefault();
        vimMode = 'insert';
        updateIndicator();
        return;
      }

      const value = activeInput.value;
      let pos = activeInput.selectionStart;

      if (e.key === 'w') {
        e.preventDefault();
        while (pos < value.length && !/\w/.test(value[pos])) pos++;
        while (pos < value.length && /\w/.test(value[pos])) pos++;
        activeInput.setSelectionRange(pos, pos);
      }

      if (e.key === 'e') {
        e.preventDefault();
        while (pos < value.length && !/\w/.test(value[pos])) pos++;
        while (pos < value.length && /\w/.test(value[pos])) pos++;
        // if (pos > 0) pos--;
        activeInput.setSelectionRange(pos, pos);
      }

      if (e.key === 'b') {
        e.preventDefault();
        if (pos > 0) pos--;
        while (pos > 0 && !/\w/.test(value[pos])) pos--;
        while (pos > 0 && /\w/.test(value[pos-1])) pos--;
        activeInput.setSelectionRange(pos, pos);
      }

          if (e.key === 'h') {
      e.preventDefault();
      if (pos > 0) pos--;
      activeInput.setSelectionRange(pos, pos);
    }

    if (e.key === 'l') {
      e.preventDefault();
      if (pos < value.length) pos++;
      activeInput.setSelectionRange(pos, pos);
    }

    if (!['w', 'e', 'b', 'h', 'l', 'i'].includes(e.key)) {
      e.preventDefault();
    }
    }
  }

  document.addEventListener('focusin', (e) => {
      console.log("focusin triggered")
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      activeInput = e.target;
      vimMode = 'insert';
      updateIndicator();
      console.log("active input:")
      console.log(activeInput)
    }
  });

  document.addEventListener('focusout', (e) => {
    if (e.target === activeInput) {
      activeInput = null;
    }
  });

  document.addEventListener('keydown', handleKeydown);

  createIndicator();
})();
