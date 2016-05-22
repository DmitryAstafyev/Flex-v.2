// LICENSE
// This file (core / module) is released under the MIT License. See [LICENSE] file for details.
/*global flex*/
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
    if (flex !== void 0) {
        var protofunction = function () { };
        protofunction.prototype = function () {
            var objects         = null,
                attrs           = null,
                props           = null,
                mutationCross   = null,
                privates        = null,
                helpers         = null,
                callers         = null,
                settings        = null,
                errors          = null,
                support         = null;
            settings    = {
                objects : {
                    STORAGE_PROPERTY    : 'flex.object.bind.storage',
                    HANDLE_ID_PROPERTY  : 'flex.object.bind.handle.id'
                },
                attrs   : {
                    STORAGE_PROPERTY    : 'flex.attrs.bind.storage',
                    HANDLE_ID_PROPERTY  : 'flex.attrs.bind.handle.id'
                },
                props: {
                    STORAGE_PROPERTY    : 'flex.props.bind.storage',
                    HANDLE_ID_PROPERTY  : 'flex.props.bind.handle.id'
                },
            };
            errors      = {
                objects: {
                    INCORRECT_ARGUMENTS : 'defined incorrect arguments or not defined at all',
                    PROPERTY_IS_CONST   : 'cannot kill bind with property, because property now is constant'
                },
                support: {
                    DEFINE_PROPERTY     : 'flex.binds: Current browser does not support Object.defineProperty',
                    MUTATION_SCANNING   : 'flex.attrs: Current browser does not support any avaliable way to scanning mutation of attributes',
                }
            };
            //Binding properies of objects
            objects         = {
                storage : {
                    create : function (object) {
                        var Storage = function (object) {
                                this.parent     = object;
                                this.binds      = {};
                            };
                        Storage.prototype = {
                            make            : function (property, value) {
                                var self = this;
                                if (!this.binds[property]) {
                                    this.binds[property] = {
                                        current     : value,
                                        previous    : value,
                                        setter      : function (value) { 
                                            self.binds[property].previous   = self.binds[property].current;
                                            self.binds[property].current    = value;
                                            for (var id in self.binds[property].handles) {
                                                self.binds[property].handles[id].call(self.parent, self.binds[property].current, self.binds[property].previous, id);
                                            }
                                        },
                                        getter      : function () {
                                            return self.binds[property].current;
                                        },
                                        handles     : {}
                                    };
                                    return true;
                                }
                                return false;
                            },
                            add             : function (property, handle) {
                                var handleID = flex.unique();
                                //Save handle ID in handle
                                handle[settings.objects.HANDLE_ID_PROPERTY] = handleID;
                                //Add handle in storage
                                this.binds[property].handles[handleID]      = handle;
                                //Return handle ID
                                return handleID;
                            },
                            remove          : function (property, id) {
                                if (this.binds[property]) {
                                    if (this.binds[property].handles[id]) {
                                        delete this.binds[property].handles[id];
                                        if (Object.keys(this.binds[property].handles).length === 0) {
                                            return delete this.binds[property];
                                        }
                                    }
                                }
                                return null;
                            },
                            kill            : function (property) {
                                if (this.binds[property]) {
                                    return delete this.binds[property];
                                }
                                return null;
                            },
                            isPropertyReady : function (property){
                                return this.binds[property] !== void 0 ? true : false;
                            },
                            destroy         : function (){
                                if (Object.keys(this.binds).length === 0) {
                                    return delete this.parent[settings.objects.STORAGE_PROPERTY];
                                }
                                return false;
                            },
                            setter          : function (property) {
                                return this.binds[property].setter;
                            },
                            getter          : function (property) {
                                return this.binds[property].getter;
                            }
                        };
                        return new Storage(object);
                    }
                },
                bind    : function (object, property, handle) {
                    /// <signature>
                    ///     <summary>Bind handle to property of object</summary>
                    ///     <param name="object"    type="OBJECT"   >Parent object</param>
                    ///     <param name="property"  type="STRING"   >Property</param>
                    ///     <param name="handle"    type="FUNCTION" >Handle of property changing</param>
                    ///     <returns type="STRING"/>
                    /// </signature>
                    var storage = settings.objects.STORAGE_PROPERTY,
                        value   = null;
                    if (Object.defineProperty) {
                        if (typeof object === 'object' && typeof property === 'string' && typeof handle === 'function') {
                            value = object[property];
                            if (!object[storage]) {
                                //Object isn't listening
                                object[storage] = objects.storage.create(object);
                            }
                            storage = object[storage];
                            //Prepare property if needed
                            if (!storage.isPropertyReady(property)) {
                                //First handle for property
                                if (delete object[property]) {
                                    //Prepare property storage
                                    storage.make(property, value);
                                    //Bind
                                    Object.defineProperty(object, property, {
                                        get         : storage.getter(property),
                                        set         : storage.setter(property),
                                        configurable: true
                                    });
                                } else {
                                    storage.destroy();
                                    return false;
                                }
                            }
                            //Add handle
                            return storage.add(property, handle);
                        }
                        throw 'object.bind::' + errors.objects.INCORRECT_ARGUMENTS;
                    }
                },
                unbind  : function (object, property, id) {
                    /// <signature>
                    ///     <summary>Unbind handle to property of object by handle's ID</summary>
                    ///     <param name="object"    type="OBJECT">Parent object</param>
                    ///     <param name="property"  type="STRING">Property</param>
                    ///     <param name="id"        type="STRING">ID of handle</param>
                    ///     <returns type="BOOLEAN"/>
                    /// </signature>
                    var storage = settings.objects.STORAGE_PROPERTY,
                        value   = null;
                    if (typeof object === 'object' && typeof property === 'string' && typeof id === 'string') {
                        if (object[storage]) {
                            storage = object[storage];
                            if (storage.isPropertyReady(property)) {
                                value = object[property];
                                storage.remove(property, id);
                                if (!storage.isPropertyReady(property)) {
                                    try {
                                        delete object[property];
                                        object[property] = value;
                                        return true;
                                    } catch (e) {
                                        throw 'object.unbind::' + errors.objects.PROPERTY_IS_CONST;
                                        return false;
                                    }
                                }
                            }
                        }
                        return null;
                    }
                    throw 'object.unbind::' + errors.objects.INCORRECT_ARGUMENTS;
                },
                kill    : function (object, property) {
                    /// <signature>
                    ///     <summary>Unbind all handles, which was attached to property of object</summary>
                    ///     <param name="object"    type="OBJECT">Parent object</param>
                    ///     <param name="property"  type="STRING">Property</param>
                    ///     <returns type="BOOLEAN"/>
                    /// </signature>
                    var storage = settings.objects.STORAGE_PROPERTY,
                        value   = null;
                    if (typeof object === 'object' && typeof property === 'string') {
                        if (object[storage]) {
                            value   = object[property];
                            storage = object[storage];
                            try {
                                if (storage.kill(property)) {
                                    delete object[property];
                                    object[property] = value;
                                    return true;
                                } else {
                                    return false;
                                }
                            } catch (e) {
                                throw 'object.kill::' + errors.objects.PROPERTY_IS_CONST;
                                return false;
                            }
                        }
                        return null;
                    }
                    throw 'object.kill::' + errors.objects.INCORRECT_ARGUMENTS;
                },
            };
            //Binding attributes of nodes
            attrs           = {
                storage : {
                    create : function (node) {
                        var Storage = function (node) {
                                this.node       = node;
                                this.binds      = {};
                                this._destroy   = null;
                            };
                        Storage.prototype = {
                            init            : function (){
                                this._destroy = mutationCross.attach(node,
                                    this.handle,
                                    this,
                                    {
                                        attributes              : true,
                                        childList               : false,
                                        subtree                 : false,
                                        characterData           : true,
                                        attributeOldValue       : false,
                                        characterDataOldValue   : false
                                    }
                                );
                            },
                            handle          : function (attr, mutation) {
                                var self        = this,
                                    attr_value  = null;
                                if (this.binds[attr]) {
                                    attr_value = this.node.getAttribute(attr);
                                    if (attr_value !== this.binds[attr].current) {
                                        this.binds[attr].previous   = this.binds[attr].current;
                                        this.binds[attr].current    = attr_value;
                                        _object(this.binds[attr].handles).forEach(function (id, handle) {
                                            handle.call(self.node, attr, self.binds[attr].current, self.binds[attr].previous, mutation, id);
                                        });
                                    }
                                }
                            },
                            make            : function (attr) {
                                if (!this.binds[attr]) {
                                    this.binds[attr] = {
                                        handles     : {},
                                        previous    : null,
                                        current     : this.node.getAttribute(attr)
                                    };
                                }
                            },
                            add             : function (attr, handle) {
                                var id = flex.unique();
                                //Save handle ID in handle
                                handle[settings.attrs.HANDLE_ID_PROPERTY] = id;
                                //Add handle in storage
                                this.binds[attr].handles[id] = handle;
                                //Return handle ID
                                return id;
                            },
                            remove          : function (attr, id) {
                                var result = null;
                                if (this.binds[attr]) {
                                    if (this.binds[attr].handles[id]) {
                                        delete this.binds[attr].handles[id];
                                        if (Object.keys(this.binds[attr].handles).length === 0) {
                                            result = delete this.binds[attr];
                                            this.destroy();
                                            return result;
                                        }
                                    }
                                }
                                return result;
                            },
                            kill            : function (attr) {
                                var result = null;
                                if (this.binds[attr]) {
                                    result = delete this.binds[attr];
                                    this.destroy();
                                    return result;
                                }
                                return result;
                            },
                            isAttrReady     : function (attr) {
                                return this.binds[attr] !== void 0 ? true : false;
                            },
                            destroy         : function (){
                                if (Object.keys(this.binds).length === 0) {
                                    this._destroy();
                                    return delete this.node[settings.attrs.STORAGE_PROPERTY];
                                }
                                return false;
                            },
                        };
                        return new Storage(node);
                    }
                },
                bind    : function (node, attr, handle) {
                    /// <signature>
                    ///     <summary>Bind handle to attribute of node</summary>
                    ///     <param name="node"      type="DOMNode"  >Target node</param>
                    ///     <param name="attr"      type="STRING"   >Attribute name</param>
                    ///     <param name="handle"    type="FUNCTION" >Handle of attribute changing</param>
                    ///     <returns type="STRING"/>
                    /// </signature>
                    var storage = settings.attrs.STORAGE_PROPERTY,
                        value   = null;
                    if (mutationCross.attach !== null) {
                        if (node !== void 0 && typeof attr === 'string' && typeof handle === 'function') {
                            if (node.nodeName) {
                                if (!node[storage]) {
                                    //Node isn't listening
                                    node[storage] = attrs.storage.create(node);
                                    node[storage].init();
                                }
                                storage = node[storage];
                                //Prepare attr if needed
                                if (!storage.isAttrReady(attr)) {
                                    //First handle for attr
                                    storage.make(attr);
                                }
                                //Add handle
                                return storage.add(attr, handle);
                            }
                        }
                        throw 'attrs.bind::' + errors.objects.INCORRECT_ARGUMENTS;
                    }
                },
                unbind  : function (node, attr, id) {
                    /// <signature>
                    ///     <summary>Unbind handle to attribute of node by handle's ID</summary>
                    ///     <param name="node"      type="DOMNode"  >Target node</param>
                    ///     <param name="attr"      type="STRING"   >Attribute name</param>
                    ///     <param name="id"        type="STRING"   >ID of handle</param>
                    ///     <returns type="BOOLEAN"/>
                    /// </signature>
                    var storage = settings.attrs.STORAGE_PROPERTY;
                    if (typeof node === 'object' && typeof attr === 'string' && typeof id === 'string') {
                        if (node[storage]) {
                            storage = node[storage];
                            if (storage.isAttrReady(attr)) {
                                return storage.remove(attr, id);
                            }
                        }
                        return null;
                    }
                    throw 'attrs.unbind::' + errors.objects.INCORRECT_ARGUMENTS;
                },
                kill    : function (node, attr) {
                    /// <signature>
                    ///     <summary>Unbind all handles, which was attached to attribute of node</summary>
                    ///     <param name="node"      type="DOMNode"  >Target node</param>
                    ///     <param name="attr"      type="STRING"   >Attribute name</param>
                    ///     <returns type="BOOLEAN"/>
                    /// </signature>
                    var storage = settings.attrs.STORAGE_PROPERTY;
                    if (typeof node === 'object' && typeof attr === 'string') {
                        if (node[storage]) {
                            storage = node[storage];
                            if (storage.isAttrReady(attr)) {
                                return storage.kill(attr);
                            }
                        }
                        return null;
                    }
                    throw 'attrs.unbind::' + errors.objects.INCORRECT_ARGUMENTS;
                },
            };
            //Binding properties of nodes
            props           = {
                storage : {
                    create : function (node) {
                        var Storage = function (node) {
                                this.node       = node;
                                this.binds      = {};
                                this._destroy   = null;
                            };
                        Storage.prototype = {
                            init            : function (){
                                this._destroy = mutationCross.attach(
                                    node,
                                    this.handle,
                                    this,
                                    {
                                        attributes              : true,
                                        childList               : true,
                                        subtree                 : true,
                                        characterData           : true,
                                        attributeOldValue       : false,
                                        characterDataOldValue   : false
                                    }
                                );
                            },
                            prop            : function(prop){
                                var res     = null,
                                    node    = this.node;
                                prop.split('.').forEach(function (step, index, steps) {
                                    if (node[step] !== void 0 && index < steps.length - 1) {
                                        node = node[step];
                                    } else if (node[step] !== void 0 && index === steps.length - 1) {
                                        res = {
                                            parent  : node,
                                            name    : step
                                        };
                                    }
                                });
                                return res;
                            },
                            handle          : function (attr, mutation) {
                                var self = this;
                                _object(this.binds).forEach(function (prop, bind_data) {
                                    var prop_value = self.binds[prop].parent[prop];
                                    if (prop_value !== self.binds[prop].current) {
                                        self.binds[prop].previous   = self.binds[prop].current;
                                        self.binds[prop].current    = prop_value;
                                        _object(self.binds[prop].handles).forEach(function (id, handle) {
                                            handle.call(self.binds[prop].parent, prop, self.binds[prop].current, self.binds[prop].previous, mutation, id);
                                        });
                                    }
                                });
                            },
                            make            : function (prop) {
                                var prop = this.prop(prop);
                                if (!this.binds[prop.name]) {
                                    this.binds[prop.name] = {
                                        handles     : {},
                                        previous    : null,
                                        current     : prop.parent[prop.name],
                                        parent      : prop.parent
                                    };
                                }
                            },
                            add             : function (prop, handle) {
                                var id      = flex.unique(),
                                    prop    = this.prop(prop);
                                //Save handle ID in handle
                                handle[settings.props.HANDLE_ID_PROPERTY] = id;
                                //Add handle in storage
                                this.binds[prop.name].handles[id] = handle;
                                //Return handle ID
                                return id;
                            },
                            remove          : function (prop, id) {
                                var result  = null,
                                    prop    = this.prop(prop);
                                if (this.binds[prop.name]) {
                                    if (this.binds[prop.name].handles[id]) {
                                        delete this.binds[prop.name].handles[id];
                                        if (Object.keys(this.binds[prop.name].handles).length === 0) {
                                            result = delete this.binds[prop.name];
                                            this.destroy();
                                            return result;
                                        }
                                    }
                                }
                                return result;
                            },
                            kill            : function (prop) {
                                var result  = null,
                                    prop    = this.prop(prop);
                                if (this.binds[prop.name]) {
                                    result = delete this.binds[prop.name];
                                    this.destroy();
                                    return result;
                                }
                                return result;
                            },
                            isPropReady: function (prop) {
                                var prop = this.prop(prop);
                                return this.binds[prop.name] !== void 0 ? true : false;
                            },
                            destroy         : function (){
                                if (Object.keys(this.binds).length === 0) {
                                    this._destroy();
                                    return delete this.node[settings.props.STORAGE_PROPERTY];
                                }
                                return false;
                            },
                        };
                        return new Storage(node);
                    }
                },
                bind    : function (node, prop, handle) {
                    /// <signature>
                    ///     <summary>Bind handle to prop of node</summary>
                    ///     <param name="node"      type="DOMNode"  >Target node</param>
                    ///     <param name="prop"      type="STRING"   >Prop name</param>
                    ///     <param name="handle"    type="FUNCTION" >Handle of prop changing</param>
                    ///     <returns type="STRING"/>
                    /// </signature>
                    function isValidProp(node, prop) {
                        var res = false;
                        prop.split('.').forEach(function (step, index, steps) {
                            if (node[step] !== void 0 && index < steps.length - 1) {
                                node = node[step];
                            } else if (node[step] !== void 0 && index === steps.length - 1) {
                                res = true;
                            }
                        });
                        return res;
                    };
                    var storage = settings.props.STORAGE_PROPERTY,
                        value   = null;
                    if (mutationCross.attach !== null) {
                        if (node !== void 0 && typeof prop === 'string' && typeof handle === 'function') {
                            if (node.nodeName !== void 0) {
                                if (isValidProp(node, prop)) {
                                    if (!node[storage]) {
                                        //Node isn't listening
                                        node[storage] = props.storage.create(node);
                                        node[storage].init();
                                    }
                                    storage = node[storage];
                                    //Prepare prop if needed
                                    if (!storage.isPropReady(prop)) {
                                        //First handle for prop
                                        storage.make(prop);
                                    }
                                    //Add handle
                                    return storage.add(prop, handle);
                                }
                            }
                        }
                        throw 'props.bind::' + errors.objects.INCORRECT_ARGUMENTS;
                    }
                },
                unbind  : function (node, prop, id) {
                    /// <signature>
                    ///     <summary>Unbind handle to prop of node by handle's ID</summary>
                    ///     <param name="node"      type="DOMNode"  >Target node</param>
                    ///     <param name="prop"      type="STRING"   >Prop name</param>
                    ///     <param name="id"        type="STRING"   >ID of handle</param>
                    ///     <returns type="BOOLEAN"/>
                    /// </signature>
                    var storage = settings.props.STORAGE_PROPERTY;
                    if (typeof node === 'object' && typeof prop === 'string' && typeof id === 'string') {
                        if (node[storage]) {
                            storage = node[storage];
                            if (storage.isPropReady(prop)) {
                                return storage.remove(prop, id);
                            }
                        }
                        return null;
                    }
                    throw 'props.unbind::' + errors.objects.INCORRECT_ARGUMENTS;
                },
                kill    : function (node, prop) {
                    /// <signature>
                    ///     <summary>Unbind all handles, which was attached to prop of node</summary>
                    ///     <param name="node"      type="DOMNode"  >Target node</param>
                    ///     <param name="prop"      type="STRING"   >Prop name</param>
                    ///     <returns type="BOOLEAN"/>
                    /// </signature>
                    var storage = settings.props.STORAGE_PROPERTY;
                    if (typeof node === 'object' && typeof prop === 'string') {
                        if (node[storage]) {
                            storage = node[storage];
                            if (storage.isPropReady(prop)) {
                                return storage.kill(prop);
                            }
                        }
                        return null;
                    }
                    throw 'props.unbind::' + errors.objects.INCORRECT_ARGUMENTS;
                },
            };
            mutationCross   = {
                init: function () {
                    mutationCross.attach = mutationCross.attach();
                },
                //Modern
                mutationObserver    : function (node, handle, self, parameters) {
                    var MutationObserver    = window.MutationObserver || window.WebKitMutationObserver,
                        observer            = null;
                    observer = new MutationObserver(function (mutations) {
                        mutations.forEach(function (mutation) {
                            handle.call(self, mutation.attributeName, mutation);
                        });
                    });
                    observer.observe(node, parameters);
                    //Return distroy / disconnect method
                    return function () {
                        observer.disconnect();
                    };
                },
                //Old
                DOMAttrModified     : function (node, handle, self) {
                    flex.events.DOM.add(node, 'DOMAttrModified', function (mutation) {
                        handle.call(self, event.attrName, mutation);
                    });
                    //Return distroy / disconnect method
                    return function () {
                        //Do nothing
                    };
                },
                //IE < 11
                onPropertyChange    : function (node, handle, self) {
                    flex.events.DOM.add(node, 'propertychange', function (mutation) {
                        handle.call(self, event.attributeName, mutation);
                    });
                    //Return distroy / disconnect method
                    return function () {
                        //Do nothing
                    };
                },
                //Common accessor to browser API
                attach              : function () {
                    function isDOMAttrModified() {
                        var node = document.createElement('DIV'),
                            flag = false;
                        flex.events.DOM.add(node, 'DOMAttrModified', function () {
                            flag = true;
                        });
                        node.setAttribute('id', 'test');
                        return flag;
                    };
                    if (window.MutationObserver || window.WebKitMutationObserver) {
                        return mutationCross.mutationObserver;
                    }
                    if (isDOMAttrModified()) {
                        return mutationCross.DOMAttrModified;
                    }
                    if ('onpropertychange' in document.body) {
                        return mutationCross.onPropertyChange;
                    }
                    return null;
                }
            };
            helpers         = {
            };
            callers         = {
                init: function () {
                    flex.callers.define.object('binding.bind',          function (property, handle) {
                        return objects.bind(this.target, property, handle);
                    });
                    flex.callers.define.object('binding.unbind',        function (property, id) {
                        return objects.unbind(this.target, property, id);
                    });
                    flex.callers.define.object('binding.kill',          function (property) {
                        return objects.kill(this.target, property);
                    });

                    flex.callers.define.node('bindingAttrs.bind',       function (attr, handle) {
                        return attrs.bind(this.target, attr, handle);
                    });
                    flex.callers.define.node('bindingAttrs.unbind',     function (attr, id) {
                        return attrs.unbind(this.target, attr, id);
                    });
                    flex.callers.define.node('bindingAttrs.kill',       function (attr) {
                        return attrs.kill(this.target, attr);
                    });

                    flex.callers.define.nodes('bindingAttrs.bind',      function (attr, handle) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target,       function (target) {
                            result.push(attrs.bind(target, attr, handle));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('bindingAttrs.unbind',    function (attr, id) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target,       function (target) {
                            result.push(attrs.unbind(target, attr, id));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('bindingAttrs.kill',      function (attr) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target,       function (target) {
                            result.push(attrs.kill(target, attr));
                        });
                        return result;
                    });

                    flex.callers.define.node('bindingProps.bind',       function (prop, handle) {
                        return props.bind(this.target, prop, handle);
                    });
                    flex.callers.define.node('bindingProps.unbind',     function (prop, id) {
                        return props.unbind(this.target, prop, id);
                    });
                    flex.callers.define.node('bindingProps.kill',       function (prop) {
                        return props.kill(this.target, prop);
                    });

                    flex.callers.define.nodes('bindingProps.bind',      function (prop, handle) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(props.bind(target, prop, handle));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('bindingProps.unbind',    function (prop, id) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(props.unbind(target, prop, id));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('bindingProps.kill',      function (prop) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(props.kill(target, prop));
                        });
                        return result;
                    });
                }
            };
            support     = {
                check   : function () {
                    if (!Object.defineProperty) {
                        throw errors.support.DEFINE_PROPERTY;
                    }
                    if (mutationCross.attach === null) {
                        throw errors.support.MUTATION_SCANNING;
                    }
                }
            };
            //Init 
            mutationCross.init();
            //Initialization of callers
            callers.init();
            //Check support
            support.check();
            //Public part
            privates    = {
            };
            return {
            };
        };
        flex.modules.attach({
            name            : 'binds',
            protofunction   : protofunction,
        });
    }
}());