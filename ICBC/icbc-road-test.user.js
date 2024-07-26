// ==UserScript==
// @name         ICBC Road Test Auto-login
// @namespace https://greasyfork.org/users/1217444
// @version      1.0
// @description  ICBC Road Test Auto-login
// @author       deXaint
// @match        https://onlinebusiness.icbc.com/webdeas-ui/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icbc.com
// @grant        none
// ==/UserScript==

var lastName = "";
var license = "";
var keyword = "";

var intervalID = setInterval(login, 1000);

function login() {
    switch (location.pathname){
        case "/webdeas-ui/home":
            document.getElementsByClassName("primary")[0].click();
            break;
        case "/webdeas-ui/login;type=driver":
            var lastNameInput = document.getElementById("mat-input-0");
            lastNameInput.value = lastName;
            lastNameInput.dispatchEvent(new Event("input"));

            var licenseInput = document.getElementById("mat-input-1");
            licenseInput.value = license;
            licenseInput.dispatchEvent(new Event("input"));

            var keywordInput = document.getElementById("mat-input-2");
            keywordInput.value = keyword;
            keywordInput.dispatchEvent(new Event("input"));

            document.getElementById("mat-checkbox-1-input").click();

            document.getElementsByClassName("primary")[0].click();

            break;
        case "/webdeas-ui/booking":
            clearInterval(intervalID);

            var tabs = document.getElementsByClassName("mat-tab-label-content");
            for (let i = 0; i < tabs.length; i++) {
                if (tabs[i].innerHTML.includes("By office")) {
                    tabs[i].click();
                    break;
                }
            }

            var keyboardEvent = new KeyboardEvent('keydown', {
                code: 'Enter',
                key: 'Enter',
                charCode: 13,
                keyCode: 13
            });

            setTimeout(function() {
                var officeInput = document.getElementById("mat-input-4");
                officeInput.value = "Vancouver";
                officeInput.focus();
                officeInput.click();
                officeInput.dispatchEvent(new Event("input"));

                setTimeout(function() {
                    var options = document.getElementsByClassName("mat-option-text");
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].innerHTML.includes("Vancouver driver licensing (Point Grey)")) {
                            options[i].click();
                            break;
                        }
                    }
                }, 1000);

            }, 1000);






    }
}
