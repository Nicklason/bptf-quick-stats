// ==UserScript==
// @name         BackpackTF Quick Stats
// @namespace    https://www.youtube.com/watch?v=dQw4w9WgXcQ
// @version      1.1.0
// @description  A faster way to open stats pages for bptf items
// @author       Nicklason
// @match        https://backpack.tf/profiles/*
// @grant        GM_openInTab
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

/* global GM_openInTab */

const $ = window.jQuery;

(function () {
    'use strict';

    // Wait for the inventory to load
    waitInventory();

    // Listen for inventory refresh
    $('#refresh-inventory').click(function () {
        waitInventory();
    });
})();

function waitInventory (check = false) {
    $('.item').not('.spacer').off('click');
    if (check) {
        const pages = $('#backpack').children('.backpack-page');
        if (pages.length != 0) {
            inventoryLoaded();
            return;
        }
    }

    setTimeout(function () {
        waitInventory(true);
    }, 1000);
}

function inventoryLoaded () {
    $('.item').not('.spacer').on('mouseover', function () {
        const self = this;
        $(document).bind('keydown', function (e) {
            if (e.which == 16) {
                const url = constructLink($(self));
                GM_openInTab(url, { insert: true });
            }
        });
    }).on('mouseout', function () {
        $(document).unbind('keydown');
    });
}

function constructLink (element) {
    const name = element.data('name');
    const quality = element.data('q_name');
    const craftable = element.data('craftable') == 1;
    const tradeable = element.data('tradable') == 1;
    const effect = element.data('effect_id') ? element.data('effect_id') : null;

    const url = `https://backpack.tf/stats/${quality}/${name}/${tradeable ? 'Tradeable' : 'Non-Tradable'}/${craftable ? 'Craftable' : 'Non-Craftable'}${effect === null ? '' : `/${effect}`}`;
    return url;
}
