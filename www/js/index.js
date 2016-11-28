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
        App.controller('home', homeController);
        try {
            App.restore();
        } catch (err) {
            App.load('home');
        }
    }
};

function noop () { }

function onResume() {
    location.reload();
}

var colors = [
    { name: 'Turquoise', value: '1abc9c' },
    { name: 'Green Sea', value: '16a085' },
    { name: 'Sun Flower', value: 'f1c40f' },
    { name: 'Orange', value: 'f39c12' },
    { name: 'Emerald', value: '2ecc71' },
    { name: 'Nephritis', value: '27ae60' },
    { name: 'Carrot', value: 'e67e22' },
    { name: 'Pumpkin', value: 'd35400' },
    { name: 'Peter River', value: '3498db' },
    { name: 'Belize Hole', value: '2980b9' },
    { name: 'Alizarin', value: 'e74c3c' },
    { name: 'Pomegranate', value: 'c0392b' },
    { name: 'Amethyst', value: '9b59b6' },
    { name: 'Wisteria', value: '8e44ad' },
    { name: 'Clouds', value: 'ecf0f1' },
    { name: 'Silver', value: 'bdc3c7' },
    { name: 'Wet Asphalt', value: '34495e' },
    { name: 'Midnight Blue', value: '2c3e50' },
    { name: 'Concrete', value: '95a5a6' },
    { name: 'Asbestos', value: '7f8c8d' }
];

function homeController(page) {

}

app.initialize();
