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

        setJqueryMap,
        onTapAcct, onLogin, onLogout,
        initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    //-------------------- END UTILITY METHODS -------------------

    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container : $container,
            $acct      : $container.find('.twrap-shell-head-acct'),
            $nav       : $container.find('.twrap-shell-main-nav')
        };
    };
    // End DOM method /setJqueryMap/
    //--------------------- END DOM METHODS ----------------------

    //------------------- BEGIN EVENT HANDLERS -------------------
    // Event handler: onTapAcct
    // When the account element is tapped, if the user is anonymous
    // (in other words, not logged in), then we prompt for a user name
    // and then invoke twrap.model.people.login( <user_name> ).
    // If the user is already signed in, we invoke twrap.model.people.logout()
    // method.
    onTapAcct = function ( event ) {
        var acct_text, user_name, user = twrap.model.people.get_user();
        if ( user.get_is_anon() ) {
            user_name = prompt( 'Please sign in' );
            twrap.model.people.login( user_name );
            jqueryMap.$acct.text( '... processing ...' );
        }
        else {
            twrap.model.people.logout();
        }
        return false;
    };

    // Event handler: onLogin
    // This updates the user area (in the top right corner) by replacing
    // the "Please sign in" text with the user name. This is provided
    // by the login_user object that's distributed by the twrap-login
    // event.
    onLogin = function ( event, login_user ) {
        jqueryMap.$acct.text( login_user.name );
    };

    // Event handler: onLogout
    // This reverts the user area text back to "Please sign in".
    onLogout = function ( event, logout_user ) {
        jqueryMap.$acct.text( 'Please sign in' );
    };

    //-------------------- END EVENT HANDLERS --------------------

    //------------------- BEGIN PUBLIC METHODS -------------------
    // Begin Public method /initModule/
    initModule = function ( $container ) {
        stateMap.$container = $container;
        $container.html( configMap.main_html );
        setJqueryMap();

        // configure and initialize feature modules
        twrap.libnav.configModule( {} );
        twrap.libnav.initModule( jqueryMap.$nav );

        $.gevent.subscribe( $container, 'twrap-login', onLogin);
        $.gevent.subscribe( $container, 'twrap-logout', onLogout);

        // Initialize the user area text. Bind a touch or mouse click
        // on the user area to the onTapAcct event handler.
        jqueryMap.$acct
            .text( 'Please sign-in' )
            .bind( 'utap', onTapAcct );
    };
    // End PUBLIC method /initModule/

    return { initModule : initModule };
    //------------------- END PUBLIC METHODS ---------------------
}());