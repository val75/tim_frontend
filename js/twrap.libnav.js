/*
 * twrap.libnav.js
 * Library Navigator module for TWrap
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global $, twrap */

twrap.libnav = (function () {

    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        configMap = {
            main_html : String()
              + '<div style="padding: 1em; color: black">'
                + 'Say hello to libnav'
              + '</div>'
              + '<div style="padding: 1em"; id="jstree">'
                + '<ul>'
                  + '<li>Root node 1'
                    + '<ul>'
                      + '<li>Child node 1</li>'
                      + '<li>Child node 2</li>'
                    + '</ul>'
                  + '</li>'
                + '</ul>'
              + '</div>',
            settable_map : {},
            root_id : 'r0'
        },
        stateMap  = {
            $container : null
        },
        jqueryMap = {},

        setJqueryMap, getRootJson, getDbJson,
        configModule, initModule
    ;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    //-------------------- END UTILITY METHODS -------------------

    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container : $container,
            $tree : $container.find('#jstree')
        };
    };
    // End DOM method /setJqueryMap/

    getRootJson = function () {
        var rootNode = twrap.model.lib.library.get_by_cid(configMap.root_id);
        console.log(rootNode.text);
        console.log(rootNode.children);

        return rootNode;
    };

    getDbJson = function () {
        var libDb = twrap.model.lib.library.get_db(),
            //libDb1 = libDb(configMap.root_id).remove(),
            libList = libDb().stringify();

        console.log(libList);

        return libList;
    };

    //--------------------- END DOM METHODS --------------------

    //------------------- BEGIN EVENT HANDLERS -------------------
    //-------------------- END EVENT HANDLERS --------------------

    //------------------- BEGIN PUBLIC METHODS -------------------
    // Begin public method /configModule/
    // Purpose   : Adjust configuration of allowed keys
    // Arguments :
    // Settings  :
    //    * configMap.settable_map declares allowed keys
    // Returns   : true
    // Throws    : none
    //
    configModule = function ( input_map ) {
        twrap.util.setConfigMap({
            input_map    : input_map,
            settable_map : configMap.settable_map,
            config_map   : configMap
        });
        return true;
    };
    // End public method /configModule

    // Begin public method /initModule/
    // Purpose   : Initializes module
    // Arguments :
    //    * $container the jquery element used by this feature
    // Returns   : true
    // Throws    : none
    //
    initModule = function ( $container ) {
        $container.html( configMap.main_html );
        stateMap.$container = $container;
        setJqueryMap();

        jqueryMap.$tree.jstree({
            'core' : {
                'data' : function (node, cb) {
                    var libDb = twrap.model.lib.library.get_db();
                    console.log("Calling data function for node " + node.id);
                    if(node.id === "#") {
                        cb(JSON.parse(libDb({ id : configMap.root_id}).stringify()));
                    } else {
                        console.log(libDb({ parent : node.id }).stringify());
                        cb(JSON.parse(libDb({ parent : node.id }).stringify()));
                    }
                }
            }
        });
        return true;
    };
    // End public method /initModule/

    // return public methods
    return {
        configModule : configModule,
        initModule   : initModule
    };
    //------------------- END PUBLIC METHODS ---------------------
}());