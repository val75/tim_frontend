/*
 * twrap.shell.js
 * Shell module for SPA
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global $, twrap */

twrap.shell = (function () {
    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        configMap = {
            main_html : String()
            + '<div class="ui-layout-center">Center</div>'
            + '<div class="ui-layout-north">North</div>'
            + '<div class="ui-layout-south">South</div>'
            + '<div class="ui-layout-east">East</div>'
            + '<div class="ui-layout-west">Library</div>'
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
