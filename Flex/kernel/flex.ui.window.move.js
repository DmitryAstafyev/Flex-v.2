// LICENSE
// This file (core / module) is released under the BSD License. See [LICENSE] file for details.
/*global flex*/
/// <reference path='intellisense/flex.callers.node.intellisense.js' />
/// <reference path='intellisense/flex.callers.nodes.intellisense.js' />
/// <reference path='intellisense/flex.callers.object.intellisense.js' />
/// <reference path="intellisense/flex.intellisense.js" />
/// <module>
///     <summary>
///         Module control movement of some node on screen. Works only with position: absolute.
///     </summary>
/// </module>
(function () {
    "use strict";
    if (flex !== void 0) {
        var protofunction = function () { };
        protofunction.prototype = function () {
            /* Description
            * data-flex-ui-window-move-container="id"
            * data-flex-ui-window-move-hook="id"
            * */
            var //Get modules
                html            = flex.libraries.html.create(),
                events          = flex.libraries.events.create(),
                //Variables
                privates        = null,
                render          = null,
                coreEvents      = null,
                settings        = null;
            settings = {
                CONTAINER           : 'data-flex-ui-window-move-container',
                HOOK                : 'data-flex-ui-window-move-hook',
                INITED              : 'data-flex-window-move-inited',
                GLOBAL_GROUP        : 'flex-window-move',
                GLOBAL_EVENT_FLAG   : 'flex-window-move-global-event',
                GLOBAL_CURRENT      : 'flex-window-move-global-current',
                GLOBAL_EVENT_ID     : 'flex-window-move-global-event-id',
                STATE_STORAGE       : 'flex-window-move-instance-state',
            };
            function init(id) {
                var selector    = new html.select.bySelector(),
                    id          = id || null,
                    containers  = selector.all('*[' + settings.CONTAINER + (id !== null ? '="' + id + '"' : '') + ']:not([' + settings.INITED + '])');
                if (containers !== null) {
                    Array.prototype.forEach.call(
                        containers,
                        function (container) {
                            var id      = container.getAttribute(settings.CONTAINER),
                                hooks   = null;
                            if (id !== '' && id !== null) {
                                hooks = selector.all('*[' + settings.HOOK + '="' + id + '"]');
                                if (hooks !== null) {
                                    render.attach(container, hooks, id);
                                    coreEvents.attach(container, id);
                                }
                            }
                            container.setAttribute(settings.INITED, true);
                        }
                    );
                }
            };
            render      = {
                attach  : function (container, hooks, id) {
                    var DOMEvents = events.DOMEvents();
                    Array.prototype.forEach.call(
                        hooks,
                        function (hook) {
                            DOMEvents.add(
                                hook,
                                'mousedown',
                                function (event) {
                                    render.start(event, container, hook, id);
                                },
                                id
                            );
                        }
                    );
                },
                start   : function (event, container, hook, id) {
                    function getPosition(node) {
                        if (node.currentStyle) {
                            if (node.currentStyle.position) {
                                return node.currentStyle.position;
                            }
                        }
                        if (window.getComputedStyle) {
                            return window.getComputedStyle(node).position;
                        }
                        return null;
                    }
                    var possition   = null,
                        scroll      = null,
                        pos         = null,
                        scrl        = null,
                        isFixed     = null;
                    if (flex.overhead.objecty.get(container, settings.STATE_STORAGE, false, false) === false) {
                        possition   = html.position();
                        scroll      = html.scroll();
                        pos         = possition.byPage(container);
                        scrl        = scroll.get(container.parentNode);
                        isFixed     = getPosition(container) !== 'fixed' ? false : true;
                        flex.overhead.globaly.set(
                            settings.GLOBAL_GROUP,
                            settings.GLOBAL_CURRENT,
                            {
                                clientX     : event.flex.clientX,
                                clientY     : event.flex.clientY,
                                offsetX     : event.flex.offsetX,
                                offsetY     : event.flex.offsetY,
                                pageX       : event.flex.pageX,
                                pageY       : event.flex.pageY,
                                hook        : hook,
                                container   : container,
                                id          : id,
                                oldX        : event.flex.pageX,
                                oldY        : event.flex.pageY,
                                posX        : pos.left + (isFixed === false ? scrl.left() : 0),
                                posY        : pos.top + (isFixed === false ? scrl.top() : 0),
                            }
                        );
                        return event.flex.stop();
                    } else {
                        return true;
                    }
                },
                move    : function(event){
                    var instance    = flex.overhead.globaly.get(settings.GLOBAL_GROUP, settings.GLOBAL_CURRENT),
                        container   = null;
                    if (instance !== null) {
                        container               = instance.container;
                        instance.posX           = (instance.posX - (instance.oldX - event.flex.pageX));
                        instance.posY           = (instance.posY - (instance.oldY - event.flex.pageY));
                        container.style.left    = instance.posX + 'px';
                        container.style.top     = instance.posY + 'px';
                        instance.oldX           = event.flex.pageX;
                        instance.oldY           = event.flex.pageY;
                    }
                    return event.flex.stop();
                },
                stop    : function(event) {
                    flex.overhead.globaly.del(settings.GLOBAL_GROUP, settings.GLOBAL_CURRENT);
                },
                global: {
                    attach: function () {
                        var isAttached  = flex.overhead.globaly.get(settings.GLOBAL_GROUP, settings.GLOBAL_EVENT_FLAG),
                            DOMEvents   = events.DOMEvents();
                        if (isAttached !== true) {
                            flex.overhead.globaly.set(settings.GLOBAL_GROUP, settings.GLOBAL_EVENT_FLAG, true);
                            DOMEvents.add(
                                window,
                                'mousemove',
                                function (event) {
                                    render.move(event);
                                },
                                settings.GLOBAL_EVENT_ID
                            );
                            DOMEvents.add(
                                window,
                                'mouseup',
                                function (event) {
                                    render.stop(event);
                                },
                                settings.GLOBAL_EVENT_ID
                            );
                        }
                    }
                }
            };
            coreEvents = {
                attach: function (container, id) {
                    flex.events.core.listen(
                        flex.registry.events.ui.window.maximize.GROUP,
                        flex.registry.events.ui.window.maximize.MAXIMIZED,
                        function (params) {
                            return coreEvents.onRefreshByParent(params.container, container, flex.registry.events.ui.window.maximize.MAXIMIZED);
                        },
                        settings.STATE_STORAGE + id,
                        false
                    );
                    flex.events.core.listen(
                        flex.registry.events.ui.window.maximize.GROUP,
                        flex.registry.events.ui.window.maximize.RESTORED,
                        function (params) {
                            return coreEvents.onRefreshByParent(params.container, container, flex.registry.events.ui.window.maximize.RESTORED);
                        },
                        settings.STATE_STORAGE + id,
                        false
                    );
                },
                onRefreshByParent: function (parent, container, state) {
                    if (parent === container) {
                        switch (state) {
                            case flex.registry.events.ui.window.maximize.MAXIMIZED:
                                flex.overhead.objecty.set(container, settings.STATE_STORAGE, true, true);
                                break;
                            case flex.registry.events.ui.window.maximize.RESTORED:
                                flex.overhead.objecty.set(container, settings.STATE_STORAGE, false, true);
                                break;
                        }
                    }
                    return false;
                }
            };
            privates    = {
                init : init
            };
            render.global.attach();
            return {
                init : privates.init
            };
        };
        flex.modules.attach({
            name            : 'ui.window.move',
            protofunction   : protofunction,
            reference       : function () {
                flex.libraries.events   ();
                flex.libraries.html     ();
            }
        });
    }
}());