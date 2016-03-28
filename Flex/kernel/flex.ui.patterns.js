// LICENSE
// This file (core / module) is released under the BSD License. See [LICENSE] file for details.
/// <reference path='intellisense/flex.callers.node.intellisense.js' />
/// <reference path='intellisense/flex.callers.nodes.intellisense.js' />
/// <reference path='intellisense/flex.callers.object.intellisense.js' />
/// <reference path="intellisense/flex.intellisense.js" />
/// <module>
///     <summary>
///         Basic events controller.
///     </summary>
/// </module>
(function () {
    "use strict";
    /*TODO:
    - save ready template as object (with marks only) - is it possible?
    - add modele, DOM, resources into controller
    */
    if (flex !== void 0) {
        var protofunction = function () { };
        protofunction.prototype = function () {
            var //Get modules
                html        = flex.libraries.html.create(),
                //Variables
                privates    = null,
                settings    = null,
                transport   = null,
                bindsEvents = null,
                resources   = null,
                storage     = null,
                template    = null,
                callers     = null,
                controllers = null,
                logs        = null;
            settings    = {
                regs            : {
                    BODY            : /<body>(\n|\r|\s|.)*?<\/body>/gi,
                    BODY_TAG        : /<\s*body\s*>|<\s*\/\s*body\s*>/gi,
                    BODY_CLEAR      : /^[\n\r\s]*|[\n\r\s]*$/gi,
                    CSS             : /<link\s+.*?\/>|<link\s+.*?\>/gi,
                    CSS_HREF        : /href\s*\=\s*"(.*?)"|href\s*\=\s*'(.*?)'/gi,
                    CSS_REL         : /rel\s*=\s*"stylesheet"|rel\s*=\s*'stylesheet'/gi,
                    CSS_TYPE        : /type\s*=\s*"text\/css"|type\s*=\s*'text\/css'/gi,
                    JS              : /<script\s+.*?>/gi,
                    JS_SRC          : /src\s*\=\s*"(.*?)"|src\s*\=\s*'(.*?)'/gi,
                    JS_TYPE         : /type\s*=\s*"text\/javascript"|type\s*=\s*'text\/javascript'/gi,
                    STRING          : /"(.*?)"|'(.*?)'/gi,
                    STRING_BORDERS  : /"|'/gi,
                    HOOK            : /\{\{\w*?\}\}/gi,
                    MODEL           : /\{\{\:\:\w*?\}\}/gi,
                    MODEL_BORDERS   : /\{\{\:\:|\}\}/gi,
                    MODEL_OPEN      : '\\{\\{\\:\\:',
                    MODEL_CLOSE     : '\\}\\}',
                    HOOK_OPEN       : '\\{\\{',
                    HOOK_CLOSE      : '\\}\\}',
                    HOOK_BORDERS    : /\{\{|\}\}/gi,
                    GROUP_PROPERTY  : /__\w*?__/gi
                },
                storage         : {
                    USE_LOCALSTORAGE        : true,
                    VIRTUAL_STORAGE_GROUP   : 'FLEX_UI_PATTERNS_GROUP',
                    VIRTUAL_STORAGE_ID      : 'FLEX_UI_PATTERNS_STORAGE',
                    CSS_ATTACHED_JOURNAL    : 'FLEX_UI_PATTERNS_CSS_JOURNAL',
                    JS_ATTACHED_JOURNAL     : 'JS_ATTACHED_JOURNAL',
                    PRELOAD_TRACKER         : 'FLEX_UI_PATTERNS_PRELOAD_TRACKER',
                    NODE_BINDING_DATA       : 'FLEX_PATTERNS_BINDINGS_DATA'
                },
                tags            : {
                    FLEX_PATTERN        : 'flex-pattern',
                    FLEX_PATTERN_MARK   : 'flex-pattern-mark',
                    HOOK_WRAPPER        : 'wrapper'
                },
                consts          : {
                    statuses    : {
                        SUCCESS : '1',
                        FAIL    : '0',
                    }
                },
                attrs           : {
                    MODEL_DATA  : 'flex-model-data'
                },
                errors          : {
                    DUBLICATE_ID                : 'ID of pattern is registred. Cannot use same ID twise.',
                    DUBLICATE_CONTROLLER_URL    : 'Attempt save controller with same URL.',
                    FAIL_PRELOAD_PATTERN        : 'Fail to preload pattern: '
                },
                logs            : {
                    show        : true
                }
            };
            transport   = {
                preload     : {
                    /// <summary>
                    /// Tracker is submodule for preload several templates by one time
                    /// </summary>
                    tracker: {
                        create      : function (template_urls) {
                            var id      = flex.unique(),
                                storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PRELOAD_TRACKER, {});
                            storage[id] = {};
                            Array.prototype.forEach.call(
                                template_urls,
                                function (template_url) {
                                    if (!storage[id][template_url]) {
                                        storage[id][template_url] = {
                                            url     : template_url,
                                            status  : false
                                        };
                                    }
                                }
                            );
                            return id;
                        },
                        start       : function (template_urls, tracker_id, callbacks) {
                            Array.prototype.forEach.call(
                                template_urls,
                                function (template_url) {
                                    transport.send({
                                        preload     : true,
                                        url         : template_url,
                                        callbacks   : {
                                            success : function (url, template) {
                                                transport.preload.tracker.success(url, template, template_url, tracker_id, callbacks);
                                            },
                                            fail    : function (url, template) {
                                                transport.preload.tracker.fail(url, template, template_url, tracker_id, callbacks);
                                            },
                                        }
                                    });
                                }
                            );

                        },
                        success     : function (url, template, track_url, tracker_id, callbacks) {
                            var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PRELOAD_TRACKER, {});
                            if (storage[tracker_id]) {
                                storage[tracker_id][track_url].status = settings.consts.statuses.SUCCESS;
                                transport.preload.tracker.tryFinish(tracker_id, callbacks);
                            }
                        },
                        fail        : function (url, template, track_url, tracker_id, callbacks) {
                            var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PRELOAD_TRACKER, {});
                            if (storage[tracker_id]) {
                                storage[tracker_id][track_url].status = settings.consts.statuses.FAIL;
                                transport.preload.tracker.tryFinish(tracker_id, callbacks);
                            }
                        },
                        tryFinish   : function (tracker_id, callbacks) {
                            function callback(callback, success, fail) {
                                if (typeof callback === 'function') {
                                    flex.system.handle(
                                        callback,
                                        [
                                            success,
                                            fail
                                        ],
                                        'flex.ui.templates:: templates preload',
                                        this
                                    );
                                }
                            };
                            var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PRELOAD_TRACKER, {}),
                                success = [],
                                fail    = [];
                            if (storage[tracker_id]) {
                                for (var key in storage[tracker_id]) {
                                    switch (storage[tracker_id][key].status) {
                                        case settings.consts.statuses.SUCCESS:
                                            success.push(storage[tracker_id].url);
                                            break;
                                        case settings.consts.statuses.FAIL:
                                            fail.push(storage[tracker_id].url);
                                            break;
                                        case false:
                                            return false;
                                            break;
                                    }
                                }
                                //Clear storage
                                storage[tracker_id] = null;
                                delete storage[tracker_id];
                                //Call main callback
                                if (fail.length === 0 && callbacks) {
                                    callback(callbacks.success, success, fail);
                                } else {
                                    callback(callbacks.fail, success, fail);
                                }
                            }
                        }
                    },
                    preload: function (template_urls, callbacks) {
                        /// <summary>
                        /// Preload template and save it in virtual storage and local storage (if it's allowed)
                        /// </summary>
                        /// <param name="template_urls" type="string || array"  >URL or URLs of template(s), which should be loaded</param>
                        /// <param name="callbacks"     type="object"           >Collection of callbacks: before, success, fail</param>
                        /// <returns                    type="boolean"          >true - success; false - fail</returns>
                        var tracker_id  = null,
                            callbacks   = typeof callbacks === 'object' ? callbacks : {};
                        flex.oop.objects.validate(callbacks, [  { name: 'success',  type: 'function', value: null },
                                                                { name: 'fail',     type: 'function', value: null }]);
                        if (typeof template_urls === 'string') {
                            template_urls = [template_urls];
                        }
                        if (template_urls instanceof Array) {
                            tracker_id = transport.preload.tracker.create(template_urls);
                            transport.preload.tracker.start(template_urls, tracker_id, callbacks);
                            return true;
                        }
                        return false;
                    },
                },
                send        : function (parameters) {
                    /// <summary>
                    /// Load template; save it in virtual storage and local storage (if it's allowed)
                    /// </summary>
                    /// <param name="parameters" type="Object">Template parameters: &#13;&#10;
                    /// {   [string]            url                     (source of template),                                               &#13;&#10;
                    ///     [string || node]    node                    (target node for mount),                                            &#13;&#10;
                    ///     [boolean]           replace                 (true - replace node by template; false - append template to node), &#13;&#10;
                    ///     [object]            hooks                   (bind data),                                                        &#13;&#10;
                    ///     [object]            callbacks               (callbacks),                                                        &#13;&#10;
                    ///     [boolean]           remove_missing_hooks    (remove missed bind data),                                          &#13;&#10;
                    /// }</param>
                    /// <returns type="boolean">true - success; false - fail</returns>
                    var ajax        = null,
                        storaged    = null;
                    parameters.node = transport.node(parameters.node);
                    storaged        = storage.virtual.get(parameters.url);
                    if (storaged === null) {
                        storaged = storage.local.get(parameters.url);
                    }
                    if (storaged === null) {
                        ajax = flex.ajax.send(
                            null,
                            parameters.url,
                            'get',
                            null,
                            {
                                success : function (response, request) {
                                    transport.success(response, request, parameters);
                                },
                                fail    : function (response, request) {
                                    transport.fail(request, parameters);
                                },
                            },
                            null
                        );
                        ajax.send();
                        return true;
                    } else {
                        return transport.success(storaged, null, parameters);
                    }
                    return null;
                },
                success     : function (response, request, parameters) {
                    if (request === null) {
                        //Data have gotten from storage
                        parameters.gotten_from_server = false;
                        return template.apply(response, parameters);
                    } else {
                        //Data have gotten from server
                        parameters.gotten_from_server = true;
                        template.apply(response.original, parameters);
                    }
                },
                fail        : function (request, parameters) {
                    transport.callback(parameters.callbacks.fail);
                },
                callback    : function (callback, template_url, template) {
                    /// <summary>
                    /// Calls callback with same parameters for all events
                    /// </summary>
                    /// <param name="callback"      type="function || null" >function of callback or null (in this case will nothing)</param>
                    /// <param name="template_url"  type="string"           >URL of template, which is owner of callback</param>
                    /// <param name="template"      type="node || null"     >collection of nodes (build template)</param>
                    /// <returns                    type="void"             >void</returns>
                    if (callback !== null) {
                        flex.system.handle(
                            callback,
                            [
                                template_url,
                                template || null
                            ],
                            'flex.ui.templates:: template [' + template_url + ']',
                            this
                        );
                    }
                },
                node        : function (node) {
                    var selector = null;
                    if (node) {
                        if (node.parentNode !== void 0) {
                            node = [node];
                        }
                        if (typeof node === 'string') {
                            selector    = new html.select.bySelector();
                            node        = selector.all(node);
                        }
                        if (node !== null) {
                            if (node.length > 0) {
                                return node;
                            }
                        }
                    }
                    return null;
                }
            };
            bindsEvents      = {
                data    : {
                    value: [
                        //Group #1
                        {
                            nodes   : ['input', 'textarea'],
                            event   : 'change',
                            getter  : function () { return this.value; },
                            setter  : function (value) { this.value = value; }
                        }
                    ],
                },
                assing  : function (node, prop_name, handle) {
                    var node_name   = node.nodeName.toLowerCase(),
                        group       = null;
                    if (bindsEvents.data[prop_name] !== void 0) {
                        bindsEvents.data[prop_name].forEach(function (_group) {
                            if (_group.nodes.indexOf(node_name) !== -1) {
                                group = _group;
                            }
                        });
                        if (group !== null) {
                            (function (event, node, getter, setter, handle) {
                                _node(node).events().add(event, function (event) {
                                    handle.call(node, event, getter, setter);
                                });
                            }(group.event, node, group.getter.bind(node), group.setter.bind(node), handle));
                        }
                    }
                    return false;
                },
                isPossible: function (node, prop_name) {
                    var node_name = node.nodeName.toLowerCase();
                    if (bindsEvents.data[prop_name] !== void 0) {
                        try{
                            bindsEvents.data[prop_name].forEach(function (_group) {
                                if (_group.nodes.indexOf(node_name) !== -1) {
                                    throw 'found';
                                }
                            });
                        } catch (e) {
                            return e === 'found' ? true : false;
                        }
                    }
                    return false;
                }
            };
            template    = {
                init        : function (parameters){
                    /// <summary>
                    /// Load template; save it in virtual storage and local storage (if it's allowed)
                    /// </summary>
                    /// <param name="parameters" type="Object">Template parameters: &#13;&#10;
                    /// {   [string]            url                     (source of template),                                               &#13;&#10;
                    ///     [string || node]    node                    (target node for mount),                                            &#13;&#10;
                    ///     [boolean]           replace                 (true - replace node by template; false - append template to node), &#13;&#10;
                    ///     [object]            hooks                   (bind data),                                                        &#13;&#10;
                    ///     [object]            callbacks               (callbacks),                                                        &#13;&#10;
                    ///     [boolean]           remove_missing_hooks    (remove missed bind data),                                          &#13;&#10;
                    /// }</param>
                    /// <returns type="boolean">true - success; false - fail</returns>
                    var pattern = null;
                    if (flex.oop.objects.validate(parameters, [ { name: 'url',                  type: 'string'                                  },
                                                                { name: 'node',                 type: ['node', 'string'],   value: null         },
                                                                { name: 'pattern_id',           type: 'string',             value: flex.unique()},
                                                                { name: 'replace',              type: 'boolean',            value: false        },
                                                                { name: 'hooks',                type: ['object', 'array'],  value: null         },
                                                                { name: 'callbacks',            type: 'object',             value: {}           },
                                                                { name: 'remove_missing_hooks', type: 'boolean',            value: true         }]) !== false) {
                        flex.oop.objects.validate(parameters.callbacks, [   { name: 'before',   type: 'function', value: null },
                                                                            { name: 'success',  type: 'function', value: null },
                                                                            { name: 'fail',     type: 'function', value: null }]);
                        parameters.url  = flex.system.url.restore(parameters.url);
                        pattern         = _object({
                            constr      : function () {
                                this.url = parameters.url;
                            },
                            privates    : {
                                parameters: parameters
                            },
                            prototype   : function (privates) {
                                var self        = this,
                                    privates    = privates,
                                    render      = null,
                                    preload     = null,
                                    getHooks    = null,
                                    setHooks    = null;
                                render      = function (parent_pattern_id) {
                                    if (typeof parent_pattern_id === 'string') {
                                        privates.parameters.parent_pattern_id = parent_pattern_id;
                                    }
                                    return transport.send(privates.parameters);
                                };
                                preload     = function (callback) {
                                    transport.preload.preload(privates.parameters.url, {
                                        success : callback,
                                        fail    : function () {
                                            throw Error(settings.errors.FAIL_PRELOAD_PATTERN + ' ' + privates.parameters.url);
                                        }
                                    });
                                };
                                getHooks    = function (){
                                    if (privates.parameters.hooks !== void 0){
                                        return privates.parameters.hooks;
                                    } else {
                                        return null;
                                    }
                                };
                                setHooks    = function(hooks){
                                    privates.parameters.hooks = hooks;
                                };
                                return {
                                    render      : render,
                                    preload     : preload,
                                    getHooks    : getHooks,
                                    setHooks    : setHooks
                                };
                            }
                        }).createInstanceClass();
                    }
                    return pattern;
                },
                isTemplate  : function (something){
                    if (typeof something.render === 'function' && typeof something.url === 'string') {
                        return true;
                    } else {
                        return false;
                    }
                },
                apply       : function (something, parameters) {
                    function processing() {
                        //Get template instance
                        data.instance = template.set.convert(data.html, parameters);
                        if (parameters.preload === void 0 || parameters.preload !== true) {
                            //Execute callback
                            data.instance.handle(parameters.callbacks.before);
                            //Processing hooks
                            template.set.hooks(parameters.hooks, parameters.pattern_id);
                            //Get nodes
                            data.template = data.instance.build(parameters.hooks, parameters.parent_pattern_id === void 0 ? true : false);
                        } else {
                            //Execute callback
                            transport.callback(parameters.callbacks.before);
                        }
                        //Load css
                        resources.css.load(data.css, function () {
                            //Load JS
                            resources.js.load(data.js, function () {
                                if (parameters.preload === void 0 || parameters.preload !== true) {
                                    if (parameters.parent_pattern_id === void 0) {
                                        //Mount node(s)
                                        template.mount(data.template, parameters.node, parameters.replace);
                                    }
                                    //Execute callback
                                    data.instance.handle(parameters.callbacks.success);
                                    //Reset time in logs
                                    logs.performance(parameters.pattern_id, parameters.url);
                                } else {
                                    //Execute callback
                                    transport.callback(parameters.callbacks.success);
                                }
                            }, parameters);
                        });
                        return {
                            template    : data.template,
                            instance    : data.instance
                        };
                    };
                    function save(data, parameters) {
                        var _data = {
                                original: data.original,
                                html    : data.html,
                                css     : data.css,
                                js      : data.js
                            };
                        storage.virtual.add(parameters.url, _data);
                        if (parameters.gotten_from_server) {
                            //Save data into local
                            storage.local.add(parameters.url, _data);
                        }
                    };
                    var data = {
                            original: typeof something === 'object' ? something.original    : something,
                            html    : typeof something === 'object' ? something.html        : template.get.html (something),
                            css     : typeof something === 'object' ? something.css         : template.get.css  (something, parameters.url),
                            js      : typeof something === 'object' ? something.js          : template.get.js   (something, parameters.url),
                            instance: null,
                            template: null
                        };
                    if (data.html !== null) {
                        if (parameters.preload === void 0 || parameters.preload !== true) {
                            //Fix time in logs
                            logs.performance(parameters.pattern_id, parameters.url);
                        }
                        //Save data into virtual
                        save(data, parameters);
                        if (parameters.parent_pattern_id === void 0) {
                            //Parent pattern
                            template.complete(parameters.hooks, processing);
                        } else {
                            //Child pattern
                            return processing();
                        }
                    }
                    return false;
                },
                mount       : function (templates, nodes, replace) {
                    if (nodes !== null) {
                        Array.prototype.forEach.call(
                            nodes,
                            function (parent) {
                                if (templates instanceof Array) {
                                    templates.forEach(function (template) {
                                        if (!replace) {
                                            parent.appendChild(template);
                                        } else {
                                            parent.parentNode.insertBefore(template, parent);
                                        }
                                    });
                                    if (replace) {
                                        parent.parentNode.removeChild(parent);
                                    }
                                }
                            }
                        );
                    }
                },
                complete    : function (hooks, callback) {
                    function createRegister(register_id, hooks, callback) {
                        function processHooksWrapper(hooks, storage) {
                            if (hooks instanceof Array) {
                                Array.prototype.forEach.call(
                                    hooks,
                                    function (hook) {
                                        processHooks(hook, urls);
                                    }
                                );
                            } else {
                                processHooks(hooks, urls);
                            }
                        };
                        function processHooks(hooks, storage) {
                            if (typeof hooks === 'object') {
                                _object(hooks).forEach(function (key, hook_value) {
                                    var child_hooks = null;
                                    if (template.isTemplate(hook_value)) {
                                        child_hooks = hook_value.getHooks();
                                        if (storage.indexOf(hook_value.url) === -1) {
                                            storage.push(hook_value.url);
                                        }
                                        if (child_hooks !== null) {
                                            processHooksWrapper(child_hooks, urls);
                                        }
                                    }
                                });
                            }
                        };
                        var urls = [];
                        processHooksWrapper(hooks, urls);
                        if (urls.length > 0) {
                            flex.overhead.register.open(register_id, urls, callback);
                            return true;
                        } else {
                            return false;
                        }
                    };
                    function processingHooks(register_id, hooks) {
                        function processHooksWrapper(hooks) {
                            if (hooks instanceof Array) {
                                Array.prototype.forEach.call(
                                    hooks,
                                    function (hook) {
                                        processHooks(hook);
                                    }
                                );
                            } else {
                                processHooks(hooks);
                            }
                        };
                        function processHooks(hooks) {
                            if (typeof hooks === 'object') {
                                _object(hooks).forEach(function (key, hook_value) {
                                    (function (register_id, hook_value) {
                                        var child_hooks = null;
                                        if (template.isTemplate(hook_value)) {
                                            hook_value.preload(function () {
                                                flex.overhead.register.done(register_id, hook_value.url);
                                            });
                                            child_hooks = hook_value.getHooks();
                                            if (child_hooks !== null) {
                                                processHooksWrapper(child_hooks);
                                            }
                                        }
                                    }(register_id, hook_value));
                                });
                            }
                        };
                        processHooksWrapper(hooks);
                    };
                    var register_id = flex.unique();
                    if (createRegister(register_id, hooks, callback)) {
                        processingHooks(register_id, hooks);
                    } else {
                        callback();
                    }
                },
                get         : {
                    URLs    : function (hrefs, template_url) {
                        var baseURL = flex.system.url.restore(template_url);
                        if (baseURL !== null) {
                            hrefs = hrefs.map(function (href) {
                                var url = flex.system.url.parse(href, baseURL);
                                return (url !== null ? url.url : false);
                            });
                            hrefs = hrefs.filter(function (href) {
                                return (href !== false ? true : false);
                            });
                        }
                        return hrefs;
                    },
                    html    : function (html) {
                        var regs = settings.regs,
                            body = html.match(regs.BODY);
                        if (body !== null) {
                            if (body.length === 1) {
                                return body[0].replace(regs.BODY_TAG, '');
                            }
                        }
                        return null;
                    },
                    css     : function (html, url) {
                        var regs    = settings.regs,
                            links   = html.match(regs.CSS),
                            hrefs   = [];
                        if (links !== null) {
                            Array.prototype.forEach.call(
                                links,
                                function (link) {
                                    function validate(link) {
                                        var rel     = link.search(regs.CSS_REL),
                                            type    = link.search(regs.CSS_TYPE);
                                        if (rel > 0 && type > 0) {
                                            return true;
                                        }
                                        return false;
                                    };
                                    var href = link.match(regs.CSS_HREF),
                                        str  = null;
                                    if (validate(link) !== false && href !== null) {
                                        if (href.length === 1) {
                                            str = href[0].match(regs.STRING);
                                            if (str !== null) {
                                                if (str.length === 1) {
                                                    hrefs.push(str[0].replace(regs.STRING_BORDERS, ''));
                                                }
                                            }
                                        }
                                    }
                                }
                            );
                        }
                        return template.get.URLs(hrefs, url);
                    },
                    js      : function (html, url) {
                        var regs    = settings.regs,
                            links   = html.match(regs.JS),
                            hrefs   = [];
                        if (links !== null) {
                            Array.prototype.forEach.call(
                                links,
                                function (link) {
                                    function validate(link) {
                                        var type = link.search(regs.JS_TYPE);
                                        if (type > 0) {
                                            return true;
                                        }
                                        return false;
                                    };
                                    var src = link.match(regs.JS_SRC),
                                        str = null;
                                    if (validate(link) !== false && src !== null) {
                                        if (src.length === 1) {
                                            str = src[0].match(regs.STRING);
                                            if (str !== null) {
                                                if (str.length === 1) {
                                                    hrefs.push(str[0].replace(regs.STRING_BORDERS, ''));
                                                }
                                            }
                                        }
                                    }
                                }
                            );
                        }
                        return template.get.URLs(hrefs, url);
                    },
                    pattern : function (url) {
                        return template.set.storage[url] !== void 0 ? template.set.storage[url] : null;
                    }
                },
                set         : {
                    storage             : {},
                    hooks               : function (hooks, pattern_id) {
                        function isNode(something){
                            if (something.nodeName !== void 0 && something.parentNode !== void 0 && something.nodeType !== void 0) {
                                return true;
                            }else{
                                return false;
                            }
                        };
                        function processingValue(something) {
                            function getValue(something) {
                                var value = '';
                                if (template.isTemplate(something)) {
                                    return getValue(something.render(pattern_id));
                                } else {
                                    if (something.length && typeof something !== 'string' && isNode(something) === false) {
                                        Array.prototype.forEach.call(
                                            something,
                                            function (_something) {
                                                value += processingValue(_something);
                                            }
                                        );
                                    } else {
                                        value = something;
                                        if (isNode(value) === true) {
                                            value = (function (something) {
                                                var wrapper = document.createElement('div');
                                                wrapper.appendChild(something.cloneNode(true));
                                                return wrapper.innerHTML;
                                            }(value));
                                        } else if (typeof value === 'object' && value.template !== void 0 && value.instance !== void 0) {
                                            value = {
                                                html    : getValue(value.template),
                                                instance: value.instance
                                            };
                                        } else if (typeof value.toString === 'function') {
                                            value = value.toString();
                                        } else {
                                            value = (typeof value === 'string' ? value : '');
                                        }
                                    }
                                }
                                return value;
                            };
                            if (something !== void 0) {
                                if (typeof something === 'function' && !something.length) {
                                    something = something();
                                }
                                something = getValue(something);
                                return something;
                            }
                            return '';
                        };
                        if (hooks instanceof Array) {
                            hooks.forEach(function (_hooks, index) {
                                template.set.hooks(hooks[index], pattern_id);
                            });
                        } else {
                            if (typeof hooks === 'object') {
                                _object(hooks).forEach(function (name, value) {
                                    hooks[name] = processingValue(value);
                                });
                            }
                        }
                    },
                    convert             : function (body, parameters) {
                        function clearTest(reg, str) {
                            reg.lastIndex = 0;
                            return reg.test(str);
                        };
                        function findHookInAttributes(node, hook, storage, reg_hook) {
                            var reg_hook = reg_hook instanceof RegExp ? reg_hook : new RegExp(settings.regs.HOOK_OPEN + hook + settings.regs.HOOK_CLOSE, 'gi');
                            if (node.attributes) {
                                Array.prototype.forEach.call(node.attributes, function (attr) {
                                    if (typeof attr.nodeValue === 'string' && attr.nodeValue !== '') {
                                        if (clearTest(reg_hook, attr.nodeValue)) {
                                            node.setAttribute(attr.nodeName, attr.nodeValue.replace(reg_hook, '{{' + hook + '_attr' + '}}'));
                                            storage.push((function (hook, node, attr_name, attr_value) {
                                                return function (value) {
                                                    node.setAttribute(attr_name, attr_value.replace(hook, value));
                                                };
                                            }(new RegExp(settings.regs.HOOK_OPEN + hook + '_attr' + settings.regs.HOOK_CLOSE, 'gi'), node, attr.nodeName, node.getAttribute(attr.nodeName))));
                                        }
                                    }
                                });
                            }
                            if (node.childNodes) {
                                Array.prototype.forEach.call(node.childNodes, function (childNode) {
                                    findHookInAttributes(childNode, hook, storage, reg_hook);
                                });
                            }
                        };
                        function findHookInHTMLs(node, hook, storage) {
                            function makeHTMLSwitcher(node, hook, innerHTML) {
                                return function (value) {
                                    if (typeof value !== 'string') {
                                        if (typeof value.innerHTML === 'string') {
                                            value = value.innerHTML;
                                        } else if (value.toString) {
                                            value = value.toString();
                                        } else {
                                            value = 'Wrong type of value - [' + typeof value + ']';
                                        }
                                    }
                                    node.innerHTML = innerHTML.replace(hook, value);
                                };
                            };
                            var hook = hook instanceof RegExp ? hook : new RegExp(settings.regs.HOOK_OPEN + hook + settings.regs.HOOK_CLOSE, 'gi');
                            if (node.childNodes !== void 0) {
                                if (node.childNodes.length > 0) {
                                    Array.prototype.forEach.call(node.childNodes, function (childNode) {
                                        if (typeof childNode.innerHTML === 'string') {
                                            if (clearTest(hook, childNode.innerHTML)) {
                                                findHookInHTMLs(childNode, hook, storage);
                                            }
                                        } else if (typeof childNode.nodeValue === 'string') {
                                            if (clearTest(hook, childNode.nodeValue)) {
                                                storage.push(makeHTMLSwitcher(childNode.parentNode, hook, childNode.parentNode.innerHTML));
                                            }
                                        }
                                    });
                                }
                            }
                        };
                        function addWrappers(node) {
                            function wrap(node) {
                                var innerHTML   = node.nodeValue,
                                    hooks       = innerHTML.match(settings.regs.HOOK),
                                    container   = null;
                                if (hooks instanceof Array) {
                                    hooks.forEach(function (hook) {
                                        var _hook   = hook.replace(settings.regs.HOOK_BORDERS, '');
                                        innerHTML   = innerHTML.replace(new RegExp(settings.regs.HOOK_OPEN + _hook + settings.regs.HOOK_CLOSE, 'gi'), 
                                                                        '<' + settings.tags.HOOK_WRAPPER + ' id="' + _hook + '">' + hook + '</' + settings.tags.HOOK_WRAPPER + '>')
                                    });
                                    container           = document.createElement('div');
                                    container.innerHTML = innerHTML;
                                    for (var index = 0, max_index = container.childNodes.length; index < max_index; index += 1) {
                                        node.parentNode.insertBefore(container.childNodes[0], node);
                                    }
                                    node.parentNode.removeChild(node);
                                }
                            };
                            if (node.childNodes !== void 0) {
                                if (node.childNodes.length > 0) {
                                    Array.prototype.forEach.call(
                                        Array.prototype.filter.call(node.childNodes, function () { return true; }), 
                                        function (childNode) {
                                            if (typeof childNode.innerHTML === 'string') {
                                                if (clearTest(settings.regs.HOOK, childNode.innerHTML)) {
                                                    addWrappers(childNode);
                                                }
                                            } else if (typeof childNode.nodeValue === 'string') {
                                                if (clearTest(settings.regs.HOOK, childNode.nodeValue)) {
                                                    wrap(childNode);
                                                }
                                            }
                                        }
                                    );
                                }
                            }
                        };
                        var hooks   = null,
                            pattern = null,
                            __hooks = {};
                        if (template.set.storage[parameters.url] === void 0) {
                            hooks   = body.match(settings.regs.HOOK);
                            pattern = document.createElement('div');
                            if (hooks instanceof Array) {
                                hooks = (function (hooks) {
                                    var history = {};
                                    return hooks.filter(function (hook) {
                                        if (history[hook] === void 0) {
                                            history[hook] = true;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                }(hooks));
                                hooks = hooks.map(function (hook) {
                                    return hook .replace(new RegExp(settings.regs.HOOK_OPEN,    'gi'), '')
                                                .replace(new RegExp(settings.regs.HOOK_CLOSE,   'gi'), '');
                                });
                                pattern.innerHTML = body;
                                addWrappers(pattern);
                                hooks.forEach(function (hook) {
                                    var _hooks = [];
                                    findHookInAttributes(pattern, hook, _hooks);
                                    findHookInHTMLs     (pattern, hook, _hooks);
                                    __hooks[hook] = (function (_hooks) {
                                        return function (value) {
                                            _hooks.forEach(function (_hook) {
                                                _hook(value);
                                            });
                                        };
                                    }(_hooks));
                                });
                                template.set.model(body, pattern, parameters);
                                template.set.storage[parameters.url] = template.set.getPatternInstance(parameters, pattern, __hooks);
                            } else {
                                return null;
                            }
                        }
                        return template.set.storage[parameters.url];
                    },
                    model               : function (body, pattern, parameters) {
                        function clearTest(reg, str) {
                            reg.lastIndex = 0;
                            return reg.test(str);
                        };
                        function setAttrData(node, model_item) {
                            var model = node.getAttribute(settings.attrs.MODEL_DATA);
                            model = typeof model === 'string' ? (model !== '' ? JSON.parse(model) : []) : [];
                            model.push(model_item);
                            node.setAttribute(settings.attrs.MODEL_DATA, JSON.stringify(model));
                        };
                        function findModelInAttributes(node, model, reg_model) {
                            var reg_model = reg_model instanceof RegExp ? reg_model : new RegExp(settings.regs.MODEL_OPEN + model + settings.regs.MODEL_CLOSE, 'gi');
                            if (node.attributes) {
                                Array.prototype.forEach.call(node.attributes, function (attr) {
                                    if (typeof attr.nodeValue === 'string' && attr.nodeValue !== '') {
                                        if (clearTest(reg_model, attr.nodeValue)) {
                                            setAttrData(node, {
                                                attr : attr.nodeName,
                                                model: model
                                            });
                                            node.removeAttribute(attr.nodeName);
                                        }
                                    }
                                });
                            }
                            if (node.childNodes) {
                                Array.prototype.forEach.call(node.childNodes, function (childNode) {
                                    findModelInAttributes(childNode, model, reg_model);
                                });
                            }
                        };
                        function findModelInHTMLs(node, model, reg_model) {
                            var reg_model = reg_model instanceof RegExp ? reg_model : new RegExp(settings.regs.MODEL_OPEN + model + settings.regs.MODEL_CLOSE, 'gi');
                            if (node.childNodes !== void 0) {
                                if (node.childNodes.length > 0) {
                                    Array.prototype.forEach.call(node.childNodes, function (childNode) {
                                        if (typeof childNode.innerHTML === 'string') {
                                            if (clearTest(reg_model, childNode.innerHTML)) {
                                                findModelInHTMLs(childNode, model, reg_model);
                                            }
                                        } else if (typeof childNode.nodeValue === 'string') {
                                            if (clearTest(reg_model, childNode.nodeValue)) {
                                                setAttrData(node, {
                                                    prop    : 'innerHTML',
                                                    model   : model
                                                });
                                                childNode.parentNode.removeChild(childNode);
                                            }
                                        }
                                    });
                                }
                            }
                        };
                        var models = body.match(settings.regs.MODEL);
                        if (models instanceof Array) {
                            models = (function (models) {
                                var history = {};
                                return models.filter(function (model) {
                                    if (history[model] === void 0) {
                                        history[model] = true;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });
                            }(models));
                            models = models.map(function (model) {
                                return model.replace(settings.regs.MODEL_BORDERS, '');
                            });
                            models.forEach(function (model) {
                                findModelInAttributes(pattern, model);
                                findModelInHTMLs(pattern, model);
                            });
                        }
                    },
                    getPatternInstance  : function (parameters, pattern, hooks) {
                        var instance = flex.oop.classes.create({
                            constr      : function () {
                                this.url        = parameters.url;
                                this.id         = parameters.pattern_id;
                                this.childs     = {};
                            },
                            privates    : {
                                pattern     : pattern,
                                hooks       : hooks,
                                //__instance -> automaticaly attached
                            },
                            prototype   : function (privates) {
                                var self        = this,         
                                    privates    = privates,
                                    map         = null,
                                    hooks       = null,
                                    model       = null,
                                    methods     = null,
                                    wrappers    = null,
                                    controllers = null;
                                hooks       = {
                                    setHooks: function (hooks) {
                                        _object(privates.hooks).forEach(function (key, hook) {
                                            var value = null;
                                            if (hooks[key] !== void 0) {
                                                value = hooks[key];
                                                if (value !== null && typeof value === 'object') {
                                                    if (value.html !== void 0) {
                                                        self.childs[key]    = value.instance;
                                                        value               = value.html;
                                                    }
                                                }
                                                hook(value);
                                            } else {
                                                hook('');
                                            }
                                        });
                                    },
                                };
                                map         = {
                                    map     : {},
                                    create  : function (clone) {
                                        function processing(node, storage) {
                                            var hook = null;
                                            if (node.nodeName.toLowerCase() === settings.tags.HOOK_WRAPPER) {
                                                hook            = node.id;
                                                if (storage[hook] === void 0) {
                                                    storage[hook]   = {
                                                        nodes   : Array.prototype.filter.call(node.childNodes, function () { return true; }),
                                                        childs  : {},
                                                    };
                                                    storage         = storage[hook].childs;
                                                } else {
                                                    if (!(storage[hook] instanceof Array)) {
                                                        storage[hook] = [storage[hook]];
                                                    }
                                                    storage[hook].push({
                                                        nodes   : Array.prototype.filter.call(node.childNodes, function () { return true; }),
                                                        childs  : {},
                                                    });
                                                    storage         = storage[hook][storage[hook].length - 1].childs;
                                                }
                                            }
                                            if (node.childNodes.length) {
                                                Array.prototype.forEach.call(node.childNodes, function (childNode) {
                                                    processing(childNode, storage);
                                                });
                                            }
                                        };
                                        processing(clone, map.map);
                                    },
                                    reset   : function(){
                                        map.map = {};
                                    }
                                };
                                model       = {
                                    model   : {},
                                    binds   : null,
                                    create  : function (clone) {
                                        function getPath(node, path) {
                                            var path = path === void 0 ? [] : path;
                                            if (node.nodeName.toLowerCase() === settings.tags.HOOK_WRAPPER) {
                                                path.unshift('__' + node.id + '__');
                                            }
                                            if (node.parentNode !== null) {
                                                getPath(node.parentNode, path);
                                            }
                                            return path;
                                        };
                                        function getStorage(path) {
                                            var destination = model.model;
                                            path.forEach(function (step, index) {
                                                destination[step]   = destination[step] === void 0 ? { } : destination[step];
                                                destination         = destination[step];
                                            });
                                            return destination;
                                        }
                                        var model_nodes = _nodes('*[' + settings.attrs.MODEL_DATA + ']', false, clone).target;
                                        if (model_nodes.length > 0) {
                                            Array.prototype.forEach.call(model_nodes, function (model_node) {
                                                var destination = getStorage(getPath(model_node)),
                                                    models      = JSON.parse(model_node.getAttribute(settings.attrs.MODEL_DATA));
                                                if (models instanceof Array) {
                                                    models.forEach(function (model) {
                                                        if (destination[model.model] === void 0) {
                                                            destination[model.model] = [];
                                                        }
                                                        destination[model.model].push({
                                                            node    : model_node,
                                                            attr    : model.attr === void 0 ? null : model.attr,
                                                            prop    : model.prop === void 0 ? null : model.prop
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    },
                                    clear   : function (clone) {
                                        var model_nodes = _nodes('*[' + settings.attrs.MODEL_DATA + ']', false, clone).target;
                                        if (model_nodes.length > 0) {
                                            Array.prototype.forEach.call(model_nodes, function (model_node) {
                                                model_node.removeAttribute(settings.attrs.MODEL_DATA);
                                            });
                                        }
                                    },
                                    bind    : function (){
                                        function clearTest(reg, str) {
                                            reg.lastIndex = 0;
                                            return reg.test(str);
                                        };
                                        function bind(group, binds) {
                                            function executeHandles(handles, _this, arg_1, arg_2) {
                                                var state_code = arg_1 + arg_2;
                                                if (handles instanceof Array) {
                                                    handles.forEach(function (handle) {
                                                        if (handle.state_code !== state_code) {
                                                            handle.state_code = state_code;
                                                            handle.call(_this, arg_1, arg_2);
                                                        }
                                                    });
                                                }
                                            };
                                            function income(key, node, binds, group, prop) {
                                                if (node.attr !== null) {
                                                    (function (binds, key, node, attr_name, handles) {
                                                        _node(node).bindingAttrs().bind(attr_name, function (attr_name, current, previous) {
                                                            if (binds[key] !== current) {
                                                                binds[key] = current;
                                                                executeHandles(handles, this, attr_name, current);
                                                            }
                                                        });
                                                    }(binds, key, node.node, node.attr, group[key].handles));
                                                }
                                                if (bindsEvents.isPossible(node.node, prop)) {
                                                    (function (binds, key, node, attr_name, handles) {
                                                        bindsEvents.assing(node, prop, function (event, getter, setter) {
                                                            var current = getter();
                                                            if (binds[key] !== current) {
                                                                binds[key]  = current;
                                                                executeHandles(handles, this, attr_name, current);
                                                            }
                                                        });
                                                    }(binds, key, node.node, node.attr, group[key].handles));
                                                } else {
                                                    if (node.prop !== null) {
                                                        (function (binds, key, node, prop, handles) {
                                                            _node(node).bindingProps().bind(prop, function (prop, current, previous) {
                                                                if (binds[key] !== current) {
                                                                    binds[key] = current;
                                                                    executeHandles(handles, this, prop, current);
                                                                }
                                                            });
                                                        }(binds, key, node.node, node.prop, group[key].handles));
                                                    }
                                                }
                                            };
                                            function outcome(key, node, binds, group, prop) {
                                                if (node.attr !== null) {
                                                    (function (binds, key, node, attr_name, handles) {
                                                        _object(binds).binding().bind(key, function (current, previous) {
                                                            var execute = false;
                                                            if (node.getAttribute(attr_name) !== current) {
                                                                node.setAttribute(attr_name, current);
                                                                execute = true;
                                                            }
                                                            if (node[attr_name] !== void 0) {
                                                                if (node[attr_name] !== current) {
                                                                    node[attr_name] = current;
                                                                    execute = true;
                                                                }
                                                            }
                                                            if (execute) {
                                                                executeHandles(handles, node, attr_name, current);
                                                            }
                                                        });
                                                    }(binds, key, node.node, node.attr, group[key].handles));
                                                } else {
                                                    if (node.node[prop] !== void 0) {
                                                        (function (binds, key, node, prop, handles) {
                                                            _object(binds).binding().bind(key, function (current, previous) {
                                                                if (node[prop] !== current) {
                                                                    node[prop] = current;
                                                                    executeHandles(handles, node, prop, current);
                                                                }
                                                            });
                                                        }(binds, key, node.node, prop, group[key].handles));
                                                    }
                                                }
                                            };
                                            _object(group).forEach(function (key, nodes) {
                                                if (clearTest(settings.regs.GROUP_PROPERTY, key)) {
                                                    binds[key] = {};
                                                    bind(group[key], binds[key]);
                                                } else {
                                                    group[key].handles  = [];
                                                    binds[key]          = null;
                                                    if (nodes instanceof Array) {
                                                        nodes.forEach(function (node) {
                                                            var prop = node.prop !== null ? node.prop : node.attr;
                                                            node.node[settings.storage.NODE_BINDING_DATA] = {
                                                                outcome_call: false
                                                            };
                                                            income  (key, node, binds, group, prop);
                                                            outcome (key, node, binds, group, prop);
                                                        });
                                                    }
                                                    group[key] = {
                                                        addHandle   : function (handle) {
                                                            handle.state_code = null;
                                                            this.handles.push(handle);
                                                        },
                                                        removeHandle: function (handle) {
                                                            this.handles.push(handle);
                                                        },
                                                        handles     : group[key].handles
                                                    };
                                                    group[key].addHandle.   bind(group[key]);
                                                    group[key].removeHandle.bind(group[key]);
                                                }
                                            });
                                        };
                                        model.binds = {};
                                        if (model.model !== null) {
                                            bind(model.model, model.binds);
                                        }
                                    },
                                    reset   : function(){
                                        model.model     = {};
                                        model.binds     = null;
                                    }
                                };
                                wrappers    = {
                                    remove: function (clone) {
                                        var wrappers = _nodes(settings.tags.HOOK_WRAPPER, false, clone).target;
                                        if (wrappers.length > 0) {
                                            Array.prototype.forEach.call(wrappers, function (wrapper) {
                                                var parent  = wrapper.parentNode,
                                                    hook    = wrapper.id;
                                                for (var _index = 0, _max_index = wrapper.childNodes.length; _index < _max_index; _index += 1) {
                                                    if (wrapper.childNodes[0].setAttribute) {
                                                        wrapper.childNodes[0].setAttribute('flex-pattern-parent-hook', hook);
                                                    }
                                                    parent.insertBefore(wrapper.childNodes[0], wrapper);
                                                }
                                                parent.removeChild(wrapper);
                                            });
                                        }
                                    }
                                };
                                controllers = {
                                    controller  : null,
                                    add         : function(controller){
                                        if (typeof controller === 'function') {
                                            controllers.controller = controller;
                                        }
                                    },
                                    apply       : function () {
                                        if (controllers.controller !== null) {
                                            controllers.controller(model.model, map.map, null);
                                        }
                                    }
                                };
                                methods     = {
                                    build   : function (_hooks, is_parent) {
                                        var result          = [],
                                            clone           = null,
                                            remove_wrappers = remove_wrappers === void 0 ? true : remove_wrappers;
                                        _hooks = _hooks instanceof Array ? _hooks : [_hooks];
                                        _hooks.forEach(function (_hooks, index) {
                                            hooks.setHooks(_hooks);
                                            clone = privates.pattern.cloneNode(true);
                                            map.    reset();
                                            model.  reset();
                                            map.    create(clone);
                                            model.  create(clone);
                                            if (is_parent) {
                                                wrappers.   remove(clone);
                                                model.      clear (clone);
                                                model.      bind();
                                            }
                                            //Apply controllers
                                            controllers.apply();
                                            //Prepare result
                                            Array.prototype.forEach.call(clone.childNodes, function (node) {
                                                result.push(node);
                                            });
                                        });
                                        return result;
                                    },
                                    clone   : function(hooks, is_parent){
                                        function getHTML(something) {
                                            var something   = something instanceof Array ? something : [something],
                                                html        = '';
                                            something.forEach(function (something) {
                                                var wrapper = null;
                                                if (something.cloneNode) {
                                                    wrapper = document.createElement('div');
                                                    wrapper.appendChild(something.cloneNode(true));
                                                    html    += wrapper.innerHTML;   
                                                }
                                            });
                                            return html;
                                        };
                                        var hooks       = hooks instanceof Array ? hooks : [hooks],
                                            _hooks      = {},
                                            is_parent   = typeof is_parent === 'boolean' ? is_parent : true;
                                        hooks.forEach(function (hooks) {
                                            if (typeof hooks === 'object') {
                                                _object(hooks).forEach(function (hook_name, hook_value) {
                                                    var hook_value = hook_value instanceof Array ? hook_value : [hook_value];
                                                    _hooks[hook_name] = '';
                                                    hook_value.forEach(function (hook_value) {
                                                        if (hook_value.nodeName !== void 0 && hook_value.parentNode !== void 0 && hook_value.nodeType !== void 0) {
                                                            _hooks[hook_name] += getHTML(hook_value);
                                                        } else if (typeof hook_value === 'function') {
                                                            _hooks[hook_name] += hook_value();
                                                        } else if (typeof hook_value === 'object') {
                                                            if (self.childs[hook_name] !== void 0) {
                                                                _hooks[hook_name] += getHTML(self.childs[hook_name].clone(hook_value, false));
                                                            }
                                                        } else if (typeof hook_value === 'string') {
                                                            _hooks[hook_name] += hook_value;
                                                        } else if (typeof value.toString === 'function') {
                                                            _hooks[hook_name] += hook_value.toString();
                                                        } else {
                                                            throw new Error('Unexpected hook type');
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                        return methods.build(_hooks, is_parent);
                                    },
                                    handle  : function (handle) {
                                        if (typeof handle === 'function') {
                                            handle.call(privates.__instance, self.url, model.binds, model.model);
                                        }
                                    },
                                };
                                return {
                                    build       : methods.build,
                                    clone       : methods.clone,
                                    handle      : methods.handle,
                                    controllers : {
                                        set     : controllers.add,
                                        apply   : controllers.apply
                                    }
                                };
                            }
                        });
                        return instance;
                    }
                },
            };
            resources   = {
                css : {
                    load    : function (hrefs, onFinish) {
                        var journal     = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CSS_ATTACHED_JOURNAL, {}),
                            onFinish    = onFinish || null,
                            register_id = flex.unique();
                        if (hrefs.length > 0) {
                            if (onFinish !== null) {
                                flex.overhead.register.open(register_id, hrefs, onFinish);
                            } else {
                                register_id = null;
                            }
                            Array.prototype.forEach.call(
                                hrefs,
                                function (href) {
                                    var storaged = null;
                                    if (!journal[href]) {
                                        //Add into journal
                                        journal[href] = true;
                                        //Check virtual storage
                                        storaged = storage.virtual.get(href);
                                        if (storaged === null) {
                                            //Check local storage
                                            storaged = storage.local.get(href);
                                        }
                                        if (storaged === null) {
                                            //Load css from server
                                            flex.resources.attach.css.connect(
                                                href,
                                                function (href) {
                                                    resources.css.onLoad(href, register_id);
                                                }
                                            );
                                        } else {
                                            //Load css from storage
                                            flex.resources.attach.css.adoption(storaged, null, href);
                                            flex.overhead.register.done(register_id, href);
                                            //Save into virtual storage
                                            storage.virtual.add(href, storaged);
                                        }
                                    } else {
                                        flex.overhead.register.done(register_id, href);
                                    }
                                }
                            );
                        } else {
                            flex.system.handle(onFinish, null, 'flex.ui.templates.resources.css.load', null);
                        }
                    },
                    onLoad  : function (href, register_id) {
                        var cssText = flex.resources.parse.css.stringify(href);
                        if (cssText !== null) {
                            //Save into virtual storage
                            storage.virtual.add(href, cssText);
                            //Save into local storage
                            storage.local.add(href, cssText);
                        }
                        if (register_id !== null) {
                            flex.overhead.register.done(register_id, href);
                        }
                    }
                },
                js  : {
                    currentURL  : null,
                    load        : function (srcs, onFinish, parameters) {
                        var journal     = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.JS_ATTACHED_JOURNAL, {}),
                            onFinish    = onFinish || null,
                            register_id = flex.unique();
                        if (srcs.length > 0) {
                            if (onFinish !== null) {
                                flex.overhead.register.open(register_id, srcs, onFinish);
                            } else {
                                register_id = null;
                            }
                            Array.prototype.forEach.call(
                                srcs,
                                function (href) {
                                    var storaged = null;
                                    if (journal[href] === void 0) {
                                        //Add reference between pattern and controller
                                        controllers.references.assign(href, parameters.url);
                                        //Add into journal
                                        journal[href]   = true;
                                        //Check virtual storage
                                        storaged        = storage.virtual.get(href);
                                        if (storaged === null) {
                                            //Check local storage
                                            storaged    = storage.local.get(href);
                                        }
                                        if (storaged === null || flex.config().resources.USE_STORAGED === false) {
                                            //Load js from server
                                            flex.resources.attach.js.connect(
                                                href,
                                                function () {
                                                    flex.overhead.register.done(register_id, href);
                                                    resources.js.loader.load(href);
                                                }
                                            );
                                        } else {
                                            //Save URL before
                                            resources.js.currentURL = href;
                                            //Load js from storage
                                            flex.resources.attach.js.adoption(storaged, function () {
                                                flex.overhead.register.done(register_id, href);
                                                //Reset URL
                                                resources.js.currentURL = href;
                                            });
                                            //Save into virtual storage
                                            storage.virtual.add(href, storaged);
                                        }
                                    } else {
                                        flex.overhead.register.done(register_id, href);
                                    }
                                }
                            );
                        } else {
                            flex.system.handle(onFinish, null, 'flex.ui.templates.resources.js.load', null);
                        }
                    },
                    onLoad      : function (href, register_id) {
                        var jsText = flex.resources.parse.css.stringify(href);
                        if (jsText !== null) {
                            //Save into virtual storage
                            storage.virtual.add(href, jsText);
                            //Save into local storage
                            storage.local.add(href, jsText);
                        }
                        if (register_id !== null) {
                            flex.overhead.register.done(register_id, href);
                        }
                    },
                    loader      : {
                        load    : function (url) {
                            var request = flex.ajax.send(
                                null,
                                url,
                                'get',
                                null,
                                {
                                    success : function (response, request) {
                                        resources.js.loader.success(url, response);
                                    },
                                    fail    : function (response, request) {
                                        resources.js.loader.fail(request, response, url);
                                    }
                                },
                                null
                            );
                            request.send();
                        },
                        success : function (url, response) {
                            //Save into virtual storage
                            storage.virtual.add(url, response.original);
                            //Save into local storage
                            storage.local.add(url, response.original);
                        },
                        fail    : function (request, response, url) {
                        }
                    }
                }
            };
            storage     = {
                virtual : {
                    add     : function (key, value) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.VIRTUAL_STORAGE_ID, {});
                        if (storage !== null) {
                            if (storage[key] === void 0) {
                                storage[key] = value;
                                return true;
                            }
                        }
                    },
                    get     : function (key) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.VIRTUAL_STORAGE_ID, {});
                        if (storage !== null) {
                            return (storage[key] !== void 0 ? storage[key] : null);
                        }
                        return null;
                    }
                },
                local   : {
                    add: function (url, value) {
                        if (settings.storage.USE_LOCALSTORAGE === true) {
                            return flex.localStorage.addJSON(url, {
                                html    : value,
                                hash    : flex.hashes.get(url)
                            });
                        }
                        return false;
                    },
                    get: function (url) {
                        var target = null;
                        if (settings.storage.USE_LOCALSTORAGE === true) {
                            flex.hashes.update(url);
                            target = flex.localStorage.getJSON(url);
                            if (target !== null) {
                                if (target.hash === flex.hashes.get(url)) {
                                    return target.html;
                                }
                            }
                        }
                        return null;
                    }
                }
            };
            callers     = {
                init    : function () {
                    flex.callers.define.node('ui.patterns.append', function (parameters) {
                        if (typeof parameters === 'object' && this.target) {
                            parameters.node = this.target;
                        }
                        return transport.send(parameters);
                    });
                    flex.callers.define.nodes('ui.patterns.append', function () {
                        var result = [];
                        Array.prototype.forEach.call(this.target, function (target) {
                            if (typeof parameters === 'object' && this.target) {
                                parameters.node = this.target;
                            }
                            result.push(transport.send(parameters));
                        });
                        return result;
                    });
                }
            };
            controllers = {
                references: {
                    data            : {},
                    assign          : function (href, pattern_url) {
                        if (controllers.references.data[href] === void 0) {
                            controllers.references.data[href] = pattern_url;
                        }
                    },
                    getPatternURL   : function (href) {
                        return controllers.references.data[href] !== void 0 ? controllers.references.data[href] : null;
                    }
                },
                attach  : function (controller) {
                    var url     = null,
                        pattern = null;
                    if (typeof controller === 'function') {
                        url = resources.js.currentURL !== null ? resources.js.currentURL : flex.resources.attach.js.getCurrentSRC();
                        if (url !== null) {
                            //Get pattern URL
                            pattern = controllers.references.getPatternURL(url);
                            //Get pattern instance
                            pattern = template.get.pattern(pattern);
                            if (pattern !== null) {
                                //Save controller
                                pattern.controllers.set(controller);
                            }
                        }
                    }
                }
            };
            logs        = {
                performance: (function () {
                    var storage = {};
                    return function (id, url) {
                        if (storage[id] === void 0) {
                            storage[id] = performance.now();
                        } else {
                            flex.logs.log('[flex.ui.patterns] ' + (performance.now() - storage[id]).toFixed(4) + 'ms. was needed to generate template #' + id + ' (' + url + ').', flex.logs.types.NOTIFICATION);
                            delete storage[id];
                        }
                    };
                }())
            };
            //Init callers
            callers.init();
            flex.libraries.events.create();
            flex.libraries.binds.create();
            //Private part
            privates    = {
                get         : template.init,
                preload     : transport.preload.preload,
                controllers : {
                    attach  : controllers.attach
                }
            };
            //Global callers
            window['_controller'] = privates.controllers.attach;
            //Public part
            return {
                get     : privates.get,
                preload : privates.preload,
            };
        };
        flex.modules.attach({
            name            : 'ui.patterns',
            protofunction   : protofunction,
            reference       : function () {
                flex.libraries.events();
                flex.libraries.binds();
                flex.libraries.html();
            },
            onAfterAttach: function () {
            }
        });
    }
}());