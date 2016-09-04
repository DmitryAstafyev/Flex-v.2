/// <reference path="flex.core.js" />
/// <module>
///     <summary>
///         Settings of [flex].
///     </summary>
/// </module>
(function () {
    "use strict";
    var init = function () {
            flex.init({
                resources: {
                    MODULES: [
                        'program.presentation', 'flex.binds', 'flex.ui.patterns', 'flex.types.array'
                    ],
                    EXTERNAL        : [
                        { url: '/program/body.css'  },
                    ],
                    ASYNCHRONOUS: [
                        {
                            resources: [
                                { url: 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js' },
                                { url: '/program/highcharts/highcharts.js',         after: ['http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js'] },
                                { url: '/program/highcharts/highcharts-more.js',    after: ['/program/highcharts/highcharts.js'] },
                                { url: '/program/highcharts/exporting.js',          after: ['/program/highcharts/highcharts.js'] },
                            ],
                            storage : false,
                            finish  : null
                        }
                    ],
                    USE_STORAGED    : false,
                },
                paths   : {
                    CORE    : '/kernel',
                    ATTACH  : '/app'
                },
                events  : {
                    onFlexLoad: function () {
                        //var short = flex.libraries.short.create();
                        //short.getName();
                    },
                    onPageLoad: function () {
                        var presentation = flex.libraries.program.presentation.create();
                        presentation.start();
                    }
                },
                settings: {
                    CHECK_PATHS_IN_CSS : true
                },
                logs: {
                    SHOW: ['CRITICAL', 'LOGICAL', 'WARNING', 'NOTIFICATION', 'LOGS', 'KERNEL_LOGS']
                }
            });
        },
        start = function () {
            if (flex !== void 0) {
                init();
            } else {
                setTimeout(start, 50);
            }
        };
    start();
}());