/*
 * twrap.model.lib.js
 * Model module for procedure library
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global TAFFY, $, twrap */

twrap.model.lib = (function () {
    'use strict';

    var
        // Place static configuration values in configMap
        configMap = {
            // Reserve a special ID for the root node
            root_id : 'r0'
        },

        // Place dynamic information shared across the module in stateMap
        stateMap = {
            // Key to store the root node object
            root_node : null,
            cid_serial : 0,
            // Key to store a TaffyDB collection of person objects.
            // Initialize it as an empty collection.
            library_db : TAFFY(),
            // Key to store a map of node objects keyed by cid
            library_cid_map : {},
            // Key to store the current selected node object
            node : null
        },

        // Flag tells Model to use data, objects abd methods from
        // Fake instead of data from the Data module.
        isFakeData = true,

        library, nodeProto, makeCid, clearLibraryDb,
        makeNode, removeNode,
        initModule;

     // The library object API
    // ----------------------
    // The library object is available at twrap.model.lib.
    // The library object provides methods and events to manage
    // a collection of node objects. Its public methods include:
    //   * get_db() - return the TaffyDB database of all the
    //     node objects.
    //
    // Each node is represented by a node object.

    nodeProto = {
        get_is_proc : function () {
        },
        get_is_root : function () {
            return this.cid === stateMap.root_node.cid;
        }
    };

    // Method: makeCid
    // Client ID generator
    makeCid = function () {
        return 'c' + String( stateMap.cid_serial++ );
    };

    // Method: clearLibraryDb
    // Remove all node objects
    clearLibraryDb = function () {
        stateMap.library_db = TAFFY();
        stateMap.library_cid_map = {};
    };

    // Method: makeNode
    // Creates a node object and stores it in a TaffyDB
    // collection. Ensures it also updates the index in the
    // library_cid_map
    makeNode = function (node_map) {
        var node,
            cid      = node_map.cid,
            id       = node_map.id,
            name     = node_map.name,
            text     = node_map.name,
            brief    = node_map.brief,
            children = node_map.children,
            parent   = node_map.parent;

        if ( cid === undefined || name ) {
            //throw 'client id and name required';
        }

        node = Object.create( nodeProto );
        node.cid = cid;
        node.name = name;
        node.text = text;

        if ( id ) { node.id = id; }

        if ( brief ) { node.brief = brief; }

        if ( children ) { node.children = children; }

        if ( parent ) { node.parent = parent; }

        stateMap.library_cid_map[ cid ] = node;

        stateMap.library_db.insert( node );
        return node;
    };

    // Method: removeNode
    // Removes a node from the library list
    removeNode = function ( node ) {
        if ( ! node ) { return false; }

        stateMap.library_db({ cid : node.cid }).remove();
        if ( node.cid ) {
            delete stateMap.library_cid_map[ node.cid ];
        }
        return true;
    };

    // Define the library closure
    // This allows us to share only the methods we want
    library = (function () {
        var get_by_cid, get_db, get_node;

        // Convenience method
        get_by_cid = function ( cid ) {
            return stateMap.library_cid_map[ cid ];
        };

        // Returns the TaffyDB collection of node objects
        get_db = function () { return stateMap.library_db; };

        get_node = function () { return stateMap.node; };

        return {
            get_by_cid : get_by_cid,
            get_db     : get_db,
            get_node   : get_node
        };
    }());

    initModule = function () {
        var i, node_list, node_map;

        // Initialize root node
        stateMap.root_node = makeNode({
            cid : configMap.root_id,
            id : configMap.root_id,
            name : 'Root',
            brief : "Library Root Node",
            children : true
        });

        stateMap.node = stateMap.root_node;

        if ( isFakeData ) {
            node_list = twrap.fake.getLibraryList();
            for ( i = 0; i < node_list.length; i++ ) {
                node_map = node_list[ i ];
                makeNode({
                    cid : node_map._id,
                    id : node_map._id,
                    name : node_map.name,
                    brief : node_map.brief,
                    parent : node_map.parent,
                    children : node_map.children
                });
            }
        }
    };

    return {
        initModule : initModule,
        library    : library
    };
}());