// ==UserScript==
// @name         明日方舟一图流-活动商店优化
// @version      1.0
// @description  标记活动商店已兑换物品。
// @author       deXaint
// @match        https://yituliu.site/material/store
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yituliu.site
// @grant        none
// ==/UserScript==

setTimeout(function(){
    // for adding checkbox
    var actCards = document.querySelectorAll(".act_card:not(.uni_invisible)");
    for (var i = 0; i < actCards.length ; i++) {
        if (actCards[i].innerHTML != "") {
            // modify its height
            actCards[i].style.height = "120px";

            // append div with checkbox
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.classList.add('redeem');
            checkbox.style = "transform: scale(1.8);";

            checkbox.addEventListener("change", function(e) {
                if (this.checked) {
                    this.parentNode.parentNode.style.opacity = "0.5";
                } else {
                    this.parentNode.parentNode.style.opacity = "1.0";
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
        }
    }

    // for adding clear all button
    var buttonDiv = document.createElement('div');
    buttonDiv.style="width:100%;";

    var button = document.createElement('button');
    button.textContent = '清除所有';
    button.style="width:100%;";

    button.addEventListener("click", function(e) {
        var checkboxes = document.querySelectorAll(".redeem");
        for (var i = 0; i < checkboxes.length ; i++) {
            checkboxes[i].checked = false;
            checkboxes[i].dispatchEvent(new Event('change'));
        }
    });

    buttonDiv.appendChild(button);

    // insert before first act content
    var firstActContent = document.querySelector('.act_content');

    firstActContent.parentNode.insertBefore(buttonDiv, firstActContent);

}, 1000);