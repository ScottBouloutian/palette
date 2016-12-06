/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

(function () {
    'use strict';

    var app = {
        // Application Constructor
        initialize: function() {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        },

        // deviceready Event Handler
        onDeviceReady: function() {
            this.receivedEvent('deviceready');
            document.addEventListener('resume', onResume, false);
        },

        // Update DOM on a Received Event
        receivedEvent: function(id) {
            if (id === 'deviceready') {
                App.controller('home', homeController);
                App.controller('color', colorController);
                App.controller('add', addController);
                try {
                    App.restore();
                } catch (err) {
                    App.load('home');
                }
            }
        }
    };

    function onResume() {
        location.reload();
    }

    var colors = {
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
            { name: 'Asbestos', value: '#7f8c8d' }
        ]
    };

    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    // end

    function loadUserColors() {
        var storage = window.localStorage;
        colors.user = JSON.parse(storage.getItem('palette:user-colors')) || [];
    }

    function saveUserColors() {
        var storage = window.localStorage;
        storage.setItem('palette:user-colors', JSON.stringify(colors.user));
    }

    function colorElement(color, type) {
        var element = $('<div class="color-text"></div>');
        element.css('background-color', color.value);
        element.on('click', function () {
            App.load('color', {
                color: color,
                type: type
            });
        });
        return element;
    }

    function homeController(page) {
        loadUserColors();

        $(page).on('appShow', function () {
            // Create the add button
            var addElement = $(page).find('.add-color').clone();
            addElement.on('click', function () {
                App.load('add');
            });

            // Display the colors
            Object.keys(colors).forEach(function (key) {
                var colorList = colors[key];
                var listElement = $(page).find('#' + key + '-colors').find('#color-list');
                listElement.empty();
                colorList.map(function (color) {
                    return colorElement(color, key);
                }).forEach(function (element) {
                    listElement.append(element);
                });
                if (key === 'user') {
                    listElement.append(addElement);
                }
            });
        });
    }

    function colorController(page, options) {
        var color = options.color;
        var rgb = hexToRgb(color.value);
        var hexSection = $(page).find('#hex-section');
        var rgbSection = $(page).find('#rgb-section');
        var hexCopy = hexSection.find('.app-button');
        var rgbCopy = rgbSection.find('.app-button');
        var hexText = color.value;
        var rgbText = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
        var trash = $(page).find('#discard-color');

        $(page).find('.app-content').css('background-color', color.value);
        $(page).find('.app-title').text(color.name || '');

        // Only allow discarding of user selected colors
        if (options.type === 'user') {
            trash.show();
        } else {
            trash.hide();
        }

        // Connect the trash button
        trash.on('click', function () {
            colors.user = colors.user.filter(function (userColor) {
                return userColor.id !== color.id;
            });
            saveUserColors();
            App.back();
        });

        // Display the hex section
        hexSection.find('.color-value').text(hexText);
        hexCopy.on('click', function () {
            cordova.plugins.clipboard.copy(hexText);
            hexCopy.text('copied');
        });

        // Display the rgb section
        rgbSection.find('.color-value').text(rgbText);
        rgbCopy.on('click', function () {
            cordova.plugins.clipboard.copy(rgbText);
            rgbCopy.text('copied');
        });
    }

    function addController(page) {
        var sections = {
            red: {
                element: $(page).find('#red-section'),
                value: 127
            },
            green: {
                element: $(page).find('#green-section'),
                value: 127
            },
            blue: {
                element: $(page).find('#blue-section'),
                value: 127
            }
        };

        // Connect the sliders
        Object.keys(sections).forEach(function (key) {
            var section = sections[key];
            var input = section.element.find('input');
            var label = section.element.find('.slider-value');

            var update = function() {
                section.value = Math.round(input.val() * 2.55);
                label.text(section.value);
                $(page).find('.app-content').css('background-color',
                    rgbToHex(sections.red.value, sections.green.value, sections.blue.value));
            };

            update();
            input.on('input', update);
        });

        // Connect the add button
        $(page).find('#add-button').on('click', function () {
            var hexColor = rgbToHex(sections.red.value, sections.green.value, sections.blue.value);
            colors.user = colors.user.concat({
                id: Math.round(Math.random() * 999999),
                value: hexColor
            });
            saveUserColors();
            App.back();
        });
    }

    app.initialize();
}());
