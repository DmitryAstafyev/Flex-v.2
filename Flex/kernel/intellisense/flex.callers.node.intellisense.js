(function () {
    window['_node'] = function (selector, use_cache, document_link) {
        /// <signature>
        ///     <summary>Return flex node class or NULL if node cannot be found</summary>
        ///     <param name="selector" type="STRING">Selector for target node</param>
        ///     <returns type='Flex node class'/>
        /// </signature>
        /// <signature>
        ///     <summary>Return flex node class or NULL if node cannot be found</summary>
        ///     <param name="node" type="NODE">Target node or [window] object</param>
        ///     <returns type='Flex node class'/>
        /// </signature>
        /// <signature>
        ///     <summary>Return flex node class or NULL if node cannot be found</summary>
        ///     <param name="selector" type="STRING">Selector for target node</param>
        ///     <param name="use_cache" type="BOOLEAN">[true] - use cached data; [false] - don't use cache</param>
        ///     <returns type='Flex node class'/>
        /// </signature>
        /// <signature>
        ///     <summary>Return flex node class or NULL if node cannot be found</summary>
        ///     <param name="selector" type="STRING">Selector for target node</param>
        ///     <param name="use_cache" type="BOOLEAN">[true] - use cached data; [false] - don't use cache</param>
        ///     <param name="document_link" type="DOCUMENT">Link to document object. Can be useful for iFrames for example.</param>
        ///     <returns type='Flex node class'/>
        /// </signature>
        return {
            events      : function () {
                /// <signature>
                ///     <summary>Group of functionality for DOM events</summary>
                /// </signature>
                return {
                    add     : function (type, handle, id, touch) {
                        /// <signature>
                        ///     <summary>Attach event to node or other object</summary>
                        ///     <param name="type" type="STRING">Name of event</param>
                        ///     <param name="handle" type="FUNCTION">Event handle</param>
                        ///     <returns type="boolean"/>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Attach event to node or other object</summary>
                        ///     <param name="type" type="STRING">Name of event</param>
                        ///     <param name="handle" type="FUNCTION">Event handle</param>
                        ///     <param name="id" type="STRING">ID of event handle</param>
                        ///     <returns type="boolean"/>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Attach event to node or other object</summary>
                        ///     <param name="type" type="STRING">Name of event</param>
                        ///     <param name="handle" type="FUNCTION">Event handle</param>
                        ///     <param name="id" type="STRING">ID of event handle</param>
                        ///     <param name="touch" type="BOOLEAN">[true] - attach analog of touch event; [false] - don't attach touch events</param>
                        ///     <returns type="boolean"/>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Attach event to node or other object</summary>
                        ///     <param name="type" type="STRING">Name of event</param>
                        ///     <param name="handle" type="FUNCTION">Event handle</param>
                        ///     <param name="id" type="STRING">ID of event handle</param>
                        ///     <param name="touch" type="BOOLEAN">[true] - attach analog of touch event; [false] - don't attach touch events</param>
                        ///     <param name="safely" type="BOOLEAN">[true] - will block all throws and show log in console instead; [false] - will not block throws</param>
                        ///     <returns type="boolean"/>
                        /// </signature>
                    },
                    remove  : function (type, handle, id) {
                        /// <signature>
                        ///     <summary>Detach event from node or other object</summary>
                        ///     <param name="type" type="STRING">Name of event</param>
                        ///     <param name="handle" type="FUNCTION">Event handle</param>
                        ///     <returns type="boolean"/>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Detach event from node or other object</summary>
                        ///     <param name="type" type="STRING">Name of event</param>
                        ///     <param name="handle" type="FUNCTION">Event handle</param>
                        ///     <param name="id" type="STRING">ID of event handle</param>
                        ///     <returns type="boolean"/>
                        /// </signature>
                    },
                    call    : function (type) {
                        /// <signature>
                        ///     <summary>Call defined event</summary>
                        ///     <param name="type" type="STRING">Name of event</param>
                        ///     <returns type="boolean"/>
                        /// </signature>
                    }
                };
            },
            html        : function () {
                /// <signature>
                ///     <summary>Group of functionality for DOM manipulations</summary>
                /// </signature>
                return {
                    /// <signature>
                    ///     <summary>Detection of size</summary>
                    /// </signature>
                    size    : function () {
                        return {
                            get                 : function () {
                                /// <signature>
                                ///     <summary>Get size of node (without margin)</summary>
                                ///     <returns type="object"/>
                                /// </signature>
                            },
                            getWithMargin       : function () {
                                /// <signature>
                                ///     <summary>Get size of node (with margin)</summary>
                                ///     <returns type="object"/>
                                /// </signature>
                            },
                            getByClientRectSize : function () {
                                /// <signature>
                                ///     <summary>Get size of node using client rectangle size</summary>
                                ///     <returns type="object"/>
                                /// </signature>
                            },
                            getByOffset         : function () {
                                /// <signature>
                                ///     <summary>Get size of node via "old school" method (via offsets)</summary>
                                ///     <returns type="object"/>
                                /// </signature>
                            },
                        };
                    },
                    position: function () {
                        /// <signature>
                        ///     <summary>Detection of node position</summary>
                        /// </signature>
                        return {
                            byPage  : function () {
                                /// <signature>
                                ///     <summary>Get position of node to page</summary>
                                ///     <returns type="object"/>
                                /// </signature>
                            },
                            byWindow: function () {
                                /// <signature>
                                ///     <summary>Get position of node to window (view port)</summary>
                                ///     <returns type="object"/>
                                /// </signature>
                            },
                        };
                    },
                    styles  : function () {
                        /// <signature>
                        ///     <summary>Styling on node</summary>
                        /// </signature>
                        return {
                            apply       : function (styles) {
                                /// <signature>
                                ///     <summary>Apply styles to node</summary>
                                ///     <param name="style" type="OBJECT">Styles, like : { display : "none", margin: "1rem,2rem,3rem,4rem"}</param>
                                ///     <returns type="boolean"/>
                                /// </signature>
                            },
                            redraw      : function () {
                                /// <signature>
                                ///     <summary>Redraw node</summary>
                                ///     <returns type="boolean"/>
                                /// </signature>
                            },
                            addClass    : function (class_name) {
                                /// <signature>
                                ///     <summary>Add class to node</summary>
                                ///     <param name="name" type="STRING">Class name</param>
                                ///     <returns type="boolean"/>
                                /// </signature>
                            },
                            removeClass : function (class_name) {
                                /// <signature>
                                ///     <summary>Remove class from node</summary>
                                ///     <param name="name" type="STRING">Class name</param>
                                ///     <returns type="boolean"/>
                                /// </signature>
                            },
                        };
                    },
                    find    : function () {
                        /// <signature>
                        ///     <summary>Searching other nodes (considering current node)</summary>
                        /// </signature>
                        return {
                            childByAttr : function (node_name, attribute) {
                                /// <signature>
                                ///     <summary>Find first child by node name and attribute</summary>
                                ///     <param name="node_name" type="STRING">Name of child node (DIV, P, A and etc.)</param>
                                ///     <param name="attribute" type="OBJECT">Attribute of child node. { STRING name, STRING value }. Set value to NULL to ignore value of attribute</param>
                                ///     <returns type="NODE"/>
                                /// </signature>
                            },
                            childByType : function (node_name) {
                                /// <signature>
                                ///     <summary>Find first child by node name</summary>
                                ///     <param name="node_name" type="STRING">Name of child node (DIV, P, A and etc.)</param>
                                ///     <returns type="NODE"/>
                                /// </signature>
                            },
                            parentByAttr: function (attribute) {
                                /// <signature>
                                ///     <summary>Find parent by attribute</summary>
                                ///     <param name="attribute" type="OBJECT">Attribute of parent node. { STRING name, STRING value }. Set value to NULL to ignore value of attribute</param>
                                ///     <returns type="NODE"/>
                                /// </signature>
                            },
                            node        : function (selector) {
                                /// <signature>
                                ///     <summary>Find first child node by selector</summary>
                                ///     <param name="selector" type="STRING">Selector of child node</param>
                                ///     <returns type="NODE"/>
                                /// </signature>
                            },
                            nodes       : function (selector) {
                                /// <signature>
                                ///     <summary>Find all child nodes by selector</summary>
                                ///     <param name="selector" type="STRING">Selector of child nodes</param>
                                ///     <returns type="NODES"/>
                                /// </signature>
                            },
                        };
                    },
                    scroll: function () {
                        /// <signature>
                        ///     <summary>Scroll</summary>
                        /// </signature>
                        return {
                            position: function () {
                                /// <signature>
                                ///     <summary>Get parameters of scroll of node</summary>
                                ///     <returns type="NODE"/>
                                /// </signature>
                            },
                        };
                    }
                }
            },
            bindingAttrs: function () {
                /// <signature>
                ///     <summary>Group of functionality for bindings handles to attributes</summary>
                /// </signature>
                return {
                    bind: function (attr, handle) {
                        /// <signature>
                        ///     <summary>Bind handle to attribute of node</summary>
                        ///     <param name="attr"      type="STRING"   >Attribute name</param>
                        ///     <param name="handle"    type="FUNCTION" >Handle of attribute changing</param>
                        ///     <returns type="STRING"/>
                        /// </signature>
                    },
                    unbind: function (attr, id) {
                        /// <signature>
                        ///     <summary>Unbind handle to attribute of node by handle's ID</summary>
                        ///     <param name="attr"      type="STRING"   >Attribute name</param>
                        ///     <param name="id"        type="STRING"   >ID of handle</param>
                        ///     <returns type="BOOLEAN"/>
                        /// </signature>
                    },
                    kill: function (attr) {
                        /// <signature>
                        ///     <summary>Unbind all handles, which was attached to attribute of node</summary>
                        ///     <param name="attr"      type="STRING"   >Attribute name</param>
                        ///     <returns type="BOOLEAN"/>
                        /// </signature>
                    },
                };
            },
            bindingProps: function () {
                /// <signature>
                ///     <summary>Group of functionality for bindings handles to prop</summary>
                /// </signature>
                return {
                    bind: function (prop, handle) {
                        /// <signature>
                        ///     <summary>Bind handle to prop of node</summary>
                        ///     <param name="prop"      type="STRING"   >Prop name</param>
                        ///     <param name="handle"    type="FUNCTION" >Handle of prop changing</param>
                        ///     <returns type="STRING"/>
                        /// </signature>
                    },
                    unbind: function (prop, id) {
                        /// <signature>
                        ///     <summary>Unbind handle to prop of node by handle's ID</summary>
                        ///     <param name="prop"      type="STRING"   >Prop name</param>
                        ///     <param name="id"        type="STRING"   >ID of handle</param>
                        ///     <returns type="BOOLEAN"/>
                        /// </signature>
                    },
                    kill: function (prop) {
                        /// <signature>
                        ///     <summary>Unbind all handles, which was attached to prop of node</summary>
                        ///     <param name="prop"      type="STRING"   >Prop name</param>
                        ///     <returns type="BOOLEAN"/>
                        /// </signature>
                    },
                };
            },
            ui : function(){
                /// <signature>
                ///     <summary>Group of functionality for ui elements</summary>
                /// </signature>
                return {
                    /// <signature>
                    ///     <summary>Patterns controller</summary>
                    /// </signature>
                    patterns: function () {
                        return {
                            append: function (parameters) {
                                /// <summary>
                                /// Load pattern
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
                            }
                        }
                    }
                }
            },
            target: ''
        };
    };
})();