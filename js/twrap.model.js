/*
 * twrap.model.js
 * Model module
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global TAFFY, $, twrap */

twrap.model = (function () {
    'use strict';

    var
        configMap = {
            // Reserve a special ID for the "anonymous" person
            anon_id : 'a0'
        },

        stateMap = {
            // Key to store the anonymous person object
            anon_user       : null,
            // Key to store a map of person objects keyed by cid
            people_cid_map  : {},
            cid_serial      : 0,
            // Key to store a TaffyDB collection of person objects.
            // Initialize it as an empty collection.
            people_db       : TAFFY(),
            // Key to store the current user object.
            user            : null,
            // Key to store a TaffyDB collection of procedure objects.
            // Initialize it as an empty collection
            library_db      : TAFFY(),
            // Key to store a map of procedure objects keyed by cid
            library_cid_map : {},
            // Key to store the current selected procedure object
            procedure       : null
        },

        // Flag tells Model to use data, objects abd methods from
        // Fake instead of data from the Data module.
        isFakeData = true,

        personProto, makeCid, clearPeopleDb, completeLogin,
        makePerson, removePerson, people, initModule,
        library, procedureProto, clearLibraryDb,
        makeProcedure, removeProcedure;

    // The library object API
    // ----------------------
    // The library object is available at twrap.model.library.
    // The library object provides methods and events to manage
    // a collection of procedure objects. Its public methods include:
    //   * get_db() - return the TaffyDB database of all the
    //     procedure categories and objects.
    //
    // Each procedure is represented by a procedure object.

    // Prototype for procedure objects
    procedureProto = {
        get_is_proc : function () {
            return this.cid === stateMap.proc.cid;
        }
    };

    // Method: clearLibraryDb
    // Remove all procedure objects
    clearLibraryDb = function () {
        stateMap.library_db = TAFFY();
        stateMap.library_cid_map = {};
    };

    // Method: makeProcedure
    // Creates a procedure object and stores it in a TaffyDB
    // collection. Ensure it also updates the index in the
    // library_cid_map
    makeProcedure = function (procedure_map) {
        var procedure,
            cid  = procedure_map.cid,
            id   = procedure_map.id,
            name = procedure_map.name;

        if ( cid === undefined || ! name ) {
            throw 'client id and name required';
        }

        procedure      = Object.create( procedureProto );
        procedure.cid  = cid;
        procedure.name = name;

        if ( id ) { procedure.id = id; }

        stateMap.library_cid_map[ cid ] = procedure;

        stateMap.library_db.insert( procedure );
        return procedure;
    };

    // Method: removeProcedure
    // Removes a procedure from the library list
    removeProcedure = function ( procedure ) {
        if ( ! procedure ) { return false; }

        stateMap.library_db({ cid : procedure.cid }).remove();
        if ( procedure.cid ) {
            delete stateMap.library_cid_map[ procedure.cid ];
        }
        return true;
    };

    library = (function () {
        var get_by_cid, get_db, get_procedure, show_tree;

        get_by_cid = function ( cid ) {
            return stateMap.library_cid_map[ cid ];
        };

        get_db = function () { return stateMap.library_db; };

        get_procedure = function () { return stateMap.procedure; };

        show_tree = function ( proc_name ) {
            var sio = isFakeData ? twrap.fake.mockSio : twrap.data.getSio();
        };
    }());

    // The people object API
    // -------------------
    // The people object is available at twrap.model.people.
    // The people object provides methods and events to manage
    // a collection of person objects. Its public methods include:
    //   * get_user() - return the current user person object.
    //     If the current user is not signed in, an anonymous user
    //     object is returned.
    //   * get_db() - return the TaffyDB database of all the person
    //     objects - including the current user - presorted.
    //   * get_by_cid( <client_id> ) - return a person object with
    //     provided unique id.
    //   * login( <user_name> ) - login as the user with the provided
    //     user name. The current user object is changed to reflect
    //     the new identity. Successful completion of login
    //     publishes a 'twrap-login' global custom event.
    //   * logout() - revert the current user object to anonymous.
    //     This method publishes a 'twrap-logout' global custom event.
    //
    // jQuery global custom events published by the object include:
    //   * twrap-login - This is published when a user login process
    //     completes. The updated user object is provided as data.
    //   * twrap-logout - This is published when a logout completes.
    //     The former user object is provided as data.
    //
    // Each person is represented by a person object.
    // Person objects provide the following methods:
    //   * get_is_user() - return true if object is the current user
    //   * get_is_anon() - return true if object is anonymous
    //
    // The attributes for a person object include:
    //   * cid - string client id. This is always defined, and
    //     is only different from the id attribute if the client
    //     data is not synced with the backend.
    //   * id - the unique id. This may be undefined if the object is
    //     not synced with the backend.
    //   * name - the string name of the user.
    //

    // Prototype for person objects
    // Use of a prototype usually reduces memory requirements and
    // improves the performance of objects
    personProto = {
        get_is_user : function () {
            return this.cid === stateMap.user.cid;
        },
        get_is_anon : function () {
            return this.cid === stateMap.anon_user.cid;
        }
    };

    // Method: makeCid
    // Client ID generator.
    makeCid = function () {
        return 'c' + String( stateMap.cid_serial++ );
    };

    // Method: clearPeopleDb
    // Remove all person objects except the anonymous person and,
    // if a user is signed in, the current user object.
    clearPeopleDb = function () {
        var user = stateMap.user;
        stateMap.people_db      = TAFFY();
        stateMap.people_cid_map = {};
        if ( user ) {
            stateMap.people_db.insert( user );
            stateMap.people_cid_map[ user.cid ] = user;
        }
    };

    // Method: completeLogin
    // Completes user sign-in when the backend sends confirmation
    // and data for the user.
    // Updates current user info, then publishes the twrap-login
    // event.
    completeLogin = function ( user_list ) {
        var user_map = user_list[ 0 ];
        delete stateMap.people_cid_map[ user_map.cid ];
        stateMap.user.cid = user_map._id;
        stateMap.user.id = user_map._id;
        stateMap.people_cid_map[ user_map._id ] = stateMap.user;

        $.gevent.publish( 'twrap-login', [ stateMap.user ] );
    };

    // Method: makePerson
    // Creates a person object and stores it in a TaffyDB
    // collection.
    // Ensure it also updates the index in the people_cid_map
    makePerson = function (person_map) {
        var person,
            cid  = person_map.cid,
            id   = person_map.id,
            name = person_map.name;

        if ( cid === undefined || ! name ) {
            throw 'client id and name required';
        }

        person      = Object.create(personProto);
        person.cid  = cid;
        person.name = name;

        if ( id ) { person.id = id; }

        stateMap.people_cid_map[ cid ] = person;

        stateMap.people_db.insert( person );

        return person;
    };

    // Method: removePerson
    // Removes person object from the people list
    removePerson = function ( person ) {
        if ( !person ) { return false; }
        // can't remove anonymous person
        if ( person.id === configMap.anon_id ) {
            return false;
        }

        stateMap.people_db({ cid : person.cid }).remove();
        if (person.cid ) {
            delete stateMap.people_cid_map[ person.cid ];
        }
        return true;
    };

    // Define the people closure
    // This allows us to share only the methods we want
    people = (function () {
        var get_by_cid, get_db, get_user, login, logout;

        // Convenience method
        get_by_cid = function () {
            return stateMap.people_cid_map[ cid ];
        };

        // Returns the TaffyDB collection of person objects
        get_db = function () { return stateMap.people_db; };

        // Returns the current user person object
        get_user = function () { return stateMap.user; };

        login = function ( name ) {
            var sio = isFakeData ? twrap.fake.mockSio : twrap.data.getSio();

            stateMap.user = makePerson({
                cid  : makeCid(),
                name : name
            });

            // Register a callback to complete sign-in when
            // the backend publishes a userupdate message
            sio.on( 'userupdate', completeLogin );

            // Send an adduser message to the backend along with
            // all the user details. Adding a user and signing
            // in are the same thing in this context
            sio.emit( 'adduser', {
                cid  : stateMap.user.cid,
                name : stateMap.user.name
            });
        };

        // This publishes a twrap-logout event
        logout = function () {
            var is_removed, user = stateMap.user;

            is_removed = removePerson( user );
            stateMap.user = stateMap.anon_user;

            $.gevent.publish( 'twrap-logout', [ user ]);
            return is_removed;
        };

        return {
            get_by_cid : get_by_cid,
            get_db     : get_db,
            get_user   : get_user,
            login      : login,
            logout     : logout
        };
    }());

    initModule = function () {
        var i, people_list, person_map,
            library_list, procedure_map;

        // Initialize anonymous person
        stateMap.anon_user = makePerson({
            cid  : configMap.anon_id,
            id   : configMap.anon_id,
            name : 'anonymous'
        });

        stateMap.user = stateMap.anon_user;

        if ( isFakeData ) {
            people_list = twrap.fake.getPeopleList();
            for ( i = 0; i < people_list.length; i++ ) {
                person_map = people_list[ i ];
                makePerson({
                    cid  : person_map._id,
                    id   : person_map._id,
                    name : person_map.name
                });
            }
            library_list = twrap.fake.getLibraryList();
            for ( i = 0; i < library_list.length; i++ ) {
                procedure_map = library_list[ i ];
                makeProcedure({
                    cid  : procedure_map._id,
                    id   : procedure_map._id,
                    name : procedure_map.name
                });
            }
        }
    };

    return {
        initModule : initModule,
        people     : people,
        library    : library
    };
}());