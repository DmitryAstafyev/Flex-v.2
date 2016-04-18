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
                settings    = null,
                //Classes
                source      = null,
                pattern     = null,
                instance    = null,
                result      = null,
                caller      = null,
                //Methods
                privates    = null,
                controllers = null,
                storage     = null,
                logs        = null,
                measuring   = null,
                helpers     = null,
                methods     = null,
                callers     = null;
            //Settings
            settings    = {
                measuring   : {
                    MEASURE : true,
                },
                classes     : {
                    SOURCE  : function(){},
                    PATTERN : function(){},
                    INSTANCE: function(){},
                    RESULT  : function(){},
                    CALLER  : function(){},
                },
                regs        : {
                    BODY                : /<body>(\n|\r|\s|.)*?<\/body>/gi,
                    BODY_TAG            : /<\s*body\s*>|<\s*\/\s*body\s*>/gi,
                    BODY_CLEAR          : /^[\n\r\s]*|[\n\r\s]*$/gi,
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
                    HOOK                : /\{\{\w*?\}\}/gi,
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
                    CONDITION_OPEN      : 'CON:',
                    CONDITION_CLOSE     : ':CON',
                },
                storage     : {
                    USE_LOCALSTORAGE        : true,
                    VIRTUAL_STORAGE_GROUP   : 'FLEX_UI_PATTERNS_GROUP',
                    VIRTUAL_STORAGE_ID      : 'FLEX_UI_PATTERNS_STORAGE',
                    CSS_ATTACHED_JOURNAL    : 'FLEX_UI_PATTERNS_CSS_JOURNAL',
                    JS_ATTACHED_JOURNAL     : 'JS_ATTACHED_JOURNAL',
                    PRELOAD_TRACKER         : 'FLEX_UI_PATTERNS_PRELOAD_TRACKER',
                    NODE_BINDING_DATA       : 'FLEX_PATTERNS_BINDINGS_DATA',
                    CONTROLLERS_LINKS       : 'FLEX_PATTERNS_CONTROLLERS_LINKS',
                    CONTROLLERS_STORAGE     : 'FLEX_PATTERNS_CONTROLLERS_STORAGE',
                    PATTERN_SOURCES         : 'FLEX_PATTERNS_PATTERN_SOURCES',
                    PATTERNS                : 'FLEX_PATTERNS_PATTERNS',
                },
                compatibility: {
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
                css     : {
                    classes     : {
                        HOOK_WRAPPER    : 'flex_patterns_hook_wrapper'
                    },
                    attrs       : {
                        MODEL_DATA: 'flex-model-data'
                    },
                    selectors   : {
                        HOOK_WRAPPERS: '.flex_patterns_hook_wrapper'
                    },
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
                pattern: {
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
                },
                instance : {
                    BAD_HOOK_FOR_CLONE      : '2000:BAD_HOOK_FOR_CLONE',
                    NO_URL_FOR_CLONE_HOOK   : '2001:NO_URL_FOR_CLONE_HOOK',
                },
                caller : {
                    CANNOT_INIT_PATTERN     : '3000:CANNOT_INIT_PATTERN',
                    CANNOT_GET_CHILD_PATTERN: '3001:CANNOT_GET_CHILD_PATTERN',
                    CANNOT_GET_PATTERN      : '3002:CANNOT_GET_PATTERN',
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
                            if (storaged !== null) {
                                process(storaged, success, fail);
                            } else {
                                perf_id = measuring.measure();
                                ajax    = flex.ajax.send(
                                    null,
                                    self.url,
                                    'get',
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
                                    },
                                    null
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
                                                if (storaged === null) {
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
                                                if (storaged === null || flex.config().resources.USE_STORAGED === false) {
                                                    perf_id = measuring.measure();
                                                    flex.resources.attach.js.connect(
                                                        url,
                                                        function () {
                                                            flex.overhead.register.done(register_id, url);
                                                            var request = flex.ajax.send(null, url, 'get', null, {
                                                                    success: function (response, request) {
                                                                        storage.add(url, response.original);
                                                                    },
                                                                }, null);
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
                    returning = {
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
                    convert = {
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
                                        /*
                                        if (typeof value === 'string') {
                                            node.innerHTML  = value;
                                            node            = verifyCompatibility(node, value);
                                            return true;
                                        }
                                        if (typeof value.innerHTML === 'string') {
                                            node.appendChild(value);
                                            return true;
                                        }
                                        if (value instanceof settings.classes.RESULT) {
                                            value.nodes().forEach(function (_node) {
                                                node.appendChild(_node);
                                            });
                                            return true;
                                        }
                                        if (value.toString !== void 0) {
                                            node.innerHTML  = value;
                                            node            = verifyCompatibility(node, value);
                                            return true;
                                        }
                                        */
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
                                inAttrs : function (node, model, reg_model) {
                                    var reg_model = reg_model instanceof RegExp ? reg_model : new RegExp(settings.regs.MODEL_OPEN + model + settings.regs.MODEL_CLOSE, 'gi');
                                    if (node.attributes) {
                                        Array.prototype.forEach.call(node.attributes, function (attr) {
                                            var defaultIEFix = null;
                                            if (typeof attr.nodeValue === 'string' && attr.nodeValue !== '') {
                                                if (helpers.testReg(reg_model, attr.nodeValue)) {
                                                    convert.model.setAttrData(node, {
                                                        attr    : attr.nodeName,
                                                        model   : model
                                                    });
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
                                var condition = str.replace(settings.regs.CONDITION_OPEN, '');
                                if (condition.indexOf(settings.regs.CONDITION_OPEN) === -1) {
                                    condition = condition.split('=');
                                    if (condition.length === 2) {
                                        return {
                                            name    : condition[0],
                                            value   : condition[1]
                                        };
                                    }
                                }
                                flex.logs.log(signature() + logs.pattern.WRONG_CONDITION_DEFINITION + ' (original comment: ' + str + ')', flex.logs.types.CRITICAL);
                                throw logs.pattern.WRONG_CONDITION_DEFINITION;
                            },
                            getNodes: function (condition_name, condition_node, parent) {
                                var inside_condition    = false,
                                    nodes               = [];
                                try {
                                    Array.prototype.forEach.call(parent.childNodes, function (child) {
                                        if (inside_condition) {
                                            if (child.nodeType === 8 && child.nodeValue.indexOf(condition_name + settings.regs.CONDITION_CLOSE) !== -1) {
                                                inside_condition = null;
                                                throw 'closed';
                                            } else {
                                                nodes.push(child);
                                            }
                                        } else if (child === condition_node) {
                                            inside_condition = true;
                                        }
                                    });
                                } catch (e) {

                                }
                                if (inside_condition === false) {
                                    flex.logs.log(signature() + logs.pattern.CANNOT_FIND_CONDITION_BEGINING + ' (condition name: ' + condition_name + ')', flex.logs.types.CRITICAL);
                                    throw logs.pattern.CANNOT_FIND_CONDITION_BEGINING;
                                }
                                if (inside_condition === true) {
                                    flex.logs.log(signature() + logs.pattern.CANNOT_FIND_CONDITION_END + ' (condition name: ' + condition_name + ')', flex.logs.types.CRITICAL);
                                    throw logs.pattern.CANNOT_FIND_CONDITION_END;
                                }
                                return nodes;
                            },
                            find    : function (node){
                                function search(node, conditions) {
                                    if (node.childNodes !== void 0) {
                                        Array.prototype.forEach.call(node.childNodes, function (node) {
                                            var condition = null;
                                            if (node.nodeType === 8) {
                                                if (node.nodeValue.indexOf(settings.regs.CONDITION_OPEN) === 0) {
                                                    condition = convert.conditions.getName(node.nodeValue);
                                                    if (conditions[condition.name] === void 0) {
                                                        conditions[condition.name] = [];
                                                    }
                                                    conditions[condition.name].push({
                                                        value   : condition.value,
                                                        nodes   : convert.conditions.getNodes(condition.name, node, node.parentNode)
                                                    });
                                                }
                                            } else if (node.childNodes !== void 0 && node.childNodes.length > 0) {
                                                search(node, conditions);
                                            }
                                        });
                                    }
                                };
                                var conditions = {};
                                search(node, conditions);
                                return conditions;
                            },
                            process : function (clone, _conditions) {
                                var conditions = convert.conditions.find(clone);
                                _object(_conditions).forEach(function (con_name, con_value) {
                                    var found_flag = false;
                                    if (conditions[con_name] !== void 0) {
                                        conditions[con_name].forEach(function (condition) {
                                            if (condition.value !== con_value) {
                                                condition.nodes.forEach(function (node) {
                                                    node.parentNode.removeChild(node);
                                                });
                                            } else {
                                                found_flag = true;
                                            }
                                        });
                                        if (!found_flag) {
                                            flex.logs.log(signature() + logs.pattern.CANNOT_FIND_CONDITION_VALUE + ' (condition name: ' + con_name + ' = "' + con_value + '")', flex.logs.types.WARNING);
                                        }
                                    } else {
                                        flex.logs.log(signature() + logs.pattern.CANNOT_FIND_CONDITION_NODES + ' (condition name: ' + con_name + ')', flex.logs.types.WARNING);
                                    }
                                });
                            }
                        },
                        process     : function () {
                            privates.pattern = compatibility.getParent(compatibility.getFirstTagFromHTML(privates.html));
                            if (privates.pattern !== null) {
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
                        if (condition_values !== void 0 && condition_values !== null) {
                            convert.conditions.process(clone, condition_values);
                        }
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
                            clone   : clone,
                            setters : hook_setters
                        };
                    };
                    signature       = function () {
                        return logs.SIGNATURE + ':: pattern (' + self.url + ')';
                    };
                    returning = {
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
                        methods     = null,
                        controller  = null,
                        cloning     = null,
                        conditions  = null,
                        returning   = null;
                    cloning     = {
                        update          : function (_hooks) {
                            var _hooks  = _hooks instanceof Array ? _hooks[0] : _hooks,
                                map     = {};
                            _object(_hooks).forEach(function (hook_name, hook_value) {
                                if (hook_value instanceof settings.classes.RESULT) {
                                    map['__' + hook_name + '__'] = hook_value.url;
                                } else {
                                    map[hook_name] = true;
                                }
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
                                                url     : hooks_map['__' + hook_name + '__'],
                                                hooks   : cloning.convertHooks(hooks_map[hook_name], hook_value)
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
                                            map.    current[key] = hooks[key].map();
                                            model.  current.model['__' + key + '__']    = hooks[key].model();
                                            model.  current.binds['__' + key + '__']    = hooks[key].binds();
                                            hooks_map[key]                              = hooks[key].hooks_map()
                                        }
                                        hook_setter(hooks[key]);
                                    } else {
                                        hook_setter('');
                                    }
                                });
                            }
                        },
                    };
                    map         = {
                        current     : {},
                        map         : {},
                        update      : function (clone) {
                            var iteration = {
                                nodes   : Array.prototype.filter.call(clone.childNodes, function () { return true; }),
                                childs  : map.current
                            };
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
                                                attr    : _model.attr === void 0 ? null : _model.attr,
                                                prop    : _model.prop === void 0 ? null : _model.prop
                                            });
                                        });
                                    }
                                });
                            }
                            return model.current.binds;
                        },
                        update      : function (clone) {
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
                        reset       : function(){
                            model.model = null;
                            model.binds = null;
                        },
                        iteration   : function () {
                            model.current = {
                                model: {},
                                binds: {}
                            };
                        }
                    };
                    conditions = {
                        get: function (_hooks, _conditions) {
                            var result = {};
                            if (_conditions !== null) {
                                _object(_conditions).forEach(function (name, handle) {
                                    result[name] = handle(_hooks);
                                });
                            }
                            return Object.keys(result).length > 0 ? result : null;
                        }
                    };
                    controller = {
                        apply: function (_instance, _resources) {
                            var _controllers = controllers.storage.get(self.url);
                            if (_controllers !== null) {
                                _controllers.forEach(function (controller) {
                                    methods.handle(controller, _instance, _resources);
                                });
                            }
                        }
                    };
                    methods     = {
                        build       : function (_hooks, _resources, _conditions) {
                            var nodes       = [],
                                _map        = [],
                                _binds      = [],
                                clone       = null,
                                hooks_map   = null,
                                _instance   = null;
                            if (_hooks !== null) {
                                map.    reset();
                                model.  reset();
                                _hooks      = hooks.build(_hooks);
                                hooks_map   = cloning.update(_hooks);
                                _hooks      = _hooks instanceof Array ? _hooks : [_hooks];
                                _hooks.forEach(function (_hooks) {
                                    clone = privates.pattern(conditions.get(_hooks, _conditions));
                                    map.        iteration();
                                    model.      iteration();
                                    hooks.      apply(_hooks, clone.setters, hooks_map);
                                    map.        update(clone.clone);
                                    model.      update(clone.clone);
                                    model.      clear(clone.clone);
                                    nodes = nodes.concat(Array.prototype.filter.call(clone.clone.childNodes, function () { return true; }));
                                });
                            }
                            _instance = result.instance({
                                url         : self.url,
                                nodes       : nodes,
                                map         : map.map,
                                model       : model.model,
                                binds       : model.binds,
                                hooks_map   : hooks_map,
                                instance    : privates.__instance,
                                handle      : function (handle, _resources) { return methods.handle(handle, _instance, _resources); }
                            });
                            controller.apply(_instance, _resources);
                            return _instance;
                        },
                        handle      : function (handle, _instance, _resources) {
                            if (typeof handle === 'function') {
                                handle.call(_instance, model.model, model.binds, map.map, _resources);
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
            };
            //END: instance class ===============================================
            //BEGIN: result class ===============================================
            result = {
                proto       : function (privates) {
                    var mount       = null,
                        returning   = null,
                        clone       = null;
                    clone       = function (hooks) {
                        return privates.instance.clone(privates.hooks_map, hooks);
                    };
                    mount       = function (destination, replace) {
                        if (destination !== null) {
                            destination.forEach.call(destination, function (parent) {
                                privates.nodes.forEach(function (node) {
                                    if (!replace) {
                                        parent.appendChild(node);
                                    } else {
                                        parent.parentNode.insertBefore(node, parent);
                                    }
                                    if (replace) {
                                        parent.parentNode.removeChild(parent);
                                    }
                                });
                            });
                        }
                    };
                    returning   = {
                        nodes       : function () { return privates.nodes;      },
                        map         : function () { return privates.map;        },
                        model       : function () { return privates.model;      },
                        binds       : function () { return privates.binds;      },
                        handle      : function () { return privates.handle;     },
                        hooks_map   : function () { return privates.hooks_map;  },
                        instance    : function () { return privates.instance;   },
                        clone       : clone,
                        mount       : mount
                    };
                    return {
                        nodes       : returning.nodes,
                        mount       : returning.mount,
                        map         : returning.map,
                        model       : returning.model,
                        binds       : returning.binds,
                        hooks_map   : returning.hooks_map,
                        instance    : returning.instance,
                        handle      : returning.handle,
                        clone       : returning.clone,
                    };
                },
                instance    : function (parameters) {
                    if (flex.oop.objects.validate(parameters, [ { name: 'url',          type: 'string'                              },
                                                                { name: 'nodes',        type: 'array'                               },
                                                                { name: 'handle',       type: 'function'                            },
                                                                { name: 'hooks_map',    type: 'object',             value: null     },
                                                                { name: 'instance',     type: 'object',             value: null     },
                                                                { name: 'map',          type: ['object', 'array'],  value: null     },
                                                                { name: 'model',        type: ['object', 'array'],  value: null     },
                                                                { name: 'binds',        type: ['object', 'array'],  value: null     }]) !== false) {
                        return _object({
                            parent  : settings.classes.RESULT,
                            constr  : function () {
                                this.url = flex.system.url.restore(parameters.url);
                            },
                            privates: {
                                nodes       : parameters.nodes,
                                map         : parameters.map,
                                model       : parameters.model,
                                binds       : parameters.binds,
                                handle      : parameters.handle,
                                hooks_map   : parameters.hooks_map,
                                instance    : parameters.instance,
                            },
                            prototype: result.proto
                        }).createInstanceClass();
                    } else {
                        return null;
                    }
                },
            };
            //END: result class ===============================================
            //BEGIN: caller class ===============================================
            caller = {
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
                                            privates.pattern.mount(privates.node, privates.replace);
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
                    signature = function () {
                        return logs.SIGNATURE + ':: caller (' + self.url + ')';
                    };
                    returning = {
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
                                node                : parameters.node !== null ? (typeof parameters.node === 'string' ? _nodes(parameters.node).target : [parameters.node]) : null,
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
                            prototype: caller.proto
                        }).createInstanceClass();
                    } else {
                        return null;
                    }
                },
            };
            //END: caller class ===============================================
            controllers = {
                references: {
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
                storage: {
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
                current: {
                    data    : null,
                    set     : function(url){
                        controllers.current.data = url;
                    },
                    get     : function () {
                        return controllers.current.data;
                    },
                    reset   : function () {
                        controllers.current.data = null;
                    },
                },
                attach  : function (controller) {
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
                    if (something.nodeName !== void 0 && something.parentNode !== void 0 && something.nodeType !== void 0) {
                        return true;
                    } else {
                        return false;
                    }
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
            //Init modules
            flex.libraries.events.create();
            flex.libraries.binds.create();
            //Private part
            privates    = {
                preload     : source.init,
                get         : caller.instance,
                controller  : {
                    attach  : controllers.attach
                }
            };
            //Global callers
            callers.init();
            window['_controller'] = privates.controller.attach;
            //Public part
            return {
                preload : privates.preload,
                get     : privates.get
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