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
    var actCards = document.querySelectorAll(".act_card:not(.uni_invisible)");
    for (var i = 0; i < actCards.length ; i++) {
        if (actCards[i].innerHTML != "") {
            // modify its height
            actCards[i].style.height = "120px";

            // append div with checkbox
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.style = "transform: scale(1.8);";

            checkbox.addEventListener("change", function(e) {
                if (this.checked) {
                    this.parentNode.parentNode.style.opacity = "0.5";
                } else {
                    this.parentNode.parentNode.style.opacity = "1.0";
                }
            });

            var div = document.createElement('div');
            div.style="width:100%;display:flex; flex-direction: row; justify-content: center; align-items: center;";

            div.appendChild(checkbox);

            actCards[i].appendChild(div);
        }
    }
}, 1000);
