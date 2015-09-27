/*
 * twrap.fake.js
 * Fake module
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global $, twrap */

twrap.fake = (function () {
    'use strict';

    var getPeopleList, fakeIdSerial, makeFakeId, mockSio,
        getLibraryList;

    // Add a mock server ID serial number counter
    fakeIdSerial = 3;

    // Method to make a mock serial ID string
    makeFakeId = function () {
        return 'id_' + String( fakeIdSerial++ );
    };

    getPeopleList = function () {
        return [
            { name : 'Valentin', _id : 'id_01' },
            { name : 'Vivek', _id : 'id_02' }
        ];
    };

    getLibraryList = function () {
        return [
            { name : 'Connect Procedures', _id : 'id_01', brief : 'Connect lib', children : true, parent : 'r0' },
            { name : 'ConnectSsh', _id : 'id_02' , brief : 'Connect to host through ssh', parent : 'id_01' },
            { name : 'ConnectTelnet', _id : 'id_03', brief : 'Connect to host through telnet', parent : 'id_01' },
            { name : 'Other stuff', _id : 'id_04', brief : 'Just other', children : true, parent : 'r0' }
        ];
    };

    // Define mockSio object closure
    // It has two public methods: on and emit
    mockSio = (function () {
        var on_sio, emit_sio, callback_map = {};

        // Registers a callback for a message type
        on_sio = function ( msg_type, callback ) {
            callback_map[ msg_type ] = callback;
        };

        // Respond to 'adduser' event with 'userupdate' callback
        // after a 3s delay
        emit_sio = function ( msg_type, data ) {
            if ( msg_type === 'adduser' && callback_map.userupdate ) {
                setTimeout(function () {
                    callback_map.userupdate(
                        [{ _id  : makeFakeId(),
                           name : data.name
                        }]
                    );
                }, 3000 );
            }
        };

        return { emit : emit_sio, on : on_sio };
    }());

    return {
        getPeopleList  : getPeopleList,
        getLibraryList : getLibraryList,
        mockSio        : mockSio
    };
}());
