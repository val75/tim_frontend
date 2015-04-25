/*
 * twrap.shell.js
 * Shell module for TWrap
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global $, twrap */

twrap.shell = (function () {
    'use strict';
    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        configMap = {
            main_html : String()
             + '<div class="twrap-shell-head">'
               + '<div class="twrap-shell-head-logo">'
                + '<h1>TWRAP</h1>'
                + '<p>test automation end to end</p>'
               + '</div>'
               + '<div class="twrap-shell-head-acct"></div>'
             + '</div>'
             + '<div class="twrap-shell-main">'
               + '<div class="twrap-shell-main-nav"></div>'
               + '<div class="twrap-shell-main-content"></div>'
               + '<div class="twrap-shell-main-info"></div>'
             + '</div>'
             + '<div class="twrap-shell-foot"></div>'
        },
        stateMap  = {
            $container : null
        },
        jqueryMap = {},

        setJqueryMap, initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    //-------------------- END UTILITY METHODS -------------------

    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container : $container
        };
    };
    // End DOM method /setJqueryMap/
    //--------------------- END DOM METHODS ----------------------

    //------------------- BEGIN EVENT HANDLERS -------------------
    //-------------------- END EVENT HANDLERS --------------------

    //------------------- BEGIN PUBLIC METHODS -------------------
    // Begin Public method /initModule/
    initModule = function ( $container ) {
        stateMap.$container = $container;
        $container.html( configMap.main_html );
        setJqueryMap();
    };
    // End PUBLIC method /initModule/

    return { initModule : initModule };
    //------------------- END PUBLIC METHODS ---------------------
}());