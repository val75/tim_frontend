/*
 * twrap.js
 * Root namespace module
 */

/*jslint           browser : true,   continue : true,
 devel  : true,    indent : 2,       maxerr  : 50,
 newcap : true,     nomen : true,   plusplus : true,
 regexp : true,    sloppy : true,       vars : false,
 white  : true
 */
/*global $, twrap */

var twrap = (function () {
    var initModule = function ( $container ) {
        twrap.shell.initModule( $container );

        myLayout = $container.layout({ applyDemoStyles: true });
    };

    return { initModule: initModule };
}());
