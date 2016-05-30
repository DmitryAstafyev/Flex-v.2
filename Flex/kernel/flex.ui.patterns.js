// LICENSE
// This file (core / module) is released under the MIT License. See [LICENSE] file for details.
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
            var config      = null,
                settings    = null,
                //Classes
                source      = null,
                pattern     = null,
                instance    = null,
                result      = null,
                caller      = null,
                //Methods
                layout      = null,
                privates    = null,
                controllers = null,
                storage     = null,
                logs        = null,
                measuring   = null,
                helpers     = null,
                conditions  = null,
                callers     = null;
            //Config
            config      = {
                values      : {
                    USE_STORAGE_CSS : true,
                    USE_STORAGE_JS  : true,
                    USE_STORAGE_HTML: true,
                    PATTERN_NODE    : 'pattern',
                },
                validator   : {
                    USE_STORAGE_CSS : function (value) { return typeof value === 'boolean' ? true : false;},
                    USE_STORAGE_JS  : function (value) { return typeof value === 'boolean' ? true : false;},
                    USE_STORAGE_HTML: function (value) { return typeof value === 'boolean' ? true : false;},
                    PATTERN_NODE    : function (value) { return typeof value === 'string' ? (value.length > 0 ? (value.replace(/\w/gi, '').length === 0 ? true : false) : false) : false; },
                },
                setup       : function (_config) {
                    if (_config !== null && typeof _config === 'object') {
                        _object(_config).forEach(function (key, value) {
                            if (config.values[key] !== void 0 && config.validator[key] !== void 0) {
                                config.values[key] = config.validator[key](value) ? value : config.values[key];
                            }
                        });
                    }
                },
                get         : function () {
                    return config.values;
                },
                debug       : function (){
                    config.values.USE_STORAGE_CSS   = false;
                    config.values.USE_STORAGE_JS    = false;
                    config.values.USE_STORAGE_HTML  = false;
                }
            };
            //Settings
            settings    = {
                measuring       : {
                    MEASURE : true,
                },
                classes         : {
                    SOURCE  : function(){},
                    PATTERN : function(){},
                    INSTANCE: function(){},
                    RESULT  : function(){},
                    CALLER  : function(){},
                },
                regs            : {
                    BODY                : /<\s*body[^>]*>(\n|\r|\s|.)*?<\s*\/body\s*>/gi,
                    BODY_TAG            : /<\s*body[^>]*>|<\s*\/\s*body\s*>/gi,
                    BODY_CLEAR          : /^[\n\r\s]*|[\n\r\s]*$/gi,
                    TABLE               : /<\s*table[^>]*>(\n|\r|\s|.)*?<\s*\/table\s*>/gi,
                    TABLE_TAG           : /<\s*table[^>]*>|<\s*\/\s*table\s*>/gi,
                    ANY_TAG             : /<\s*[\w]{1,}[^>]*>(\n|\r|\s|\t|.)*<\s*\/\s*\w{1,}\s*>/gi,
                    FIRST_TAG           : /^\<.*?\>/gi,
                    TAG_BORDERS         : /<|>/gi,
                    CSS                 : /<link\s+.*?\/>|<link\s+.*?\>/gi,
                    CSS_HREF            : /href\s*\=\s*"(.*?)"|href\s*\=\s*'(.*?)'/gi,
                    CSS_REL             : /rel\s*=\s*"stylesheet"|rel\s*=\s*'stylesheet'/gi,
                    CSS_TYPE            : /type\s*=\s*"text\/css"|type\s*=\s*'text\/css'/gi,
                    JS                  : /<script\s+.*?>/gi,
                    JS_SRC              : /src\s*\=\s*"(.*?)"|src\s*\=\s*'(.*?)'/gi,
                    JS_TYPE             : /type\s*=\s*"text\/javascript"|type\s*=\s*'text\/javascript'/gi,
                    STRING              : /"(.*?)"|'(.*?)'/gi,
                    STRING_BORDERS      : /"|'/gi,
                    DOM                 : /\{\{\$[\w\.\,]*?\}\}/gi,
                    DOM_OPEN            : '\\{\\{\\$',
                    DOM_CLOSE           : '\\}\\}',
                    HOOK                : /\{\{[\w\.]*?\}\}/gi,
                    MODEL               : /\{\{\:\:\w*?\}\}/gi,
                    MODEL_BORDERS       : /\{\{\:\:|\}\}/gi,
                    MODEL_OPEN          : '\\{\\{\\:\\:',
                    MODEL_CLOSE         : '\\}\\}',
                    HOOK_OPEN           : '\\{\\{',
                    HOOK_CLOSE          : '\\}\\}',
                    HOOK_OPEN_COM       : '<\\!--\\{\\{',
                    HOOK_CLOSE_COM      : '\\}\\}-->',
                    HOOK_BORDERS        : /\{\{|\}\}/gi,
                    GROUP_PROPERTY      : /__\w*?__/gi,
                    FIRST_WORD          : /^\w+/gi,
                    NOT_WORDS_NUMBERS   : /[^\w\d]/gi,
                    CONDITION_STRUCTURE : /^\w*=/gi
                },
                marks           : {
                    DOM         : 'DOM',
                },
                storage         : {
                    USE_LOCALSTORAGE        : true,
                    VIRTUAL_STORAGE_GROUP   : 'FLEX_UI_PATTERNS_GROUP',
                    VIRTUAL_STORAGE_ID      : 'FLEX_UI_PATTERNS_STORAGE',
                    CSS_ATTACHED_JOURNAL    : 'FLEX_UI_PATTERNS_CSS_JOURNAL',
                    JS_ATTACHED_JOURNAL     : 'JS_ATTACHED_JOURNAL',
                    PRELOAD_TRACKER         : 'FLEX_UI_PATTERNS_PRELOAD_TRACKER',
                    NODE_BINDING_DATA       : 'FLEX_PATTERNS_BINDINGS_DATA',
                    CONTROLLERS_LINKS       : 'FLEX_PATTERNS_CONTROLLERS_LINKS',
                    CONTROLLERS_STORAGE     : 'FLEX_PATTERNS_CONTROLLERS_STORAGE',
                    CONDITIONS_STORAGE      : 'FLEX_PATTERNS_CONDITIONS_STORAGE',
                    PATTERN_SOURCES         : 'FLEX_PATTERNS_PATTERN_SOURCES',
                    PATTERNS                : 'FLEX_PATTERNS_PATTERNS',
                },
                compatibility   : {
                    PARENT_TO_CHILD : {
                        table   : 'tbody',
                        tbody   : 'tr',
                        thead   : 'tr',
                        tfoot   : 'tr',
                        tr      : 'td',
                        colgroup: 'col',
                    },
                    CHILD_TO_PARENT : {
                        tr      : 'tbody',
                        th      : 'tbody',
                        td      : 'tr',
                        col     : 'colgroup',
                        tbody   : 'table',
                        thead   : 'table',
                        tfoot   : 'table',
                    },
                    BASE            : 'div'
                },
                css             : {
                    classes     : {
                        HOOK_WRAPPER    : 'flex_patterns_hook_wrapper'
                    },
                    attrs       : {
                        MODEL_DATA      : 'data-flex-model-data',
                        DOM_MARK        : 'data-flex-dom-mark',
                    },
                    selectors   : {
                        HOOK_WRAPPERS: '.flex_patterns_hook_wrapper'
                    },
                },
                other           : {
                    INDEXES     : '__indexes'
                }
            };
            logs        = {
                SIGNATURE   : '[flex.ui.patterns]', 
                source      : {
                    TEMPLATE_WAS_LOADED     : '0001:TEMPLATE_WAS_LOADED',
                    FAIL_TO_LOAD_TEMPLATE   : '0002:FAIL_TO_LOAD_TEMPLATE',
                    FAIL_TO_PARSE_TEMPLATE  : '0003:FAIL_TO_PARSE_TEMPLATE',
                    FAIL_TO_LOAD_JS_RESOURCE: '0004:FAIL_TO_LOAD_JS_RESOURCE',
                },
                pattern     : {
                    CANNOT_FIND_FIRST_TAG               : '1000:CANNOT_FIND_FIRST_TAG',
                    CANNOT_CREATE_WRAPPER               : '1001:CANNOT_CREATE_WRAPPER',
                    WRONG_PATTERN_WRAPPER               : '1002:WRONG_PATTERN_WRAPPER',
                    WRONG_HOOK_VALUE                    : '1003:WRONG_HOOK_VALUE',
                    WRONG_CONDITION_DEFINITION          : '1004:WRONG_CONDITION_DEFINITION',
                    MODEL_HOOK_NEEDS_WRAPPER            : '1005:MODEL_HOOK_NEEDS_WRAPPER',
                    CANNOT_FIND_CONDITION_BEGINING      : '1006:CANNOT_FIND_CONDITION_BEGINING',
                    CANNOT_FIND_CONDITION_END           : '1007:CANNOT_FIND_CONDITION_END',
                    CANNOT_FIND_CONDITION_NODES         : '1008:CANNOT_FIND_CONDITION_NODES',
                    CANNOT_FIND_CONDITION_VALUE         : '1009:CANNOT_FIND_CONDITION_VALUE',
                    UNEXCEPTED_ERROR_CONDITION_PARSER   : '1010:UNEXCEPTED_ERROR_CONDITION_PARSER',
                },
                instance    : {
                    BAD_HOOK_FOR_CLONE      : '2000:BAD_HOOK_FOR_CLONE',
                    NO_URL_FOR_CLONE_HOOK   : '2001:NO_URL_FOR_CLONE_HOOK',
                },
                caller      : {
                    CANNOT_INIT_PATTERN     : '3000:CANNOT_INIT_PATTERN',
                    CANNOT_GET_CHILD_PATTERN: '3001:CANNOT_GET_CHILD_PATTERN',
                    CANNOT_GET_PATTERN      : '3002:CANNOT_GET_PATTERN',
                },
                layout      : {
                    BAD_ARRAY_OF_HOOKS      : '4000:BAD_ARRAY_OF_HOOKS',
                }
            };
            //Classes implementations
            //BEGIN: source class ===============================================
            source      = {
                proto       : function (privates) {
                    var self        = this,
                        load        = null,
                        parse       = null,
                        process     = null,
                        resources   = null,
                        get         = null,
                        callback    = null,
                        signature   = null,
                        returning   = null;
                    load        = function (success, fail) {
                        var perf_id     = null,
                            ajax        = null,
                            storaged    = null;
                        if (privates.html === null) {
                            storaged = storage.get(self.url);
                            if (storaged !== null && config.get().USE_STORAGE_HTML === true) {
                                process(storaged, success, fail);
                            } else {
                                perf_id = measuring.measure();
                                ajax    = flex.ajax.send(
                                    self.url,
                                    flex.ajax.methods.GET,
                                    null,
                                    {
                                        success: function (response, request) {
                                            measuring.measure(perf_id, 'loading sources for (' + self.url + ')');
                                            storage.add(self.url, response);
                                            process(response, success, fail);
                                        },
                                        fail: function (response, request) {
                                            measuring.measure(perf_id, 'loading sources for (' + self.url + ')');
                                            flex.logs.log(signature() + logs.source.FAIL_TO_LOAD_TEMPLATE, flex.logs.types.CRITICAL);
                                            callback(fail);
                                            throw logs.source.FAIL_TO_LOAD_TEMPLATE;
                                        },
                                    }
                                );
                                ajax.send();
                            }
                        } else {
                            flex.logs.log(signature() + logs.source.TEMPLATE_WAS_LOADED, flex.logs.types.NOTIFICATION);
                        }
                        return true;
                    };
                    parse       = {
                        URLs: function (hrefs) {
                            var baseURL = flex.system.url.restore(self.url);
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
                        html: function (html) {
                            var regs = settings.regs,
                                body = html.match(regs.BODY);
                            if (body !== null) {
                                if (body.length === 1) {
                                    privates.html       = body[0].replace(regs.BODY_TAG, '').replace(regs.BODY_CLEAR, '');
                                    privates.original   = html;
                                    privates.html       = helpers.tableFix(privates.html);
                                    return true;
                                }
                            }
                            privates.html = null;
                            return false;
                        },
                        css : function () {
                            var regs    = settings.regs,
                                links   = privates.original !== null ? privates.original.match(regs.CSS) : null,
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
                                        var href    = link.match(regs.CSS_HREF),
                                            str     = null;
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
                            privates.css = parse.URLs(hrefs);
                        },
                        js  : function () {
                            var regs    = settings.regs,
                                links   = privates.original !== null ? privates.original.match(regs.JS) : null,
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
                            privates.js = parse.URLs(hrefs);
                        },
                    };
                    process     = function (response, success, fail) {
                        if (parse.html(response.original)) {
                            parse.js();
                            parse.css();
                            resources.css.load(function () {
                                resources.js.load(
                                    function () {
                                        callback(success);
                                    },
                                    function () {
                                        callback(fail);
                                    }
                                );
                            });
                        } else {
                            flex.logs.log(signature() + logs.source.FAIL_TO_PARSE_TEMPLATE, flex.logs.types.NOTIFICATION);
                            callback(fail);
                        }
                    };
                    resources   = {
                        css : {
                            load: function (success) {
                                var journal     = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CSS_ATTACHED_JOURNAL, {}),
                                    register_id = flex.unique();
                                if (privates.css !== null && privates.css.length > 0) {
                                    flex.overhead.register.open(register_id, privates.css, success);
                                    Array.prototype.forEach.call(
                                        privates.css,
                                        function (url) {
                                            var storaged    = null,
                                                perf_id     = null;
                                            if (!journal[url]) {
                                                journal[url]    = true;
                                                storaged        = storage.get(url);
                                                if (storaged === null || config.get().USE_STORAGE_CSS === false) {
                                                    perf_id = measuring.measure();
                                                    flex.resources.attach.css.connect(
                                                        url,
                                                        function (url) {
                                                            var cssText = flex.resources.parse.css.stringify(url);
                                                            if (cssText !== null) {
                                                                storage.add(url, cssText);
                                                            }
                                                            if (register_id !== null) {
                                                                flex.overhead.register.done(register_id, url);
                                                            }
                                                            measuring.measure(perf_id, 'loading resources for (' + self.url + '):: ' + url);
                                                        }
                                                    );
                                                } else {
                                                    flex.resources.attach.css.adoption(storaged, null, url);
                                                    flex.overhead.register.done(register_id, url);
                                                    storage.add(url, storaged);
                                                }
                                            } else {
                                                flex.overhead.register.done(register_id, url);
                                            }
                                        }
                                    );
                                } else {
                                    callback(success);
                                }
                            },
                        },
                        js  : {
                            load: function (success, fail) {
                                var journal     = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.JS_ATTACHED_JOURNAL, {}),
                                    register_id = flex.unique();
                                if (privates.js !== null && privates.js.length > 0) {
                                    flex.overhead.register.open(register_id, privates.js, success);
                                    Array.prototype.forEach.call(
                                        privates.js,
                                        function (url) {
                                            var storaged    = null,
                                                perf_id     = null;
                                            if (journal[url] === void 0) {
                                                controllers.references.assign(url, self.url);
                                                journal[url]    = true;
                                                storaged        = storage.get(url);
                                                if (storaged === null || config.get().USE_STORAGE_JS === false) {
                                                    perf_id = measuring.measure();
                                                    flex.resources.attach.js.connect(
                                                        url,
                                                        function () {
                                                            flex.overhead.register.done(register_id, url);
                                                            var request = flex.ajax.send(
                                                                url,
                                                                flex.ajax.methods.GET,
                                                                null,
                                                                {
                                                                    success: function (response, request) {
                                                                        storage.add(url, response.original);
                                                                    },
                                                                }
                                                            );
                                                            request.send();
                                                            measuring.measure(perf_id, 'loading resources for (' + self.url + '):: ' + url);
                                                        },
                                                        function () {
                                                            flex.logs.log(signature() + logs.source.FAIL_TO_LOAD_JS_RESOURCE, flex.logs.types.CRITICAL);
                                                            measuring.measure(perf_id, 'loading resources for (' + self.url + '):: ' + url);
                                                            callback(fail);
                                                            throw logs.source.FAIL_TO_LOAD_JS_RESOURCE;
                                                        }
                                                    );
                                                } else {
                                                    controllers.current.set(url);
                                                    flex.resources.attach.js.adoption(storaged, function () {
                                                        flex.overhead.register.done(register_id, url);
                                                        controllers.current.set(url);
                                                    });
                                                    storage.add(url, storaged);
                                                }
                                            } else {
                                                flex.overhead.register.done(register_id, url);
                                            }
                                        }
                                    );
                                } else {
                                    callback(success);
                                }
                            },
                        }
                    };
                    callback    = function (callback) {
                        if (typeof callback === 'function') {
                            callback.call(privates.__instance, self.url, self.original_url, privates.__instance);
                        }
                    };
                    get         = {
                        html: function () { return privates.html; }
                    };
                    signature   = function () {
                        return logs.SIGNATURE + ':: pattern (' + self.url + ')';
                    };
                    returning   = {
                        load : load,
                        html : get.html,
                    };
                    return {
                        load: returning.load,
                        html: returning.html
                    };
                },
                instance    : function (parameters) {
                    if (flex.oop.objects.validate(parameters, [ { name: 'url',  type: 'string'              },
                                                                { name: 'html', type: 'string', value: null },
                                                                { name: 'css',  type: 'array',  value: null },
                                                                { name: 'js',   type: 'array',  value: null }]) !== false) {
                        return _object({
                            parent          : settings.classes.SOURCE,
                            constr          : function () {
                                this.url            = flex.system.url.restore(parameters.url);
                                this.original_url   = parameters.url;
                            },
                            privates        : {
                                original: null,
                                html    : parameters.html,
                                css     : parameters.css,
                                js      : parameters.js,
                            },
                            prototype       : source.proto
                        }).createInstanceClass();
                    } else {
                        return null;
                    }
                },
                storage     : {
                    add: function (url, instance) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PATTERN_SOURCES, {});
                        if (storage[url] === void 0) {
                            storage[url] = instance;
                        }
                    },
                    get: function (url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PATTERN_SOURCES, {});
                        return storage[url] !== void 0 ? storage[url] : null;
                    },
                },
                init        : function (url, success, fail) {
                    var urls        = url instanceof Array ? url : [url],
                        journal     = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PRELOAD_TRACKER, {}),
                        register_id = flex.unique(),
                        sources     = [],
                        is_failed   = false;
                    flex.overhead.register.open(register_id, urls, function () {
                        if (typeof success === 'function' && !is_failed) {
                            success(sources);
                        } else {
                            flex.system.handle(fail);
                        }
                    });
                    urls.forEach(function (url) {
                        var instance = source.storage.get(url);
                        if (instance !== null) {
                            sources.push(instance);
                            flex.overhead.register.done(register_id, url);
                        } else {
                            instance = source.instance({ url: url });
                            instance.load(
                                function (_url, _original_url, _instance) {
                                    sources.push                (_instance);
                                    source.storage.add          (_original_url, _instance);
                                    pattern.init                (_url, _instance.html());
                                    flex.overhead.register.done (register_id, _original_url);
                                },
                                function (_url, _original_url, _instance) {
                                    is_failed = true;
                                    flex.overhead.register.done(register_id, _original_url);
                                }
                            );
                        }
                    });
                }
            };
            //END: source class ===============================================
            //BEGIN: pattern class ===============================================
            pattern     = {
                proto       : function (privates) {
                    var self            = this,
                        hooks           = null,
                        convert         = null,
                        compatibility   = null,
                        clone           = null,
                        returning       = null,
                        signature       = null;
                    convert         = {
                        hooks       : {
                            getFromHTML : function(){
                                var hooks = privates.html.match(settings.regs.HOOK);
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
                                    return hooks;
                                }
                            },
                            wrap        : function (target_node) {
                                function wrapHook(node) {
                                    var innerHTML   = node.nodeValue,
                                        hooks       = innerHTML.match(settings.regs.HOOK),
                                        container   = null,
                                        tag         = settings.compatibility.PARENT_TO_CHILD[node.parentNode.nodeName.toLowerCase()] !== void 0 ? settings.compatibility.PARENT_TO_CHILD[node.parentNode.nodeName.toLowerCase()] : settings.compatibility.BASE;
                                    if (hooks instanceof Array) {
                                        hooks.forEach(function (hook) {
                                            var _hook = hook.replace(settings.regs.HOOK_BORDERS, '');
                                            innerHTML = innerHTML.replace(  new RegExp(settings.regs.HOOK_OPEN + _hook + settings.regs.HOOK_CLOSE, 'gi'),
                                                                            '<' + tag + ' id="' + _hook + '" class="' + settings.css.classes.HOOK_WRAPPER + '"><!--' + hook + '--></' + tag + '>');
                                        });
                                        container           = document.createElement(node.parentNode.nodeName);
                                        container.innerHTML = innerHTML;
                                        for (var index = 0, max_index = container.childNodes.length; index < max_index; index += 1) {
                                            node.parentNode.insertBefore(container.childNodes[0], node);
                                        }
                                        node.parentNode.removeChild(node);
                                    }
                                };
                                if (target_node.childNodes !== void 0) {
                                    if (target_node.childNodes.length > 0) {
                                        Array.prototype.forEach.call(
                                            Array.prototype.filter.call(target_node.childNodes, function () { return true; }),
                                            function (childNode) {
                                                if (typeof childNode.innerHTML === 'string') {
                                                    if (helpers.testReg(settings.regs.HOOK, childNode.innerHTML)) {
                                                        convert.hooks.wrap(childNode);
                                                    }
                                                } else if (typeof childNode.nodeValue === 'string') {
                                                    if (helpers.testReg(settings.regs.HOOK, childNode.nodeValue)) {
                                                        wrapHook(childNode);
                                                    }
                                                }
                                            }
                                        );
                                    }
                                }
                                return true;
                            },
                            setters     : {
                                inNodes     : function (node, hook, storage, hook_com) {
                                    var hook_com    = hook_com  instanceof RegExp ? hook_com    : new RegExp(settings.regs.HOOK_OPEN_COM    + hook + settings.regs.HOOK_CLOSE_COM,  'gi'),
                                        hook        = hook      instanceof RegExp ? hook        : new RegExp(settings.regs.HOOK_OPEN        + hook + settings.regs.HOOK_CLOSE,      'gi');
                                    if (node.childNodes !== void 0) {
                                        if (node.childNodes.length > 0) {
                                            Array.prototype.forEach.call(node.childNodes, function (childNode) {
                                                if (typeof childNode.innerHTML === 'string') {
                                                    if (helpers.testReg(hook_com, childNode.innerHTML)) {
                                                        convert.hooks.setters.inNodes(childNode, hook, storage, hook_com);
                                                    }
                                                } else if (typeof childNode.nodeValue === 'string') {
                                                    if (helpers.testReg(hook, childNode.nodeValue)) {
                                                        storage.push(convert.hooks.setters.nodeSetter(childNode.parentNode));
                                                    }
                                                }
                                            });
                                        }
                                    }
                                },
                                inAttributes: function (node, hook, storage, reg_hook) {
                                    var reg_hook = reg_hook instanceof RegExp ? reg_hook : new RegExp(settings.regs.HOOK_OPEN + hook + settings.regs.HOOK_CLOSE, 'gi');
                                    if (node.attributes) {
                                        Array.prototype.forEach.call(node.attributes, function (attr) {
                                            if (typeof attr.nodeValue === 'string' && attr.nodeValue !== '') {
                                                if (helpers.testReg(reg_hook, attr.nodeValue)) {
                                                    node.setAttribute(attr.nodeName, attr.nodeValue.replace(reg_hook, '{{' + hook + '_attr' + '}}'));
                                                    storage.push(convert.hooks.setters.attrSetter(
                                                        new RegExp(settings.regs.HOOK_OPEN + hook + '_attr' + settings.regs.HOOK_CLOSE, 'gi'),
                                                        node,
                                                        attr.nodeName,
                                                        node.getAttribute(attr.nodeName))
                                                    );
                                                }
                                            }
                                        });
                                    }
                                    if (node.childNodes) {
                                        Array.prototype.forEach.call(node.childNodes, function (childNode) {
                                            convert.hooks.setters.inAttributes(childNode, hook, storage, reg_hook);
                                        });
                                    }
                                },
                                attrSetter  : function (hook, node, attr_name, attr_value) {
                                    return function (value) {
                                        node.setAttribute(attr_name, attr_value.replace(hook, value));
                                    };
                                },
                                nodeSetter  : function (node) {
                                    function verifyCompatibility(node, value) {
                                        var _node   = null,
                                            tag     = null;
                                        if (node.innerHTML !== value) {
                                            tag = compatibility.getFirstTagFromHTML(value.replace(settings.regs.BODY_CLEAR, ''));
                                            if (settings.compatibility.CHILD_TO_PARENT[tag] !== void 0) {
                                                if (settings.compatibility.CHILD_TO_PARENT[tag] !== node.nodeName.toLowerCase()) {
                                                    _node = document.createElement(settings.compatibility.CHILD_TO_PARENT[tag]);
                                                    if (node.attributes !== void 0 && node.attributes !== null && node.attributes.length !== void 0) {
                                                        Array.prototype.forEach.call(node.attributes, function (attr) {
                                                            _node.setAttribute(attr.nodeName, attr.nodeValue);
                                                        });
                                                    }
                                                    _node.innerHTML = value;
                                                    node.parentNode.insertBefore(_node, node)
                                                    node.parentNode.removeChild(node);
                                                    node = _node;
                                                }
                                            }
                                        }
                                        return node;
                                    };
                                    return function (value) {
                                        if (typeof value.innerHTML === 'string') {
                                            node.parentNode.insertBefore(value, node);
                                            node.parentNode.removeChild(node);
                                            return true;
                                        }
                                        if (value instanceof settings.classes.RESULT) {
                                            value.nodes().forEach(function (_node) {
                                                node.parentNode.insertBefore(_node, node);
                                            });
                                            node.parentNode.removeChild(node);
                                            return true;
                                        }
                                        if (value.toString !== void 0 || typeof value === 'string') {
                                            node.innerHTML  = typeof value === 'string' ? value : value.toString();
                                            node            = verifyCompatibility(node, value);
                                            for (var index = node.childNodes.length - 1; index >= 0; index -= 1) {
                                                node.parentNode.insertBefore(node.childNodes[0], node);
                                            }
                                            node.parentNode.removeChild(node);
                                            return true;
                                        }
                                    };
                                },
                            },
                            process     : function () {
                                privates.hooks_html = convert.hooks.getFromHTML();
                                convert.hooks.wrap(privates.pattern);
                            },
                        },
                        model       : {
                            getFromHTML : function () {
                                var models = privates.html.match(settings.regs.MODEL);
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
                                    return models;
                                }
                                return null;
                            },
                            setAttrData : function(node, model_item){
                                var model = node.getAttribute(settings.css.attrs.MODEL_DATA);
                                model       = typeof model === 'string' ? (model !== '' ? JSON.parse(model) : []) : [];
                                model.push(model_item);
                                node.setAttribute(settings.css.attrs.MODEL_DATA, JSON.stringify(model));
                            },
                            find        : {
                                inStyles: function (node, style){
                                    var properties = style.split(';');
                                    properties.forEach(function (property) {
                                        var pair    = property.split(':'),
                                            model   = property.match(settings.regs.MODEL);
                                        if (pair.length > 1) {
                                            if (node.style[pair[0]] !== void 0) {
                                                model = property.match(settings.regs.MODEL);
                                                if (model instanceof Array && model.length === 1) {
                                                    model = model[0].replace(settings.regs.MODEL_BORDERS, '');
                                                    convert.model.setAttrData(node, {
                                                        style: pair[0],
                                                        model: model
                                                    });
                                                }
                                            }
                                        }
                                    });
                                },
                                inAttrs : function (node, model, reg_model) {
                                    var reg_model = reg_model instanceof RegExp ? reg_model : new RegExp(settings.regs.MODEL_OPEN + model + settings.regs.MODEL_CLOSE, 'gi');
                                    if (node.attributes) {
                                        Array.prototype.forEach.call(node.attributes, function (attr) {
                                            var defaultIEFix = null;
                                            if (typeof attr.nodeValue === 'string' && attr.nodeValue !== '') {
                                                if (helpers.testReg(reg_model, attr.nodeValue)) {
                                                    if (attr.nodeName === 'style') {
                                                        convert.model.find.inStyles(node, attr.nodeValue);
                                                    } else {
                                                        convert.model.setAttrData(node, {
                                                            attr    : attr.nodeName,
                                                            model   : model
                                                        });
                                                    }
                                                    node.removeAttribute(attr.nodeName);
                                                    if (node[attr.nodeName] !== void 0) {
                                                        node[attr.nodeName] = null;
                                                        //IE 11 fix
                                                        defaultIEFix = 'default' + attr.nodeName[0].toUpperCase() + attr.nodeName.substr(1, attr.nodeName.length - 1);
                                                        if (node[defaultIEFix] !== void 0) {
                                                            node[defaultIEFix] = '';
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    if (node.childNodes) {
                                        Array.prototype.forEach.call(node.childNodes, function (childNode) {
                                            convert.model.find.inAttrs(childNode, model, reg_model);
                                        });
                                    }
                                },
                                inHTML  : function (node, model, reg_model) {
                                    function validatePlaceHolder(node, model) {
                                        if (node.childNodes !== null && node.childNodes.length > 0) {
                                            Array.prototype.forEach.call(node.childNodes, function (child) {
                                                if (child.nodeType !== 3) {
                                                    if (child.className !== void 0 && child.className.indexOf(settings.css.classes.HOOK_WRAPPER) === -1) {
                                                        flex.logs.log(signature() + logs.pattern.MODEL_HOOK_NEEDS_WRAPPER + '(model hook: ' + model + ')', flex.logs.types.CRITICAL);
                                                        throw logs.pattern.MODEL_HOOK_NEEDS_WRAPPER;
                                                    } else if (child.className === void 0) {
                                                        flex.logs.log(signature() + logs.pattern.MODEL_HOOK_NEEDS_WRAPPER + '(model hook: ' + model + ')', flex.logs.types.CRITICAL);
                                                        throw logs.pattern.MODEL_HOOK_NEEDS_WRAPPER;
                                                    }
                                                }
                                            });
                                        }
                                    };
                                    var reg_model = reg_model instanceof RegExp ? reg_model : new RegExp(settings.regs.MODEL_OPEN + model + settings.regs.MODEL_CLOSE, 'gi');
                                    if (node.childNodes !== void 0) {
                                        if (node.childNodes.length > 0) {
                                            Array.prototype.forEach.call(node.childNodes, function (childNode) {
                                                if (typeof childNode.innerHTML === 'string') {
                                                    if (helpers.testReg(reg_model, childNode.innerHTML)) {
                                                        convert.model.find.inHTML(childNode, model, reg_model);
                                                    }
                                                } else if (typeof childNode.nodeValue === 'string') {
                                                    if (helpers.testReg(reg_model, childNode.nodeValue)) {
                                                        validatePlaceHolder(node, model);
                                                        convert.model.setAttrData(node, {
                                                            prop    : 'innerHTML',
                                                            model   : model
                                                        });
                                                        childNode.parentNode.removeChild(childNode);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            process     : function () {
                                var models_html = convert.model.getFromHTML();
                                if (models_html !== null) {
                                    models_html.forEach(function (model) {
                                        convert.model.find.inAttrs(privates.pattern, model);
                                        convert.model.find.inHTML(privates.pattern, model, null);
                                    });
                                }
                            }
                        },
                        conditions  : {
                            getName : function (str){
                                var condition = str.split('=');
                                if (condition.length === 2) {
                                    return {
                                        name    : condition[0],
                                        value   : condition[1]
                                    };
                                }
                                flex.logs.log(signature() + logs.pattern.WRONG_CONDITION_DEFINITION + ' (original comment: ' + str + ')', flex.logs.types.CRITICAL);
                                throw logs.pattern.WRONG_CONDITION_DEFINITION;
                            },
                            getNodes: function (condition_name, condition_node, parent) {
                                var inside_condition    = false,
                                    nodes               = [],
                                    included            = [],
                                    inside_included     = false;
                                try {
                                    Array.prototype.forEach.call(parent.childNodes, function (child) {
                                        var con_included = null;
                                        if (inside_condition) {
                                            if (child.nodeType === 8 && child.nodeValue === condition_name) {
                                                inside_condition = null;
                                                throw 'closed';
                                            } else {
                                                if (child.nodeType === 8 && helpers.testReg(settings.regs.CONDITION_STRUCTURE, child.nodeValue)) {
                                                    con_included = convert.conditions.getName(child.nodeValue).name;
                                                    if (included.indexOf(con_included) === -1) {
                                                        included.push(con_included);
                                                    }
                                                    inside_included = true;
                                                } else if (child.nodeType === 8 && included.indexOf(child.nodeValue) !== -1) {
                                                    inside_included = false;
                                                } else /*if (inside_included === false) */{
                                                    nodes.push(child);
                                                }
                                            }
                                        } else if (child === condition_node) {
                                            inside_condition = true;
                                        }
                                    });
                                } catch (e) {
                                    if (e !== 'closed') {
                                        flex.logs.log(signature() + logs.pattern.UNEXCEPTED_ERROR_CONDITION_PARSER + ' (condition name: ' + condition_name + ')', flex.logs.types.CRITICAL);
                                        throw logs.pattern.UNEXCEPTED_ERROR_CONDITION_PARSER;
                                    }
                                }
                                if (inside_condition === false) {
                                    flex.logs.log(signature() + logs.pattern.CANNOT_FIND_CONDITION_BEGINING + ' (condition name: ' + condition_name + ')', flex.logs.types.CRITICAL);
                                    throw logs.pattern.CANNOT_FIND_CONDITION_BEGINING;
                                }
                                if (inside_condition === true) {
                                    flex.logs.log(signature() + logs.pattern.CANNOT_FIND_CONDITION_END + ' (condition name: ' + condition_name + ')', flex.logs.types.CRITICAL);
                                    throw logs.pattern.CANNOT_FIND_CONDITION_END;
                                }
                                return {
                                    nodes       : nodes,
                                    included    : included
                                };
                            },
                            find    : function (node){
                                function search(node, conditions) {
                                    if (node.childNodes !== void 0) {
                                        Array.prototype.forEach.call(node.childNodes, function (node) {
                                            var condition   = null,
                                                found       = null;
                                            if (node.nodeType === 8) {
                                                if (helpers.testReg(settings.regs.CONDITION_STRUCTURE, node.nodeValue)) {
                                                    condition = convert.conditions.getName(node.nodeValue);
                                                    if (conditions[condition.name] === void 0) {
                                                        conditions[condition.name] = [];
                                                    }
                                                    found = convert.conditions.getNodes(condition.name, node, node.parentNode);
                                                    conditions[condition.name].push({
                                                        value       : condition.value,
                                                        comment     : node,
                                                        nodes       : found.nodes,
                                                        included    : found.included
                                                    });
                                                }
                                            } else if (node.childNodes !== void 0 && node.childNodes.length > 0) {
                                                search(node, conditions);
                                            }
                                        });
                                    }
                                };
                                function setupAppendMethod(conditions) {
                                    function add(comment) {
                                        if (_comments.indexOf(comment) === -1) {
                                            _comments.push(comment);
                                        }
                                    };
                                    function getAppend(node) {
                                        var _node   = node,
                                            result  = null,
                                            next    = null,
                                            in_con  = convert.conditions.getName(node.nodeValue).name;
                                        add(node);
                                        do {
                                            next = node.nextSibling !== void 0 ? node.nextSibling : null;
                                            if (next !== null) {
                                                if (next.nodeType === 8 && helpers.testReg(settings.regs.CONDITION_STRUCTURE, next.nodeValue)) {
                                                    in_con  = convert.conditions.getName(next.nodeValue).name;
                                                    node    = next;
                                                    add(next);
                                                } else if (in_con !== false && next.nodeType === 8 && next.nodeValue === in_con) {
                                                    in_con  = false;
                                                    node    = next;
                                                    add(next);
                                                } else if (!in_con && next.nodeType !== 8) {
                                                    if (next.nodeType === 3 && next.nodeValue.replace(/\s|\r|\n|\t/gi, '') === ''){
                                                        node = next;
                                                    } else {
                                                        _node   = node;
                                                        result  = function append(node) {
                                                            if (_node.parentNode !== null) {
                                                                if (_node.nextSibling !== null){
                                                                    _node.parentNode.insertBefore(node, _node.nextSibling);
                                                                } else {
                                                                    _node.parentNode.appendChild(node);
                                                                }
                                                                return true;
                                                            } else {
                                                                return false;
                                                            }
                                                        };
                                                    }
                                                } else {
                                                    node = next;
                                                }
                                            } else {
                                                _node   = _node.parentNode;
                                                result  = function append(node) {
                                                    _node.appendChild(node);
                                                    return true;
                                                };
                                            }
                                            
                                        } while (result === null);
                                        return result;
                                    };
                                    var _comments = [];
                                    _object(conditions).forEach(function (con_name, con_value) {
                                        if (con_value instanceof Array) {
                                            con_value.forEach(function (value, index) {
                                                conditions[con_name][index].append = getAppend(value.comment);
                                            });
                                        }
                                    });
                                    return _comments;
                                };
                                function removeComments(conditions, comments) {
                                    _object(conditions).forEach(function (con_name, con_value) {
                                        if (con_value instanceof Array) {
                                            con_value.forEach(function (value, index) {
                                                value.nodes.forEach(function (node) {
                                                    value.append(node);
                                                });
                                                conditions[con_name][index].comment = null;
                                                delete conditions[con_name][index].comment;
                                            });
                                        }
                                    });
                                    comments.forEach(function (comment) {
                                        if (comment.parentNode !== null) {
                                            comment.parentNode.removeChild(comment);
                                        }
                                    });
                                };
                                var conditions  = {},
                                    _comments   = null;
                                search(node, conditions);
                                _comments = setupAppendMethod(conditions);
                                removeComments(conditions, _comments);
                                return conditions;
                            },
                            process : function (clone, _conditions) {
                                var conditions      = convert.conditions.find(clone),
                                    conditions_dom  = {};
                                _object(_conditions).forEach(function (con_name, con_value) {
                                    var found_flag  = false;
                                    if (conditions[con_name] !== void 0) {
                                        conditions_dom[con_name] = {};
                                        conditions[con_name].forEach(function (condition) {
                                            conditions_dom[con_name][condition.value] = conditions_dom[con_name][condition.value] === void 0 ? [] : conditions_dom[con_name][condition.value];
                                            conditions_dom[con_name][condition.value] = (function (_append, _nodes, _included) {
                                                var methods = {
                                                    append      : function append() {
                                                        var to_delete = [];
                                                        _nodes.forEach(function (node, index) {
                                                            if (node.__to_deleted === void 0) {
                                                                _append(node);
                                                            } else {
                                                                to_delete.push(index);
                                                            }
                                                        });
                                                        if (to_delete.length > 0) {
                                                            _nodes = _nodes.filter(function (val, index) {
                                                                return to_delete.indexOf(index) !== -1 ? false : true;
                                                            });
                                                        }
                                                    },
                                                    remove      : function remove() {
                                                        var to_delete = [];
                                                        _nodes.forEach(function (node, index) {
                                                            if (node.parentNode !== null) {
                                                                return node.parentNode.removeChild(node);
                                                            }
                                                            if (node.__to_deleted !== void 0) {
                                                                to_delete.push(index);
                                                            }
                                                        });
                                                        if (to_delete.length > 0) {
                                                            _nodes = _nodes.filter(function (val, index) {
                                                                return to_delete.indexOf(index) !== -1 ? false : true;
                                                            });
                                                        }
                                                    },
                                                    del         : function del() {
                                                        _nodes.forEach(function (node) {
                                                            node.__to_deleted = true;
                                                        });
                                                    },
                                                    included    : _included
                                                };
                                                methods.append.blocked = false;
                                                methods.remove.blocked = false;
                                                return methods;
                                            }(condition.append, condition.nodes, condition.included));
                                            condition.nodes.forEach(function (node) {
                                                if (condition.value !== con_value) {
                                                    if (node.parentNode !== null) {
                                                        node.parentNode.removeChild(node);
                                                    }
                                                } else {
                                                    found_flag = true;
                                                }
                                            });
                                        });
                                        conditions_dom[con_name].__update   = (function (values) {
                                            return function update(res) {
                                                _object(values).forEach(function (name, methods) {
                                                    if (methods.append !== void 0 && methods.remove !== void 0) {
                                                        if (!methods.append.blocked && !methods.remove.blocked) {
                                                            if (res === name) {
                                                                methods.append();
                                                            } else {
                                                                methods.remove();
                                                            }
                                                        }
                                                    }
                                                });
                                            };
                                        }(conditions_dom[con_name]));
                                        conditions_dom[con_name].__block    = (function (values) {
                                            return function block(res) {
                                                _object(values).forEach(function (name, methods) {
                                                    if (methods.append !== void 0 && methods.remove !== void 0) {
                                                        methods.append.blocked = true;
                                                        methods.remove.blocked = true;
                                                    }
                                                });
                                            };
                                        }(conditions_dom[con_name]));
                                        conditions_dom[con_name].__unblock  = (function (values) {
                                            return function unblock(res) {
                                                _object(values).forEach(function (name, methods) {
                                                    if (methods.append !== void 0 && methods.remove !== void 0) {
                                                        methods.append.blocked = false;
                                                        methods.remove.blocked = false;
                                                    }
                                                });
                                            };
                                        }(conditions_dom[con_name]));
                                        conditions_dom[con_name].__included = (function (values) {
                                            var included = [];
                                            _object(values).forEach(function (name, methods) {
                                                if (methods.included !== void 0) {
                                                    included = included.concat(methods.included);
                                                }
                                            });
                                            return included;
                                        }(conditions_dom[con_name]));
                                        if (!found_flag) {
                                            flex.logs.log(signature() + logs.pattern.CANNOT_FIND_CONDITION_VALUE + ' (condition name: ' + con_name + ' = "' + con_value + '")', flex.logs.types.WARNING);
                                        }
                                    } else {
                                        flex.logs.log(signature() + logs.pattern.CANNOT_FIND_CONDITION_NODES + ' (condition name: ' + con_name + ')', flex.logs.types.WARNING);
                                    }
                                });
                                return Object.keys(conditions_dom).length > 0 ? conditions_dom : null;
                            }
                        },
                        marks       : {
                            getFromHTML : function (type) {
                                var marks   = null,
                                    _marks  = [];
                                if (settings.regs[type] !== void 0) {
                                    marks = privates.html.match(settings.regs[type]);
                                    if (marks instanceof Array) {
                                        marks = (function (marks) {
                                            var history = {};
                                            return marks.filter(function (mark) {
                                                if (history[mark] === void 0) {
                                                    history[mark] = true;
                                                    return true;
                                                } else {
                                                    return false;
                                                }
                                            });
                                        }(marks));
                                        marks.forEach(function (mark, index) {
                                            var _mark = mark.replace(new RegExp(settings.regs[type + '_OPEN'], 'gi'), '')
                                                                    .replace(new RegExp(settings.regs[type + '_CLOSE'], 'gi'), '');
                                            privates.html = privates.html.replace(
                                                new RegExp(settings.regs[type + '_OPEN'] + _mark.replace(/\./gi, '\\.') + settings.regs[type + '_CLOSE'], 'gi'),
                                                ' ' + settings.css.attrs[type + '_MARK'] + '="' + _mark + '" ');
                                            _mark = _mark.split(',');
                                            _mark.forEach(function (mark) {
                                                mark = mark.replace(/\s/gi);
                                                if (_marks.indexOf(mark) === -1) {
                                                    _marks.push(mark);
                                                }
                                            });
                                        });
                                    }
                                }
                                return _marks;
                            },
                            getFromDOM  : function (clone, type) {
                                var marks = {};
                                if (privates[type.toLowerCase()] instanceof Array) {
                                    privates[type.toLowerCase()].forEach(function (mark) {
                                        marks[mark] = _nodes('*[' + settings.css.attrs[type + '_MARK'] + '*="' + mark + '"]', false, clone);
                                        if (marks[mark].target !== null && marks[mark].target.length > 0) {
                                            marks[mark] = marks[mark].target;
                                        }
                                    });
                                    _object(marks).forEach(function (name, nodes) {
                                        if (marks[name] !== null) {
                                            switch (type) {
                                                case settings.marks.DOM:
                                                    marks[name] = nodes;
                                                    break;
                                            }
                                            Array.prototype.forEach.call(nodes, function (node, number) {
                                                node.removeAttribute(settings.css.attrs[type + '_MARK']);
                                            });
                                        }
                                    });
                                }
                                return marks;
                            },
                            process     : function () {
                                [settings.marks.DOM].forEach(function (type) {
                                    privates[type.toLowerCase()] = convert.marks.getFromHTML(type);
                                });
                            }
                        },
                        process     : function () {
                            privates.pattern = compatibility.getParent(compatibility.getFirstTagFromHTML(privates.html));
                            if (privates.pattern !== null) {
                                convert.marks.      process();
                                privates.pattern.innerHTML = privates.html;
                                convert.hooks.      process();
                                convert.model.      process();
                                return true;
                                /*
                                if (privates.pattern.innerHTML.replace(settings.regs.NOT_WORDS_NUMBERS, '') === privates.html.replace(settings.regs.NOT_WORDS_NUMBERS, '')) {
                                    convert.hooks.process();
                                    convert.model.process();
                                    return true;
                                } else {
                                    flex.logs.log(signature() + logs.pattern.WRONG_PATTERN_WRAPPER, flex.logs.types.CRITICAL);
                                    throw logs.pattern.WRONG_PATTERN_WRAPPER;
                                }
                                */
                            } else {
                                flex.logs.log(signature() + logs.pattern.CANNOT_CREATE_WRAPPER, flex.logs.types.CRITICAL);
                                throw logs.pattern.CANNOT_CREATE_WRAPPER;
                            }
                            return false;
                        }
                    };
                    compatibility   = {
                        getParent           : function (child_tag) {
                            if (typeof child_tag === 'string') {
                                if (settings.compatibility.CHILD_TO_PARENT[child_tag] !== void 0) {
                                    return document.createElement(settings.compatibility.CHILD_TO_PARENT[child_tag]);
                                } else {
                                    return document.createElement(settings.compatibility.BASE);
                                }
                            } else {
                                return null;
                            }
                        },
                        getFirstTagFromHTML : function (html) {
                            var tag = html.match(settings.regs.FIRST_TAG);
                            if (tag !== null) {
                                if (tag.length === 1) {
                                    return tag[0].replace(settings.regs.TAG_BORDERS, '').match(settings.regs.FIRST_WORD)[0].toLowerCase()
                                }
                            }
                            flex.logs.log(signature() + logs.pattern.CANNOT_FIND_FIRST_TAG + '(Probably hook has symbol of caret inside (\\n, \\r))', flex.logs.types.NOTIFICATION);
                            return null;
                        }
                    };
                    clone           = function (condition_values) {
                        var hook_setters    = {},
                            clone           = privates.pattern.cloneNode(true),
                            conditions      = null;
                        privates.hooks_html.forEach(function (hook) {
                            var _hooks = [];
                            convert.hooks.setters.inAttributes  (clone, hook, _hooks);
                            convert.hooks.setters.inNodes       (clone, hook, _hooks);
                            hook_setters[hook] = (function (_hooks) {
                                return function (value) {
                                    _hooks.forEach(function (_hook) {
                                        _hook(value);
                                    });
                                };
                            }(_hooks));
                        });
                        return {
                            clone           : clone,
                            setters         : hook_setters,
                            dom             : convert.marks.getFromDOM(clone, settings.marks.DOM),
                            applyConditions : function(){
                                var conditions_dom  = null;
                                if (condition_values !== void 0 && condition_values !== null) {
                                    conditions_dom = convert.conditions.process(clone, condition_values);
                                }
                                return conditions_dom;
                            }
                        };
                    };
                    signature       = function () {
                        return logs.SIGNATURE + ':: pattern (' + self.url + ')';
                    };
                    returning       = {
                        build   : convert.process,
                        clone   : clone
                    };
                    return {
                        build   : returning.build,
                        pattern : returning.clone
                    };
                },
                instance    : function (parameters) {
                    if (flex.oop.objects.validate(parameters, [ { name: 'url',  type: 'string'  },
                                                                { name: 'html', type: 'string'  }]) !== false) {
                        return _object({
                            parent          : settings.classes.PATTERN,
                            constr          : function () {
                                this.url    = flex.system.url.restore(parameters.url);
                            },
                            privates        : {
                                html                : parameters.html,
                                pattern             : null,
                                hooks_html          : null,
                                dom                 : null
                            },
                            prototype       : pattern.proto
                        }).createInstanceClass();
                    } else {
                        return null;
                    }
                },
                storage     : {
                    add: function (url, instance) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PATTERNS, {});
                        if (storage[url] === void 0) {
                            storage[url] = instance;
                        }
                    },
                    get: function (url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PATTERNS, {});
                        return storage[url] !== void 0 ? storage[url] : null;
                    },
                },
                init        : function (url, html) {
                    var _instance = pattern.storage.get(url);
                    if (_instance !== null) {
                        return _instance;
                    } else {
                        _instance = pattern.instance({ url: url, html: html });
                        if (_instance.build() !== false) {
                            instance.init(url, _instance.pattern)
                            pattern.storage.add(url, _instance);
                            return _instance;
                        }
                    }
                    return null;
                }
            };
            //END: pattern class ===============================================
            //BEGIN: instance class ===============================================
            instance    = {
                proto   : function(privates){
                    var self        = this,         
                        privates    = privates,
                        map         = null,
                        hooks       = null,
                        model       = null,
                        dom         = null,
                        methods     = null,
                        controller  = null,
                        cloning     = null,
                        condition   = null,
                        returning   = null;
                    cloning     = {
                        update          : function (_hooks, conditions) {
                            var _hooks  = _hooks instanceof Array ? _hooks[0] : _hooks,
                                map     = {};
                            _object(_hooks).forEach(function (hook_name, hook_value) {
                                if (hook_value instanceof settings.classes.RESULT) {
                                    map['__' + hook_name + '__'] = hook_value.url;
                                } else {
                                    map[hook_name] = true;
                                }
                                map['__conditions__'] = conditions;
                            });
                            return map;
                        },
                        convertHooks    : function(hooks_map, hooks){
                            var _hooks  = [],
                                hooks   = hooks instanceof Array ? hooks : [hooks];
                            hooks.forEach(function (_item) {
                                var item = {};
                                _object(_item).forEach(function (hook_name, hook_value) {
                                    if (hooks_map[hook_name] !== void 0) {
                                        if (typeof hooks_map[hook_name] === 'boolean' && hooks_map[hook_name] === true) {
                                            item[hook_name] = hook_value;
                                        } else if (typeof hooks_map[hook_name] === 'object' && hooks_map['__' + hook_name + '__'] !== void 0 && typeof hook_value === 'object' && hook_value !== null) {
                                            item[hook_name] = caller.instance({
                                                url         : hooks_map['__' + hook_name + '__'],
                                                conditions  : hooks_map[hook_name]['__conditions__'],
                                                hooks       : cloning.convertHooks(hooks_map[hook_name], hook_value)
                                            });
                                        } else {
                                            flex.logs.log(logs.instance.NO_URL_FOR_CLONE_HOOK + '(' + self.url + ')', flex.logs.types.WARNING);
                                        }
                                    } else {
                                        flex.logs.log(logs.instance.BAD_HOOK_FOR_CLONE + '(' + self.url + ')', flex.logs.types.CRITICAL);
                                        throw logs.instance.BAD_HOOK_FOR_CLONE;
                                    }
                                });
                                _hooks.push(item);
                            });
                            return _hooks;
                        },
                        clone           : function (hooks_map, hooks) {
                            var _hooks = cloning.convertHooks(hooks_map, hooks),
                                result = null;
                            if (_hooks.length > 0) {
                                result = caller.instance({
                                    url     : self.url,
                                    hooks   : _hooks
                                }).render(true);
                                return result instanceof settings.classes.RESULT ? result.nodes() : null;
                            }
                        }
                    };
                    hooks       = {
                        build       : function (_hooks) {
                            if (_hooks instanceof Array) {
                                _hooks.forEach(function (_, index) {
                                    _hooks[index] = hooks.build(_hooks[index]);
                                });
                            } else {
                                if (_hooks !== null) {
                                    _object(_hooks).forEach(function (hook_name, hook_value) {
                                        if (typeof hook_value === 'function') {
                                            _hooks[hook_name] = hook_value();
                                        } else if (typeof hook_value === 'object' && hook_value !== null) {
                                            hooks.convertObj(hook_value, _hooks, hook_name);
                                            delete _hooks[hook_name];
                                        }
                                    });
                                }
                            }
                            return _hooks;
                        },
                        apply       : function (hooks, hook_setters, hooks_map) {
                            if (hooks !== null) {
                                _object(hook_setters).forEach(function (key, hook_setter) {
                                    var value = null;
                                    if (hooks[key] !== void 0) {
                                        if (hooks[key] instanceof settings.classes.RESULT) {
                                            map.        current[key]                        = hooks[key].map();
                                            model.      current.model   ['__' + key + '__'] = hooks[key].model();
                                            model.      current.binds   ['__' + key + '__'] = hooks[key].binds();
                                            dom.        current         ['__' + key + '__'] = hooks[key].dom();
                                            hooks_map[key]                                  = hooks[key].hooks_map()
                                        }
                                        hook_setter(hooks[key]);
                                    } else {
                                        hook_setter('');
                                    }
                                });
                            }
                        },
                        convertObj  : function (hook_obj, _hooks, parent) {
                            _object(hook_obj).forEach(function (key, value) {
                                var path = parent + '.' + key;
                                if (typeof value === 'object' && value !== null) {
                                    hooks.convertObj(value, _hooks, path);
                                } else {
                                    _hooks[path] = value;
                                }
                            });
                        }
                    };
                    map         = {
                        current     : {},
                        map         : {},
                        update      : function (clone) {
                            var iteration = {
                                __context: clone.childNodes.length > 0 ? clone.childNodes[0] : null
                            };
                            if (typeof map.current === 'object' && map.current !== null) {
                                _object(map.current).forEach(function (name, value) {
                                    iteration[name] = value;
                                });
                            }
                            if (map.map === null) {
                                map.map = {};
                            } else if (typeof map.map === 'object' && !(map.map instanceof Array)) {
                                map.map = [map.map];
                            }
                            if (map.map instanceof Array) {
                                map.map.push(iteration);
                            } else {
                                map.map = iteration;
                            }
                        },
                        reset       : function(){
                            map.map = null;
                        },
                        iteration   : function () {
                            map.current = {};
                        },
                        collapse    : function () {
                            function convert(source) {
                                var storage = null;
                                if (source instanceof Array) {
                                    storage = [];
                                    source.forEach(function (value) {
                                        storage.push(convert(value));
                                    });
                                } else {
                                    storage = {};
                                    if (source.__context !== void 0) {
                                        storage.__context = instance.map.create(source.__context.parentNode);
                                    }
                                    _object(source).forEach(function (name, value) {
                                        if (name !== '__context') {
                                            if (typeof value === 'object' || value instanceof Array) {
                                                storage[name] = convert(value);
                                            }
                                        }
                                    });
                                }
                                return storage;
                            };
                            return convert(map.map);
                        }
                    };
                    model       = {
                        current     : null,
                        model       : null,
                        binds       : null,
                        map         : function (clone) {
                            var model_nodes = _nodes('*[' + settings.css.attrs.MODEL_DATA + ']', false, clone).target;
                            if (model_nodes.length > 0) {
                                Array.prototype.forEach.call(model_nodes, function (model_node) {
                                    var models = JSON.parse(model_node.getAttribute(settings.css.attrs.MODEL_DATA));
                                    if (models instanceof Array) {
                                        models.forEach(function (_model) {
                                            if (model.current.binds[_model.model] === void 0) {
                                                model.current.binds[_model.model] = [];
                                            }
                                            model.current.binds[_model.model].push({
                                                node    : model_node,
                                                attr    : _model.attr   === void 0 ? null : _model.attr,
                                                prop    : _model.prop   === void 0 ? null : _model.prop,
                                                style   : _model.style  === void 0 ? null : _model.style,
                                            });
                                        });
                                    }
                                });
                            }
                            return model.current.binds;
                        },
                        update      : function (clone) {
                            function bind(group, binds) {
                                function correctStyle(prop) {
                                    var result = '';
                                    prop.split('-').forEach(function (part, index) {
                                        if (index > 0) {
                                            part = String.prototype.toUpperCase.apply(part.charAt(0)) + part.substr(1, part.length - 1);
                                        }
                                        result += part;
                                    });
                                    return result;
                                };
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
                                    if (node.style !== null) {
                                        (function (binds, key, node, prop, handles) {
                                            _node(node).bindingProps().bind('style.' + prop, function (prop, current, previous) {
                                                if (binds[key] !== current) {
                                                    binds[key] = current;
                                                    executeHandles(handles, this, prop, current);
                                                }
                                            });
                                        }(binds, key, node.node, correctStyle(node.style), group[key].handles));
                                    }
                                    if (helpers.binds.isPossible(node.node, prop)) {
                                        (function (binds, key, node, attr_name, handles) {
                                            helpers.binds.assing(node, prop, function (event, getter, setter) {
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
                                            binds[key] = node.getAttribute(attr_name);
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
                                    } 
                                    if (node.style !== null) {
                                        (function (binds, key, node, prop, handles) {
                                            binds[key] = node.style[prop];
                                            _object(binds).binding().bind(key, function (current, previous) {
                                                if (node.style[prop] !== current) {
                                                    node.style[prop] = current;
                                                    executeHandles(handles, node.style, prop, current);
                                                }
                                            });
                                        }(binds, key, node.node, correctStyle(node.style), group[key].handles));
                                    }
                                    if (node.prop !== null) {
                                        if (node.node[prop] !== void 0) {
                                            (function (binds, key, node, prop, handles) {
                                                binds[key] = node[prop];
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
                                if (group !== null) {
                                    _object(group).forEach(function (key, nodes) {
                                        if (!helpers.testReg(settings.regs.GROUP_PROPERTY, key)) {
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
                                                    handle.id = flex.unique();
                                                    this.handles.push(handle);
                                                    return handle.id;
                                                },
                                                removeHandle: function (id) {
                                                    var index = -1;
                                                    this.handles.forEach(function (handle, _index) {
                                                        if (handle.id === id) {
                                                            index = _index;
                                                        }
                                                    });
                                                    if (index !== -1) {
                                                        this.handles.splice(index, 1);
                                                    }
                                                },
                                                handles     : group[key].handles
                                            };
                                            group[key].addHandle.   bind(group[key]);
                                            group[key].removeHandle.bind(group[key]);
                                        }
                                    });
                                }
                            };
                            model.map(clone);
                            bind(model.current.binds, model.current.model);
                            if (model.model === null) {
                                model.model = {};
                            } else if (typeof model.model === 'object' && !(model.model instanceof Array)) {
                                model.model = [model.model];
                            }
                            if (model.model instanceof Array) {
                                model.model.push(model.current.model);
                            } else {
                                model.model = model.current.model;
                            }
                            if (model.binds === null) {
                                model.binds = {};
                            } else if (typeof model.binds === 'object' && !(model.binds instanceof Array)) {
                                model.binds = [model.binds];
                            }
                            if (model.binds instanceof Array) {
                                model.binds.push(model.current.binds);
                            } else {
                                model.binds = model.current.binds;
                            }
                        },
                        clear       : function (clone) {
                            var model_nodes = _nodes('*[' + settings.css.attrs.MODEL_DATA + ']', false, clone).target;
                            if (model_nodes.length > 0) {
                                Array.prototype.forEach.call(model_nodes, function (model_node) {
                                    model_node.removeAttribute(settings.css.attrs.MODEL_DATA);
                                });
                            }
                        },
                        reset       : function (){
                            model.model = null;
                            model.binds = null;
                        },
                        iteration   : function () {
                            model.current = {
                                model: {},
                                binds: {}
                            };
                        },
                        getLast     : function () {
                            var last = {
                                model : model.model instanceof Array ? model.model[model.model.length - 1] : model.model,
                                binds : model.binds instanceof Array ? model.binds[model.binds.length - 1] : model.binds
                            };
                            return last;
                        }
                    };
                    dom         = {
                        current     : null,
                        dom         : null,
                        update      : function (_dom) {
                            if (Object.keys(dom.current).length > 0) {
                                _object(dom.current).forEach(function (key, value) {
                                    _dom[key] = value;
                                });
                            }
                            if (dom.dom === null) {
                                dom.dom = {};
                            } else if (typeof dom.dom === 'object' && !(dom.dom instanceof Array)) {
                                dom.dom = [dom.dom];
                            }
                            if (dom.dom instanceof Array) {
                                dom.dom.push(_dom);
                            } else {
                                dom.dom = _dom;
                            }
                        },
                        reset       : function(){
                            dom.dom = null;
                        },
                        iteration   : function () {
                            dom.current = {};
                        },
                        collapse    : function () {
                            function process(source, storage, indexes) {
                                function addIndexes(nodes, indexes) {
                                    function toNodeList(nodeList, indexes) {
                                        Array.prototype.forEach.call(nodeList, function (node, index) {
                                            var __indexes = nodeList.length > 1 ? indexes.concat([index]) : indexes;
                                            if (node[settings.other.INDEXES] === void 0 || node[settings.other.INDEXES].length < __indexes.length) {
                                                node[settings.other.INDEXES] = nodeList.length > 1 ? indexes.concat([index]) : indexes;
                                            }
                                        });
                                    };
                                    if (nodes instanceof NodeList) {
                                        toNodeList(nodes, indexes);
                                    } else if (nodes instanceof instance.nodeList.NODE_LIST) {
                                        nodes.collections.forEach(function (collection) {
                                            toNodeList(collection, indexes);
                                        });
                                    }
                                };
                                function getFromArray(source, storage, indexes) {
                                    var names       = [],
                                        sub_objs    = [];
                                    if (source.length > 0 && typeof source[0] === 'object' && source[0] !== null) {
                                        _object(source[0]).forEach(function (name) {
                                            names.push(name);
                                        });
                                        names.forEach(function (name) {
                                            storage[name] = [];
                                            source.forEach(function (value, index) {
                                                if (value[name] instanceof NodeList || value[name] instanceof instance.nodeList.NODE_LIST) {
                                                    storage[name].push(value[name]);
                                                    addIndexes(value[name], indexes.concat([index]));
                                                } else if (value[name] instanceof Array) {
                                                    storage[name].push({});
                                                    getFromArray(value[name], storage[name][storage[name].length - 1], indexes.concat([index]));
                                                    if (sub_objs.indexOf(name) === -1) {
                                                        sub_objs.push(name);
                                                    }
                                                } else if (typeof value[name] === 'object' && value[name] !== null && !(value[name] instanceof instance.nodeList.NODE_LIST)) {
                                                    storage[name].push(value[name]);
                                                    if (sub_objs.indexOf(name) === -1) {
                                                        sub_objs.push(name);
                                                    }
                                                }
                                            });
                                        });
                                        sub_objs.forEach(function (name) {
                                            var source = storage[name];
                                            storage[name] = {};
                                            getFromArray(source, storage[name], indexes);
                                        });
                                        _object(storage).forEach(function (name, value) {
                                            var collection = instance.nodeList.create();
                                            if (value instanceof Array) {
                                                value.forEach(function (nodeList) {
                                                    collection.add(nodeList);
                                                });
                                                storage[name] = collection;
                                            }
                                        });
                                        return storage[name];
                                    }
                                };
                                _object(source).forEach(function (name, value) {
                                    if (value instanceof Array) {
                                        storage[name] = {};
                                        getFromArray(value, storage[name], indexes);
                                    } else if (value instanceof NodeList) {
                                        addIndexes(value, indexes);
                                        storage[name] = instance.nodeList.create(value);
                                    } else if (typeof value === 'object') {
                                        storage[name] = {};
                                        process(value, storage[name], indexes);
                                    }
                                });
                            };
                            function wrap(source) {
                                var result = null;
                                if (source instanceof Array) {
                                    result = [];
                                    source.forEach(function (item) {
                                        result.push(wrap(item));
                                    });
                                } else if (source instanceof NodeList) {
                                    result = instance.nodeList.create(source);
                                } else if (typeof source === 'object' && source !== null && !(source instanceof instance.nodeList.NODE_LIST)) {
                                    result = {};
                                    _object(source).forEach(function (name, value) {
                                        result[name] = wrap(value);
                                    });
                                }
                                return result;
                            };
                            var _dom = {};
                            if (dom.dom !== null) {
                                process(dom.dom, _dom, []);
                            }
                            return {
                                listed  : wrap(dom.dom),
                                grouped: _dom
                            };
                        }
                    };
                    condition   = {
                        get         : function (_hooks, _conditions) {
                            var result = {};
                            if (_conditions !== null) {
                                _object(_conditions).forEach(function (name, handle) {
                                    result[name] = handle(_hooks);
                                });
                            }
                            return Object.keys(result).length > 0 ? result : null;
                        },
                        setDefault  : function (_conditions) {
                            var defaults = conditions.storage.get(self.url);
                            if (typeof defaults === 'object' && defaults !== null) {
                                if (typeof _conditions !== 'object' || _conditions === null) {
                                    _conditions = {};
                                }
                                _object(defaults).forEach(function (name, value) {
                                    if (_conditions[name] === void 0) {
                                        _conditions[name] = value;
                                    }
                                });
                                _conditions = Object.keys(_conditions).length > 0 ? _conditions : null;
                            }
                            return _conditions;
                        },
                        tracking    : function (_conditions, conditions_dom, _hooks) {
                            var handles = [];
                            if (typeof _conditions === 'object' && _conditions !== null) {
                                _object(_conditions).forEach(function (con_name, con_value) {
                                    if (typeof con_value === 'function') {
                                        if (con_value.tracking !== void 0 && conditions_dom[con_name] !== void 0) {
                                            con_value.tracking = con_value.tracking instanceof Array ? con_value.tracking : [con_value.tracking];
                                            con_value.tracking.forEach(function (tracked) {
                                                var data    = {},
                                                    _model  = model.getLast(),
                                                    handle  = null;
                                                if (_model.binds[tracked] !== void 0) {
                                                    if (typeof _model.binds[tracked].addHandle === 'function') {
                                                        _object(_hooks).forEach(function (hook_name, hook_value) {
                                                            if (_model.model[hook_name] !== void 0) {
                                                                data[hook_name] = function getModelValue() { return _model.model[hook_name]; };
                                                            } else {
                                                                data[hook_name] = hook_value;
                                                            }
                                                        });
                                                        handle = (function (_conditions, con_name, _data, conditions_dom) {
                                                            return function trackingHandle() {
                                                                var data    = {},
                                                                    result  = null;
                                                                _object(_data).forEach(function (data_name, data_value) {
                                                                    data[data_name] = typeof data_value === 'function' ? data_value() : data_value;
                                                                });
                                                                result = _conditions[con_name](data);
                                                                if (conditions_dom[con_name][result] !== void 0) {
                                                                    if (conditions_dom[con_name].__included.length > 0) {
                                                                        conditions_dom[con_name].__included.forEach(function (con_name) {
                                                                            if (typeof _conditions[con_name] === 'function' && conditions_dom[con_name] !== void 0) {
                                                                                if (_conditions[con_name].tracking !== void 0) {
                                                                                    conditions_dom[con_name].__unblock();
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                    conditions_dom[con_name].__update(result);
                                                                    if (conditions_dom[con_name][result].included.length > 0) {
                                                                        conditions_dom[con_name][result].included.forEach(function (con_name) {
                                                                            var res = null;
                                                                            if (typeof _conditions[con_name] === 'function' && conditions_dom[con_name] !== void 0) {
                                                                                if (_conditions[con_name].tracking !== void 0) {
                                                                                    res = _conditions[con_name](data);
                                                                                    conditions_dom[con_name].__update(res);
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                    if (conditions_dom[con_name].__included.length > 0) {
                                                                        conditions_dom[con_name].__included.forEach(function (con_name) {
                                                                            if (typeof _conditions[con_name] === 'function' && conditions_dom[con_name] !== void 0) {
                                                                                if (_conditions[con_name].tracking !== void 0) {
                                                                                    conditions_dom[con_name].__block();
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            };
                                                        }(_conditions, con_name, data, conditions_dom));
                                                        _model.binds[tracked].addHandle(handle);
                                                        handles.push(handle);
                                                    }
                                                }
                                            });
                                        } else {
                                            var result = con_value(_hooks);
                                            if (conditions_dom[con_name] !== void 0) {
                                                _object(conditions_dom[con_name]).forEach(function (res, methods) {
                                                    if (res !== result && methods.del !== void 0) {
                                                        methods.del();
                                                        conditions_dom[con_name][res] = null;
                                                        delete conditions_dom[con_name][res];
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                                handles.forEach(function (handle) {
                                    handle();
                                });
                            }
                        }
                    };
                    controller  = {
                        apply       : function (_instance, _resources) {
                            var _controllers = controllers.storage.get(self.url);
                            if (_controllers !== null) {
                                _controllers.forEach(function (controller) {
                                    methods.handle(controller, _instance, _resources);
                                });
                            }
                        },
                    };
                    methods     = {
                        build       : function (_hooks, _resources, _conditions) {
                            var nodes           = [],
                                _map            = [],
                                _binds          = [],
                                clone           = null,
                                hooks_map       = null,
                                _instance       = null,
                                _conditions     = condition.setDefault(_conditions);
                            if (_hooks !== null) {
                                map.        reset();
                                model.      reset();
                                dom.        reset();
                                _hooks      = hooks.build(_hooks);
                                hooks_map   = cloning.update(_hooks, _conditions);
                                _hooks      = _hooks instanceof Array ? _hooks : [_hooks];
                                _hooks.forEach(function (_hooks) {
                                    var conditions_dom = null;
                                    clone           = privates.pattern(condition.get(_hooks, _conditions), _conditions);
                                    map.        iteration();
                                    model.      iteration();
                                    dom.        iteration();
                                    hooks.      apply(_hooks, clone.setters, hooks_map);
                                    map.        update(clone.clone);
                                    model.      update(clone.clone);
                                    model.      clear(clone.clone);
                                    dom.        update(clone.dom);
                                    nodes           = nodes.concat(Array.prototype.filter.call(clone.clone.childNodes, function () { return true; }));
                                    conditions_dom  = clone.applyConditions();
                                    condition.tracking(_conditions, conditions_dom, _hooks);
                                });
                            }
                            _instance = result.instance({
                                url             : self.url,
                                nodes           : nodes,
                                map             : map.map,
                                model           : model.model,
                                binds           : model.binds,
                                dom             : dom.dom,
                                hooks_map       : hooks_map,
                                instance        : privates.__instance,
                                handle          : function (handle, _resources) { return methods.handle(handle, _instance, _resources); }
                            });
                            controller.apply(_instance, _resources);
                            return _instance;
                        },
                        handle      : function (handle, _instance, _resources) {
                            if (typeof handle === 'function') {
                                handle.call(_instance, {
                                    model       : model.model,
                                    binds       : model.binds,
                                    map         : map.collapse(),
                                    dom         : dom.collapse(),
                                    resources   : _resources,
                                });
                            }
                        },
                        bind        : function (hooks, resources, conditions) {
                            return function () {
                                return methods.build(hooks, resources, conditions);
                            };
                        }
                    };
                    returning   = {
                        build       : methods.build,
                        handle      : methods.handle,
                        controllers : {
                            apply   : controller.apply
                        },
                        bind        : methods.bind,
                        clone       : cloning.clone
                    };
                    return {
                        build       : returning.build,
                        handle      : returning.handle,
                        controllers : {
                            apply   : returning.controllers.apply
                        },
                        bind        : returning.bind,
                        clone       : returning.clone
                    };
                },
                instance: function (parameters) {
                    if (flex.oop.objects.validate(parameters, [ { name: 'url',                  type: 'string'      },
                                                                { name: 'pattern',              type: 'function'    }]) !== false) {
                        return _object({
                            parent          : settings.classes.INSTANCE,
                            constr          : function () {
                                this.url    = flex.system.url.restore(parameters.url);
                            },
                            privates        : {
                                //From parameters
                                pattern         : parameters.pattern,
                            },
                            prototype       : instance.proto
                        }).createInstanceClass();
                    } else {
                        return null;
                    }
                },
                storage : {
                    add: function (url, instance) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PATTERNS, {});
                        if (storage[url] === void 0) {
                            storage[url] = instance;
                        }
                    },
                    get: function (url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PATTERNS, {});
                        return storage[url] !== void 0 ? storage[url] : null;
                    },
                },
                init    : function (url, pattern) {
                    var _instance = instance.storage.get(url);
                    if (_instance === null && pattern !== void 0) {
                        _instance = instance.instance({ url: url, pattern: pattern });
                        instance.storage.add(url, _instance);
                    }
                    return _instance;
                },
                nodeList: {
                    NODE_LIST   : function(nodeList){
                        if (nodeList instanceof NodeList) {
                            this.collections = [nodeList];
                        } else if (helpers.isNode(nodeList)) {
                            this.collections = [[nodeList]];
                        } else {
                            this.collections = [];
                        }
                    },
                    init        : function () {
                        instance.nodeList.NODE_LIST.prototype = {
                            add         : function (nodeList) {
                                if (nodeList instanceof NodeList) {
                                    this.collections.push(nodeList);
                                } else if (nodeList instanceof instance.nodeList.NODE_LIST) {
                                    this.collections = this.collections.concat(nodeList.collections);
                                } else if (helpers.isNode(nodeList)) {
                                    this.collections.push([nodeList]);
                                }
                            },
                            css         : function (css) {
                                var self = this;
                                if (typeof css === 'object' && css !== null) {
                                    _object(css).forEach(function (name, value) {
                                        self.collections.forEach(function (nodeList) {
                                            Array.prototype.forEach.call(nodeList, function (node) {
                                                if (node.style[name] !== void 0) {
                                                    node.style[name] = value;
                                                }
                                            });
                                        });
                                    });
                                }
                            },
                            addClass    : function (className){
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        var classes = node.className.replace(/\s{2,}/gi, '').split(' ');
                                        if (classes.indexOf(className) === -1) {
                                            classes.push(className);
                                            node.className = classes.join(' ');
                                        }
                                    });
                                });
                            },
                            removeClass : function (className){
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        var classes = node.className.replace(/\s{2,}/gi, '').split(' '),
                                            index   = classes.indexOf(className);
                                        if (index !== -1) {
                                            classes.splice(index, 1);
                                            node.className = classes.join(' ');
                                        }
                                    });
                                });
                            },
                            show        : function () {
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        node.style.display = node.__display !== void 0 ? node.__display : 'block';
                                    });
                                });
                            },
                            hide        : function () {
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        node.__display      = node.style.display;
                                        node.style.display  = 'none';
                                    });
                                });
                            },
                            remove      : function (){
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        if (node.parentNode !== void 0 && node.parentNode !== null) {
                                            node.parentNode.removeChild(node);
                                        }
                                    });
                                });
                                this.collections = [];
                            },
                            append      : function (parent){
                                if (typeof parent.appendChild === 'function') {
                                    this.collections.forEach(function (nodeList) {
                                        Array.prototype.forEach.call(nodeList, function (node) {
                                            parent.appendChild(node);
                                        });
                                    });
                                }
                            },
                            insertBefore: function (parent, before) {
                                if (typeof parent.insertBefore === 'function' && helpers.isNode(before)) {
                                    this.collections.forEach(function (nodeList) {
                                        Array.prototype.forEach.call(nodeList, function (node) {
                                            parent.insertBefore(node, before);
                                        });
                                    });
                                }
                            },
                            attr        : function (name, value){
                                var result = [];
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        if (value !== void 0) {
                                            node.setAttribute(name, value);
                                            result.push(true);
                                        } else {
                                            result.push(node.getAttribute(name));
                                        }
                                    });
                                });
                                return result.length === 1 ? result[0] : result;
                            },
                            removeAttr  : function (name) {
                                var result = [];
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        result.push(node.removeAttribute(name));
                                    });
                                });
                                return result.length === 1 ? result[0] : result;
                            },
                            on          : function (event, handle){
                                if (typeof handle === 'function') {
                                    this.collections.forEach(function (nodeList) {
                                        Array.prototype.forEach.call(nodeList, function (node) {
                                            var target = instance.nodeList.create(node);
                                            target.indexes = node[settings.other.INDEXES];
                                            flex.events.DOM.add(node, event, handle.bind(target));
                                        });
                                    });
                                } else {
                                    throw Error('Defined [handle] is not a function');
                                }
                            },
                            getAsArray  : function () {
                                var result = [];
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        result.push(node);
                                    });
                                });
                            }
                        };
                    },
                    create      : function (nodeList) {
                        return new instance.nodeList.NODE_LIST(nodeList);
                    },
                    addMethod   : function (name, method) {
                        if (typeof name === 'string' && typeof method === 'function') {
                            if (instance.nodeList.NODE_LIST.prototype[name] !== void 0) {
                                flex.logs.log('Method [' + name + '] of NODE_LIST list class was overwritten.', flex.logs.types.NOTIFICATION);
                            }
                            instance.nodeList.NODE_LIST.prototype[name] = method;
                        }
                    }
                },
                map     : {
                    MAP: function (context) {
                        if (context !== void 0 && context.nodeType !== void 0) {
                            this.context = context;
                        } else {
                            throw Error('Context [context] should be a node.');
                        }
                    },
                    init: function () {
                        instance.map.MAP.prototype = {
                            select: function (selector) {
                                var results = _nodes(selector, false, this.context);
                                if (results.target !== null && results.target.length > 0) {
                                    return results.target.length > 1 ? results.target : results.target[0];
                                } else {
                                    return null;
                                }
                            }
                        };
                    },
                    create: function (context) {
                        return new instance.map.MAP(context);
                    }
                }
            };
            //END: instance class ===============================================
            //BEGIN: result class ===============================================
            result      = {
                proto       : function (privates) {
                    var mount       = null,
                        returning   = null,
                        clone       = null;
                    clone       = function (hooks) {
                        return privates.instance.clone(privates.hooks_map, hooks);
                    };
                    mount       = function (destination, before, after, replace) {
                        if (destination !== null) {
                            Array.prototype.forEach.call(destination, function (parent) {
                                privates.nodes.forEach(function (node) {
                                    if (!replace) {
                                        parent.appendChild(node);
                                    } else {
                                        parent.parentNode.insertBefore(node, parent);
                                    }
                                });
                                if (replace) {
                                    parent.parentNode.removeChild(parent);
                                }
                            });
                        } else if (before !== null && before.parentNode !== void 0 && before.parentNode !== null) {
                            Array.prototype.forEach.call(before, function (parent) {
                                privates.nodes.forEach(function (node) {
                                    before.parentNode.insertBefore(node, before);
                                });
                            });
                        } else if (after !== null && after.parentNode !== void 0 && after.parentNode !== null) {
                            Array.prototype.forEach.call(after, function (parent) {
                                var _before = after.nextSibling !== void 0 ? after.nextSibling : null;
                                if (_before !== null) {
                                    privates.nodes.forEach(function (node) {
                                        _before.parentNode.insertBefore(node, _before);
                                    });
                                } else {
                                    privates.nodes.forEach(function (node) {
                                        after.parentNode.appendChild(node);
                                    });
                                }
                            });
                        }
                        flex.events.core.fire(flex.registry.events.ui.patterns.GROUP, flex.registry.events.ui.patterns.MOUNTED, privates.nodes);
                    };
                    returning   = {
                        nodes           : function () { return privates.nodes;          },
                        map             : function () { return privates.map;            },
                        model           : function () { return privates.model;          },
                        dom             : function () { return privates.dom;            },
                        binds           : function () { return privates.binds;          },
                        handle          : function () { return privates.handle;         },
                        hooks_map       : function () { return privates.hooks_map;      },
                        instance        : function () { return privates.instance;       },
                        clone           : clone,
                        mount           : mount
                    };
                    return {
                        nodes       : returning.nodes,
                        mount       : returning.mount,
                        map         : returning.map,
                        dom         : returning.dom,
                        model       : returning.model,
                        binds       : returning.binds,
                        hooks_map   : returning.hooks_map,
                        instance    : returning.instance,
                        handle      : returning.handle,
                        clone       : returning.clone,
                    };
                },
                instance    : function (parameters) {
                    if (flex.oop.objects.validate(parameters, [ { name: 'url',              type: 'string'                              },
                                                                { name: 'nodes',            type: 'array'                               },
                                                                { name: 'handle',           type: 'function'                            },
                                                                { name: 'hooks_map',        type: 'object',             value: null     },
                                                                { name: 'instance',         type: 'object',             value: null     },
                                                                { name: 'map',              type: ['object', 'array'],  value: null     },
                                                                { name: 'model',            type: ['object', 'array'],  value: null     },
                                                                { name: 'dom',              type: ['object', 'array'],  value: null     },
                                                                { name: 'binds',            type: ['object', 'array'],  value: null     }]) !== false) {
                        return _object({
                            parent      : settings.classes.RESULT,
                            constr      : function () {
                                this.url = flex.system.url.restore(parameters.url);
                            },
                            privates    : {
                                nodes           : parameters.nodes,
                                map             : parameters.map,
                                model           : parameters.model,
                                binds           : parameters.binds,
                                dom             : parameters.dom,
                                handle          : parameters.handle,
                                hooks_map       : parameters.hooks_map,
                                instance        : parameters.instance,
                            },
                            prototype   : result.proto
                        }).createInstanceClass();
                    } else {
                        return null;
                    }
                },
            };
            //END: result class ===============================================
            //BEGIN: caller class ===============================================
            caller      = {
                proto   : function(privates){
                    var self        = this,
                        mount       = null,
                        render      = null,
                        patterns    = null,
                        hooks       = null,
                        signature   = null,
                        returning   = null;
                    patterns    = {
                        reset   : function(){
                            privates.patterns = {};
                        },
                        find: function (hooks) {
                            hooks = hooks instanceof Array ? hooks : [hooks];
                            if (hooks !== null) {
                                hooks.forEach(function (_hooks) {
                                    _object(_hooks).forEach(function (hook_name, hook_value) {
                                        if (hook_value instanceof settings.classes.CALLER) {
                                            if (privates.patterns[hook_value.url] === void 0) {
                                                privates.patterns[hook_value.url] = hook_value.url;
                                                patterns.find(hook_value.hooks());
                                            }
                                        }
                                    });
                                });
                            }
                            if (privates.patterns[self.url] === void 0) {
                                privates.patterns[self.url] = self.url;
                            }
                        },
                    };
                    hooks       = {
                        values  : {
                            caller  : function (value) {
                                var _instance   = instance.init(value.url),
                                    _hooks      = value.hooks(),
                                    result      = null;
                                if (_instance === null) {
                                    flex.logs.log(signature() + logs.caller.CANNOT_GET_CHILD_PATTERN + '(' + value.url + ')', flex.logs.types.CRITICAL);
                                    flex.system.handle(privates.callbacks.fail, self.url);
                                    throw logs.caller.CANNOT_GET_CHILD_PATTERN;
                                } else {
                                    hooks.apply(_hooks);
                                    return _instance.bind(_hooks, value.resources(), value.conditions());
                                }
                            }
                        },
                        value   : function (something) {
                            function getValue(something) {
                                if (something instanceof settings.classes.CALLER) {
                                    return hooks.values.caller(something);
                                }
                                if (typeof something === 'function') {
                                    return getValue(something());
                                }
                                return something;
                            };
                            if (something !== void 0) {
                                return getValue(something);
                            }
                            return '';
                        },
                        apply   : function (_hooks) {
                            var _hooks = _hooks !== void 0 ? _hooks : privates.hooks;
                            if (_hooks instanceof Array) {
                                _hooks.forEach(function (_, index) {
                                    _hooks[index] = hooks.apply(_hooks[index]);
                                });
                            } else if (typeof _hooks === 'object' && _hooks !== null) {
                                _object(_hooks).forEach(function (hook_name, hook_value) {
                                    _hooks[hook_name] = hooks.value(hook_value);
                                });
                            }
                            return _hooks;
                        }
                    };
                    render      = function (clone) {
                        var clone = typeof clone === 'boolean' ? clone : false;
                        if (!clone) {
                            patterns.reset();
                            patterns.find(privates.hooks);
                            source.init(
                                (function () {
                                    var list = [];
                                    _object(privates.patterns).forEach(function (url) {
                                        list.push(url);
                                    });
                                    return list;
                                }()),
                                function () {
                                    hooks.apply();
                                    privates.pattern        = instance.init(self.url);
                                    if (privates.pattern !== null) {
                                        privates.pattern    = privates.pattern.build(privates.hooks, privates.resources, privates.conditions);
                                        if (privates.pattern instanceof settings.classes.RESULT) {
                                            privates.pattern.mount(privates.node, privates.before, privates.after, privates.replace);
                                            if (privates.callbacks.success !== null) {
                                                privates.pattern.handle()(privates.callbacks.success, privates.resources);
                                            }
                                        }
                                    } else {
                                        flex.logs.log(signature() + logs.caller.CANNOT_GET_PATTERN, flex.logs.types.CRITICAL);
                                        flex.system.handle(privates.callbacks.fail, self.url);
                                        throw logs.caller.CANNOT_GET_PATTERN;
                                    }
                                },
                                function () {
                                    flex.logs.log(signature() + logs.caller.CANNOT_INIT_PATTERN, flex.logs.types.CRITICAL);
                                    flex.system.handle(privates.callbacks.fail, self.url);
                                    throw logs.caller.CANNOT_INIT_PATTERN;
                                }
                            );
                        } else {
                            hooks.apply();
                            privates.pattern = instance.init(self.url);
                            if (privates.pattern !== null) {
                                privates.pattern = privates.pattern.build(privates.hooks, privates.resources, privates.conditions);
                                if (privates.pattern instanceof settings.classes.RESULT) {
                                    return privates.pattern;
                                }
                            }
                        }
                    };
                    signature   = function () {
                        return logs.SIGNATURE + ':: caller (' + self.url + ')';
                    };
                    returning   = {
                        render      : render,
                        hooks       : function () { return privates.hooks; },
                        resources   : function () { return privates.resources;},
                        conditions  : function () { return privates.conditions; }
                };
                    return {
                        render      : returning.render,
                        hooks       : returning.hooks,
                        conditions  : returning.conditions,
                        resources   : returning.resources
                    };
                },
                instance: function (parameters) {
                    /// <summary>
                    /// Load template; save it in virtual storage and local storage (if it's allowed)
                    /// </summary>
                    /// <param name="parameters" type="Object">Template parameters: &#13;&#10;
                    /// {   [string]            url                     (source of template),                                               &#13;&#10;
                    ///     [string || node]    node                    (target node for mount),                                            &#13;&#10;
                    ///     [boolean]           replace                 (true - replace node by template; false - append template to node), &#13;&#10;
                    ///     [object || array]   hooks                   (bind data),                                                        &#13;&#10;
                    ///     [array]             data                    (bind data for collection),                                         &#13;&#10;
                    ///     [object]            conditions              (conditions),                                                       &#13;&#10;
                    ///     [object]            callbacks               (callbacks),                                                        &#13;&#10;
                    ///     [object]            resources               (callbacks),                                                        &#13;&#10;
                    ///     [boolean]           remove_missing_hooks    (remove missed bind data),                                          &#13;&#10;
                    /// }</param>
                    /// <returns type="boolean">true - success; false - fail</returns>
                    if (flex.oop.objects.validate(parameters, [ { name: 'url',                  type: 'string'                                  },
                                                                { name: 'node',                 type: ['node', 'string'],   value: null         },
                                                                { name: 'before',               type: ['node', 'string'],   value: null         },
                                                                { name: 'after',                type: ['node', 'string'],   value: null         },
                                                                { name: 'id',                   type: 'string',             value: flex.unique()},
                                                                { name: 'replace',              type: 'boolean',            value: false        },
                                                                { name: 'hooks',                type: ['object', 'array'],  value: null         },
                                                                { name: 'data',                 type: 'array',              value: null         },
                                                                { name: 'conditions',           type: 'object',             value: null         },
                                                                { name: 'callbacks',            type: 'object',             value: {}           },
                                                                { name: 'resources',            type: 'object',             value: {}           },
                                                                { name: 'remove_missing_hooks', type: 'boolean',            value: true         }]) !== false) {
                        flex.oop.objects.validate(parameters.callbacks, [   { name: 'before',   type: 'function', value: null },
                                                                            { name: 'success',  type: 'function', value: null },
                                                                            { name: 'fail',     type: 'function', value: null }]);
                        return _object({
                            parent          : settings.classes.CALLER,
                            constr          : function () {
                                this.url = flex.system.url.restore(parameters.url);
                            },
                            privates        : {
                                //From parameters
                                id                  : parameters.id,
                                node                : parameters.node   !== null ? (typeof parameters.node      === 'string' ? _nodes(parameters.node   ).target : [parameters.node]     ) : null,
                                before              : parameters.before !== null ? (typeof parameters.before    === 'string' ? _nodes(parameters.before ).target : [parameters.before]   ) : null,
                                after               : parameters.after  !== null ? (typeof parameters.after     === 'string' ? _nodes(parameters.after  ).target : [parameters.after]    ) : null,
                                replace             : parameters.replace,
                                hooks               : parameters.hooks,
                                data                : parameters.data,
                                conditions          : parameters.conditions,
                                callbacks           : parameters.callbacks,
                                remove_missing_hooks: parameters.remove_missing_hooks,
                                resources           : parameters.resources,
                                //Local
                                pattern             : null
                            },
                            prototype       : caller.proto
                        }).createInstanceClass();
                    } else {
                        return null;
                    }
                },
            };
            //END: caller class ===============================================
            layout      = {
                init    : function (is_auto){
                    function isValid(pattern) {
                        var nodeName = pattern.parentNode.nodeName.toLowerCase();
                        if (nodeName !== config.values.PATTERN_NODE) {
                            if (nodeName !== 'body'){
                                return isValid(pattern.parentNode);
                            } else {
                                return true;
                            }
                        } else {
                            return false;
                        }
                    };
                    var patterns    = _nodes(config.values.PATTERN_NODE).target,
                        is_auto     = typeof is_auto === 'boolean' ? is_auto : false;
                    if (patterns !== null && patterns instanceof NodeList && patterns.length > 0) {
                        Array.prototype.forEach.call(patterns, function (pattern) {
                            if (isValid(pattern)) {
                                if ((!pattern.hasAttribute('success') && !pattern.hasAttribute('error')) || !is_auto) {
                                    layout.caller(pattern);
                                }
                            }
                        });
                    }
                },
                caller  : function (pattern, is_child) {
                    function getIndex(source, hook) {
                        var index = -1;
                        try{
                            source.forEach(function(hooks, _index){
                                if (hooks[hook] === void 0){
                                    index = _index;
                                    throw 'found';
                                }
                            });
                        }catch(e){}
                        return index;
                    };
                    function getCallback(pattern, type) {
                        var callback = pattern.getAttribute(type),
                            parts       = null;
                        if (typeof callback === 'string' && callback !== '') {
                            parts       = callback.split('.');
                            callback    = window;
                            parts.forEach(function (part) {
                                if (callback !== null && callback[part] !== void 0) {
                                    callback = callback[part];
                                } else {
                                    callback = null;
                                }
                            });
                            return callback;
                        } else {
                            return null;
                        }
                    };
                    var _caller     = null,
                        is_child    = is_child !== void 0 ? is_child : false,
                        url         = null;
                    if (pattern.hasAttribute('src')) {
                        _caller = {
                            url     : pattern.getAttribute('src'),
                            hooks   : {}
                        };
                        Array.prototype.forEach.call(pattern.children, function (child) {
                            var index   = 0,
                                hook    = child.nodeName.toLowerCase();
                            if (_caller.hooks[hook] !== void 0 && !(_caller.hooks instanceof Array)) {
                                _caller.hooks = [_caller.hooks];
                            }
                            if (_caller.hooks instanceof Array) {
                                index = getIndex(_caller.hooks, hook);
                                if (index === -1) {
                                    _caller.hooks.push({});
                                    index = _caller.hooks.length - 1;
                                }
                                if (!child.hasAttribute('src')) {
                                    _caller.hooks[index][hook] = child.innerHTML;
                                } else {
                                    _caller.hooks[index][hook] = layout.caller(child, true);
                                }
                            } else {
                                if (!child.hasAttribute('src')) {
                                    _caller.hooks[hook] = child.innerHTML;
                                } else {
                                    _caller.hooks[hook] = layout.caller(child, true);
                                }
                            }
                        });
                        if (typeof _caller.hooks === 'object' && Object.keys(_caller.hooks).length === 0) {
                            delete _caller.hooks;
                        }
                        if (!is_child) {
                            _caller.node        = pattern;
                            _caller.replace     = true;
                            _caller.callbacks   = {
                                success : getCallback(pattern, 'success'),
                                error   : getCallback(pattern, 'error'),
                            };
                            _caller = caller.instance(_caller).render();
                        } else {
                            _caller = caller.instance(_caller);
                        }
                    }
                    return _caller;
                },
                attach  : function () {
                    if (document.readyState !== 'complete') {
                        flex.events.DOM.add(window, 'load', function () {
                            layout.init(true);
                        });
                    } else {
                        layout.init(true);
                    }
                }
            };
            controllers = {
                references  : {
                    assign          : function (url, pattern_url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CONTROLLERS_LINKS, {});
                        if (storage[url] === void 0) {
                            storage[url] = pattern_url;
                        }
                    },
                    getPatternURL   : function (url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CONTROLLERS_LINKS, {});
                        return storage[url] !== void 0 ? storage[url] : null;
                    }
                },
                storage     : {
                    add : function (pattern_url, controller) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CONTROLLERS_STORAGE, {});
                        if (storage[pattern_url] === void 0) {
                            storage[pattern_url] = [];
                        }
                        storage[pattern_url].push(controller);
                    },
                    get : function (pattern_url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CONTROLLERS_STORAGE, {});
                        return storage[pattern_url] !== void 0 ? storage[pattern_url] : null;
                    },
                },
                current     : {
                    data    : null,
                    set     : function (url){
                        controllers.current.data = url;
                    },
                    get     : function () {
                        return controllers.current.data;
                    },
                    reset   : function () {
                        controllers.current.data = null;
                    },
                },
                attach      : function (controller) {
                    var url     = null,
                        _source = null;
                    if (typeof controller === 'function') {
                        url = controllers.current.get() !== null ? controllers.current.get() : flex.resources.attach.js.getCurrentSRC();
                        if (url !== null) {
                            _source = controllers.references.getPatternURL(url);
                            controllers.storage.add(_source, controller);
                        }
                    }
                },
            };
            storage     = {
                virtual: {
                    add: function (url, content) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.VIRTUAL_STORAGE_ID, {});
                        if (storage !== null) {
                            if (storage[url] === void 0) {
                                storage[url] = content;
                                return true;
                            }
                        }
                    },
                    get: function (url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.VIRTUAL_STORAGE_ID, {});
                        if (storage !== null) {
                            return (storage[url] !== void 0 ? storage[url] : null);
                        }
                        return null;
                    }
                },
                local: {
                    add: function (url, content) {
                        if (settings.storage.USE_LOCALSTORAGE === true) {
                            return flex.localStorage.addJSON(url, {
                                html: content,
                                hash: flex.hashes.get(url)
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
                },
                add: function (url, content) {
                    storage.local.  add(url, content);
                    storage.virtual.add(url, content);
                },
                get: function (url) {
                    var result = storage.virtual.get(url);
                    if (result === null) {
                        result = storage.local.get(url);
                    }
                    return result;
                }
            };
            measuring   = {
                measure: (function () {
                    var storage = {};
                    return function (id, operation) {
                        if (settings.measuring.MEASURE) {
                            var id = id === void 0 ? flex.unique() : id;
                            if (storage[id] === void 0) {
                                storage[id] = performance.now();
                            } else {
                                flex.logs.log(logs.SIGNATURE + 'Operation [' + operation + '] was taken ' + (performance.now() - storage[id]).toFixed(4) + 'ms.', flex.logs.types.NOTIFICATION);
                                delete storage[id];
                            }
                            return id;
                        }
                    };
                }())
            };
            conditions  = {
                storage     : {
                    add: function (pattern_url, _conditions) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CONDITIONS_STORAGE, {});
                        storage[pattern_url] = _conditions;
                    },
                    get : function (pattern_url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CONDITIONS_STORAGE, {});
                        return storage[pattern_url] !== void 0 ? storage[pattern_url] : null;
                    },
                },
                attach: function (_conditions) {
                    var url     = null,
                        _source = null;
                    if (typeof _conditions === 'object' && _conditions !== null) {
                        url = controllers.current.get() !== null ? controllers.current.get() : flex.resources.attach.js.getCurrentSRC();
                        if (url !== null) {
                            _source = controllers.references.getPatternURL(url);
                            conditions.storage.add(_source, _conditions);
                        }
                    }
                }
            };
            helpers     = {
                testReg : function(reg, str){
                    reg.lastIndex = 0;
                    return reg.test(str);
                },
                binds   : {
                    data        : {
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
                    assing      : function (node, prop_name, handle) {
                        var node_name   = node.nodeName.toLowerCase(),
                            group       = null;
                        if (helpers.binds.data[prop_name] !== void 0) {
                            helpers.binds.data[prop_name].forEach(function (_group) {
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
                    isPossible  : function (node, prop_name) {
                        var node_name = node.nodeName.toLowerCase();
                        if (helpers.binds.data[prop_name] !== void 0) {
                            try{
                                helpers.binds.data[prop_name].forEach(function (_group) {
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
                },
                isNode  : function (something) {
                    if (something !== void 0 && something.nodeName !== void 0 && something.parentNode !== void 0 && something.nodeType !== void 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                tableFix: function (html) {
                    var tables  = html.match(settings.regs.TABLE),
                        hooks   = [];
                    if (tables instanceof Array) {
                        tables.forEach(function (table) {
                            var _hooks  = null;
                            table       = table.replace(settings.regs.TABLE_TAG, '').replace(settings.regs.ANY_TAG, '');
                            _hooks      = table.match(settings.regs.HOOK);
                            if (_hooks instanceof Array) {
                                hooks = hooks.concat(_hooks);
                            }
                        });
                        hooks.forEach(function (hook) {
                            var _hook = hook.replace(settings.regs.HOOK_BORDERS, '');
                            html = html.replace(new RegExp(settings.regs.HOOK_OPEN + _hook + settings.regs.HOOK_CLOSE, 'gi'), '<!--' + hook + '-->');
                        });
                    }
                    return html;
                }
            };
            callers     = {
                init    : function () {
                    flex.callers.define.node('ui.patterns.append', function (parameters) {
                        if (typeof parameters === 'object' && this.target) {
                            parameters.node = this.target;
                        }
                        return caller.instance(parameters);
                    });
                    flex.callers.define.nodes('ui.patterns.append', function () {
                        var result = [];
                        Array.prototype.forEach.call(this.target, function (target) {
                            if (typeof parameters === 'object' && this.target) {
                                parameters.node = this.target;
                            }
                            result.push(caller.instance(parameters));
                        });
                        return result;
                    });
                }
            };
            //Init addition classes
            instance.nodeList.init();
            instance.map.init();
            //Init modules
            if (flex.libraries !== void 0) {
                if (flex.libraries.events !== void 0 && flex.libraries.binds !== void 0) {
                    flex.libraries.events.create();
                    flex.libraries.binds.create();
                }
            }
            //Private part
            privates    = {
                preload     : source.init,
                get         : caller.instance,
                controller  : {
                    attach  : controllers.attach
                },
                conditions  : {
                    attach  : conditions.attach
                },
                classes     : {
                    NODE_LIST: {
                        addMethod : instance.nodeList.addMethod
                    }
                },
                setup       : config.setup,
                debug       : config.debug,
                layout      : layout.init
            };
            //Global callers
            callers.init();
            window['_controller'] = privates.controller.attach;
            window['_conditions'] = privates.conditions.attach;
            //Run layout parser
            layout.attach();
            //Public part
            return {
                preload : privates.preload,
                get     : privates.get,
                classes : {
                    NODE_LIST: {
                        addMethod: privates.classes.NODE_LIST.addMethod
                    }
                },
                setup   : privates.setup,
                debug   : privates.debug,
                layout  : privates.layout
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
            onAfterAttach   : function () {
            }
        });
    }
}());