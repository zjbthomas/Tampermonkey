// ==UserScript==
// @name         Steam Wishlist Language Highlighter
// @version      1.0
// @description  Highlight Steam wishlist games if they do not support Chinese
// @author       deXaint
// @match        https://store.steampowered.com/wishlist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=store.steampowered.com
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @license      MIT
// ==/UserScript==

(function() {
  'use strict';

  let triggerLimit = false;

  let languagesMap = {};
  let supportChinese = false;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }

  function main() {
    // Add option for filtering non-supported games
    waitForElement('section.Focusable').then(input => {
        let form = input.parentElement;

        let section = document.createElement('section');
        section.classList.add('Focusable');
        form.appendChild(section);

        let title = document.createElement('h3');
        title.innerHTML = '语言兼容性';
        section.appendChild(title);

        let label = document.createElement('label');
        label.setAttribute('tabindex', '0');
        label.classList.add('Focusable');
        section.appendChild(label);

        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "language_chinese";

        checkbox.addEventListener("change", function(e) {
            if (this.checked) {
                supportChinese = this.checked;
                filterWishlistList(languagesMap);
            } else {
                // this just refreshes the page; not the best solution
                location.reload();
            }
        });

        label.appendChild(checkbox);

        label.appendChild(document.createTextNode('中文'));
    });

    // Load language map using GM_xmlhttpRequest
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://raw.githubusercontent.com/zjbthomas/SteamOnlineChecker/main/languages.txt',
      onload: function(response) {
        if (response.status !== 200) {
          console.error('Failed to load language file:', response.status);
          return;
        }

        response.responseText.split('\n').forEach(line => {
          const [id, supported] = line.trim().split(',');
          if (id && supported) {
            languagesMap[id] = supported.toLowerCase() === 'true';
          }
        });

        runWatcher(languagesMap);
      },
      onerror: function(err) {
        console.error('GM_xmlhttpRequest error:', err);
      }
    });
  }

  function runWatcher(languagesMap) {
    waitForElement('#StoreTemplate .Panel input.Focusable').then(input => {
      if (!input) {
        console.error('Wishlist input not found!');
        return;
      }

      input.addEventListener('keyup', () => limitFunction(() => filterWishlistList(languagesMap)));
      document.getElementById('StoreTemplate').addEventListener('scroll', () => limitFunction(() => filterWishlistList(languagesMap)));
      filterWishlistList(languagesMap);

      const observer = new MutationObserver(() => limitFunction(() => filterWishlistList(languagesMap)));
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  function filterWishlistList(languagesMap) {
    const games = Array.from(document.querySelectorAll('#StoreTemplate .Panel .Panel a[href*="/app/"]')).filter(game => game.querySelector('img'));
    games.forEach(game => {
      const appId = game.href.split('app/')[1].split('/')[0];
      game.dataset.id = appId;

      if (languagesMap[appId] === false) {
        addLangInfo(game);
      } else {
        removeLangInfo(game);
      }
    });

    triggerLimit = false;
  }

  function limitFunction(f) {
    if (!triggerLimit) {
      triggerLimit = true;
      setTimeout(f, 50);
    }
  }

  function addLangInfo(g) {
    if (!g) return;
    if (supportChinese === false) {
        g.parentElement.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
    } else {
        g.parentElement.style.display = 'none';
    }
  }

  function removeLangInfo(g) {
    if (!g) return;
    g.parentElement.style.backgroundColor = 'rgba(64, 81, 99, 0.9)';
    g.parentElement.style.display = 'flex';
  }

  function waitForElement(selector, timeout = 15000) {
    return new Promise((resolve) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.documentElement, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }

})();