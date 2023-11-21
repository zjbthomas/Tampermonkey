// ==UserScript==
// @name         明日方舟一图流-活动商店优化
// @version      1.1
// @description  标记活动商店已兑换物品。
// @author       deXaint
// @match        https://yituliu.site/material/store
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yituliu.site
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1217444
// ==/UserScript==

setTimeout(function(){
    // check on-going acts and retrieve info from localstorage
    var tempActInfo = new Map();

    var actBannerBackgrounds = document.querySelectorAll(".act_banner_background");
    for (let i = 0; i < actBannerBackgrounds.length; i++) {
        let actName = actBannerBackgrounds[i].style.background.match(/url\(["']?([^"']*)["']?\)/)[1];

        if (localStorage.getItem(actName) != null) {
            tempActInfo.set(actName, localStorage.getItem(actName));
        } else {
            tempActInfo.set(actName, JSON.stringify({}));
        }
    }

    // clear localstorage
    localStorage.clear();

    // save on-going acts again into localstorage
    for (let [key, value] of tempActInfo) {
        localStorage.setItem(key, value);
    }

    // for adding checkbox for all act cards, regardless of act
    var actCards = document.querySelectorAll(".act_card:not(.uni_invisible)");
    for (let i = 0; i < actCards.length ; i++) {
        if (actCards[i].innerHTML != "") {
            // modify its height
            actCards[i].style.height = "120px";

            // append div with checkbox
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.classList.add('redeem');
            checkbox.style = "transform: scale(1.8);";

            checkbox.addEventListener("change", function(e) {
                let actCard = this.parentNode.parentNode;

                // change opacity of act card
                if (this.checked) {
                    actCard.style.opacity = "0.5";
                } else {
                    actCard.style.opacity = "1.0";
                }

                // store in localStorage
                let actBannerBackground = this.closest('.act_content').parentNode.querySelector('.act_banner_background');
                let actName = actBannerBackground.style.background.match(/url\(["']?([^"']*)["']?\)/)[1];

                let bgClass = findBGClass(actCard);

                if (bgClass && localStorage.getItem(actName) != null) {
                    let json = JSON.parse(localStorage.getItem(actName));
                    json[bgClass] = this.checked;

                    localStorage.setItem(actName, JSON.stringify(json));
                }
            });

            var checkboxDiv = document.createElement('div');
            checkboxDiv.style="width:100%;display:flex; flex-direction: row; justify-content: center; align-items: center;";

            checkboxDiv.appendChild(checkbox);

            actCards[i].appendChild(checkboxDiv);

            // add click listener
            actCards[i].addEventListener("click", function(e) {
                var redeemCheckbox = this.querySelector(".redeem");

                if (e.target == redeemCheckbox) return;

                redeemCheckbox.click();
            });

            // set height property of act card detail
            var actCardDetail = actCards[i].querySelector('.act_card_detail');
            actCardDetail.style.height = "100px";

            // read from localstorage
            var actBannerBackground = actCards[i].closest('.act_content').parentNode.querySelector('.act_banner_background');
            var actName = actBannerBackground.style.background.match(/url\(["']?([^"']*)["']?\)/)[1];

            var bgClass = findBGClass(actCards[i]);

            if (bgClass && localStorage.getItem(actName) != null) {
                let json = JSON.parse(localStorage.getItem(actName));

                checkbox.checked = (json[bgClass] === true);
                checkbox.dispatchEvent(new Event('change'));
            }
        }
    }

    // add function div to each act
    for (let i = 0; i < actBannerBackgrounds.length; i++) {
        // function div
        var functionDiv = document.createElement('div');
        functionDiv.style="width:100%;display: flex; justify-content: flex-end; align-content: center;";

         // insert before first act content; such insertion should be done first so the div is rendered
        actBannerBackgrounds[i].parentNode.insertBefore(functionDiv, actBannerBackgrounds[i].nextSibling);

        // sort label and checkbox
        var sortLabel = document.createElement('label');
        sortLabel.style="display: flex; align-items: center; margin-right:10px;";

        var sortCheckbox = document.createElement('input');
        sortCheckbox.type = "checkbox";
        sortCheckbox.classList.add('sort_checkbox');
        sortCheckbox.style="margin-right:5px;";

        sortLabel.addEventListener("click", function(e) {
            var sortCheckbox = this.querySelector(".sort_checkbox");
            if (e.target != sortCheckbox) return;

            var container = this.closest('div').parentNode;

            // not the best solution but at least working
            if (e.target.checked) {
                var sortedActContent = container.querySelector('.sorted_act_content');
                if (sortedActContent == null) {
                    // create a new div withh sorted content
                    sortedActContent = document.createElement('div');
                    sortedActContent.classList.add("sorted_act_content", "act_content");

                    // get eff from all act cards
                    var effMap = new Map();
                    var actCards = container.querySelectorAll(".act_card:not(.uni_invisible)");
                    for (let i = 0; i < actCards.length ; i++) {
                        if (actCards[i].innerHTML != "") {
                            var effP = actCards[i].querySelector(".act_card_item_efficiency");
                            if (effP != null) {
                                var eff = parseFloat(effP.innerHTML);

                                effMap.set(actCards[i], eff);
                            }
                        }
                    }

                    var sortedEffMap = new Map([...effMap.entries()].sort((a, b) => b[1] - a[1]));

                    // this moves node from .act_content to the newly created div; not the most elegant solution
                    for (let node of sortedEffMap.keys()) {
                        sortedActContent.appendChild(node);
                    }

                    container.insertBefore(sortedActContent, null);

                    // temporarily, remove all previous act contents
                    var actContents = container.querySelectorAll('.act_content:not(.sorted_act_content)');
                    for (let i = 0; i < actContents.length; i++) {
                        actContents[i].remove();
                    }

                }
            } else {
                // this just refreshes the page; not the best solution
                location.reload();
            }

            // store in localStorage
            let actBannerBackground = container.querySelector('.act_banner_background');
            let actName = actBannerBackground.style.background.match(/url\(["']?([^"']*)["']?\)/)[1];

            if (localStorage.getItem(actName) != null) {
                let json = JSON.parse(localStorage.getItem(actName));
                json["sorted"] = e.target.checked;

                localStorage.setItem(actName, JSON.stringify(json));
            }
        });

        sortLabel.appendChild(sortCheckbox);
        sortLabel.innerHTML += "合并后排序";

        functionDiv.appendChild(sortLabel);

        // read from localstorage
        let actName = actBannerBackgrounds[i].style.background.match(/url\(["']?([^"']*)["']?\)/)[1];

        if (localStorage.getItem(actName) != null) {
            let json = JSON.parse(localStorage.getItem(actName));
            if (json["sorted"] != null && json["sorted"] === true) {
                sortLabel.click();
            }
        }

        // clear-all button
        var button = document.createElement('button');
        button.textContent = "清除所有";

        button.addEventListener("click", function(e) {
            var checkboxes = this.closest('div').parentNode.querySelectorAll(".redeem");
            for (var i = 0; i < checkboxes.length ; i++) {
                checkboxes[i].checked = false;
                checkboxes[i].dispatchEvent(new Event('change'));
            }
        });

        functionDiv.appendChild(button);
    }
}, 1000);

function findBGClass(actCard) {
    var storeSpriteAct = actCard.querySelector('.store_sprite_act');
    var bgClass = null;
    for (var ic = 0; ic < storeSpriteAct.classList.length; ic++) {
        if (storeSpriteAct.classList[ic] != 'store_sprite_act' && storeSpriteAct.classList[ic].includes('bg-')) {
            bgClass = storeSpriteAct.classList[ic];
            break;
        }
    }
    return bgClass;
}