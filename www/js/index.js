/*
    Palette, an application for colorizing user interfaces.
    Copyright (C) 2017  Scott Bouloutian

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Ad unit configuration
let admobid = null;
let admobBanner = false;
if (/(android)/i.test(navigator.userAgent)) {
    // Android
    admobid = {
        banner: 'ca-app-pub-4400088783500800/1838970579',
        interstitial: 'ca-app-pub-4400088783500800/3315703773',
    };
} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    // iOS
    admobid = {
        banner: 'ca-app-pub-4400088783500800/1838970579',
        interstitial: 'ca-app-pub-4400088783500800/3315703773',
    };
} else {
    // Windows
    admobid = {
        banner: 'ca-app-pub-4400088783500800/1838970579',
        interstitial: 'ca-app-pub-4400088783500800/3315703773',
    };
}

function renderInterstitial(testing) {
    const product = store.get('palette_remove_ads');
    if (!product.owned) {
        AdMob.prepareInterstitial({
            adId: admobid.interstitial,
            isTesting: testing,
            autoShow: true,
        });
    }
}

function renderBanner(testing) {
    const product = store.get('palette_remove_ads');
    if (product.owned && admobBanner) {
        AdMob.removeBanner();
        admobBanner = false;
    } else if (!product.owned && !admobBanner) {
        AdMob.createBanner({
            adId: admobid.banner,
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            isTesting: testing,
            overlap: false,
            offsetTopBar: false,
            bgColor: 'black',
        });
        admobBanner = true;
    }
}

const colors = {
    flat: [
        { name: 'Turquoise', value: '#1abc9c' },
        { name: 'Green Sea', value: '#16a085' },
        { name: 'Sun Flower', value: '#f1c40f' },
        { name: 'Orange', value: '#f39c12' },
        { name: 'Emerald', value: '#2ecc71' },
        { name: 'Nephritis', value: '#27ae60' },
        { name: 'Carrot', value: '#e67e22' },
        { name: 'Pumpkin', value: '#d35400' },
        { name: 'Peter River', value: '#3498db' },
        { name: 'Belize Hole', value: '#2980b9' },
        { name: 'Alizarin', value: '#e74c3c' },
        { name: 'Pomegranate', value: '#c0392b' },
        { name: 'Amethyst', value: '#9b59b6' },
        { name: 'Wisteria', value: '#8e44ad' },
        { name: 'Clouds', value: '#ecf0f1' },
        { name: 'Silver', value: '#bdc3c7' },
        { name: 'Wet Asphalt', value: '#34495e' },
        { name: 'Midnight Blue', value: '#2c3e50' },
        { name: 'Concrete', value: '#95a5a6' },
        { name: 'Asbestos', value: '#7f8c8d' },
    ],
};

// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : null;
}
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}
function rgbToHex(r, g, b) {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}
// end

function loadUserColors() {
    const storage = window.localStorage;
    colors.user = JSON.parse(storage.getItem('palette:user-colors')) || [];
}

function saveUserColors() {
    const storage = window.localStorage;
    storage.setItem('palette:user-colors', JSON.stringify(colors.user));
}

function colorElement(color, type) {
    const element = $('<div class="color-text"></div>');
    element.css('background-color', color.value);
    element.on('click', () => {
        App.load('color', {
            color,
            type,
        });
    });
    return element;
}

function homeController(page) {
    loadUserColors();

    $(page).find('#info-button').on('click', () => App.load('info'));
    $(page).on('appShow', () => {
        // Create the add button
        const addElement = $(page).find('.add-color').clone();
        addElement.on('click', () => App.load('add'));

         // Display the colors
        Object.keys(colors).forEach((key) => {
            const colorList = colors[key];
            const listElement = $(page).find(`#${key}-colors`).find('#color-list');
            listElement.empty();
            colorList.map(color => colorElement(color, key)).forEach((element) => {
                listElement.append(element);
            });
            if (key === 'user') {
                listElement.append(addElement);
            }
        });
    });
}

function colorController(page, options) {
    const color = options.color;
    const rgb = hexToRgb(color.value);
    const hexSection = $(page).find('#hex-section');
    const rgbSection = $(page).find('#rgb-section');
    const hexCopy = hexSection.find('.app-button');
    const rgbCopy = rgbSection.find('.app-button');
    const hexText = color.value;
    const rgbText = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const trash = $(page).find('#discard-color');

    $(page).find('.app-content').css('background-color', color.value);
    $(page).find('.app-title').text(color.name || '');

    // Only allow discarding of user selected colors
    if (options.type === 'user') {
        trash.show();
    } else {
        trash.hide();
    }

    // Connect the trash button
    trash.on('click', () => {
        colors.user = colors.user.filter(userColor => userColor.id !== color.id);
        saveUserColors();
        App.back();
    });

    // Display the hex section
    hexSection.find('.color-value').text(hexText);
    hexCopy.on('click', () => {
        cordova.plugins.clipboard.copy(hexText);
        hexCopy.text('copied');
    });

    // Display the rgb section
    rgbSection.find('.color-value').text(rgbText);
    rgbCopy.on('click', () => {
        cordova.plugins.clipboard.copy(rgbText);
        rgbCopy.text('copied');
    });
}

function addController(page) {
    const sections = {
        red: {
            element: $(page).find('#red-section'),
            value: 127,
        },
        green: {
            element: $(page).find('#green-section'),
            value: 127,
        },
        blue: {
            element: $(page).find('#blue-section'),
            value: 127,
        },
    };

    // Connect the sliders
    Object.keys(sections).forEach((key) => {
        const section = sections[key];
        const input = section.element.find('input');
        const label = section.element.find('.slider-value');

        const update = () => {
            section.value = Math.round(input.val() * 2.55);
            label.text(section.value);
            $(page).find('.app-content').css('background-color',
                rgbToHex(sections.red.value, sections.green.value, sections.blue.value));
        };

        update();
        input.on('input', update);
    });

    // Connect the add button
    $(page).find('#add-button').on('click', () => {
        const hexColor = rgbToHex(sections.red.value, sections.green.value, sections.blue.value);
        colors.user = colors.user.concat({
            id: Math.round(Math.random() * 999999),
            value: hexColor,
        });
        saveUserColors();
        App.back();
    });
}

function infoController(page) {
    const productButton = $(page).find('#product-button');
    const restoreButton = $(page).find('#restore-button');
    $(page).find('#donate-button').on('click', () => window.open('https://ko-fi.com/A214L4K'));
    productButton.on('click', () => store.order('palette_remove_ads'));
    restoreButton.on('click', () => store.refresh());

    // Conditionally display the remove ads button
    function renderPurchase() {
        const product = store.get('palette_remove_ads');
        if (product && product.state === store.VALID && !product.owned && product.canPurchase) {
            productButton.removeClass('hidden');
            restoreButton.removeClass('hidden');
        } else {
            productButton.addClass('hidden');
            restoreButton.addClass('hidden');
        }
    }

    $(page).on('appShow', () => {
        renderPurchase();
        store.when('palette_remove_ads').updated(renderPurchase);
    });

    $(page).on('appHide', () => {
        store.off(renderPurchase);
    });
}

(function initialize() {
    // When the device is ready
    document.addEventListener('deviceready', () => {
        // Register app product
        cordova.plugins.DeviceMeta.getDeviceMeta((result) => {
            store.ready(() => {
                renderInterstitial(result.debug);
            });
            store.register({
                id: 'palette_remove_ads',
                alias: 'Remove Ads',
                type: store.NON_CONSUMABLE,
            });
            store.when('palette_remove_ads').approved(product => product.finish());
            store.when('palette_remove_ads').updated(() => renderBanner(result.debug));
            store.refresh();
        });

        // Setup controllers
        App.controller('home', homeController);
        App.controller('color', colorController);
        App.controller('add', addController);
        App.controller('info', infoController);

        // Load app
        try {
            App.restore();
        } catch (err) {
            App.load('home');
        }
    }, false);

    // When the app resumes
    document.addEventListener('resume', () => location.reload(), false);
}());
