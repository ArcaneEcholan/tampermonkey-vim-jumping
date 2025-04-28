// ==UserScript==
// @name         vim jumping
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
    let activeInputCopy = null;
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
            if (e.key === ';' && e.ctrlKey) {
                e.preventDefault();

                console.log("mode switching triggered, the active input now is:")
                console.log(activeInput)

                vimMode = 'normal';
                updateIndicator();

                // some textarea(eg. jira comment editor) will handle esc keydown and focus out,
                // 300 ms re-focus is a little bit tricky, but it works.
                setTimeout(() => {
                    if(activeInputCopy != null) {
                        console.log("force focus on the target input")
                        activeInputCopy.focus()
                    }
                }, 300)
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
                console.log("word forward triggered")

                e.preventDefault();
                while (pos < value.length && !/\w/.test(value[pos])) pos++;
                while (pos < value.length && /\w/.test(value[pos])) pos++;
                // if (pos > 0) pos--;
                activeInput.setSelectionRange(pos, pos);
            }

            if (e.key === 'b') {
                console.log("word backword triggered")
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
            // if a new focusin occured, don't forget to clean the copy of the last input to avoid timeout callback focusing on the last inupt
            activeInputCopy = null;
            activeInput = e.target;
            //  vimMode = 'insert';
            //  updateIndicator();
            console.log("active input:")
            console.log(activeInput)
        }
    });

    document.addEventListener('focusout', (e) => {
        if (e.target === activeInput) {
            // when input focus out by editor mode swithing listener, give it a chance for our timeout callback to re-focus
            console.log("focus out triggered")
            activeInputCopy = activeInput
            activeInput = null;
        }
    });

    document.addEventListener('keydown', handleKeydown);

    createIndicator();
})();
