/// <reference path="flex.core.js" />
/*global flex*/
/// <module>
///     <summary>
///         Registry of all flex modules.
///     </summary>
/// </module>
(function() {
    "use strict";
    /*TODO: remove settings*/
    if (flex !== void 0) {
        //Declaration of modules
        /// <var>Collection of flex libraries</var>
        flex.libraries = {
            /// <field type = 'function'>Basic events controller</field>
            binds   : {  source: 'KERNEL::flex.binds.js',     },
            /// <field type = 'function'>Basic events controller</field>
            events  : {  source: 'KERNEL::flex.events.js',     },
            /// <field type = 'function'>Collection of tools for management of DOM</field>
            html    : {  source: 'KERNEL::flex.html.js',      hash: 'HASHPROPERTY' },
            css     : {
                /// <field type = 'function'>Controller CSS animation</field>
                animation   : {  source: 'KERNEL::flex.css.animation.js', hash: 'HASHPROPERTY' },
                /// <field type = 'function'>Controller CSS events</field>
                events      : {  source: 'KERNEL::flex.css.events.js', hash: 'HASHPROPERTY'},
            },
            /// <field type = 'function'>Collection of UI elements</field>
            ui      : {
                /// <field type = 'function'>Controller of window</field>
                window      : {
                    /// <field type = 'function'>Controller of window movement</field>
                    move    : {  source: 'KERNEL::flex.ui.window.move.js',        hash: 'HASHPROPERTY' },
                    /// <field type = 'function'>Controller of window resize</field>
                    resize  : {  source: 'KERNEL::flex.ui.window.resize.js',      hash: 'HASHPROPERTY' },
                    /// <field type = 'function'>Controller of window resize</field>
                    focus   : {  source: 'KERNEL::flex.ui.window.focus.js',       hash: 'HASHPROPERTY' },
                    /// <field type = 'function'>Controller of window maximize / restore</field>
                    maximize: {  source: 'KERNEL::flex.ui.window.maximize.js',    hash: 'HASHPROPERTY' },
                },
                /// <field type = 'function'>Controller of templates</field>
                templates   : {  source: 'KERNEL::flex.ui.templates.js' },
                /// <field type = 'function'>Controller of patterns</field>
                patterns    : {  source: 'KERNEL::flex.ui.patterns.js' },
                /// <field type = 'function'>Controller of scrollbox</field>
                scrollbox   : {  source : 'KERNEL::flex.ui.scrollbox.js', hash : 'HASHPROPERTY' },
                /// <field type = 'function'>Controller of itemsbox</field>
                itemsbox    : {  source: 'KERNEL::flex.ui.itemsbox.js' },
                /// <field type = 'function'>Controller of areaswitcher</field>
                areaswitcher: {  source: 'KERNEL::flex.ui.areaswitcher.js',   hash: 'HASHPROPERTY' },
                /// <field type = 'function'>Controller of areascroller</field>
                areascroller: {  source: 'KERNEL::flex.ui.areascroller.js' },
                /// <field type = 'function'>Controller of arearesizer</field>
                arearesizer : {  source: 'KERNEL::flex.ui.arearesizer.js',    hash: 'HASHPROPERTY' },
            },
            types : {
                /// <field type = 'function'>Extended array class</field>
                array: { source: 'KERNEL::flex.types.array.js' }
            },
            presentation: {  source: 'program/presentation.js', hash: 'HASHPROPERTY' },
        };
    }
}());