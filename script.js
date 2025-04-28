// ==UserScript==
// @name         vim jumping
// @namespace    http://tampermonkey.net/
// @version      2025-04-28
// @description  try to take over the world!
// @author       https://github.com/ArcaneEcholan
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let vimMode = 'insert'; // 'insert' | 'command'
    let activeInput = null;
    let indicator = null;

    function updateIndicator() {
        if (indicator) {
            indicator.textContent = vimMode === 'insert' ? '-- INSERT --' : '-- COMMAND --';
            indicator.style.background = vimMode === 'insert' ? 'rgba(139, 139, 139, 0.7)' :'rgba(255, 0, 96, 1)';

            if(activeInput != null) {
                if(vimMode === 'command') {
                    console.log("update care style:")
                    console.log("caretColor = " + "#00bfff" )
                    console.log("fontVariantLigatures = " + "#none" )
                    activeInput.style.caretColor="rgba(255, 0, 96, 1)" /* modern bright color */
                }
                if(vimMode === 'insert') {
                    console.log("update care style:")
                    console.log("caretColor = " + "unset" )
                    console.log("fontVariantLigatures = " + "unset" )
                    activeInput.style.caretColor="#000000" /* modern bright color */
                }
                
            }
        }
    }

    function createIndicator() {
        indicator = document.createElement('div');
        indicator.style.position = 'fixed';
        indicator.style.bottom = '10px';
        indicator.style.right = '10px';
        indicator.style.background =  'rgba(139, 139, 139, 0.7)';
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

                vimMode = 'command';
                updateIndicator();
            }
            return;
        }

        if (vimMode === 'command') {
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
            activeInput = e.target;
            //  vimMode = 'insert';
            //  updateIndicator();
            console.log("active input:")
            console.log(activeInput)
        }
    });

    document.addEventListener('focusout', (e) => {
        if (e.target === activeInput) {
            console.log("focus out triggered")
            activeInput = null;
        }
    });

    document.addEventListener('keydown', handleKeydown);

    createIndicator();
})();
