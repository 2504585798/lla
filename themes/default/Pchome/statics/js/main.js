/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Tue Nov 13 2012 08:20:33 GMT-0500 (Eastern Standard Time)
 */
(function (window, undefined) {
    var
        // A central reference to the root jQuery(document)
        rootjQuery,

        // The deferred used on DOM ready
        readyList,

        // Use the correct document accordingly with window argument (sandbox)
        document = window.document,
        location = window.location,
        navigator = window.navigator,

        // Map over jQuery in case of overwrite
        _jQuery = window.jQuery,

        // Map over the $ in case of overwrite
        _$ = window.$,

        // Save a reference to some core methods
        core_push = Array.prototype.push,
        core_slice = Array.prototype.slice,
        core_indexOf = Array.prototype.indexOf,
        core_toString = Object.prototype.toString,
        core_hasOwn = Object.prototype.hasOwnProperty,
        core_trim = String.prototype.trim,

        // Define a local copy of jQuery
        jQuery = function (selector, context) {
            // The jQuery object is actually just the init constructor 'enhanced'
            return new jQuery.fn.init(selector, context, rootjQuery);
        },

        // Used for matching numbers
        core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

        // Used for detecting and trimming whitespace
        core_rnotwhite = /\S/,
        core_rspace = /\s+/,

        // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

        // A simple way to check for HTML strings
        // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
        rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

        // Match a standalone tag
        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

        // JSON RegExp
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

        // Matches dashed string for camelizing
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,

        // Used by jQuery.camelCase as callback to replace()
        fcamelCase = function (all, letter) {
            return (letter + "").toUpperCase();
        },

        // The ready event handler and self cleanup method
        DOMContentLoaded = function () {
            if (document.addEventListener) {
                document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                jQuery.ready();
            } else if (document.readyState === "complete") {
                // we're here because readyState === "complete" in oldIE
                // which is good enough for us to call the dom ready!
                document.detachEvent("onreadystatechange", DOMContentLoaded);
                jQuery.ready();
            }
        },

        // [[Class]] -> type pairs
        class2type = {};

    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        init: function (selector, context, rootjQuery) {
            var match, elem, ret, doc;

            // Handle $(""), $(null), $(undefined), $(false)
            if (!selector) {
                return this;
            }

            // Handle $(DOMElement)
            if (selector.nodeType) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            }

            // Handle HTML strings
            if (typeof selector === "string") {
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                    // Assume that strings that start and end with <> are HTML and skip the regex check
                    match = [null, selector, null];

                } else {
                    match = rquickExpr.exec(selector);
                }

                // Match html or make sure no context is specified for #id
                if (match && (match[1] || !context)) {

                    // HANDLE: $(html) -> $(array)
                    if (match[1]) {
                        context = context instanceof jQuery ? context[0] : context;
                        doc = (context && context.nodeType ? context.ownerDocument || context : document);

                        // scripts is true for back-compat
                        selector = jQuery.parseHTML(match[1], doc, true);
                        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                            this.attr.call(selector, context, true);
                        }

                        return jQuery.merge(this, selector);

                        // HANDLE: $(#id)
                    } else {
                        elem = document.getElementById(match[2]);

                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if (elem && elem.parentNode) {
                            // Handle the case where IE and Opera return items
                            // by name instead of ID
                            if (elem.id !== match[2]) {
                                return rootjQuery.find(selector);
                            }

                            // Otherwise, we inject the element directly into the jQuery object
                            this.length = 1;
                            this[0] = elem;
                        }

                        this.context = document;
                        this.selector = selector;
                        return this;
                    }

                    // HANDLE: $(expr, $(...))
                } else if (!context || context.jquery) {
                    return (context || rootjQuery).find(selector);

                    // HANDLE: $(expr, context)
                    // (which is just equivalent to: $(context).find(expr)
                } else {
                    return this.constructor(context).find(selector);
                }

                // HANDLE: $(function)
                // Shortcut for document ready
            } else if (jQuery.isFunction(selector)) {
                return rootjQuery.ready(selector);
            }

            if (selector.selector !== undefined) {
                this.selector = selector.selector;
                this.context = selector.context;
            }

            return jQuery.makeArray(selector, this);
        },

        // Start with an empty selector
        selector: "",

        // The current version of jQuery being used
        jquery: "1.8.3",

        // The default length of a jQuery object is 0
        length: 0,

        // The number of elements contained in the matched element set
        size: function () {
            return this.length;
        },

        toArray: function () {
            return core_slice.call(this);
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function (num) {
            return num == null ?

                // Return a 'clean' array
                this.toArray() :

                // Return just the object
                (num < 0 ? this[this.length + num] : this[num]);
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function (elems, name, selector) {

            // Build a new jQuery matched element set
            var ret = jQuery.merge(this.constructor(), elems);

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;

            ret.context = this.context;

            if (name === "find") {
                ret.selector = this.selector + (this.selector ? " " : "") + selector;
            } else if (name) {
                ret.selector = this.selector + "." + name + "(" + selector + ")";
            }

            // Return the newly-formed element set
            return ret;
        },

        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        each: function (callback, args) {
            return jQuery.each(this, callback, args);
        },

        ready: function (fn) {
            // Add the callback
            jQuery.ready.promise().done(fn);

            return this;
        },

        eq: function (i) {
            i = +i;
            return i === -1 ?
                this.slice(i) :
                this.slice(i, i + 1);
        },

        first: function () {
            return this.eq(0);
        },

        last: function () {
            return this.eq(-1);
        },

        slice: function () {
            return this.pushStack(core_slice.apply(this, arguments),
                "slice", core_slice.call(arguments).join(","));
        },

        map: function (callback) {
            return this.pushStack(jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            }));
        },

        end: function () {
            return this.prevObject || this.constructor(null);
        },

        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: core_push,
        sort: [].sort,
        splice: [].splice
    };

    // Give the init function the jQuery prototype for later instantiation
    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.extend = jQuery.fn.extend = function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if (length === i) {
            target = this;
            --i;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    jQuery.extend({
        noConflict: function (deep) {
            if (window.$ === jQuery) {
                window.$ = _$;
            }

            if (deep && window.jQuery === jQuery) {
                window.jQuery = _jQuery;
            }

            return jQuery;
        },

        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,

        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,

        // Hold (or release) the ready event
        holdReady: function (hold) {
            if (hold) {
                jQuery.readyWait++;
            } else {
                jQuery.ready(true);
            }
        },

        // Handle when the DOM is ready
        ready: function (wait) {

            // Abort if there are pending holds or we're already ready
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
                return;
            }

            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if (!document.body) {
                return setTimeout(jQuery.ready, 1);
            }

            // Remember that the DOM is ready
            jQuery.isReady = true;

            // If a normal DOM Ready event fired, decrement, and wait if need be
            if (wait !== true && --jQuery.readyWait > 0) {
                return;
            }

            // If there are functions bound, to execute
            readyList.resolveWith(document, [jQuery]);

            // Trigger any bound ready events
            if (jQuery.fn.trigger) {
                jQuery(document).trigger("ready").off("ready");
            }
        },

        // See test/unit/core.js for details concerning isFunction.
        // Since version 1.3, DOM methods and functions like alert
        // aren't supported. They return false on IE (#2968).
        isFunction: function (obj) {
            return jQuery.type(obj) === "function";
        },

        isArray: Array.isArray || function (obj) {
            return jQuery.type(obj) === "array";
        },

        isWindow: function (obj) {
            return obj != null && obj == obj.window;
        },

        isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },

        type: function (obj) {
            return obj == null ?
                String(obj) :
                class2type[core_toString.call(obj)] || "object";
        },

        isPlainObject: function (obj) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
                return false;
            }

            try {
                // Not own constructor property must be Object
                if (obj.constructor &&
                    !core_hasOwn.call(obj, "constructor") &&
                    !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.

            var key;
            for (key in obj) { }

            return key === undefined || core_hasOwn.call(obj, key);
        },

        isEmptyObject: function (obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },

        error: function (msg) {
            throw new Error(msg);
        },

        // data: string of html
        // context (optional): If specified, the fragment will be created in this context, defaults to document
        // scripts (optional): If true, will include scripts passed in the html string
        parseHTML: function (data, context, scripts) {
            var parsed;
            if (!data || typeof data !== "string") {
                return null;
            }
            if (typeof context === "boolean") {
                scripts = context;
                context = 0;
            }
            context = context || document;

            // Single tag
            if ((parsed = rsingleTag.exec(data))) {
                return [context.createElement(parsed[1])];
            }

            parsed = jQuery.buildFragment([data], context, scripts ? null : []);
            return jQuery.merge([],
                (parsed.cacheable ? jQuery.clone(parsed.fragment) : parsed.fragment).childNodes);
        },

        parseJSON: function (data) {
            if (!data || typeof data !== "string") {
                return null;
            }

            // Make sure leading/trailing whitespace is removed (IE can't handle it)
            data = jQuery.trim(data);

            // Attempt to parse using the native JSON parser first
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(data);
            }

            // Make sure the incoming data is actual JSON
            // Logic borrowed from http://json.org/json2.js
            if (rvalidchars.test(data.replace(rvalidescape, "@")
                .replace(rvalidtokens, "]")
                .replace(rvalidbraces, ""))) {

                return (new Function("return " + data))();

            }
            jQuery.error("Invalid JSON: " + data);
        },

        // Cross-browser xml parsing
        parseXML: function (data) {
            var xml, tmp;
            if (!data || typeof data !== "string") {
                return null;
            }
            try {
                if (window.DOMParser) { // Standard
                    tmp = new DOMParser();
                    xml = tmp.parseFromString(data, "text/xml");
                } else { // IE
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(data);
                }
            } catch (e) {
                xml = undefined;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                jQuery.error("Invalid XML: " + data);
            }
            return xml;
        },

        noop: function () { },

        // Evaluates a script in a global context
        // Workarounds based on findings by Jim Driscoll
        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        globalEval: function (data) {
            if (data && core_rnotwhite.test(data)) {
                // We use execScript on Internet Explorer
                // We use an anonymous function so that context is window
                // rather than jQuery in Firefox
                (window.execScript || function (data) {
                    window["eval"].call(window, data);
                })(data);
            }
        },

        // Convert dashed to camelCase; used by the css and data modules
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function (string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },

        nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },

        // args is for internal usage only
        each: function (obj, callback, args) {
            var name,
                i = 0,
                length = obj.length,
                isObj = length === undefined || jQuery.isFunction(obj);

            if (args) {
                if (isObj) {
                    for (name in obj) {
                        if (callback.apply(obj[name], args) === false) {
                            break;
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.apply(obj[i++], args) === false) {
                            break;
                        }
                    }
                }

                // A special, fast, case for the most common use of each
            } else {
                if (isObj) {
                    for (name in obj) {
                        if (callback.call(obj[name], name, obj[name]) === false) {
                            break;
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.call(obj[i], i, obj[i++]) === false) {
                            break;
                        }
                    }
                }
            }

            return obj;
        },

        // Use native String.trim function wherever possible
        trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
            function (text) {
                return text == null ?
                    "" :
                    core_trim.call(text);
            } :

            // Otherwise use our own trimming functionality
            function (text) {
                return text == null ?
                    "" :
                    (text + "").replace(rtrim, "");
            },

        // results is for internal usage only
        makeArray: function (arr, results) {
            var type,
                ret = results || [];

            if (arr != null) {
                // The window, strings (and functions) also have 'length'
                // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
                type = jQuery.type(arr);

                if (arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow(arr)) {
                    core_push.call(ret, arr);
                } else {
                    jQuery.merge(ret, arr);
                }
            }

            return ret;
        },

        inArray: function (elem, arr, i) {
            var len;

            if (arr) {
                if (core_indexOf) {
                    return core_indexOf.call(arr, elem, i);
                }

                len = arr.length;
                i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

                for (; i < len; i++) {
                    // Skip accessing in sparse arrays
                    if (i in arr && arr[i] === elem) {
                        return i;
                    }
                }
            }

            return -1;
        },

        merge: function (first, second) {
            var l = second.length,
                i = first.length,
                j = 0;

            if (typeof l === "number") {
                for (; j < l; j++) {
                    first[i++] = second[j];
                }

            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }

            first.length = i;

            return first;
        },

        grep: function (elems, callback, inv) {
            var retVal,
                ret = [],
                i = 0,
                length = elems.length;
            inv = !!inv;

            // Go through the array, only saving the items
            // that pass the validator function
            for (; i < length; i++) {
                retVal = !!callback(elems[i], i);
                if (inv !== retVal) {
                    ret.push(elems[i]);
                }
            }

            return ret;
        },

        // arg is for internal usage only
        map: function (elems, callback, arg) {
            var value, key,
                ret = [],
                i = 0,
                length = elems.length,
                // jquery objects are treated as arrays
                isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ((length > 0 && elems[0] && elems[length - 1]) || length === 0 || jQuery.isArray(elems));

            // Go through the array, translating each of the items to their
            if (isArray) {
                for (; i < length; i++) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }

                // Go through every key on the object,
            } else {
                for (key in elems) {
                    value = callback(elems[key], key, arg);

                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }
            }

            // Flatten any nested arrays
            return ret.concat.apply([], ret);
        },

        // A global GUID counter for objects
        guid: 1,

        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function (fn, context) {
            var tmp, args, proxy;

            if (typeof context === "string") {
                tmp = fn[context];
                context = fn;
                fn = tmp;
            }

            // Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            if (!jQuery.isFunction(fn)) {
                return undefined;
            }

            // Simulated bind
            args = core_slice.call(arguments, 2);
            proxy = function () {
                return fn.apply(context, args.concat(core_slice.call(arguments)));
            };

            // Set the guid of unique handler to the same of original handler, so it can be removed
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;

            return proxy;
        },

        // Multifunctional method to get and set values of a collection
        // The value/s can optionally be executed if it's a function
        access: function (elems, fn, key, value, chainable, emptyGet, pass) {
            var exec,
                bulk = key == null,
                i = 0,
                length = elems.length;

            // Sets many values
            if (key && typeof key === "object") {
                for (i in key) {
                    jQuery.access(elems, fn, i, key[i], 1, emptyGet, value);
                }
                chainable = 1;

                // Sets one value
            } else if (value !== undefined) {
                // Optionally, function values get executed if exec is true
                exec = pass === undefined && jQuery.isFunction(value);

                if (bulk) {
                    // Bulk operations only iterate when executing function values
                    if (exec) {
                        exec = fn;
                        fn = function (elem, key, value) {
                            return exec.call(jQuery(elem), value);
                        };

                        // Otherwise they run against the entire set
                    } else {
                        fn.call(elems, value);
                        fn = null;
                    }
                }

                if (fn) {
                    for (; i < length; i++) {
                        fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
                    }
                }

                chainable = 1;
            }

            return chainable ?
                elems :

                // Gets
                bulk ?
                    fn.call(elems) :
                    length ? fn(elems[0], key) : emptyGet;
        },

        now: function () {
            return (new Date()).getTime();
        }
    });

    jQuery.ready.promise = function (obj) {
        if (!readyList) {

            readyList = jQuery.Deferred();

            // Catch cases where $(document).ready() is called after the browser event has already occurred.
            // we once tried to use readyState "interactive" here, but it caused issues like the one
            // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
            if (document.readyState === "complete") {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                setTimeout(jQuery.ready, 1);

                // Standards-based browsers support DOMContentLoaded
            } else if (document.addEventListener) {
                // Use the handy event callback
                document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

                // A fallback to window.onload, that will always work
                window.addEventListener("load", jQuery.ready, false);

                // If IE event model is used
            } else {
                // Ensure firing before onload, maybe late but safe also for iframes
                document.attachEvent("onreadystatechange", DOMContentLoaded);

                // A fallback to window.onload, that will always work
                window.attachEvent("onload", jQuery.ready);

                // If IE and not a frame
                // continually check to see if the document is ready
                var top = false;

                try {
                    top = window.frameElement == null && document.documentElement;
                } catch (e) { }

                if (top && top.doScroll) {
                    (function doScrollCheck() {
                        if (!jQuery.isReady) {

                            try {
                                // Use the trick by Diego Perini
                                // http://javascript.nwbox.com/IEContentLoaded/
                                top.doScroll("left");
                            } catch (e) {
                                return setTimeout(doScrollCheck, 50);
                            }

                            // and execute any waiting functions
                            jQuery.ready();
                        }
                    })();
                }
            }
        }
        return readyList.promise(obj);
    };

    // Populate the class2type map
    jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    // All jQuery objects should point back to these
    rootjQuery = jQuery(document);
    // String to Object options format cache
    var optionsCache = {};

    // Convert String-formatted options into Object-formatted ones and store in cache
    function createOptions(options) {
        var object = optionsCache[options] = {};
        jQuery.each(options.split(core_rspace), function (_, flag) {
            object[flag] = true;
        });
        return object;
    }

    /*
     * Create a callback list using the following parameters:
     *
     *	options: an optional list of space-separated options that will change how
     *			the callback list behaves or a more traditional option object
     *
     * By default a callback list will act like an event callback list and can be
     * "fired" multiple times.
     *
     * Possible options:
     *
     *	once:			will ensure the callback list can only be fired once (like a Deferred)
     *
     *	memory:			will keep track of previous values and will call any callback added
     *					after the list has been fired right away with the latest "memorized"
     *					values (like a Deferred)
     *
     *	unique:			will ensure a callback can only be added once (no duplicate in the list)
     *
     *	stopOnFalse:	interrupt callings when a callback returns false
     *
     */
    jQuery.Callbacks = function (options) {

        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = typeof options === "string" ?
            (optionsCache[options] || createOptions(options)) :
            jQuery.extend({}, options);

        var // Last fire value (for non-forgettable lists)
            memory,
            // Flag to know if list was already fired
            fired,
            // Flag to know if list is currently firing
            firing,
            // First callback to fire (used internally by add and fireWith)
            firingStart,
            // End of the loop when firing
            firingLength,
            // Index of currently firing callback (modified by remove if needed)
            firingIndex,
            // Actual callback list
            list = [],
            // Stack of fire calls for repeatable lists
            stack = !options.once && [],
            // Fire callbacks
            fire = function (data) {
                memory = options.memory && data;
                fired = true;
                firingIndex = firingStart || 0;
                firingStart = 0;
                firingLength = list.length;
                firing = true;
                for (; list && firingIndex < firingLength; firingIndex++) {
                    if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                        memory = false; // To prevent further calls using add
                        break;
                    }
                }
                firing = false;
                if (list) {
                    if (stack) {
                        if (stack.length) {
                            fire(stack.shift());
                        }
                    } else if (memory) {
                        list = [];
                    } else {
                        self.disable();
                    }
                }
            },
            // Actual Callbacks object
            self = {
                // Add a callback or a collection of callbacks to the list
                add: function () {
                    if (list) {
                        // First, we save the current length
                        var start = list.length;
                        (function add(args) {
                            jQuery.each(args, function (_, arg) {
                                var type = jQuery.type(arg);
                                if (type === "function") {
                                    if (!options.unique || !self.has(arg)) {
                                        list.push(arg);
                                    }
                                } else if (arg && arg.length && type !== "string") {
                                    // Inspect recursively
                                    add(arg);
                                }
                            });
                        })(arguments);
                        // Do we need to add the callbacks to the
                        // current firing batch?
                        if (firing) {
                            firingLength = list.length;
                            // With memory, if we're not firing then
                            // we should call right away
                        } else if (memory) {
                            firingStart = start;
                            fire(memory);
                        }
                    }
                    return this;
                },
                // Remove a callback from the list
                remove: function () {
                    if (list) {
                        jQuery.each(arguments, function (_, arg) {
                            var index;
                            while ((index = jQuery.inArray(arg, list, index)) > -1) {
                                list.splice(index, 1);
                                // Handle firing indexes
                                if (firing) {
                                    if (index <= firingLength) {
                                        firingLength--;
                                    }
                                    if (index <= firingIndex) {
                                        firingIndex--;
                                    }
                                }
                            }
                        });
                    }
                    return this;
                },
                // Control if a given callback is in the list
                has: function (fn) {
                    return jQuery.inArray(fn, list) > -1;
                },
                // Remove all callbacks from the list
                empty: function () {
                    list = [];
                    return this;
                },
                // Have the list do nothing anymore
                disable: function () {
                    list = stack = memory = undefined;
                    return this;
                },
                // Is it disabled?
                disabled: function () {
                    return !list;
                },
                // Lock the list in its current state
                lock: function () {
                    stack = undefined;
                    if (!memory) {
                        self.disable();
                    }
                    return this;
                },
                // Is it locked?
                locked: function () {
                    return !stack;
                },
                // Call all callbacks with the given context and arguments
                fireWith: function (context, args) {
                    args = args || [];
                    args = [context, args.slice ? args.slice() : args];
                    if (list && (!fired || stack)) {
                        if (firing) {
                            stack.push(args);
                        } else {
                            fire(args);
                        }
                    }
                    return this;
                },
                // Call all the callbacks with the given arguments
                fire: function () {
                    self.fireWith(this, arguments);
                    return this;
                },
                // To know if the callbacks have already been called at least once
                fired: function () {
                    return !!fired;
                }
            };

        return self;
    };
    jQuery.extend({

        Deferred: function (func) {
            var tuples = [
                    // action, add listener, listener list, final state
                    ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", jQuery.Callbacks("memory")]
            ],
                state = "pending",
                promise = {
                    state: function () {
                        return state;
                    },
                    always: function () {
                        deferred.done(arguments).fail(arguments);
                        return this;
                    },
                    then: function ( /* fnDone, fnFail, fnProgress */) {
                        var fns = arguments;
                        return jQuery.Deferred(function (newDefer) {
                            jQuery.each(tuples, function (i, tuple) {
                                var action = tuple[0],
                                    fn = fns[i];
                                // deferred[ done | fail | progress ] for forwarding actions to newDefer
                                deferred[tuple[1]](jQuery.isFunction(fn) ?
                                    function () {
                                        var returned = fn.apply(this, arguments);
                                        if (returned && jQuery.isFunction(returned.promise)) {
                                            returned.promise()
                                                .done(newDefer.resolve)
                                                .fail(newDefer.reject)
                                                .progress(newDefer.notify);
                                        } else {
                                            newDefer[action + "With"](this === deferred ? newDefer : this, [returned]);
                                        }
                                    } :
                                    newDefer[action]
                                );
                            });
                            fns = null;
                        }).promise();
                    },
                    // Get a promise for this deferred
                    // If obj is provided, the promise aspect is added to the object
                    promise: function (obj) {
                        return obj != null ? jQuery.extend(obj, promise) : promise;
                    }
                },
                deferred = {};

            // Keep pipe for back-compat
            promise.pipe = promise.then;

            // Add list-specific methods
            jQuery.each(tuples, function (i, tuple) {
                var list = tuple[2],
                    stateString = tuple[3];

                // promise[ done | fail | progress ] = list.add
                promise[tuple[1]] = list.add;

                // Handle state
                if (stateString) {
                    list.add(function () {
                        // state = [ resolved | rejected ]
                        state = stateString;

                        // [ reject_list | resolve_list ].disable; progress_list.lock
                    }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
                }

                // deferred[ resolve | reject | notify ] = list.fire
                deferred[tuple[0]] = list.fire;
                deferred[tuple[0] + "With"] = list.fireWith;
            });

            // Make the deferred a promise
            promise.promise(deferred);

            // Call given func if any
            if (func) {
                func.call(deferred, deferred);
            }

            // All done!
            return deferred;
        },

        // Deferred helper
        when: function (subordinate /* , ..., subordinateN */) {
            var i = 0,
                resolveValues = core_slice.call(arguments),
                length = resolveValues.length,

                // the count of uncompleted subordinates
                remaining = length !== 1 || (subordinate && jQuery.isFunction(subordinate.promise)) ? length : 0,

                // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
                deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

                // Update function for both resolve and progress values
                updateFunc = function (i, contexts, values) {
                    return function (value) {
                        contexts[i] = this;
                        values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
                        if (values === progressValues) {
                            deferred.notifyWith(contexts, values);
                        } else if (!(--remaining)) {
                            deferred.resolveWith(contexts, values);
                        }
                    };
                },

                progressValues, progressContexts, resolveContexts;

            // add listeners to Deferred subordinates; treat others as resolved
            if (length > 1) {
                progressValues = new Array(length);
                progressContexts = new Array(length);
                resolveContexts = new Array(length);
                for (; i < length; i++) {
                    if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
                        resolveValues[i].promise()
                            .done(updateFunc(i, resolveContexts, resolveValues))
                            .fail(deferred.reject)
                            .progress(updateFunc(i, progressContexts, progressValues));
                    } else {
                        --remaining;
                    }
                }
            }

            // if we're not waiting on anything, resolve the master
            if (!remaining) {
                deferred.resolveWith(resolveContexts, resolveValues);
            }

            return deferred.promise();
        }
    });
    jQuery.support = (function () {

        var support,
            all,
            a,
            select,
            opt,
            input,
            fragment,
            eventName,
            i,
            isSupported,
            clickFn,
            div = document.createElement("div");

        // Setup
        div.setAttribute("className", "t");
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

        // Support tests won't run in some limited or non-browser environments
        all = div.getElementsByTagName("*");
        a = div.getElementsByTagName("a")[0];
        if (!all || !a || !all.length) {
            return {};
        }

        // First batch of tests
        select = document.createElement("select");
        opt = select.appendChild(document.createElement("option"));
        input = div.getElementsByTagName("input")[0];

        a.style.cssText = "top:1px;float:left;opacity:.5";
        support = {
            // IE strips leading whitespace when .innerHTML is used
            leadingWhitespace: (div.firstChild.nodeType === 3),

            // Make sure that tbody elements aren't automatically inserted
            // IE will insert them into empty tables
            tbody: !div.getElementsByTagName("tbody").length,

            // Make sure that link elements get serialized correctly by innerHTML
            // This requires a wrapper element in IE
            htmlSerialize: !!div.getElementsByTagName("link").length,

            // Get the style information from getAttribute
            // (IE uses .cssText instead)
            style: /top/.test(a.getAttribute("style")),

            // Make sure that URLs aren't manipulated
            // (IE normalizes it by default)
            hrefNormalized: (a.getAttribute("href") === "/a"),

            // Make sure that element opacity exists
            // (IE uses filter instead)
            // Use a regex to work around a WebKit issue. See #5145
            opacity: /^0.5/.test(a.style.opacity),

            // Verify style float existence
            // (IE uses styleFloat instead of cssFloat)
            cssFloat: !!a.style.cssFloat,

            // Make sure that if no value is specified for a checkbox
            // that it defaults to "on".
            // (WebKit defaults to "" instead)
            checkOn: (input.value === "on"),

            // Make sure that a selected-by-default option has a working selected property.
            // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
            optSelected: opt.selected,

            // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
            getSetAttribute: div.className !== "t",

            // Tests for enctype support on a form (#6743)
            enctype: !!document.createElement("form").enctype,

            // Makes sure cloning an html5 element does not cause problems
            // Where outerHTML is undefined, this still works
            html5Clone: document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>",

            // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
            boxModel: (document.compatMode === "CSS1Compat"),

            // Will be defined later
            submitBubbles: true,
            changeBubbles: true,
            focusinBubbles: false,
            deleteExpando: true,
            noCloneEvent: true,
            inlineBlockNeedsLayout: false,
            shrinkWrapBlocks: false,
            reliableMarginRight: true,
            boxSizingReliable: true,
            pixelPosition: false
        };

        // Make sure checked status is properly cloned
        input.checked = true;
        support.noCloneChecked = input.cloneNode(true).checked;

        // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as disabled)
        select.disabled = true;
        support.optDisabled = !opt.disabled;

        // Test to see if it's possible to delete an expando from an element
        // Fails in Internet Explorer
        try {
            delete div.test;
        } catch (e) {
            support.deleteExpando = false;
        }

        if (!div.addEventListener && div.attachEvent && div.fireEvent) {
            div.attachEvent("onclick", clickFn = function () {
                // Cloning a node shouldn't copy over any
                // bound event handlers (IE does this)
                support.noCloneEvent = false;
            });
            div.cloneNode(true).fireEvent("onclick");
            div.detachEvent("onclick", clickFn);
        }

        // Check if a radio maintains its value
        // after being appended to the DOM
        input = document.createElement("input");
        input.value = "t";
        input.setAttribute("type", "radio");
        support.radioValue = input.value === "t";

        input.setAttribute("checked", "checked");

        // #11217 - WebKit loses check when the name is after the checked attribute
        input.setAttribute("name", "t");

        div.appendChild(input);
        fragment = document.createDocumentFragment();
        fragment.appendChild(div.lastChild);

        // WebKit doesn't clone checked state correctly in fragments
        support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

        // Check if a disconnected checkbox will retain its checked
        // value of true after appended to the DOM (IE6/7)
        support.appendChecked = input.checked;

        fragment.removeChild(input);
        fragment.appendChild(div);

        // Technique from Juriy Zaytsev
        // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
        // We only care about the case where non-standard event systems
        // are used, namely in IE. Short-circuiting here helps us to
        // avoid an eval call (in setAttribute) which can cause CSP
        // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
        if (div.attachEvent) {
            for (i in {
                submit: true,
                change: true,
                focusin: true
            }) {
                eventName = "on" + i;
                isSupported = (eventName in div);
                if (!isSupported) {
                    div.setAttribute(eventName, "return;");
                    isSupported = (typeof div[eventName] === "function");
                }
                support[i + "Bubbles"] = isSupported;
            }
        }

        // Run tests that need a body at doc ready
        jQuery(function () {
            var container, div, tds, marginDiv,
                divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
                body = document.getElementsByTagName("body")[0];

            if (!body) {
                // Return for frameset docs that don't have a body
                return;
            }

            container = document.createElement("div");
            container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
            body.insertBefore(container, body.firstChild);

            // Construct the test element
            div = document.createElement("div");
            container.appendChild(div);

            // Check if table cells still have offsetWidth/Height when they are set
            // to display:none and there are still other visible table cells in a
            // table row; if so, offsetWidth/Height are not reliable for use when
            // determining if an element has been hidden directly using
            // display:none (it is still safe to use offsets if a parent element is
            // hidden; don safety goggles and see bug #4512 for more information).
            // (only IE 8 fails this test)
            div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
            tds = div.getElementsByTagName("td");
            tds[0].style.cssText = "padding:0;margin:0;border:0;display:none";
            isSupported = (tds[0].offsetHeight === 0);

            tds[0].style.display = "";
            tds[1].style.display = "none";

            // Check if empty table cells still have offsetWidth/Height
            // (IE <= 8 fail this test)
            support.reliableHiddenOffsets = isSupported && (tds[0].offsetHeight === 0);

            // Check box-sizing and margin behavior
            div.innerHTML = "";
            div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
            support.boxSizing = (div.offsetWidth === 4);
            support.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== 1);

            // NOTE: To any future maintainer, we've window.getComputedStyle
            // because jsdom on node.js will break without it.
            if (window.getComputedStyle) {
                support.pixelPosition = (window.getComputedStyle(div, null) || {}).top !== "1%";
                support.boxSizingReliable = (window.getComputedStyle(div, null) || { width: "4px" }).width === "4px";

                // Check if div with explicit width and no margin-right incorrectly
                // gets computed margin-right based on width of container. For more
                // info see bug #3333
                // Fails in WebKit before Feb 2011 nightlies
                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                marginDiv = document.createElement("div");
                marginDiv.style.cssText = div.style.cssText = divReset;
                marginDiv.style.marginRight = marginDiv.style.width = "0";
                div.style.width = "1px";
                div.appendChild(marginDiv);
                support.reliableMarginRight =
                    !parseFloat((window.getComputedStyle(marginDiv, null) || {}).marginRight);
            }

            if (typeof div.style.zoom !== "undefined") {
                // Check if natively block-level elements act like inline-block
                // elements when setting their display to 'inline' and giving
                // them layout
                // (IE < 8 does this)
                div.innerHTML = "";
                div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
                support.inlineBlockNeedsLayout = (div.offsetWidth === 3);

                // Check if elements with layout shrink-wrap their children
                // (IE 6 does this)
                div.style.display = "block";
                div.style.overflow = "visible";
                div.innerHTML = "<div></div>";
                div.firstChild.style.width = "5px";
                support.shrinkWrapBlocks = (div.offsetWidth !== 3);

                container.style.zoom = 1;
            }

            // Null elements to avoid leaks in IE
            body.removeChild(container);
            container = div = tds = marginDiv = null;
        });

        // Null elements to avoid leaks in IE
        fragment.removeChild(div);
        all = a = select = opt = input = fragment = div = null;

        return support;
    })();
    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        rmultiDash = /([A-Z])/g;

    jQuery.extend({
        cache: {},

        deletedIds: [],

        // Remove at next major release (1.9/2.0)
        uuid: 0,

        // Unique for each copy of jQuery on the page
        // Non-digits removed to match rinlinejQuery
        expando: "jQuery" + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ""),

        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
            "embed": true,
            // Ban all objects except for Flash (which handle expandos)
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            "applet": true
        },

        hasData: function (elem) {
            elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
            return !!elem && !isEmptyDataObject(elem);
        },

        data: function (elem, name, data, pvt /* Internal Use Only */) {
            if (!jQuery.acceptData(elem)) {
                return;
            }

            var thisCache, ret,
                internalKey = jQuery.expando,
                getByName = typeof name === "string",

                // We have to handle DOM nodes and JS objects differently because IE6-7
                // can't GC object references properly across the DOM-JS boundary
                isNode = elem.nodeType,

                // Only DOM nodes need the global jQuery cache; JS object data is
                // attached directly to the object so GC can occur automatically
                cache = isNode ? jQuery.cache : elem,

                // Only defining an ID for JS objects if its cache already exists allows
                // the code to shortcut on the same path as a DOM node with no cache
                id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;

            // Avoid doing any more work than we need to when trying to get data on an
            // object that has no data at all
            if ((!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined) {
                return;
            }

            if (!id) {
                // Only DOM nodes need a new unique ID for each element since their data
                // ends up in the global cache
                if (isNode) {
                    elem[internalKey] = id = jQuery.deletedIds.pop() || jQuery.guid++;
                } else {
                    id = internalKey;
                }
            }

            if (!cache[id]) {
                cache[id] = {};

                // Avoids exposing jQuery metadata on plain JS objects when the object
                // is serialized using JSON.stringify
                if (!isNode) {
                    cache[id].toJSON = jQuery.noop;
                }
            }

            // An object can be passed to jQuery.data instead of a key/value pair; this gets
            // shallow copied over onto the existing cache
            if (typeof name === "object" || typeof name === "function") {
                if (pvt) {
                    cache[id] = jQuery.extend(cache[id], name);
                } else {
                    cache[id].data = jQuery.extend(cache[id].data, name);
                }
            }

            thisCache = cache[id];

            // jQuery data() is stored in a separate object inside the object's internal data
            // cache in order to avoid key collisions between internal data and user-defined
            // data.
            if (!pvt) {
                if (!thisCache.data) {
                    thisCache.data = {};
                }

                thisCache = thisCache.data;
            }

            if (data !== undefined) {
                thisCache[jQuery.camelCase(name)] = data;
            }

            // Check for both converted-to-camel and non-converted data property names
            // If a data property was specified
            if (getByName) {

                // First Try to find as-is property data
                ret = thisCache[name];

                // Test for null|undefined property data
                if (ret == null) {

                    // Try to find the camelCased property
                    ret = thisCache[jQuery.camelCase(name)];
                }
            } else {
                ret = thisCache;
            }

            return ret;
        },

        removeData: function (elem, name, pvt /* Internal Use Only */) {
            if (!jQuery.acceptData(elem)) {
                return;
            }

            var thisCache, i, l,

                isNode = elem.nodeType,

                // See jQuery.data for more information
                cache = isNode ? jQuery.cache : elem,
                id = isNode ? elem[jQuery.expando] : jQuery.expando;

            // If there is already no cache entry for this object, there is no
            // purpose in continuing
            if (!cache[id]) {
                return;
            }

            if (name) {

                thisCache = pvt ? cache[id] : cache[id].data;

                if (thisCache) {

                    // Support array or space separated string names for data keys
                    if (!jQuery.isArray(name)) {

                        // try the string as a key before any manipulation
                        if (name in thisCache) {
                            name = [name];
                        } else {

                            // split the camel cased version by spaces unless a key with the spaces exists
                            name = jQuery.camelCase(name);
                            if (name in thisCache) {
                                name = [name];
                            } else {
                                name = name.split(" ");
                            }
                        }
                    }

                    for (i = 0, l = name.length; i < l; i++) {
                        delete thisCache[name[i]];
                    }

                    // If there is no data left in the cache, we want to continue
                    // and let the cache object itself get destroyed
                    if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) {
                        return;
                    }
                }
            }

            // See jQuery.data for more information
            if (!pvt) {
                delete cache[id].data;

                // Don't destroy the parent cache unless the internal data object
                // had been the only thing left in it
                if (!isEmptyDataObject(cache[id])) {
                    return;
                }
            }

            // Destroy the cache
            if (isNode) {
                jQuery.cleanData([elem], true);

                // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
            } else if (jQuery.support.deleteExpando || cache != cache.window) {
                delete cache[id];

                // When all else fails, null
            } else {
                cache[id] = null;
            }
        },

        // For internal use only.
        _data: function (elem, name, data) {
            return jQuery.data(elem, name, data, true);
        },

        // A method for determining if a DOM node can handle the data expando
        acceptData: function (elem) {
            var noData = elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()];

            // nodes accept data unless otherwise specified; rejection can be conditional
            return !noData || noData !== true && elem.getAttribute("classid") === noData;
        }
    });

    jQuery.fn.extend({
        data: function (key, value) {
            var parts, part, attr, name, l,
                elem = this[0],
                i = 0,
                data = null;

            // Gets all values
            if (key === undefined) {
                if (this.length) {
                    data = jQuery.data(elem);

                    if (elem.nodeType === 1 && !jQuery._data(elem, "parsedAttrs")) {
                        attr = elem.attributes;
                        for (l = attr.length; i < l; i++) {
                            name = attr[i].name;

                            if (!name.indexOf("data-")) {
                                name = jQuery.camelCase(name.substring(5));

                                dataAttr(elem, name, data[name]);
                            }
                        }
                        jQuery._data(elem, "parsedAttrs", true);
                    }
                }

                return data;
            }

            // Sets multiple values
            if (typeof key === "object") {
                return this.each(function () {
                    jQuery.data(this, key);
                });
            }

            parts = key.split(".", 2);
            parts[1] = parts[1] ? "." + parts[1] : "";
            part = parts[1] + "!";

            return jQuery.access(this, function (value) {

                if (value === undefined) {
                    data = this.triggerHandler("getData" + part, [parts[0]]);

                    // Try to fetch any internally stored data first
                    if (data === undefined && elem) {
                        data = jQuery.data(elem, key);
                        data = dataAttr(elem, key, data);
                    }

                    return data === undefined && parts[1] ?
                        this.data(parts[0]) :
                        data;
                }

                parts[1] = value;
                this.each(function () {
                    var self = jQuery(this);

                    self.triggerHandler("setData" + part, parts);
                    jQuery.data(this, key, value);
                    self.triggerHandler("changeData" + part, parts);
                });
            }, null, value, arguments.length > 1, null, false);
        },

        removeData: function (key) {
            return this.each(function () {
                jQuery.removeData(this, key);
            });
        }
    });

    function dataAttr(elem, key, data) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if (data === undefined && elem.nodeType === 1) {

            var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();

            data = elem.getAttribute(name);

            if (typeof data === "string") {
                try {
                    data = data === "true" ? true :
                    data === "false" ? false :
                    data === "null" ? null :
                    // Only convert to a number if it doesn't change the string
                    +data + "" === data ? +data :
                    rbrace.test(data) ? jQuery.parseJSON(data) :
                        data;
                } catch (e) { }

                // Make sure we set the data so it isn't changed later
                jQuery.data(elem, key, data);

            } else {
                data = undefined;
            }
        }

        return data;
    }

    // checks a cache object for emptiness
    function isEmptyDataObject(obj) {
        var name;
        for (name in obj) {

            // if the public data object is empty, the private is still empty
            if (name === "data" && jQuery.isEmptyObject(obj[name])) {
                continue;
            }
            if (name !== "toJSON") {
                return false;
            }
        }

        return true;
    }
    jQuery.extend({
        queue: function (elem, type, data) {
            var queue;

            if (elem) {
                type = (type || "fx") + "queue";
                queue = jQuery._data(elem, type);

                // Speed up dequeue by getting out quickly if this is just a lookup
                if (data) {
                    if (!queue || jQuery.isArray(data)) {
                        queue = jQuery._data(elem, type, jQuery.makeArray(data));
                    } else {
                        queue.push(data);
                    }
                }
                return queue || [];
            }
        },

        dequeue: function (elem, type) {
            type = type || "fx";

            var queue = jQuery.queue(elem, type),
                startLength = queue.length,
                fn = queue.shift(),
                hooks = jQuery._queueHooks(elem, type),
                next = function () {
                    jQuery.dequeue(elem, type);
                };

            // If the fx queue is dequeued, always remove the progress sentinel
            if (fn === "inprogress") {
                fn = queue.shift();
                startLength--;
            }

            if (fn) {

                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                // clear up the last queue stop function
                delete hooks.stop;
                fn.call(elem, next, hooks);
            }

            if (!startLength && hooks) {
                hooks.empty.fire();
            }
        },

        // not intended for public consumption - generates a queueHooks object, or returns the current one
        _queueHooks: function (elem, type) {
            var key = type + "queueHooks";
            return jQuery._data(elem, key) || jQuery._data(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function () {
                    jQuery.removeData(elem, type + "queue", true);
                    jQuery.removeData(elem, key, true);
                })
            });
        }
    });

    jQuery.fn.extend({
        queue: function (type, data) {
            var setter = 2;

            if (typeof type !== "string") {
                data = type;
                type = "fx";
                setter--;
            }

            if (arguments.length < setter) {
                return jQuery.queue(this[0], type);
            }

            return data === undefined ?
                this :
                this.each(function () {
                    var queue = jQuery.queue(this, type, data);

                    // ensure a hooks for this queue
                    jQuery._queueHooks(this, type);

                    if (type === "fx" && queue[0] !== "inprogress") {
                        jQuery.dequeue(this, type);
                    }
                });
        },
        dequeue: function (type) {
            return this.each(function () {
                jQuery.dequeue(this, type);
            });
        },
        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        delay: function (time, type) {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || "fx";

            return this.queue(type, function (next, hooks) {
                var timeout = setTimeout(next, time);
                hooks.stop = function () {
                    clearTimeout(timeout);
                };
            });
        },
        clearQueue: function (type) {
            return this.queue(type || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function (type, obj) {
            var tmp,
                count = 1,
                defer = jQuery.Deferred(),
                elements = this,
                i = this.length,
                resolve = function () {
                    if (!(--count)) {
                        defer.resolveWith(elements, [elements]);
                    }
                };

            if (typeof type !== "string") {
                obj = type;
                type = undefined;
            }
            type = type || "fx";

            while (i--) {
                tmp = jQuery._data(elements[i], type + "queueHooks");
                if (tmp && tmp.empty) {
                    count++;
                    tmp.empty.add(resolve);
                }
            }
            resolve();
            return defer.promise(obj);
        }
    });
    var nodeHook, boolHook, fixSpecified,
        rclass = /[\t\r\n]/g,
        rreturn = /\r/g,
        rtype = /^(?:button|input)$/i,
        rfocusable = /^(?:button|input|object|select|textarea)$/i,
        rclickable = /^a(?:rea|)$/i,
        rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        getSetAttribute = jQuery.support.getSetAttribute;

    jQuery.fn.extend({
        attr: function (name, value) {
            return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1);
        },

        removeAttr: function (name) {
            return this.each(function () {
                jQuery.removeAttr(this, name);
            });
        },

        prop: function (name, value) {
            return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1);
        },

        removeProp: function (name) {
            name = jQuery.propFix[name] || name;
            return this.each(function () {
                // try/catch handles cases where IE balks (such as removing a property on window)
                try {
                    this[name] = undefined;
                    delete this[name];
                } catch (e) { }
            });
        },

        addClass: function (value) {
            var classNames, i, l, elem,
                setClass, c, cl;

            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).addClass(value.call(this, j, this.className));
                });
            }

            if (value && typeof value === "string") {
                classNames = value.split(core_rspace);

                for (i = 0, l = this.length; i < l; i++) {
                    elem = this[i];

                    if (elem.nodeType === 1) {
                        if (!elem.className && classNames.length === 1) {
                            elem.className = value;

                        } else {
                            setClass = " " + elem.className + " ";

                            for (c = 0, cl = classNames.length; c < cl; c++) {
                                if (setClass.indexOf(" " + classNames[c] + " ") < 0) {
                                    setClass += classNames[c] + " ";
                                }
                            }
                            elem.className = jQuery.trim(setClass);
                        }
                    }
                }
            }

            return this;
        },

        removeClass: function (value) {
            var removes, className, elem, c, cl, i, l;

            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).removeClass(value.call(this, j, this.className));
                });
            }
            if ((value && typeof value === "string") || value === undefined) {
                removes = (value || "").split(core_rspace);

                for (i = 0, l = this.length; i < l; i++) {
                    elem = this[i];
                    if (elem.nodeType === 1 && elem.className) {

                        className = (" " + elem.className + " ").replace(rclass, " ");

                        // loop over each item in the removal list
                        for (c = 0, cl = removes.length; c < cl; c++) {
                            // Remove until there is nothing to remove,
                            while (className.indexOf(" " + removes[c] + " ") >= 0) {
                                className = className.replace(" " + removes[c] + " ", " ");
                            }
                        }
                        elem.className = value ? jQuery.trim(className) : "";
                    }
                }
            }

            return this;
        },

        toggleClass: function (value, stateVal) {
            var type = typeof value,
                isBool = typeof stateVal === "boolean";

            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
                });
            }

            return this.each(function () {
                if (type === "string") {
                    // toggle individual class names
                    var className,
                        i = 0,
                        self = jQuery(this),
                        state = stateVal,
                        classNames = value.split(core_rspace);

                    while ((className = classNames[i++])) {
                        // check each className given, space separated list
                        state = isBool ? state : !self.hasClass(className);
                        self[state ? "addClass" : "removeClass"](className);
                    }

                } else if (type === "undefined" || type === "boolean") {
                    if (this.className) {
                        // store className if set
                        jQuery._data(this, "__className__", this.className);
                    }

                    // toggle whole className
                    this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
                }
            });
        },

        hasClass: function (selector) {
            var className = " " + selector + " ",
                i = 0,
                l = this.length;
            for (; i < l; i++) {
                if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) {
                    return true;
                }
            }

            return false;
        },

        val: function (value) {
            var hooks, ret, isFunction,
                elem = this[0];

            if (!arguments.length) {
                if (elem) {
                    hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

                    if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                        return ret;
                    }

                    ret = elem.value;

                    return typeof ret === "string" ?
                        // handle most common string cases
                        ret.replace(rreturn, "") :
                        // handle cases where value is null/undef or number
                        ret == null ? "" : ret;
                }

                return;
            }

            isFunction = jQuery.isFunction(value);

            return this.each(function (i) {
                var val,
                    self = jQuery(this);

                if (this.nodeType !== 1) {
                    return;
                }

                if (isFunction) {
                    val = value.call(this, i, self.val());
                } else {
                    val = value;
                }

                // Treat null/undefined as ""; convert numbers to string
                if (val == null) {
                    val = "";
                } else if (typeof val === "number") {
                    val += "";
                } else if (jQuery.isArray(val)) {
                    val = jQuery.map(val, function (value) {
                        return value == null ? "" : value + "";
                    });
                }

                hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

                // If set returns undefined, fall back to normal setting
                if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
                    this.value = val;
                }
            });
        }
    });

    jQuery.extend({
        valHooks: {
            option: {
                get: function (elem) {
                    // attributes.value is undefined in Blackberry 4.7 but
                    // uses .value. See #6932
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text;
                }
            },
            select: {
                get: function (elem) {
                    var value, option,
                        options = elem.options,
                        index = elem.selectedIndex,
                        one = elem.type === "select-one" || index < 0,
                        values = one ? null : [],
                        max = one ? index + 1 : options.length,
                        i = index < 0 ?
                        max :
                            one ? index : 0;

                    // Loop through all the selected options
                    for (; i < max; i++) {
                        option = options[i];

                        // oldIE doesn't update selected after form reset (#2551)
                        if ((option.selected || i === index) &&
                            // Don't return options that are disabled or in a disabled optgroup
                                (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
                                (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {

                            // Get the specific value for the option
                            value = jQuery(option).val();

                            // We don't need an array for one selects
                            if (one) {
                                return value;
                            }

                            // Multi-Selects return an array
                            values.push(value);
                        }
                    }

                    return values;
                },

                set: function (elem, value) {
                    var values = jQuery.makeArray(value);

                    jQuery(elem).find("option").each(function () {
                        this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
                    });

                    if (!values.length) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }
        },

        // Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
        attrFn: {},

        attr: function (elem, name, value, pass) {
            var ret, hooks, notxml,
                nType = elem.nodeType;

            // don't get/set attributes on text, comment and attribute nodes
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }

            if (pass && jQuery.isFunction(jQuery.fn[name])) {
                return jQuery(elem)[name](value);
            }

            // Fallback to prop when attributes are not supported
            if (typeof elem.getAttribute === "undefined") {
                return jQuery.prop(elem, name, value);
            }

            notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

            // All attributes are lowercase
            // Grab necessary hook if one is defined
            if (notxml) {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[name] || (rboolean.test(name) ? boolHook : nodeHook);
            }

            if (value !== undefined) {

                if (value === null) {
                    jQuery.removeAttr(elem, name);
                    return;

                } else if (hooks && "set" in hooks && notxml && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;

                } else {
                    elem.setAttribute(name, value + "");
                    return value;
                }

            } else if (hooks && "get" in hooks && notxml && (ret = hooks.get(elem, name)) !== null) {
                return ret;

            } else {

                ret = elem.getAttribute(name);

                // Non-existent attributes return null, we normalize to undefined
                return ret === null ?
                    undefined :
                    ret;
            }
        },

        removeAttr: function (elem, value) {
            var propName, attrNames, name, isBool,
                i = 0;

            if (value && elem.nodeType === 1) {

                attrNames = value.split(core_rspace);

                for (; i < attrNames.length; i++) {
                    name = attrNames[i];

                    if (name) {
                        propName = jQuery.propFix[name] || name;
                        isBool = rboolean.test(name);

                        // See #9699 for explanation of this approach (setting first, then removal)
                        // Do not do this for boolean attributes (see #10870)
                        if (!isBool) {
                            jQuery.attr(elem, name, "");
                        }
                        elem.removeAttribute(getSetAttribute ? name : propName);

                        // Set corresponding property to false for boolean attributes
                        if (isBool && propName in elem) {
                            elem[propName] = false;
                        }
                    }
                }
            }
        },

        attrHooks: {
            type: {
                set: function (elem, value) {
                    // We can't allow the type property to be changed (since it causes problems in IE)
                    if (rtype.test(elem.nodeName) && elem.parentNode) {
                        jQuery.error("type property can't be changed");
                    } else if (!jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
                        // Setting the type on a radio button after the value resets the value in IE6-9
                        // Reset value to it's default in case type is set after value
                        // This is for element creation
                        var val = elem.value;
                        elem.setAttribute("type", value);
                        if (val) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            },
            // Use the value property for back compat
            // Use the nodeHook for button elements in IE6/7 (#1954)
            value: {
                get: function (elem, name) {
                    if (nodeHook && jQuery.nodeName(elem, "button")) {
                        return nodeHook.get(elem, name);
                    }
                    return name in elem ?
                        elem.value :
                        null;
                },
                set: function (elem, value, name) {
                    if (nodeHook && jQuery.nodeName(elem, "button")) {
                        return nodeHook.set(elem, value, name);
                    }
                    // Does not return so that setAttribute is also used
                    elem.value = value;
                }
            }
        },

        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },

        prop: function (elem, name, value) {
            var ret, hooks, notxml,
                nType = elem.nodeType;

            // don't get/set properties on text, comment and attribute nodes
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }

            notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

            if (notxml) {
                // Fix name and attach hooks
                name = jQuery.propFix[name] || name;
                hooks = jQuery.propHooks[name];
            }

            if (value !== undefined) {
                if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;

                } else {
                    return (elem[name] = value);
                }

            } else {
                if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
                    return ret;

                } else {
                    return elem[name];
                }
            }
        },

        propHooks: {
            tabIndex: {
                get: function (elem) {
                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    var attributeNode = elem.getAttributeNode("tabindex");

                    return attributeNode && attributeNode.specified ?
                        parseInt(attributeNode.value, 10) :
                        rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
                            0 :
                            undefined;
                }
            }
        }
    });

    // Hook for boolean attributes
    boolHook = {
        get: function (elem, name) {
            // Align boolean attributes with corresponding properties
            // Fall back to attribute presence where some booleans are not supported
            var attrNode,
                property = jQuery.prop(elem, name);
            return property === true || typeof property !== "boolean" && (attrNode = elem.getAttributeNode(name)) && attrNode.nodeValue !== false ?
                name.toLowerCase() :
                undefined;
        },
        set: function (elem, value, name) {
            var propName;
            if (value === false) {
                // Remove boolean attributes when set to false
                jQuery.removeAttr(elem, name);
            } else {
                // value is true since we know at this point it's type boolean and not false
                // Set boolean attributes to the same name and set the DOM property
                propName = jQuery.propFix[name] || name;
                if (propName in elem) {
                    // Only set the IDL specifically if it already exists on the element
                    elem[propName] = true;
                }

                elem.setAttribute(name, name.toLowerCase());
            }
            return name;
        }
    };

    // IE6/7 do not support getting/setting some attributes with get/setAttribute
    if (!getSetAttribute) {

        fixSpecified = {
            name: true,
            id: true,
            coords: true
        };

        // Use this for any attribute in IE6/7
        // This fixes almost every IE6/7 issue
        nodeHook = jQuery.valHooks.button = {
            get: function (elem, name) {
                var ret;
                ret = elem.getAttributeNode(name);
                return ret && (fixSpecified[name] ? ret.value !== "" : ret.specified) ?
                    ret.value :
                    undefined;
            },
            set: function (elem, value, name) {
                // Set the existing or create a new attribute node
                var ret = elem.getAttributeNode(name);
                if (!ret) {
                    ret = document.createAttribute(name);
                    elem.setAttributeNode(ret);
                }
                return (ret.value = value + "");
            }
        };

        // Set width and height to auto instead of 0 on empty string( Bug #8150 )
        // This is for removals
        jQuery.each(["width", "height"], function (i, name) {
            jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
                set: function (elem, value) {
                    if (value === "") {
                        elem.setAttribute(name, "auto");
                        return value;
                    }
                }
            });
        });

        // Set contenteditable to false on removals(#10429)
        // Setting to empty string throws an error as an invalid value
        jQuery.attrHooks.contenteditable = {
            get: nodeHook.get,
            set: function (elem, value, name) {
                if (value === "") {
                    value = "false";
                }
                nodeHook.set(elem, value, name);
            }
        };
    }


    // Some attributes require a special call on IE
    if (!jQuery.support.hrefNormalized) {
        jQuery.each(["href", "src", "width", "height"], function (i, name) {
            jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
                get: function (elem) {
                    var ret = elem.getAttribute(name, 2);
                    return ret === null ? undefined : ret;
                }
            });
        });
    }

    if (!jQuery.support.style) {
        jQuery.attrHooks.style = {
            get: function (elem) {
                // Return undefined in the case of empty string
                // Normalize to lowercase since IE uppercases css property names
                return elem.style.cssText.toLowerCase() || undefined;
            },
            set: function (elem, value) {
                return (elem.style.cssText = value + "");
            }
        };
    }

    // Safari mis-reports the default selected property of an option
    // Accessing the parent's selectedIndex property fixes it
    if (!jQuery.support.optSelected) {
        jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
            get: function (elem) {
                var parent = elem.parentNode;

                if (parent) {
                    parent.selectedIndex;

                    // Make sure that it also works with optgroups, see #5701
                    if (parent.parentNode) {
                        parent.parentNode.selectedIndex;
                    }
                }
                return null;
            }
        });
    }

    // IE6/7 call enctype encoding
    if (!jQuery.support.enctype) {
        jQuery.propFix.enctype = "encoding";
    }

    // Radios and checkboxes getter/setter
    if (!jQuery.support.checkOn) {
        jQuery.each(["radio", "checkbox"], function () {
            jQuery.valHooks[this] = {
                get: function (elem) {
                    // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                    return elem.getAttribute("value") === null ? "on" : elem.value;
                }
            };
        });
    }
    jQuery.each(["radio", "checkbox"], function () {
        jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
            set: function (elem, value) {
                if (jQuery.isArray(value)) {
                    return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0);
                }
            }
        });
    });
    var rformElems = /^(?:textarea|input|select)$/i,
        rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
        rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        hoverHack = function (events) {
            return jQuery.event.special.hover ? events : events.replace(rhoverHack, "mouseenter$1 mouseleave$1");
        };

    /*
     * Helper functions for managing events -- not part of the public interface.
     * Props to Dean Edwards' addEvent library for many of the ideas.
     */
    jQuery.event = {

        add: function (elem, types, handler, data, selector) {

            var elemData, eventHandle, events,
                t, tns, type, namespaces, handleObj,
                handleObjIn, handlers, special;

            // Don't attach events to noData or text/comment nodes (allow plain objects tho)
            if (elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data(elem))) {
                return;
            }

            // Caller can pass in an object of custom data in lieu of the handler
            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }

            // Make sure that the handler has a unique ID, used to find/remove it later
            if (!handler.guid) {
                handler.guid = jQuery.guid++;
            }

            // Init the element's event structure and main handler, if this is the first
            events = elemData.events;
            if (!events) {
                elemData.events = events = {};
            }
            eventHandle = elemData.handle;
            if (!eventHandle) {
                elemData.handle = eventHandle = function (e) {
                    // Discard the second event of a jQuery.event.trigger() and
                    // when an event is called after a page has unloaded
                    return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
                        jQuery.event.dispatch.apply(eventHandle.elem, arguments) :
                        undefined;
                };
                // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
                eventHandle.elem = elem;
            }

            // Handle multiple events separated by a space
            // jQuery(...).bind("mouseover mouseout", fn);
            types = jQuery.trim(hoverHack(types)).split(" ");
            for (t = 0; t < types.length; t++) {

                tns = rtypenamespace.exec(types[t]) || [];
                type = tns[1];
                namespaces = (tns[2] || "").split(".").sort();

                // If event changes its type, use the special event handlers for the changed type
                special = jQuery.event.special[type] || {};

                // If selector defined, determine special event api type, otherwise given type
                type = (selector ? special.delegateType : special.bindType) || type;

                // Update special based on newly reset type
                special = jQuery.event.special[type] || {};

                // handleObj is passed to all event handlers
                handleObj = jQuery.extend({
                    type: type,
                    origType: tns[1],
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                    namespace: namespaces.join(".")
                }, handleObjIn);

                // Init the event handler queue if we're the first
                handlers = events[type];
                if (!handlers) {
                    handlers = events[type] = [];
                    handlers.delegateCount = 0;

                    // Only use addEventListener/attachEvent if the special events handler returns false
                    if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                        // Bind the global event handler to the element
                        if (elem.addEventListener) {
                            elem.addEventListener(type, eventHandle, false);

                        } else if (elem.attachEvent) {
                            elem.attachEvent("on" + type, eventHandle);
                        }
                    }
                }

                if (special.add) {
                    special.add.call(elem, handleObj);

                    if (!handleObj.handler.guid) {
                        handleObj.handler.guid = handler.guid;
                    }
                }

                // Add to the element's handler list, delegates in front
                if (selector) {
                    handlers.splice(handlers.delegateCount++, 0, handleObj);
                } else {
                    handlers.push(handleObj);
                }

                // Keep track of which events have ever been used, for event optimization
                jQuery.event.global[type] = true;
            }

            // Nullify elem to prevent memory leaks in IE
            elem = null;
        },

        global: {},

        // Detach an event or set of events from an element
        remove: function (elem, types, handler, selector, mappedTypes) {

            var t, tns, type, origType, namespaces, origCount,
                j, events, special, eventType, handleObj,
                elemData = jQuery.hasData(elem) && jQuery._data(elem);

            if (!elemData || !(events = elemData.events)) {
                return;
            }

            // Once for each type.namespace in types; type may be omitted
            types = jQuery.trim(hoverHack(types || "")).split(" ");
            for (t = 0; t < types.length; t++) {
                tns = rtypenamespace.exec(types[t]) || [];
                type = origType = tns[1];
                namespaces = tns[2];

                // Unbind all events (on this namespace, if provided) for the element
                if (!type) {
                    for (type in events) {
                        jQuery.event.remove(elem, type + types[t], handler, selector, true);
                    }
                    continue;
                }

                special = jQuery.event.special[type] || {};
                type = (selector ? special.delegateType : special.bindType) || type;
                eventType = events[type] || [];
                origCount = eventType.length;
                namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

                // Remove matching events
                for (j = 0; j < eventType.length; j++) {
                    handleObj = eventType[j];

                    if ((mappedTypes || origType === handleObj.origType) &&
                         (!handler || handler.guid === handleObj.guid) &&
                         (!namespaces || namespaces.test(handleObj.namespace)) &&
                         (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                        eventType.splice(j--, 1);

                        if (handleObj.selector) {
                            eventType.delegateCount--;
                        }
                        if (special.remove) {
                            special.remove.call(elem, handleObj);
                        }
                    }
                }

                // Remove generic event handler if we removed something and no more handlers exist
                // (avoids potential for endless recursion during removal of special event handlers)
                if (eventType.length === 0 && origCount !== eventType.length) {
                    if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                        jQuery.removeEvent(elem, type, elemData.handle);
                    }

                    delete events[type];
                }
            }

            // Remove the expando if it's no longer used
            if (jQuery.isEmptyObject(events)) {
                delete elemData.handle;

                // removeData also checks for emptiness and clears the expando if empty
                // so use it instead of delete
                jQuery.removeData(elem, "events", true);
            }
        },

        // Events that are safe to short-circuit if no handlers are attached.
        // Native DOM events should not be added, they may have inline handlers.
        customEvent: {
            "getData": true,
            "setData": true,
            "changeData": true
        },

        trigger: function (event, data, elem, onlyHandlers) {
            // Don't do events on text and comment nodes
            if (elem && (elem.nodeType === 3 || elem.nodeType === 8)) {
                return;
            }

            // Event object or event type
            var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
                type = event.type || event,
                namespaces = [];

            // focus/blur morphs to focusin/out; ensure we're not firing them right now
            if (rfocusMorph.test(type + jQuery.event.triggered)) {
                return;
            }

            if (type.indexOf("!") >= 0) {
                // Exclusive events trigger only for the exact event (no namespaces)
                type = type.slice(0, -1);
                exclusive = true;
            }

            if (type.indexOf(".") >= 0) {
                // Namespaced trigger; create a regexp to match event type in handle()
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }

            if ((!elem || jQuery.event.customEvent[type]) && !jQuery.event.global[type]) {
                // No jQuery handlers for this event type, and it can't have inline handlers
                return;
            }

            // Caller can pass in an Event, Object, or just an event type string
            event = typeof event === "object" ?
                // jQuery.Event object
                event[jQuery.expando] ? event :
                // Object literal
                new jQuery.Event(type, event) :
                // Just the event type (string)
                new jQuery.Event(type);

            event.type = type;
            event.isTrigger = true;
            event.exclusive = exclusive;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            ontype = type.indexOf(":") < 0 ? "on" + type : "";

            // Handle a global trigger
            if (!elem) {

                // TODO: Stop taunting the data cache; remove global events and always attach to document
                cache = jQuery.cache;
                for (i in cache) {
                    if (cache[i].events && cache[i].events[type]) {
                        jQuery.event.trigger(event, data, cache[i].handle.elem, true);
                    }
                }
                return;
            }

            // Clean up the event in case it is being reused
            event.result = undefined;
            if (!event.target) {
                event.target = elem;
            }

            // Clone any incoming data and prepend the event, creating the handler arg list
            data = data != null ? jQuery.makeArray(data) : [];
            data.unshift(event);

            // Allow special events to draw outside the lines
            special = jQuery.event.special[type] || {};
            if (special.trigger && special.trigger.apply(elem, data) === false) {
                return;
            }

            // Determine event propagation path in advance, per W3C events spec (#9951)
            // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
            eventPath = [[elem, special.bindType || type]];
            if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

                bubbleType = special.delegateType || type;
                cur = rfocusMorph.test(bubbleType + type) ? elem : elem.parentNode;
                for (old = elem; cur; cur = cur.parentNode) {
                    eventPath.push([cur, bubbleType]);
                    old = cur;
                }

                // Only add window if we got to document (e.g., not plain obj or detached DOM)
                if (old === (elem.ownerDocument || document)) {
                    eventPath.push([old.defaultView || old.parentWindow || window, bubbleType]);
                }
            }

            // Fire handlers on the event path
            for (i = 0; i < eventPath.length && !event.isPropagationStopped() ; i++) {

                cur = eventPath[i][0];
                event.type = eventPath[i][1];

                handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
                if (handle) {
                    handle.apply(cur, data);
                }
                // Note that this is a bare JS function and not a jQuery handler
                handle = ontype && cur[ontype];
                if (handle && jQuery.acceptData(cur) && handle.apply && handle.apply(cur, data) === false) {
                    event.preventDefault();
                }
            }
            event.type = type;

            // If nobody prevented the default action, do it now
            if (!onlyHandlers && !event.isDefaultPrevented()) {

                if ((!special._default || special._default.apply(elem.ownerDocument, data) === false) &&
                    !(type === "click" && jQuery.nodeName(elem, "a")) && jQuery.acceptData(elem)) {

                    // Call a native DOM method on the target with the same name name as the event.
                    // Can't use an .isFunction() check here because IE6/7 fails that test.
                    // Don't do default actions on window, that's where global variables be (#6170)
                    // IE<9 dies on focus/blur to hidden element (#1486)
                    if (ontype && elem[type] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow(elem)) {

                        // Don't re-trigger an onFOO event when we call its FOO() method
                        old = elem[ontype];

                        if (old) {
                            elem[ontype] = null;
                        }

                        // Prevent re-triggering of the same event, since we already bubbled it above
                        jQuery.event.triggered = type;
                        elem[type]();
                        jQuery.event.triggered = undefined;

                        if (old) {
                            elem[ontype] = old;
                        }
                    }
                }
            }

            return event.result;
        },

        dispatch: function (event) {

            // Make a writable jQuery.Event from the native event object
            event = jQuery.event.fix(event || window.event);

            var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
                handlers = ((jQuery._data(this, "events") || {})[event.type] || []),
                delegateCount = handlers.delegateCount,
                args = core_slice.call(arguments),
                run_all = !event.exclusive && !event.namespace,
                special = jQuery.event.special[event.type] || {},
                handlerQueue = [];

            // Use the fix-ed jQuery.Event rather than the (read-only) native event
            args[0] = event;
            event.delegateTarget = this;

            // Call the preDispatch hook for the mapped type, and let it bail if desired
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
                return;
            }

            // Determine handlers that should run if there are delegated events
            // Avoid non-left-click bubbling in Firefox (#3861)
            if (delegateCount && !(event.button && event.type === "click")) {

                for (cur = event.target; cur != this; cur = cur.parentNode || this) {

                    // Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
                    if (cur.disabled !== true || event.type !== "click") {
                        selMatch = {};
                        matches = [];
                        for (i = 0; i < delegateCount; i++) {
                            handleObj = handlers[i];
                            sel = handleObj.selector;

                            if (selMatch[sel] === undefined) {
                                selMatch[sel] = handleObj.needsContext ?
                                    jQuery(sel, this).index(cur) >= 0 :
                                    jQuery.find(sel, this, null, [cur]).length;
                            }
                            if (selMatch[sel]) {
                                matches.push(handleObj);
                            }
                        }
                        if (matches.length) {
                            handlerQueue.push({ elem: cur, matches: matches });
                        }
                    }
                }
            }

            // Add the remaining (directly-bound) handlers
            if (handlers.length > delegateCount) {
                handlerQueue.push({ elem: this, matches: handlers.slice(delegateCount) });
            }

            // Run delegates first; they may want to stop propagation beneath us
            for (i = 0; i < handlerQueue.length && !event.isPropagationStopped() ; i++) {
                matched = handlerQueue[i];
                event.currentTarget = matched.elem;

                for (j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped() ; j++) {
                    handleObj = matched.matches[j];

                    // Triggered event must either 1) be non-exclusive and have no namespace, or
                    // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                    if (run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test(handleObj.namespace)) {

                        event.data = handleObj.data;
                        event.handleObj = handleObj;

                        ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler)
                                .apply(matched.elem, args);

                        if (ret !== undefined) {
                            event.result = ret;
                            if (ret === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }

            // Call the postDispatch hook for the mapped type
            if (special.postDispatch) {
                special.postDispatch.call(this, event);
            }

            return event.result;
        },

        // Includes some event props shared by KeyEvent and MouseEvent
        // *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
        props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

        fixHooks: {},

        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function (event, original) {

                // Add which for key events
                if (event.which == null) {
                    event.which = original.charCode != null ? original.charCode : original.keyCode;
                }

                return event;
            }
        },

        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (event, original) {
                var eventDoc, doc, body,
                    button = original.button,
                    fromElement = original.fromElement;

                // Calculate pageX/Y if missing and clientX/Y available
                if (event.pageX == null && original.clientX != null) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;

                    event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                    event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                }

                // Add relatedTarget, if necessary
                if (!event.relatedTarget && fromElement) {
                    event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                }

                // Add which for click: 1 === left; 2 === middle; 3 === right
                // Note: button is not normalized, so don't use it
                if (!event.which && button !== undefined) {
                    event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
                }

                return event;
            }
        },

        fix: function (event) {
            if (event[jQuery.expando]) {
                return event;
            }

            // Create a writable copy of the event object and normalize some properties
            var i, prop,
                originalEvent = event,
                fixHook = jQuery.event.fixHooks[event.type] || {},
                copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

            event = jQuery.Event(originalEvent);

            for (i = copy.length; i;) {
                prop = copy[--i];
                event[prop] = originalEvent[prop];
            }

            // Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
            if (!event.target) {
                event.target = originalEvent.srcElement || document;
            }

            // Target should not be a text node (#504, Safari)
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }

            // For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
            event.metaKey = !!event.metaKey;

            return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },

        special: {
            load: {
                // Prevent triggered image.load events from bubbling to window.load
                noBubble: true
            },

            focus: {
                delegateType: "focusin"
            },
            blur: {
                delegateType: "focusout"
            },

            beforeunload: {
                setup: function (data, namespaces, eventHandle) {
                    // We only want to do this special case on windows
                    if (jQuery.isWindow(this)) {
                        this.onbeforeunload = eventHandle;
                    }
                },

                teardown: function (namespaces, eventHandle) {
                    if (this.onbeforeunload === eventHandle) {
                        this.onbeforeunload = null;
                    }
                }
            }
        },

        simulate: function (type, elem, event, bubble) {
            // Piggyback on a donor event to simulate a different one.
            // Fake originalEvent to avoid donor's stopPropagation, but if the
            // simulated event prevents default then we do the same on the donor.
            var e = jQuery.extend(
                new jQuery.Event(),
                event,
                {
                    type: type,
                    isSimulated: true,
                    originalEvent: {}
                }
            );
            if (bubble) {
                jQuery.event.trigger(e, null, elem);
            } else {
                jQuery.event.dispatch.call(elem, e);
            }
            if (e.isDefaultPrevented()) {
                event.preventDefault();
            }
        }
    };

    // Some plugins are using, but it's undocumented/deprecated and will be removed.
    // The 1.7 special event interface should provide all the hooks needed now.
    jQuery.event.handle = jQuery.event.dispatch;

    jQuery.removeEvent = document.removeEventListener ?
        function (elem, type, handle) {
            if (elem.removeEventListener) {
                elem.removeEventListener(type, handle, false);
            }
        } :
        function (elem, type, handle) {
            var name = "on" + type;

            if (elem.detachEvent) {

                // #8545, #7054, preventing memory leaks for custom events in IE6-8
                // detachEvent needed property on element, by name of that event, to properly expose it to GC
                if (typeof elem[name] === "undefined") {
                    elem[name] = null;
                }

                elem.detachEvent(name, handle);
            }
        };

    jQuery.Event = function (src, props) {
        // Allow instantiation without the 'new' keyword
        if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
        }

        // Event object
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;

            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
                src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

            // Event type
        } else {
            this.type = src;
        }

        // Put explicitly provided properties onto the event object
        if (props) {
            jQuery.extend(this, props);
        }

        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || jQuery.now();

        // Mark it as fixed
        this[jQuery.expando] = true;
    };

    function returnFalse() {
        return false;
    }
    function returnTrue() {
        return true;
    }

    // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        preventDefault: function () {
            this.isDefaultPrevented = returnTrue;

            var e = this.originalEvent;
            if (!e) {
                return;
            }

            // if preventDefault exists run it on the original event
            if (e.preventDefault) {
                e.preventDefault();

                // otherwise set the returnValue property of the original event to false (IE)
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function () {
            this.isPropagationStopped = returnTrue;

            var e = this.originalEvent;
            if (!e) {
                return;
            }
            // if stopPropagation exists run it on the original event
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            // otherwise set the cancelBubble property of the original event to true (IE)
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function () {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse
    };

    // Create mouseenter/leave events using mouseover/out and event-time checks
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function (orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,

            handle: function (event) {
                var ret,
                    target = this,
                    related = event.relatedTarget,
                    handleObj = event.handleObj,
                    selector = handleObj.selector;

                // For mousenter/leave call the handler if related is outside the target.
                // NB: No relatedTarget if the mouse left/entered the browser window
                if (!related || (related !== target && !jQuery.contains(target, related))) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply(this, arguments);
                    event.type = fix;
                }
                return ret;
            }
        };
    });

    // IE submit delegation
    if (!jQuery.support.submitBubbles) {

        jQuery.event.special.submit = {
            setup: function () {
                // Only need this for delegated form submit events
                if (jQuery.nodeName(this, "form")) {
                    return false;
                }

                // Lazy-add a submit handler when a descendant form may potentially be submitted
                jQuery.event.add(this, "click._submit keypress._submit", function (e) {
                    // Node name check avoids a VML-related crash in IE (#9807)
                    var elem = e.target,
                        form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
                    if (form && !jQuery._data(form, "_submit_attached")) {
                        jQuery.event.add(form, "submit._submit", function (event) {
                            event._submit_bubble = true;
                        });
                        jQuery._data(form, "_submit_attached", true);
                    }
                });
                // return undefined since we don't need an event listener
            },

            postDispatch: function (event) {
                // If form was submitted by the user, bubble the event up the tree
                if (event._submit_bubble) {
                    delete event._submit_bubble;
                    if (this.parentNode && !event.isTrigger) {
                        jQuery.event.simulate("submit", this.parentNode, event, true);
                    }
                }
            },

            teardown: function () {
                // Only need this for delegated form submit events
                if (jQuery.nodeName(this, "form")) {
                    return false;
                }

                // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
                jQuery.event.remove(this, "._submit");
            }
        };
    }

    // IE change delegation and checkbox/radio fix
    if (!jQuery.support.changeBubbles) {

        jQuery.event.special.change = {

            setup: function () {

                if (rformElems.test(this.nodeName)) {
                    // IE doesn't fire change on a check/radio until blur; trigger it on click
                    // after a propertychange. Eat the blur-change in special.change.handle.
                    // This still fires onchange a second time for check/radio after blur.
                    if (this.type === "checkbox" || this.type === "radio") {
                        jQuery.event.add(this, "propertychange._change", function (event) {
                            if (event.originalEvent.propertyName === "checked") {
                                this._just_changed = true;
                            }
                        });
                        jQuery.event.add(this, "click._change", function (event) {
                            if (this._just_changed && !event.isTrigger) {
                                this._just_changed = false;
                            }
                            // Allow triggered, simulated change events (#11500)
                            jQuery.event.simulate("change", this, event, true);
                        });
                    }
                    return false;
                }
                // Delegated event; lazy-add a change handler on descendant inputs
                jQuery.event.add(this, "beforeactivate._change", function (e) {
                    var elem = e.target;

                    if (rformElems.test(elem.nodeName) && !jQuery._data(elem, "_change_attached")) {
                        jQuery.event.add(elem, "change._change", function (event) {
                            if (this.parentNode && !event.isSimulated && !event.isTrigger) {
                                jQuery.event.simulate("change", this.parentNode, event, true);
                            }
                        });
                        jQuery._data(elem, "_change_attached", true);
                    }
                });
            },

            handle: function (event) {
                var elem = event.target;

                // Swallow native change events from checkbox/radio, we already triggered them above
                if (this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox")) {
                    return event.handleObj.handler.apply(this, arguments);
                }
            },

            teardown: function () {
                jQuery.event.remove(this, "._change");

                return !rformElems.test(this.nodeName);
            }
        };
    }

    // Create "bubbling" focus and blur events
    if (!jQuery.support.focusinBubbles) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {

            // Attach a single capturing handler while someone wants focusin/focusout
            var attaches = 0,
                handler = function (event) {
                    jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
                };

            jQuery.event.special[fix] = {
                setup: function () {
                    if (attaches++ === 0) {
                        document.addEventListener(orig, handler, true);
                    }
                },
                teardown: function () {
                    if (--attaches === 0) {
                        document.removeEventListener(orig, handler, true);
                    }
                }
            };
        });
    }

    jQuery.fn.extend({

        on: function (types, selector, data, fn, /*INTERNAL*/ one) {
            var origFn, type;

            // Types can be a map of types/handlers
            if (typeof types === "object") {
                // ( types-Object, selector, data )
                if (typeof selector !== "string") { // && selector != null
                    // ( types-Object, data )
                    data = data || selector;
                    selector = undefined;
                }
                for (type in types) {
                    this.on(type, selector, data, types[type], one);
                }
                return this;
            }

            if (data == null && fn == null) {
                // ( types, fn )
                fn = selector;
                data = selector = undefined;
            } else if (fn == null) {
                if (typeof selector === "string") {
                    // ( types, selector, fn )
                    fn = data;
                    data = undefined;
                } else {
                    // ( types, data, fn )
                    fn = data;
                    data = selector;
                    selector = undefined;
                }
            }
            if (fn === false) {
                fn = returnFalse;
            } else if (!fn) {
                return this;
            }

            if (one === 1) {
                origFn = fn;
                fn = function (event) {
                    // Can use an empty set, since event contains the info
                    jQuery().off(event);
                    return origFn.apply(this, arguments);
                };
                // Use same guid so caller can remove using origFn
                fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
            }
            return this.each(function () {
                jQuery.event.add(this, types, fn, data, selector);
            });
        },
        one: function (types, selector, data, fn) {
            return this.on(types, selector, data, fn, 1);
        },
        off: function (types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {
                // ( event )  dispatched jQuery.Event
                handleObj = types.handleObj;
                jQuery(types.delegateTarget).off(
                    handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                    handleObj.selector,
                    handleObj.handler
                );
                return this;
            }
            if (typeof types === "object") {
                // ( types-object [, selector] )
                for (type in types) {
                    this.off(type, selector, types[type]);
                }
                return this;
            }
            if (selector === false || typeof selector === "function") {
                // ( types [, fn] )
                fn = selector;
                selector = undefined;
            }
            if (fn === false) {
                fn = returnFalse;
            }
            return this.each(function () {
                jQuery.event.remove(this, types, fn, selector);
            });
        },

        bind: function (types, data, fn) {
            return this.on(types, null, data, fn);
        },
        unbind: function (types, fn) {
            return this.off(types, null, fn);
        },

        live: function (types, data, fn) {
            jQuery(this.context).on(types, this.selector, data, fn);
            return this;
        },
        die: function (types, fn) {
            jQuery(this.context).off(types, this.selector || "**", fn);
            return this;
        },

        delegate: function (selector, types, data, fn) {
            return this.on(types, selector, data, fn);
        },
        undelegate: function (selector, types, fn) {
            // ( namespace ) or ( selector, types [, fn] )
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        },

        trigger: function (type, data) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function (type, data) {
            if (this[0]) {
                return jQuery.event.trigger(type, data, this[0], true);
            }
        },

        toggle: function (fn) {
            // Save reference to arguments for access in closure
            var args = arguments,
                guid = fn.guid || jQuery.guid++,
                i = 0,
                toggler = function (event) {
                    // Figure out which function to execute
                    var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0) % i;
                    jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);

                    // Make sure that clicks stop
                    event.preventDefault();

                    // and execute the function
                    return args[lastToggle].apply(this, arguments) || false;
                };

            // link all the functions, so any of them can unbind this click handler
            toggler.guid = guid;
            while (i < args.length) {
                args[i++].guid = guid;
            }

            return this.click(toggler);
        },

        hover: function (fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        }
    });

    jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup error contextmenu").split(" "), function (i, name) {

            // Handle event binding
            jQuery.fn[name] = function (data, fn) {
                if (fn == null) {
                    fn = data;
                    data = null;
                }

                return arguments.length > 0 ?
                    this.on(name, null, data, fn) :
                    this.trigger(name);
            };

            if (rkeyEvent.test(name)) {
                jQuery.event.fixHooks[name] = jQuery.event.keyHooks;
            }

            if (rmouseEvent.test(name)) {
                jQuery.event.fixHooks[name] = jQuery.event.mouseHooks;
            }
        });
    /*!
     * Sizzle CSS Selector Engine
     * Copyright 2012 jQuery Foundation and other contributors
     * Released under the MIT license
     * http://sizzlejs.com/
     */
    (function (window, undefined) {

        var cachedruns,
            assertGetIdNotName,
            Expr,
            getText,
            isXML,
            contains,
            compile,
            sortOrder,
            hasDuplicate,
            outermostContext,

            baseHasDuplicate = true,
            strundefined = "undefined",

            expando = ("sizcache" + Math.random()).replace(".", ""),

            Token = String,
            document = window.document,
            docElem = document.documentElement,
            dirruns = 0,
            done = 0,
            pop = [].pop,
            push = [].push,
            slice = [].slice,
            // Use a stripped-down indexOf if a native one is unavailable
            indexOf = [].indexOf || function (elem) {
                var i = 0,
                    len = this.length;
                for (; i < len; i++) {
                    if (this[i] === elem) {
                        return i;
                    }
                }
                return -1;
            },

            // Augment a function for special use by Sizzle
            markFunction = function (fn, value) {
                fn[expando] = value == null || value;
                return fn;
            },

            createCache = function () {
                var cache = {},
                    keys = [];

                return markFunction(function (key, value) {
                    // Only keep the most recent entries
                    if (keys.push(key) > Expr.cacheLength) {
                        delete cache[keys.shift()];
                    }

                    // Retrieve with (key + " ") to avoid collision with native Object.prototype properties (see Issue #157)
                    return (cache[key + " "] = value);
                }, cache);
            },

            classCache = createCache(),
            tokenCache = createCache(),
            compilerCache = createCache(),

            // Regex

            // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
            whitespace = "[\\x20\\t\\r\\n\\f]",
            // http://www.w3.org/TR/css3-syntax/#characters
            characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

            // Loosely modeled on CSS identifier characters
            // An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
            // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
            identifier = characterEncoding.replace("w", "w#"),

            // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
            operators = "([*^$|!~]?=)",
            attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
                "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

            // Prefer arguments not in parens/brackets,
            //   then attribute selectors and non-pseudos (denoted by :),
            //   then anything else
            // These preferences are here to reduce the number of selectors
            //   needing tokenize in the PSEUDO preFilter
            pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

            // For matchExpr.POS and matchExpr.needsContext
            pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
                "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

            // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
            rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

            rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
            rcombinators = new RegExp("^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*"),
            rpseudo = new RegExp(pseudos),

            // Easily-parseable/retrievable ID or TAG or CLASS selectors
            rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

            rnot = /^:not/,
            rsibling = /[\x20\t\r\n\f]*[+~]/,
            rendsWithNot = /:not\($/,

            rheader = /h\d/i,
            rinputs = /input|select|textarea|button/i,

            rbackslash = /\\(?!\\)/g,

            matchExpr = {
                "ID": new RegExp("^#(" + characterEncoding + ")"),
                "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
                "NAME": new RegExp("^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]"),
                "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
                "ATTR": new RegExp("^" + attributes),
                "PSEUDO": new RegExp("^" + pseudos),
                "POS": new RegExp(pos, "i"),
                "CHILD": new RegExp("^:(only|nth|first|last)-child(?:\\(" + whitespace +
                    "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                    "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
                // For use in libraries implementing .is()
                "needsContext": new RegExp("^" + whitespace + "*[>+~]|" + pos, "i")
            },

            // Support

            // Used for testing something on an element
            assert = function (fn) {
                var div = document.createElement("div");

                try {
                    return fn(div);
                } catch (e) {
                    return false;
                } finally {
                    // release memory in IE
                    div = null;
                }
            },

            // Check if getElementsByTagName("*") returns only elements
            assertTagNameNoComments = assert(function (div) {
                div.appendChild(document.createComment(""));
                return !div.getElementsByTagName("*").length;
            }),

            // Check if getAttribute returns normalized href attributes
            assertHrefNotNormalized = assert(function (div) {
                div.innerHTML = "<a href='#'></a>";
                return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
                    div.firstChild.getAttribute("href") === "#";
            }),

            // Check if attributes should be retrieved by attribute nodes
            assertAttributes = assert(function (div) {
                div.innerHTML = "<select></select>";
                var type = typeof div.lastChild.getAttribute("multiple");
                // IE8 returns a string for some attributes even when not present
                return type !== "boolean" && type !== "string";
            }),

            // Check if getElementsByClassName can be trusted
            assertUsableClassName = assert(function (div) {
                // Opera can't find a second classname (in 9.6)
                div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
                if (!div.getElementsByClassName || !div.getElementsByClassName("e").length) {
                    return false;
                }

                // Safari 3.2 caches class attributes and doesn't catch changes
                div.lastChild.className = "e";
                return div.getElementsByClassName("e").length === 2;
            }),

            // Check if getElementById returns elements by name
            // Check if getElementsByName privileges form controls or returns elements by ID
            assertUsableName = assert(function (div) {
                // Inject content
                div.id = expando + 0;
                div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
                docElem.insertBefore(div, docElem.firstChild);

                // Test
                var pass = document.getElementsByName &&
                    // buggy browsers will return fewer than the correct 2
                    document.getElementsByName(expando).length === 2 +
                    // buggy browsers will return more than the correct 0
                    document.getElementsByName(expando + 0).length;
                assertGetIdNotName = !document.getElementById(expando);

                // Cleanup
                docElem.removeChild(div);

                return pass;
            });

        // If slice is not available, provide a backup
        try {
            slice.call(docElem.childNodes, 0)[0].nodeType;
        } catch (e) {
            slice = function (i) {
                var elem,
                    results = [];
                for (; (elem = this[i]) ; i++) {
                    results.push(elem);
                }
                return results;
            };
        }

        function Sizzle(selector, context, results, seed) {
            results = results || [];
            context = context || document;
            var match, elem, xml, m,
                nodeType = context.nodeType;

            if (!selector || typeof selector !== "string") {
                return results;
            }

            if (nodeType !== 1 && nodeType !== 9) {
                return [];
            }

            xml = isXML(context);

            if (!xml && !seed) {
                if ((match = rquickExpr.exec(selector))) {
                    // Speed-up: Sizzle("#ID")
                    if ((m = match[1])) {
                        if (nodeType === 9) {
                            elem = context.getElementById(m);
                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            if (elem && elem.parentNode) {
                                // Handle the case where IE, Opera, and Webkit return items
                                // by name instead of ID
                                if (elem.id === m) {
                                    results.push(elem);
                                    return results;
                                }
                            } else {
                                return results;
                            }
                        } else {
                            // Context is not a document
                            if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) &&
                                contains(context, elem) && elem.id === m) {
                                results.push(elem);
                                return results;
                            }
                        }

                        // Speed-up: Sizzle("TAG")
                    } else if (match[2]) {
                        push.apply(results, slice.call(context.getElementsByTagName(selector), 0));
                        return results;

                        // Speed-up: Sizzle(".CLASS")
                    } else if ((m = match[3]) && assertUsableClassName && context.getElementsByClassName) {
                        push.apply(results, slice.call(context.getElementsByClassName(m), 0));
                        return results;
                    }
                }
            }

            // All others
            return select(selector.replace(rtrim, "$1"), context, results, seed, xml);
        }

        Sizzle.matches = function (expr, elements) {
            return Sizzle(expr, null, null, elements);
        };

        Sizzle.matchesSelector = function (elem, expr) {
            return Sizzle(expr, null, null, [elem]).length > 0;
        };

        // Returns a function to use in pseudos for input types
        function createInputPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
            };
        }

        // Returns a function to use in pseudos for buttons
        function createButtonPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
            };
        }

        // Returns a function to use in pseudos for positionals
        function createPositionalPseudo(fn) {
            return markFunction(function (argument) {
                argument = +argument;
                return markFunction(function (seed, matches) {
                    var j,
                        matchIndexes = fn([], seed.length, argument),
                        i = matchIndexes.length;

                    // Match elements found at the specified indexes
                    while (i--) {
                        if (seed[(j = matchIndexes[i])]) {
                            seed[j] = !(matches[j] = seed[j]);
                        }
                    }
                });
            });
        }

        /**
         * Utility function for retrieving the text value of an array of DOM nodes
         * @param {Array|Element} elem
         */
        getText = Sizzle.getText = function (elem) {
            var node,
                ret = "",
                i = 0,
                nodeType = elem.nodeType;

            if (nodeType) {
                if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                    // Use textContent for elements
                    // innerText usage removed for consistency of new lines (see #11153)
                    if (typeof elem.textContent === "string") {
                        return elem.textContent;
                    } else {
                        // Traverse its children
                        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                            ret += getText(elem);
                        }
                    }
                } else if (nodeType === 3 || nodeType === 4) {
                    return elem.nodeValue;
                }
                // Do not include comment or processing instruction nodes
            } else {

                // If no nodeType, this is expected to be an array
                for (; (node = elem[i]) ; i++) {
                    // Do not traverse comment nodes
                    ret += getText(node);
                }
            }
            return ret;
        };

        isXML = Sizzle.isXML = function (elem) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        // Element contains another
        contains = Sizzle.contains = docElem.contains ?
            function (a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a,
                    bup = b && b.parentNode;
                return a === bup || !!(bup && bup.nodeType === 1 && adown.contains && adown.contains(bup));
            } :
            docElem.compareDocumentPosition ?
            function (a, b) {
                return b && !!(a.compareDocumentPosition(b) & 16);
            } :
            function (a, b) {
                while ((b = b.parentNode)) {
                    if (b === a) {
                        return true;
                    }
                }
                return false;
            };

        Sizzle.attr = function (elem, name) {
            var val,
                xml = isXML(elem);

            if (!xml) {
                name = name.toLowerCase();
            }
            if ((val = Expr.attrHandle[name])) {
                return val(elem);
            }
            if (xml || assertAttributes) {
                return elem.getAttribute(name);
            }
            val = elem.getAttributeNode(name);
            return val ?
                typeof elem[name] === "boolean" ?
                    elem[name] ? name : null :
                    val.specified ? val.value : null :
                null;
        };

        Expr = Sizzle.selectors = {

            // Can be adjusted by the user
            cacheLength: 50,

            createPseudo: markFunction,

            match: matchExpr,

            // IE6/7 return a modified href
            attrHandle: assertHrefNotNormalized ?
		{} :
		{
		    "href": function (elem) {
		        return elem.getAttribute("href", 2);
		    },
		    "type": function (elem) {
		        return elem.getAttribute("type");
		    }
		},

            find: {
                "ID": assertGetIdNotName ?
                    function (id, context, xml) {
                        if (typeof context.getElementById !== strundefined && !xml) {
                            var m = context.getElementById(id);
                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            return m && m.parentNode ? [m] : [];
                        }
                    } :
                    function (id, context, xml) {
                        if (typeof context.getElementById !== strundefined && !xml) {
                            var m = context.getElementById(id);

                            return m ?
                                m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
                                    [m] :
                                undefined :
                                [];
                        }
                    },

                "TAG": assertTagNameNoComments ?
                    function (tag, context) {
                        if (typeof context.getElementsByTagName !== strundefined) {
                            return context.getElementsByTagName(tag);
                        }
                    } :
                    function (tag, context) {
                        var results = context.getElementsByTagName(tag);

                        // Filter out possible comments
                        if (tag === "*") {
                            var elem,
                                tmp = [],
                                i = 0;

                            for (; (elem = results[i]) ; i++) {
                                if (elem.nodeType === 1) {
                                    tmp.push(elem);
                                }
                            }

                            return tmp;
                        }
                        return results;
                    },

                "NAME": assertUsableName && function (tag, context) {
                    if (typeof context.getElementsByName !== strundefined) {
                        return context.getElementsByName(name);
                    }
                },

                "CLASS": assertUsableClassName && function (className, context, xml) {
                    if (typeof context.getElementsByClassName !== strundefined && !xml) {
                        return context.getElementsByClassName(className);
                    }
                }
            },

            relative: {
                ">": { dir: "parentNode", first: true },
                " ": { dir: "parentNode" },
                "+": { dir: "previousSibling", first: true },
                "~": { dir: "previousSibling" }
            },

            preFilter: {
                "ATTR": function (match) {
                    match[1] = match[1].replace(rbackslash, "");

                    // Move the given value to match[3] whether quoted or unquoted
                    match[3] = (match[4] || match[5] || "").replace(rbackslash, "");

                    if (match[2] === "~=") {
                        match[3] = " " + match[3] + " ";
                    }

                    return match.slice(0, 4);
                },

                "CHILD": function (match) {
                    /* matches from matchExpr["CHILD"]
                        1 type (only|nth|...)
                        2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                        3 xn-component of xn+y argument ([+-]?\d*n|)
                        4 sign of xn-component
                        5 x of xn-component
                        6 sign of y-component
                        7 y of y-component
                    */
                    match[1] = match[1].toLowerCase();

                    if (match[1] === "nth") {
                        // nth-child requires argument
                        if (!match[2]) {
                            Sizzle.error(match[0]);
                        }

                        // numeric x and y parameters for Expr.filter.CHILD
                        // remember that false/true cast respectively to 0/1
                        match[3] = +(match[3] ? match[4] + (match[5] || 1) : 2 * (match[2] === "even" || match[2] === "odd"));
                        match[4] = +((match[6] + match[7]) || match[2] === "odd");

                        // other types prohibit arguments
                    } else if (match[2]) {
                        Sizzle.error(match[0]);
                    }

                    return match;
                },

                "PSEUDO": function (match) {
                    var unquoted, excess;
                    if (matchExpr["CHILD"].test(match[0])) {
                        return null;
                    }

                    if (match[3]) {
                        match[2] = match[3];
                    } else if ((unquoted = match[4])) {
                        // Only check arguments that contain a pseudo
                        if (rpseudo.test(unquoted) &&
                            // Get excess from tokenize (recursively)
                            (excess = tokenize(unquoted, true)) &&
                            // advance to the next closing parenthesis
                            (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

                            // excess is a negative index
                            unquoted = unquoted.slice(0, excess);
                            match[0] = match[0].slice(0, excess);
                        }
                        match[2] = unquoted;
                    }

                    // Return only captures needed by the pseudo filter method (type and argument)
                    return match.slice(0, 3);
                }
            },

            filter: {
                "ID": assertGetIdNotName ?
                    function (id) {
                        id = id.replace(rbackslash, "");
                        return function (elem) {
                            return elem.getAttribute("id") === id;
                        };
                    } :
                    function (id) {
                        id = id.replace(rbackslash, "");
                        return function (elem) {
                            var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                            return node && node.value === id;
                        };
                    },

                "TAG": function (nodeName) {
                    if (nodeName === "*") {
                        return function () { return true; };
                    }
                    nodeName = nodeName.replace(rbackslash, "").toLowerCase();

                    return function (elem) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
                },

                "CLASS": function (className) {
                    var pattern = classCache[expando][className + " "];

                    return pattern ||
                        (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) &&
                        classCache(className, function (elem) {
                            return pattern.test(elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "");
                        });
                },

                "ATTR": function (name, operator, check) {
                    return function (elem, context) {
                        var result = Sizzle.attr(elem, name);

                        if (result == null) {
                            return operator === "!=";
                        }
                        if (!operator) {
                            return true;
                        }

                        result += "";

                        return operator === "=" ? result === check :
                            operator === "!=" ? result !== check :
                            operator === "^=" ? check && result.indexOf(check) === 0 :
                            operator === "*=" ? check && result.indexOf(check) > -1 :
                            operator === "$=" ? check && result.substr(result.length - check.length) === check :
                            operator === "~=" ? (" " + result + " ").indexOf(check) > -1 :
                            operator === "|=" ? result === check || result.substr(0, check.length + 1) === check + "-" :
                            false;
                    };
                },

                "CHILD": function (type, argument, first, last) {

                    if (type === "nth") {
                        return function (elem) {
                            var node, diff,
                                parent = elem.parentNode;

                            if (first === 1 && last === 0) {
                                return true;
                            }

                            if (parent) {
                                diff = 0;
                                for (node = parent.firstChild; node; node = node.nextSibling) {
                                    if (node.nodeType === 1) {
                                        diff++;
                                        if (elem === node) {
                                            break;
                                        }
                                    }
                                }
                            }

                            // Incorporate the offset (or cast to NaN), then check against cycle size
                            diff -= last;
                            return diff === first || (diff % first === 0 && diff / first >= 0);
                        };
                    }

                    return function (elem) {
                        var node = elem;

                        switch (type) {
                            case "only":
                            case "first":
                                while ((node = node.previousSibling)) {
                                    if (node.nodeType === 1) {
                                        return false;
                                    }
                                }

                                if (type === "first") {
                                    return true;
                                }

                                node = elem;

                                /* falls through */
                            case "last":
                                while ((node = node.nextSibling)) {
                                    if (node.nodeType === 1) {
                                        return false;
                                    }
                                }

                                return true;
                        }
                    };
                },

                "PSEUDO": function (pseudo, argument) {
                    // pseudo-class names are case-insensitive
                    // http://www.w3.org/TR/selectors/#pseudo-classes
                    // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                    // Remember that setFilters inherits from pseudos
                    var args,
                        fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
                            Sizzle.error("unsupported pseudo: " + pseudo);

                    // The user may use createPseudo to indicate that
                    // arguments are needed to create the filter function
                    // just as Sizzle does
                    if (fn[expando]) {
                        return fn(argument);
                    }

                    // But maintain support for old signatures
                    if (fn.length > 1) {
                        args = [pseudo, pseudo, "", argument];
                        return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ?
                            markFunction(function (seed, matches) {
                                var idx,
                                    matched = fn(seed, argument),
                                    i = matched.length;
                                while (i--) {
                                    idx = indexOf.call(seed, matched[i]);
                                    seed[idx] = !(matches[idx] = matched[i]);
                                }
                            }) :
                            function (elem) {
                                return fn(elem, 0, args);
                            };
                    }

                    return fn;
                }
            },

            pseudos: {
                "not": markFunction(function (selector) {
                    // Trim the selector passed to compile
                    // to avoid treating leading and trailing
                    // spaces as combinators
                    var input = [],
                        results = [],
                        matcher = compile(selector.replace(rtrim, "$1"));

                    return matcher[expando] ?
                        markFunction(function (seed, matches, context, xml) {
                            var elem,
                                unmatched = matcher(seed, null, xml, []),
                                i = seed.length;

                            // Match elements unmatched by `matcher`
                            while (i--) {
                                if ((elem = unmatched[i])) {
                                    seed[i] = !(matches[i] = elem);
                                }
                            }
                        }) :
                        function (elem, context, xml) {
                            input[0] = elem;
                            matcher(input, null, xml, results);
                            return !results.pop();
                        };
                }),

                "has": markFunction(function (selector) {
                    return function (elem) {
                        return Sizzle(selector, elem).length > 0;
                    };
                }),

                "contains": markFunction(function (text) {
                    return function (elem) {
                        return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                    };
                }),

                "enabled": function (elem) {
                    return elem.disabled === false;
                },

                "disabled": function (elem) {
                    return elem.disabled === true;
                },

                "checked": function (elem) {
                    // In CSS3, :checked should return both checked and selected elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    var nodeName = elem.nodeName.toLowerCase();
                    return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                },

                "selected": function (elem) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    if (elem.parentNode) {
                        elem.parentNode.selectedIndex;
                    }

                    return elem.selected === true;
                },

                "parent": function (elem) {
                    return !Expr.pseudos["empty"](elem);
                },

                "empty": function (elem) {
                    // http://www.w3.org/TR/selectors/#empty-pseudo
                    // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
                    //   not comment, processing instructions, or others
                    // Thanks to Diego Perini for the nodeName shortcut
                    //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
                    var nodeType;
                    elem = elem.firstChild;
                    while (elem) {
                        if (elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4) {
                            return false;
                        }
                        elem = elem.nextSibling;
                    }
                    return true;
                },

                "header": function (elem) {
                    return rheader.test(elem.nodeName);
                },

                "text": function (elem) {
                    var type, attr;
                    // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
                    // use getAttribute instead to test this case
                    return elem.nodeName.toLowerCase() === "input" &&
                        (type = elem.type) === "text" &&
                        ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type);
                },

                // Input types
                "radio": createInputPseudo("radio"),
                "checkbox": createInputPseudo("checkbox"),
                "file": createInputPseudo("file"),
                "password": createInputPseudo("password"),
                "image": createInputPseudo("image"),

                "submit": createButtonPseudo("submit"),
                "reset": createButtonPseudo("reset"),

                "button": function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === "button" || name === "button";
                },

                "input": function (elem) {
                    return rinputs.test(elem.nodeName);
                },

                "focus": function (elem) {
                    var doc = elem.ownerDocument;
                    return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },

                "active": function (elem) {
                    return elem === elem.ownerDocument.activeElement;
                },

                // Positional types
                "first": createPositionalPseudo(function () {
                    return [0];
                }),

                "last": createPositionalPseudo(function (matchIndexes, length) {
                    return [length - 1];
                }),

                "eq": createPositionalPseudo(function (matchIndexes, length, argument) {
                    return [argument < 0 ? argument + length : argument];
                }),

                "even": createPositionalPseudo(function (matchIndexes, length) {
                    for (var i = 0; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                "odd": createPositionalPseudo(function (matchIndexes, length) {
                    for (var i = 1; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                "lt": createPositionalPseudo(function (matchIndexes, length, argument) {
                    for (var i = argument < 0 ? argument + length : argument; --i >= 0;) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                "gt": createPositionalPseudo(function (matchIndexes, length, argument) {
                    for (var i = argument < 0 ? argument + length : argument; ++i < length;) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                })
            }
        };

        function siblingCheck(a, b, ret) {
            if (a === b) {
                return ret;
            }

            var cur = a.nextSibling;

            while (cur) {
                if (cur === b) {
                    return -1;
                }

                cur = cur.nextSibling;
            }

            return 1;
        }

        sortOrder = docElem.compareDocumentPosition ?
            function (a, b) {
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }

                return (!a.compareDocumentPosition || !b.compareDocumentPosition ?
                    a.compareDocumentPosition :
                    a.compareDocumentPosition(b) & 4
                ) ? -1 : 1;
            } :
            function (a, b) {
                // The nodes are identical, we can exit early
                if (a === b) {
                    hasDuplicate = true;
                    return 0;

                    // Fallback to using sourceIndex (in IE) if it's available on both nodes
                } else if (a.sourceIndex && b.sourceIndex) {
                    return a.sourceIndex - b.sourceIndex;
                }

                var al, bl,
                    ap = [],
                    bp = [],
                    aup = a.parentNode,
                    bup = b.parentNode,
                    cur = aup;

                // If the nodes are siblings (or identical) we can do a quick check
                if (aup === bup) {
                    return siblingCheck(a, b);

                    // If no parents were found then the nodes are disconnected
                } else if (!aup) {
                    return -1;

                } else if (!bup) {
                    return 1;
                }

                // Otherwise they're somewhere else in the tree so we need
                // to build up a full list of the parentNodes for comparison
                while (cur) {
                    ap.unshift(cur);
                    cur = cur.parentNode;
                }

                cur = bup;

                while (cur) {
                    bp.unshift(cur);
                    cur = cur.parentNode;
                }

                al = ap.length;
                bl = bp.length;

                // Start walking down the tree looking for a discrepancy
                for (var i = 0; i < al && i < bl; i++) {
                    if (ap[i] !== bp[i]) {
                        return siblingCheck(ap[i], bp[i]);
                    }
                }

                // We ended someplace up the tree so do a sibling check
                return i === al ?
                    siblingCheck(a, bp[i], -1) :
                    siblingCheck(ap[i], b, 1);
            };

        // Always assume the presence of duplicates if sort doesn't
        // pass them to our comparison function (as in Google Chrome).
        [0, 0].sort(sortOrder);
        baseHasDuplicate = !hasDuplicate;

        // Document sorting and removing duplicates
        Sizzle.uniqueSort = function (results) {
            var elem,
                duplicates = [],
                i = 1,
                j = 0;

            hasDuplicate = baseHasDuplicate;
            results.sort(sortOrder);

            if (hasDuplicate) {
                for (; (elem = results[i]) ; i++) {
                    if (elem === results[i - 1]) {
                        j = duplicates.push(i);
                    }
                }
                while (j--) {
                    results.splice(duplicates[j], 1);
                }
            }

            return results;
        };

        Sizzle.error = function (msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        };

        function tokenize(selector, parseOnly) {
            var matched, match, tokens, type,
                soFar, groups, preFilters,
                cached = tokenCache[expando][selector + " "];

            if (cached) {
                return parseOnly ? 0 : cached.slice(0);
            }

            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;

            while (soFar) {

                // Comma and first run
                if (!matched || (match = rcomma.exec(soFar))) {
                    if (match) {
                        // Don't consume trailing commas as valid
                        soFar = soFar.slice(match[0].length) || soFar;
                    }
                    groups.push(tokens = []);
                }

                matched = false;

                // Combinators
                if ((match = rcombinators.exec(soFar))) {
                    tokens.push(matched = new Token(match.shift()));
                    soFar = soFar.slice(matched.length);

                    // Cast descendant combinators to space
                    matched.type = match[0].replace(rtrim, " ");
                }

                // Filters
                for (type in Expr.filter) {
                    if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
                        (match = preFilters[type](match)))) {

                        tokens.push(matched = new Token(match.shift()));
                        soFar = soFar.slice(matched.length);
                        matched.type = type;
                        matched.matches = match;
                    }
                }

                if (!matched) {
                    break;
                }
            }

            // Return the length of the invalid excess
            // if we're just parsing
            // Otherwise, throw an error or return tokens
            return parseOnly ?
                soFar.length :
                soFar ?
                    Sizzle.error(selector) :
                    // Cache the tokens
                    tokenCache(selector, groups).slice(0);
        }

        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir,
                checkNonElements = base && combinator.dir === "parentNode",
                doneName = done++;

            return combinator.first ?
                // Check against closest ancestor/preceding element
                function (elem, context, xml) {
                    while ((elem = elem[dir])) {
                        if (checkNonElements || elem.nodeType === 1) {
                            return matcher(elem, context, xml);
                        }
                    }
                } :

                // Check against all ancestor/preceding elements
                function (elem, context, xml) {
                    // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                    if (!xml) {
                        var cache,
                            dirkey = dirruns + " " + doneName + " ",
                            cachedkey = dirkey + cachedruns;
                        while ((elem = elem[dir])) {
                            if (checkNonElements || elem.nodeType === 1) {
                                if ((cache = elem[expando]) === cachedkey) {
                                    return elem.sizset;
                                } else if (typeof cache === "string" && cache.indexOf(dirkey) === 0) {
                                    if (elem.sizset) {
                                        return elem;
                                    }
                                } else {
                                    elem[expando] = cachedkey;
                                    if (matcher(elem, context, xml)) {
                                        elem.sizset = true;
                                        return elem;
                                    }
                                    elem.sizset = false;
                                }
                            }
                        }
                    } else {
                        while ((elem = elem[dir])) {
                            if (checkNonElements || elem.nodeType === 1) {
                                if (matcher(elem, context, xml)) {
                                    return elem;
                                }
                            }
                        }
                    }
                };
        }

        function elementMatcher(matchers) {
            return matchers.length > 1 ?
                function (elem, context, xml) {
                    var i = matchers.length;
                    while (i--) {
                        if (!matchers[i](elem, context, xml)) {
                            return false;
                        }
                    }
                    return true;
                } :
                matchers[0];
        }

        function condense(unmatched, map, filter, context, xml) {
            var elem,
                newUnmatched = [],
                i = 0,
                len = unmatched.length,
                mapped = map != null;

            for (; i < len; i++) {
                if ((elem = unmatched[i])) {
                    if (!filter || filter(elem, context, xml)) {
                        newUnmatched.push(elem);
                        if (mapped) {
                            map.push(i);
                        }
                    }
                }
            }

            return newUnmatched;
        }

        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
                postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
                postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function (seed, results, context, xml) {
                var temp, i, elem,
                    preMap = [],
                    postMap = [],
                    preexisting = results.length,

                    // Get initial elements from seed or context
                    elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),

                    // Prefilter to get matcher input, preserving a map for seed-results synchronization
                    matcherIn = preFilter && (seed || !selector) ?
                        condense(elems, preMap, preFilter, context, xml) :
                        elems,

                    matcherOut = matcher ?
                        // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                        postFinder || (seed ? preFilter : preexisting || postFilter) ?

                            // ...intermediate processing is necessary
                            [] :

                            // ...otherwise use results directly
                    results :
                        matcherIn;

                // Find primary matches
                if (matcher) {
                    matcher(matcherIn, matcherOut, context, xml);
                }

                // Apply postFilter
                if (postFilter) {
                    temp = condense(matcherOut, postMap);
                    postFilter(temp, [], context, xml);

                    // Un-match failing elements by moving them back to matcherIn
                    i = temp.length;
                    while (i--) {
                        if ((elem = temp[i])) {
                            matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                        }
                    }
                }

                if (seed) {
                    if (postFinder || preFilter) {
                        if (postFinder) {
                            // Get the final matcherOut by condensing this intermediate into postFinder contexts
                            temp = [];
                            i = matcherOut.length;
                            while (i--) {
                                if ((elem = matcherOut[i])) {
                                    // Restore matcherIn since elem is not yet a final match
                                    temp.push((matcherIn[i] = elem));
                                }
                            }
                            postFinder(null, (matcherOut = []), temp, xml);
                        }

                        // Move matched elements from seed to results to keep them synchronized
                        i = matcherOut.length;
                        while (i--) {
                            if ((elem = matcherOut[i]) &&
                                (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {

                                seed[temp] = !(results[temp] = elem);
                            }
                        }
                    }

                    // Add elements to results, through postFinder if defined
                } else {
                    matcherOut = condense(
                        matcherOut === results ?
                            matcherOut.splice(preexisting, matcherOut.length) :
                            matcherOut
                    );
                    if (postFinder) {
                        postFinder(null, results, matcherOut, xml);
                    } else {
                        push.apply(results, matcherOut);
                    }
                }
            });
        }

        function matcherFromTokens(tokens) {
            var checkContext, matcher, j,
                len = tokens.length,
                leadingRelative = Expr.relative[tokens[0].type],
                implicitRelative = leadingRelative || Expr.relative[" "],
                i = leadingRelative ? 1 : 0,

                // The foundational matcher ensures that elements are reachable from top-level context(s)
                matchContext = addCombinator(function (elem) {
                    return elem === checkContext;
                }, implicitRelative, true),
                matchAnyContext = addCombinator(function (elem) {
                    return indexOf.call(checkContext, elem) > -1;
                }, implicitRelative, true),
                matchers = [function (elem, context, xml) {
                    return (!leadingRelative && (xml || context !== outermostContext)) || (
                        (checkContext = context).nodeType ?
                            matchContext(elem, context, xml) :
                            matchAnyContext(elem, context, xml));
                }];

            for (; i < len; i++) {
                if ((matcher = Expr.relative[tokens[i].type])) {
                    matchers = [addCombinator(elementMatcher(matchers), matcher)];
                } else {
                    matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

                    // Return special upon seeing a positional matcher
                    if (matcher[expando]) {
                        // Find the next relative operator (if any) for proper handling
                        j = ++i;
                        for (; j < len; j++) {
                            if (Expr.relative[tokens[j].type]) {
                                break;
                            }
                        }
                        return setMatcher(
                            i > 1 && elementMatcher(matchers),
                            i > 1 && tokens.slice(0, i - 1).join("").replace(rtrim, "$1"),
                            matcher,
                            i < j && matcherFromTokens(tokens.slice(i, j)),
                            j < len && matcherFromTokens((tokens = tokens.slice(j))),
                            j < len && tokens.join("")
                        );
                    }
                    matchers.push(matcher);
                }
            }

            return elementMatcher(matchers);
        }

        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0,
                byElement = elementMatchers.length > 0,
                superMatcher = function (seed, context, xml, results, expandContext) {
                    var elem, j, matcher,
                        setMatched = [],
                        matchedCount = 0,
                        i = "0",
                        unmatched = seed && [],
                        outermost = expandContext != null,
                        contextBackup = outermostContext,
                        // We must always have either seed elements or context
                        elems = seed || byElement && Expr.find["TAG"]("*", expandContext && context.parentNode || context),
                        // Nested matchers should use non-integer dirruns
                        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

                    if (outermost) {
                        outermostContext = context !== document && context;
                        cachedruns = superMatcher.el;
                    }

                    // Add elements passing elementMatchers directly to results
                    for (; (elem = elems[i]) != null; i++) {
                        if (byElement && elem) {
                            for (j = 0; (matcher = elementMatchers[j]) ; j++) {
                                if (matcher(elem, context, xml)) {
                                    results.push(elem);
                                    break;
                                }
                            }
                            if (outermost) {
                                dirruns = dirrunsUnique;
                                cachedruns = ++superMatcher.el;
                            }
                        }

                        // Track unmatched elements for set filters
                        if (bySet) {
                            // They will have gone through all possible matchers
                            if ((elem = !matcher && elem)) {
                                matchedCount--;
                            }

                            // Lengthen the array for every element, matched or not
                            if (seed) {
                                unmatched.push(elem);
                            }
                        }
                    }

                    // Apply set filters to unmatched elements
                    matchedCount += i;
                    if (bySet && i !== matchedCount) {
                        for (j = 0; (matcher = setMatchers[j]) ; j++) {
                            matcher(unmatched, setMatched, context, xml);
                        }

                        if (seed) {
                            // Reintegrate element matches to eliminate the need for sorting
                            if (matchedCount > 0) {
                                while (i--) {
                                    if (!(unmatched[i] || setMatched[i])) {
                                        setMatched[i] = pop.call(results);
                                    }
                                }
                            }

                            // Discard index placeholder values to get only actual matches
                            setMatched = condense(setMatched);
                        }

                        // Add matches to results
                        push.apply(results, setMatched);

                        // Seedless set matches succeeding multiple successful matchers stipulate sorting
                        if (outermost && !seed && setMatched.length > 0 &&
                            (matchedCount + setMatchers.length) > 1) {

                            Sizzle.uniqueSort(results);
                        }
                    }

                    // Override manipulation of globals by nested matchers
                    if (outermost) {
                        dirruns = dirrunsUnique;
                        outermostContext = contextBackup;
                    }

                    return unmatched;
                };

            superMatcher.el = 0;
            return bySet ?
                markFunction(superMatcher) :
                superMatcher;
        }

        compile = Sizzle.compile = function (selector, group /* Internal Use Only */) {
            var i,
                setMatchers = [],
                elementMatchers = [],
                cached = compilerCache[expando][selector + " "];

            if (!cached) {
                // Generate a function of recursive functions that can be used to check each element
                if (!group) {
                    group = tokenize(selector);
                }
                i = group.length;
                while (i--) {
                    cached = matcherFromTokens(group[i]);
                    if (cached[expando]) {
                        setMatchers.push(cached);
                    } else {
                        elementMatchers.push(cached);
                    }
                }

                // Cache the compiled function
                cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
            }
            return cached;
        };

        function multipleContexts(selector, contexts, results) {
            var i = 0,
                len = contexts.length;
            for (; i < len; i++) {
                Sizzle(selector, contexts[i], results);
            }
            return results;
        }

        function select(selector, context, results, seed, xml) {
            var i, tokens, token, type, find,
                match = tokenize(selector),
                j = match.length;

            if (!seed) {
                // Try to minimize operations if there is only one group
                if (match.length === 1) {

                    // Take a shortcut and set the context if the root selector is an ID
                    tokens = match[0] = match[0].slice(0);
                    if (tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                            context.nodeType === 9 && !xml &&
                            Expr.relative[tokens[1].type]) {

                        context = Expr.find["ID"](token.matches[0].replace(rbackslash, ""), context, xml)[0];
                        if (!context) {
                            return results;
                        }

                        selector = selector.slice(tokens.shift().length);
                    }

                    // Fetch a seed set for right-to-left matching
                    for (i = matchExpr["POS"].test(selector) ? -1 : tokens.length - 1; i >= 0; i--) {
                        token = tokens[i];

                        // Abort if we hit a combinator
                        if (Expr.relative[(type = token.type)]) {
                            break;
                        }
                        if ((find = Expr.find[type])) {
                            // Search, expanding context for leading sibling combinators
                            if ((seed = find(
                                token.matches[0].replace(rbackslash, ""),
                                rsibling.test(tokens[0].type) && context.parentNode || context,
                                xml
                            ))) {

                                // If seed is empty or no tokens remain, we can return early
                                tokens.splice(i, 1);
                                selector = seed.length && tokens.join("");
                                if (!selector) {
                                    push.apply(results, slice.call(seed, 0));
                                    return results;
                                }

                                break;
                            }
                        }
                    }
                }
            }

            // Compile and execute a filtering function
            // Provide `match` to avoid retokenization if we modified the selector above
            compile(selector, match)(
                seed,
                context,
                xml,
                results,
                rsibling.test(selector)
            );
            return results;
        }

        if (document.querySelectorAll) {
            (function () {
                var disconnectedMatch,
                    oldSelect = select,
                    rescape = /'|\\/g,
                    rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

                    // qSa(:focus) reports false when true (Chrome 21), no need to also add to buggyMatches since matches checks buggyQSA
                    // A support test would require too much code (would include document ready)
                    rbuggyQSA = [":focus"],

                    // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
                    // A support test would require too much code (would include document ready)
                    // just skip matchesSelector for :active
                    rbuggyMatches = [":active"],
                    matches = docElem.matchesSelector ||
                        docElem.mozMatchesSelector ||
                        docElem.webkitMatchesSelector ||
                        docElem.oMatchesSelector ||
                        docElem.msMatchesSelector;

                // Build QSA regex
                // Regex strategy adopted from Diego Perini
                assert(function (div) {
                    // Select is set to empty string on purpose
                    // This is to test IE's treatment of not explictly
                    // setting a boolean content attribute,
                    // since its presence should be enough
                    // http://bugs.jquery.com/ticket/12359
                    div.innerHTML = "<select><option selected=''></option></select>";

                    // IE8 - Some boolean attributes are not treated correctly
                    if (!div.querySelectorAll("[selected]").length) {
                        rbuggyQSA.push("\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)");
                    }

                    // Webkit/Opera - :checked should return selected option elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    // IE8 throws error here (do not put tests after this one)
                    if (!div.querySelectorAll(":checked").length) {
                        rbuggyQSA.push(":checked");
                    }
                });

                assert(function (div) {

                    // Opera 10-12/IE9 - ^= $= *= and empty values
                    // Should not select anything
                    div.innerHTML = "<p test=''></p>";
                    if (div.querySelectorAll("[test^='']").length) {
                        rbuggyQSA.push("[*^$]=" + whitespace + "*(?:\"\"|'')");
                    }

                    // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                    // IE8 throws error here (do not put tests after this one)
                    div.innerHTML = "<input type='hidden'/>";
                    if (!div.querySelectorAll(":enabled").length) {
                        rbuggyQSA.push(":enabled", ":disabled");
                    }
                });

                // rbuggyQSA always contains :focus, so no need for a length check
                rbuggyQSA = /* rbuggyQSA.length && */ new RegExp(rbuggyQSA.join("|"));

                select = function (selector, context, results, seed, xml) {
                    // Only use querySelectorAll when not filtering,
                    // when this is not xml,
                    // and when no QSA bugs apply
                    if (!seed && !xml && !rbuggyQSA.test(selector)) {
                        var groups, i,
                            old = true,
                            nid = expando,
                            newContext = context,
                            newSelector = context.nodeType === 9 && selector;

                        // qSA works strangely on Element-rooted queries
                        // We can work around this by specifying an extra ID on the root
                        // and working up from there (Thanks to Andrew Dupont for the technique)
                        // IE 8 doesn't work on object elements
                        if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                            groups = tokenize(selector);

                            if ((old = context.getAttribute("id"))) {
                                nid = old.replace(rescape, "\\$&");
                            } else {
                                context.setAttribute("id", nid);
                            }
                            nid = "[id='" + nid + "'] ";

                            i = groups.length;
                            while (i--) {
                                groups[i] = nid + groups[i].join("");
                            }
                            newContext = rsibling.test(selector) && context.parentNode || context;
                            newSelector = groups.join(",");
                        }

                        if (newSelector) {
                            try {
                                push.apply(results, slice.call(newContext.querySelectorAll(
                                    newSelector
                                ), 0));
                                return results;
                            } catch (qsaError) {
                            } finally {
                                if (!old) {
                                    context.removeAttribute("id");
                                }
                            }
                        }
                    }

                    return oldSelect(selector, context, results, seed, xml);
                };

                if (matches) {
                    assert(function (div) {
                        // Check to see if it's possible to do matchesSelector
                        // on a disconnected node (IE 9)
                        disconnectedMatch = matches.call(div, "div");

                        // This should fail with an exception
                        // Gecko does not error, returns false instead
                        try {
                            matches.call(div, "[test!='']:sizzle");
                            rbuggyMatches.push("!=", pseudos);
                        } catch (e) { }
                    });

                    // rbuggyMatches always contains :active and :focus, so no need for a length check
                    rbuggyMatches = /* rbuggyMatches.length && */ new RegExp(rbuggyMatches.join("|"));

                    Sizzle.matchesSelector = function (elem, expr) {
                        // Make sure that attribute selectors are quoted
                        expr = expr.replace(rattributeQuotes, "='$1']");

                        // rbuggyMatches always contains :active, so no need for an existence check
                        if (!isXML(elem) && !rbuggyMatches.test(expr) && !rbuggyQSA.test(expr)) {
                            try {
                                var ret = matches.call(elem, expr);

                                // IE 9's matchesSelector returns false on disconnected nodes
                                if (ret || disconnectedMatch ||
                                    // As well, disconnected nodes are said to be in a document
                                    // fragment in IE 9
                                        elem.document && elem.document.nodeType !== 11) {
                                    return ret;
                                }
                            } catch (e) { }
                        }

                        return Sizzle(expr, null, null, [elem]).length > 0;
                    };
                }
            })();
        }

        // Deprecated
        Expr.pseudos["nth"] = Expr.pseudos["eq"];

        // Back-compat
        function setFilters() { }
        Expr.filters = setFilters.prototype = Expr.pseudos;
        Expr.setFilters = new setFilters();

        // Override sizzle attribute retrieval
        Sizzle.attr = jQuery.attr;
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;


    })(window);
    var runtil = /Until$/,
        rparentsprev = /^(?:parents|prev(?:Until|All))/,
        isSimple = /^.[^:#\[\.,]*$/,
        rneedsContext = jQuery.expr.match.needsContext,
        // methods guaranteed to produce a unique set when starting from a unique set
        guaranteedUnique = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };

    jQuery.fn.extend({
        find: function (selector) {
            var i, l, length, n, r, ret,
                self = this;

            if (typeof selector !== "string") {
                return jQuery(selector).filter(function () {
                    for (i = 0, l = self.length; i < l; i++) {
                        if (jQuery.contains(self[i], this)) {
                            return true;
                        }
                    }
                });
            }

            ret = this.pushStack("", "find", selector);

            for (i = 0, l = this.length; i < l; i++) {
                length = ret.length;
                jQuery.find(selector, this[i], ret);

                if (i > 0) {
                    // Make sure that the results are unique
                    for (n = length; n < ret.length; n++) {
                        for (r = 0; r < length; r++) {
                            if (ret[r] === ret[n]) {
                                ret.splice(n--, 1);
                                break;
                            }
                        }
                    }
                }
            }

            return ret;
        },

        has: function (target) {
            var i,
                targets = jQuery(target, this),
                len = targets.length;

            return this.filter(function () {
                for (i = 0; i < len; i++) {
                    if (jQuery.contains(this, targets[i])) {
                        return true;
                    }
                }
            });
        },

        not: function (selector) {
            return this.pushStack(winnow(this, selector, false), "not", selector);
        },

        filter: function (selector) {
            return this.pushStack(winnow(this, selector, true), "filter", selector);
        },

        is: function (selector) {
            return !!selector && (
                typeof selector === "string" ?
                    // If this is a positional/relative selector, check membership in the returned set
                    // so $("p:first").is("p:last") won't return true for a doc with two "p".
                    rneedsContext.test(selector) ?
                        jQuery(selector, this.context).index(this[0]) >= 0 :
                        jQuery.filter(selector, this).length > 0 :
                    this.filter(selector).length > 0);
        },

        closest: function (selectors, context) {
            var cur,
                i = 0,
                l = this.length,
                ret = [],
                pos = rneedsContext.test(selectors) || typeof selectors !== "string" ?
                    jQuery(selectors, context || this.context) :
                    0;

            for (; i < l; i++) {
                cur = this[i];

                while (cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11) {
                    if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
                        ret.push(cur);
                        break;
                    }
                    cur = cur.parentNode;
                }
            }

            ret = ret.length > 1 ? jQuery.unique(ret) : ret;

            return this.pushStack(ret, "closest", selectors);
        },

        // Determine the position of an element within
        // the matched set of elements
        index: function (elem) {

            // No argument, return index in parent
            if (!elem) {
                return (this[0] && this[0].parentNode) ? this.prevAll().length : -1;
            }

            // index in selector
            if (typeof elem === "string") {
                return jQuery.inArray(this[0], jQuery(elem));
            }

            // Locate the position of the desired element
            return jQuery.inArray(
                // If it receives a jQuery object, the first element is used
                elem.jquery ? elem[0] : elem, this);
        },

        add: function (selector, context) {
            var set = typeof selector === "string" ?
                    jQuery(selector, context) :
                    jQuery.makeArray(selector && selector.nodeType ? [selector] : selector),
                all = jQuery.merge(this.get(), set);

            return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ?
                all :
                jQuery.unique(all));
        },

        addBack: function (selector) {
            return this.add(selector == null ?
                this.prevObject : this.prevObject.filter(selector)
            );
        }
    });

    jQuery.fn.andSelf = jQuery.fn.addBack;

    // A painfully simple check to see if an element is disconnected
    // from a document (should be improved, where feasible).
    function isDisconnected(node) {
        return !node || !node.parentNode || node.parentNode.nodeType === 11;
    }

    function sibling(cur, dir) {
        do {
            cur = cur[dir];
        } while (cur && cur.nodeType !== 1);

        return cur;
    }

    jQuery.each({
        parent: function (elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function (elem) {
            return jQuery.dir(elem, "parentNode");
        },
        parentsUntil: function (elem, i, until) {
            return jQuery.dir(elem, "parentNode", until);
        },
        next: function (elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function (elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function (elem) {
            return jQuery.dir(elem, "nextSibling");
        },
        prevAll: function (elem) {
            return jQuery.dir(elem, "previousSibling");
        },
        nextUntil: function (elem, i, until) {
            return jQuery.dir(elem, "nextSibling", until);
        },
        prevUntil: function (elem, i, until) {
            return jQuery.dir(elem, "previousSibling", until);
        },
        siblings: function (elem) {
            return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
        },
        children: function (elem) {
            return jQuery.sibling(elem.firstChild);
        },
        contents: function (elem) {
            return jQuery.nodeName(elem, "iframe") ?
                elem.contentDocument || elem.contentWindow.document :
                jQuery.merge([], elem.childNodes);
        }
    }, function (name, fn) {
        jQuery.fn[name] = function (until, selector) {
            var ret = jQuery.map(this, fn, until);

            if (!runtil.test(name)) {
                selector = until;
            }

            if (selector && typeof selector === "string") {
                ret = jQuery.filter(selector, ret);
            }

            ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret;

            if (this.length > 1 && rparentsprev.test(name)) {
                ret = ret.reverse();
            }

            return this.pushStack(ret, name, core_slice.call(arguments).join(","));
        };
    });

    jQuery.extend({
        filter: function (expr, elems, not) {
            if (not) {
                expr = ":not(" + expr + ")";
            }

            return elems.length === 1 ?
                jQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [] :
                jQuery.find.matches(expr, elems);
        },

        dir: function (elem, dir, until) {
            var matched = [],
                cur = elem[dir];

            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
                if (cur.nodeType === 1) {
                    matched.push(cur);
                }
                cur = cur[dir];
            }
            return matched;
        },

        sibling: function (n, elem) {
            var r = [];

            for (; n; n = n.nextSibling) {
                if (n.nodeType === 1 && n !== elem) {
                    r.push(n);
                }
            }

            return r;
        }
    });

    // Implement the identical functionality for filter and not
    function winnow(elements, qualifier, keep) {

        // Can't pass null or undefined to indexOf in Firefox 4
        // Set to 0 to skip string check
        qualifier = qualifier || 0;

        if (jQuery.isFunction(qualifier)) {
            return jQuery.grep(elements, function (elem, i) {
                var retVal = !!qualifier.call(elem, i, elem);
                return retVal === keep;
            });

        } else if (qualifier.nodeType) {
            return jQuery.grep(elements, function (elem, i) {
                return (elem === qualifier) === keep;
            });

        } else if (typeof qualifier === "string") {
            var filtered = jQuery.grep(elements, function (elem) {
                return elem.nodeType === 1;
            });

            if (isSimple.test(qualifier)) {
                return jQuery.filter(qualifier, filtered, !keep);
            } else {
                qualifier = jQuery.filter(qualifier, filtered);
            }
        }

        return jQuery.grep(elements, function (elem, i) {
            return (jQuery.inArray(elem, qualifier) >= 0) === keep;
        });
    }
    function createSafeFragment(document) {
        var list = nodeNames.split("|"),
        safeFrag = document.createDocumentFragment();

        if (safeFrag.createElement) {
            while (list.length) {
                safeFrag.createElement(
                    list.pop()
                );
            }
        }
        return safeFrag;
    }

    var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
            "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
        rleadingWhitespace = /^\s+/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        rtagName = /<([\w:]+)/,
        rtbody = /<tbody/i,
        rhtml = /<|&#?\w+;/,
        rnoInnerhtml = /<(?:script|style|link)/i,
        rnocache = /<(?:script|object|embed|option|style)/i,
        rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
        rcheckableType = /^(?:checkbox|radio)$/,
        // checked="checked" or checked
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
        rscriptType = /\/(java|ecma)script/i,
        rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
        wrapMap = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            area: [1, "<map>", "</map>"],
            _default: [0, "", ""]
        },
        safeFragment = createSafeFragment(document),
        fragmentDiv = safeFragment.appendChild(document.createElement("div"));

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
    // unless wrapped in a div with non-breaking characters in front of it.
    if (!jQuery.support.htmlSerialize) {
        wrapMap._default = [1, "X<div>", "</div>"];
    }

    jQuery.fn.extend({
        text: function (value) {
            return jQuery.access(this, function (value) {
                return value === undefined ?
                    jQuery.text(this) :
                    this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
            }, null, value, arguments.length);
        },

        wrapAll: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapAll(html.call(this, i));
                });
            }

            if (this[0]) {
                // The elements to wrap the target around
                var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

                if (this[0].parentNode) {
                    wrap.insertBefore(this[0]);
                }

                wrap.map(function () {
                    var elem = this;

                    while (elem.firstChild && elem.firstChild.nodeType === 1) {
                        elem = elem.firstChild;
                    }

                    return elem;
                }).append(this);
            }

            return this;
        },

        wrapInner: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapInner(html.call(this, i));
                });
            }

            return this.each(function () {
                var self = jQuery(this),
                    contents = self.contents();

                if (contents.length) {
                    contents.wrapAll(html);

                } else {
                    self.append(html);
                }
            });
        },

        wrap: function (html) {
            var isFunction = jQuery.isFunction(html);

            return this.each(function (i) {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
            });
        },

        unwrap: function () {
            return this.parent().each(function () {
                if (!jQuery.nodeName(this, "body")) {
                    jQuery(this).replaceWith(this.childNodes);
                }
            }).end();
        },

        append: function () {
            return this.domManip(arguments, true, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11) {
                    this.appendChild(elem);
                }
            });
        },

        prepend: function () {
            return this.domManip(arguments, true, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11) {
                    this.insertBefore(elem, this.firstChild);
                }
            });
        },

        before: function () {
            if (!isDisconnected(this[0])) {
                return this.domManip(arguments, false, function (elem) {
                    this.parentNode.insertBefore(elem, this);
                });
            }

            if (arguments.length) {
                var set = jQuery.clean(arguments);
                return this.pushStack(jQuery.merge(set, this), "before", this.selector);
            }
        },

        after: function () {
            if (!isDisconnected(this[0])) {
                return this.domManip(arguments, false, function (elem) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                });
            }

            if (arguments.length) {
                var set = jQuery.clean(arguments);
                return this.pushStack(jQuery.merge(this, set), "after", this.selector);
            }
        },

        // keepData is for internal use only--do not document
        remove: function (selector, keepData) {
            var elem,
                i = 0;

            for (; (elem = this[i]) != null; i++) {
                if (!selector || jQuery.filter(selector, [elem]).length) {
                    if (!keepData && elem.nodeType === 1) {
                        jQuery.cleanData(elem.getElementsByTagName("*"));
                        jQuery.cleanData([elem]);
                    }

                    if (elem.parentNode) {
                        elem.parentNode.removeChild(elem);
                    }
                }
            }

            return this;
        },

        empty: function () {
            var elem,
                i = 0;

            for (; (elem = this[i]) != null; i++) {
                // Remove element nodes and prevent memory leaks
                if (elem.nodeType === 1) {
                    jQuery.cleanData(elem.getElementsByTagName("*"));
                }

                // Remove any remaining nodes
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }
            }

            return this;
        },

        clone: function (dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

            return this.map(function () {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },

        html: function (value) {
            return jQuery.access(this, function (value) {
                var elem = this[0] || {},
                    i = 0,
                    l = this.length;

                if (value === undefined) {
                    return elem.nodeType === 1 ?
                        elem.innerHTML.replace(rinlinejQuery, "") :
                        undefined;
                }

                // See if we can take a shortcut and just use innerHTML
                if (typeof value === "string" && !rnoInnerhtml.test(value) &&
                    (jQuery.support.htmlSerialize || !rnoshimcache.test(value)) &&
                    (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) &&
                    !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

                    value = value.replace(rxhtmlTag, "<$1></$2>");

                    try {
                        for (; i < l; i++) {
                            // Remove element nodes and prevent memory leaks
                            elem = this[i] || {};
                            if (elem.nodeType === 1) {
                                jQuery.cleanData(elem.getElementsByTagName("*"));
                                elem.innerHTML = value;
                            }
                        }

                        elem = 0;

                        // If using innerHTML throws an exception, use the fallback method
                    } catch (e) { }
                }

                if (elem) {
                    this.empty().append(value);
                }
            }, null, value, arguments.length);
        },

        replaceWith: function (value) {
            if (!isDisconnected(this[0])) {
                // Make sure that the elements are removed from the DOM before they are inserted
                // this can help fix replacing a parent with child elements
                if (jQuery.isFunction(value)) {
                    return this.each(function (i) {
                        var self = jQuery(this), old = self.html();
                        self.replaceWith(value.call(this, i, old));
                    });
                }

                if (typeof value !== "string") {
                    value = jQuery(value).detach();
                }

                return this.each(function () {
                    var next = this.nextSibling,
                        parent = this.parentNode;

                    jQuery(this).remove();

                    if (next) {
                        jQuery(next).before(value);
                    } else {
                        jQuery(parent).append(value);
                    }
                });
            }

            return this.length ?
                this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value) :
                this;
        },

        detach: function (selector) {
            return this.remove(selector, true);
        },

        domManip: function (args, table, callback) {

            // Flatten any nested arrays
            args = [].concat.apply([], args);

            var results, first, fragment, iNoClone,
                i = 0,
                value = args[0],
                scripts = [],
                l = this.length;

            // We can't cloneNode fragments that contain checked, in WebKit
            if (!jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test(value)) {
                return this.each(function () {
                    jQuery(this).domManip(args, table, callback);
                });
            }

            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    var self = jQuery(this);
                    args[0] = value.call(this, i, table ? self.html() : undefined);
                    self.domManip(args, table, callback);
                });
            }

            if (this[0]) {
                results = jQuery.buildFragment(args, this, scripts);
                fragment = results.fragment;
                first = fragment.firstChild;

                if (fragment.childNodes.length === 1) {
                    fragment = first;
                }

                if (first) {
                    table = table && jQuery.nodeName(first, "tr");

                    // Use the original fragment for the last item instead of the first because it can end up
                    // being emptied incorrectly in certain situations (#8070).
                    // Fragments from the fragment cache must always be cloned and never used in place.
                    for (iNoClone = results.cacheable || l - 1; i < l; i++) {
                        callback.call(
                            table && jQuery.nodeName(this[i], "table") ?
                                findOrAppend(this[i], "tbody") :
                                this[i],
                            i === iNoClone ?
                            fragment :
                                jQuery.clone(fragment, true, true)
                        );
                    }
                }

                // Fix #11809: Avoid leaking memory
                fragment = first = null;

                if (scripts.length) {
                    jQuery.each(scripts, function (i, elem) {
                        if (elem.src) {
                            if (jQuery.ajax) {
                                jQuery.ajax({
                                    url: elem.src,
                                    type: "GET",
                                    dataType: "script",
                                    async: false,
                                    global: false,
                                    "throws": true
                                });
                            } else {
                                jQuery.error("no ajax");
                            }
                        } else {
                            jQuery.globalEval((elem.text || elem.textContent || elem.innerHTML || "").replace(rcleanScript, ""));
                        }

                        if (elem.parentNode) {
                            elem.parentNode.removeChild(elem);
                        }
                    });
                }
            }

            return this;
        }
    });

    function findOrAppend(elem, tag) {
        return elem.getElementsByTagName(tag)[0] || elem.appendChild(elem.ownerDocument.createElement(tag));
    }

    function cloneCopyEvent(src, dest) {

        if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
            return;
        }

        var type, i, l,
            oldData = jQuery._data(src),
            curData = jQuery._data(dest, oldData),
            events = oldData.events;

        if (events) {
            delete curData.handle;
            curData.events = {};

            for (type in events) {
                for (i = 0, l = events[type].length; i < l; i++) {
                    jQuery.event.add(dest, type, events[type][i]);
                }
            }
        }

        // make the cloned public data object a copy from the original
        if (curData.data) {
            curData.data = jQuery.extend({}, curData.data);
        }
    }

    function cloneFixAttributes(src, dest) {
        var nodeName;

        // We do not need to do anything for non-Elements
        if (dest.nodeType !== 1) {
            return;
        }

        // clearAttributes removes the attributes, which we don't want,
        // but also removes the attachEvent events, which we *do* want
        if (dest.clearAttributes) {
            dest.clearAttributes();
        }

        // mergeAttributes, in contrast, only merges back on the
        // original attributes, not the events
        if (dest.mergeAttributes) {
            dest.mergeAttributes(src);
        }

        nodeName = dest.nodeName.toLowerCase();

        if (nodeName === "object") {
            // IE6-10 improperly clones children of object elements using classid.
            // IE10 throws NoModificationAllowedError if parent is null, #12132.
            if (dest.parentNode) {
                dest.outerHTML = src.outerHTML;
            }

            // This path appears unavoidable for IE9. When cloning an object
            // element in IE9, the outerHTML strategy above is not sufficient.
            // If the src has innerHTML and the destination does not,
            // copy the src.innerHTML into the dest.innerHTML. #10324
            if (jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML))) {
                dest.innerHTML = src.innerHTML;
            }

        } else if (nodeName === "input" && rcheckableType.test(src.type)) {
            // IE6-8 fails to persist the checked state of a cloned checkbox
            // or radio button. Worse, IE6-7 fail to give the cloned element
            // a checked appearance if the defaultChecked value isn't also set

            dest.defaultChecked = dest.checked = src.checked;

            // IE6-7 get confused and end up setting the value of a cloned
            // checkbox/radio button to an empty string instead of "on"
            if (dest.value !== src.value) {
                dest.value = src.value;
            }

            // IE6-8 fails to return the selected option to the default selected
            // state when cloning options
        } else if (nodeName === "option") {
            dest.selected = src.defaultSelected;

            // IE6-8 fails to set the defaultValue to the correct value when
            // cloning other types of input fields
        } else if (nodeName === "input" || nodeName === "textarea") {
            dest.defaultValue = src.defaultValue;

            // IE blanks contents when cloning scripts
        } else if (nodeName === "script" && dest.text !== src.text) {
            dest.text = src.text;
        }

        // Event data gets referenced instead of copied if the expando
        // gets copied too
        dest.removeAttribute(jQuery.expando);
    }

    jQuery.buildFragment = function (args, context, scripts) {
        var fragment, cacheable, cachehit,
            first = args[0];

        // Set context from what may come in as undefined or a jQuery collection or a node
        // Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
        // also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
        context = context || document;
        context = !context.nodeType && context[0] || context;
        context = context.ownerDocument || context;

        // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
        // Cloning options loses the selected state, so don't cache them
        // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
        // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
        // Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
        if (args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
            first.charAt(0) === "<" && !rnocache.test(first) &&
            (jQuery.support.checkClone || !rchecked.test(first)) &&
            (jQuery.support.html5Clone || !rnoshimcache.test(first))) {

            // Mark cacheable and look for a hit
            cacheable = true;
            fragment = jQuery.fragments[first];
            cachehit = fragment !== undefined;
        }

        if (!fragment) {
            fragment = context.createDocumentFragment();
            jQuery.clean(args, context, fragment, scripts);

            // Update the cache, but only store false
            // unless this is a second parsing of the same content
            if (cacheable) {
                jQuery.fragments[first] = cachehit && fragment;
            }
        }

        return { fragment: fragment, cacheable: cacheable };
    };

    jQuery.fragments = {};

    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (name, original) {
        jQuery.fn[name] = function (selector) {
            var elems,
                i = 0,
                ret = [],
                insert = jQuery(selector),
                l = insert.length,
                parent = this.length === 1 && this[0].parentNode;

            if ((parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1) {
                insert[original](this[0]);
                return this;
            } else {
                for (; i < l; i++) {
                    elems = (i > 0 ? this.clone(true) : this).get();
                    jQuery(insert[i])[original](elems);
                    ret = ret.concat(elems);
                }

                return this.pushStack(ret, name, insert.selector);
            }
        };
    });

    function getAll(elem) {
        if (typeof elem.getElementsByTagName !== "undefined") {
            return elem.getElementsByTagName("*");

        } else if (typeof elem.querySelectorAll !== "undefined") {
            return elem.querySelectorAll("*");

        } else {
            return [];
        }
    }

    // Used in clean, fixes the defaultChecked property
    function fixDefaultChecked(elem) {
        if (rcheckableType.test(elem.type)) {
            elem.defaultChecked = elem.checked;
        }
    }

    jQuery.extend({
        clone: function (elem, dataAndEvents, deepDataAndEvents) {
            var srcElements,
                destElements,
                i,
                clone;

            if (jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test("<" + elem.nodeName + ">")) {
                clone = elem.cloneNode(true);

                // IE<=8 does not properly clone detached, unknown element nodes
            } else {
                fragmentDiv.innerHTML = elem.outerHTML;
                fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
            }

            if ((!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
                    (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
                // IE copies events bound via attachEvent when using cloneNode.
                // Calling detachEvent on the clone will also remove the events
                // from the original. In order to get around this, we use some
                // proprietary methods to clear the events. Thanks to MooTools
                // guys for this hotness.

                cloneFixAttributes(elem, clone);

                // Using Sizzle here is crazy slow, so we use getElementsByTagName instead
                srcElements = getAll(elem);
                destElements = getAll(clone);

                // Weird iteration because IE will replace the length property
                // with an element if you are cloning the body and one of the
                // elements on the page has a name or id of "length"
                for (i = 0; srcElements[i]; ++i) {
                    // Ensure that the destination node is not null; Fixes #9587
                    if (destElements[i]) {
                        cloneFixAttributes(srcElements[i], destElements[i]);
                    }
                }
            }

            // Copy the events from the original to the clone
            if (dataAndEvents) {
                cloneCopyEvent(elem, clone);

                if (deepDataAndEvents) {
                    srcElements = getAll(elem);
                    destElements = getAll(clone);

                    for (i = 0; srcElements[i]; ++i) {
                        cloneCopyEvent(srcElements[i], destElements[i]);
                    }
                }
            }

            srcElements = destElements = null;

            // Return the cloned set
            return clone;
        },

        clean: function (elems, context, fragment, scripts) {
            var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
                safe = context === document && safeFragment,
                ret = [];

            // Ensure that context is a document
            if (!context || typeof context.createDocumentFragment === "undefined") {
                context = document;
            }

            // Use the already-created safe fragment if context permits
            for (i = 0; (elem = elems[i]) != null; i++) {
                if (typeof elem === "number") {
                    elem += "";
                }

                if (!elem) {
                    continue;
                }

                // Convert html string into DOM nodes
                if (typeof elem === "string") {
                    if (!rhtml.test(elem)) {
                        elem = context.createTextNode(elem);
                    } else {
                        // Ensure a safe container in which to render the html
                        safe = safe || createSafeFragment(context);
                        div = context.createElement("div");
                        safe.appendChild(div);

                        // Fix "XHTML"-style tags in all browsers
                        elem = elem.replace(rxhtmlTag, "<$1></$2>");

                        // Go to html and back, then peel off extra wrappers
                        tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                        wrap = wrapMap[tag] || wrapMap._default;
                        depth = wrap[0];
                        div.innerHTML = wrap[1] + elem + wrap[2];

                        // Move to the right depth
                        while (depth--) {
                            div = div.lastChild;
                        }

                        // Remove IE's autoinserted <tbody> from table fragments
                        if (!jQuery.support.tbody) {

                            // String was a <table>, *may* have spurious <tbody>
                            hasBody = rtbody.test(elem);
                            tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

                            for (j = tbody.length - 1; j >= 0 ; --j) {
                                if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length) {
                                    tbody[j].parentNode.removeChild(tbody[j]);
                                }
                            }
                        }

                        // IE completely kills leading whitespace when innerHTML is used
                        if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem)) {
                            div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
                        }

                        elem = div.childNodes;

                        // Take out of fragment container (we need a fresh div each time)
                        div.parentNode.removeChild(div);
                    }
                }

                if (elem.nodeType) {
                    ret.push(elem);
                } else {
                    jQuery.merge(ret, elem);
                }
            }

            // Fix #11356: Clear elements from safeFragment
            if (div) {
                elem = div = safe = null;
            }

            // Reset defaultChecked for any radios and checkboxes
            // about to be appended to the DOM in IE 6/7 (#8060)
            if (!jQuery.support.appendChecked) {
                for (i = 0; (elem = ret[i]) != null; i++) {
                    if (jQuery.nodeName(elem, "input")) {
                        fixDefaultChecked(elem);
                    } else if (typeof elem.getElementsByTagName !== "undefined") {
                        jQuery.grep(elem.getElementsByTagName("input"), fixDefaultChecked);
                    }
                }
            }

            // Append elements to a provided document fragment
            if (fragment) {
                // Special handling of each script element
                handleScript = function (elem) {
                    // Check if we consider it executable
                    if (!elem.type || rscriptType.test(elem.type)) {
                        // Detach the script and store it in the scripts array (if provided) or the fragment
                        // Return truthy to indicate that it has been handled
                        return scripts ?
                            scripts.push(elem.parentNode ? elem.parentNode.removeChild(elem) : elem) :
                            fragment.appendChild(elem);
                    }
                };

                for (i = 0; (elem = ret[i]) != null; i++) {
                    // Check if we're done after handling an executable script
                    if (!(jQuery.nodeName(elem, "script") && handleScript(elem))) {
                        // Append to fragment and handle embedded scripts
                        fragment.appendChild(elem);
                        if (typeof elem.getElementsByTagName !== "undefined") {
                            // handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
                            jsTags = jQuery.grep(jQuery.merge([], elem.getElementsByTagName("script")), handleScript);

                            // Splice the scripts into ret after their former ancestor and advance our index beyond them
                            ret.splice.apply(ret, [i + 1, 0].concat(jsTags));
                            i += jsTags.length;
                        }
                    }
                }
            }

            return ret;
        },

        cleanData: function (elems, /* internal */ acceptData) {
            var data, id, elem, type,
                i = 0,
                internalKey = jQuery.expando,
                cache = jQuery.cache,
                deleteExpando = jQuery.support.deleteExpando,
                special = jQuery.event.special;

            for (; (elem = elems[i]) != null; i++) {

                if (acceptData || jQuery.acceptData(elem)) {

                    id = elem[internalKey];
                    data = id && cache[id];

                    if (data) {
                        if (data.events) {
                            for (type in data.events) {
                                if (special[type]) {
                                    jQuery.event.remove(elem, type);

                                    // This is a shortcut to avoid jQuery.event.remove's overhead
                                } else {
                                    jQuery.removeEvent(elem, type, data.handle);
                                }
                            }
                        }

                        // Remove cache only if it was not already removed by jQuery.event.remove
                        if (cache[id]) {

                            delete cache[id];

                            // IE does not allow us to delete expando properties from nodes,
                            // nor does it have a removeAttribute function on Document nodes;
                            // we must handle all of these cases
                            if (deleteExpando) {
                                delete elem[internalKey];

                            } else if (elem.removeAttribute) {
                                elem.removeAttribute(internalKey);

                            } else {
                                elem[internalKey] = null;
                            }

                            jQuery.deletedIds.push(id);
                        }
                    }
                }
            }
        }
    });
    // Limit scope pollution from any deprecated API
    (function () {

        var matched, browser;

        // Use of jQuery.browser is frowned upon.
        // More details: http://api.jquery.com/jQuery.browser
        // jQuery.uaMatch maintained for back-compat
        jQuery.uaMatch = function (ua) {
            ua = ua.toLowerCase();

            var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                [];

            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        };

        matched = jQuery.uaMatch(navigator.userAgent);
        browser = {};

        if (matched.browser) {
            browser[matched.browser] = true;
            browser.version = matched.version;
        }

        // Chrome is Webkit, but Webkit is also Safari.
        if (browser.chrome) {
            browser.webkit = true;
        } else if (browser.webkit) {
            browser.safari = true;
        }

        jQuery.browser = browser;

        jQuery.sub = function () {
            function jQuerySub(selector, context) {
                return new jQuerySub.fn.init(selector, context);
            }
            jQuery.extend(true, jQuerySub, this);
            jQuerySub.superclass = this;
            jQuerySub.fn = jQuerySub.prototype = this();
            jQuerySub.fn.constructor = jQuerySub;
            jQuerySub.sub = this.sub;
            jQuerySub.fn.init = function init(selector, context) {
                if (context && context instanceof jQuery && !(context instanceof jQuerySub)) {
                    context = jQuerySub(context);
                }

                return jQuery.fn.init.call(this, selector, context, rootjQuerySub);
            };
            jQuerySub.fn.init.prototype = jQuerySub.fn;
            var rootjQuerySub = jQuerySub(document);
            return jQuerySub;
        };

    })();
    var curCSS, iframe, iframeDoc,
        ralpha = /alpha\([^)]*\)/i,
        ropacity = /opacity=([^)]*)/,
        rposition = /^(top|right|bottom|left)$/,
        // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
        // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
        rdisplayswap = /^(none|table(?!-c[ea]).+)/,
        rmargin = /^margin/,
        rnumsplit = new RegExp("^(" + core_pnum + ")(.*)$", "i"),
        rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"),
        rrelNum = new RegExp("^([-+])=(" + core_pnum + ")", "i"),
        elemdisplay = { BODY: "block" },

        cssShow = { position: "absolute", visibility: "hidden", display: "block" },
        cssNormalTransform = {
            letterSpacing: 0,
            fontWeight: 400
        },

        cssExpand = ["Top", "Right", "Bottom", "Left"],
        cssPrefixes = ["Webkit", "O", "Moz", "ms"],

        eventsToggle = jQuery.fn.toggle;

    // return a css property mapped to a potentially vendor prefixed property
    function vendorPropName(style, name) {

        // shortcut for names that are not vendor prefixed
        if (name in style) {
            return name;
        }

        // check for vendor prefixed names
        var capName = name.charAt(0).toUpperCase() + name.slice(1),
            origName = name,
            i = cssPrefixes.length;

        while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in style) {
                return name;
            }
        }

        return origName;
    }

    function isHidden(elem, el) {
        elem = el || elem;
        return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
    }

    function showHide(elements, show) {
        var elem, display,
            values = [],
            index = 0,
            length = elements.length;

        for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }
            values[index] = jQuery._data(elem, "olddisplay");
            if (show) {
                // Reset the inline display of this element to learn if it is
                // being hidden by cascaded rules or not
                if (!values[index] && elem.style.display === "none") {
                    elem.style.display = "";
                }

                // Set elements which have been overridden with display: none
                // in a stylesheet to whatever the default browser style is
                // for such an element
                if (elem.style.display === "" && isHidden(elem)) {
                    values[index] = jQuery._data(elem, "olddisplay", css_defaultDisplay(elem.nodeName));
                }
            } else {
                display = curCSS(elem, "display");

                if (!values[index] && display !== "none") {
                    jQuery._data(elem, "olddisplay", display);
                }
            }
        }

        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        for (index = 0; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }
            if (!show || elem.style.display === "none" || elem.style.display === "") {
                elem.style.display = show ? values[index] || "" : "none";
            }
        }

        return elements;
    }

    jQuery.fn.extend({
        css: function (name, value) {
            return jQuery.access(this, function (elem, name, value) {
                return value !== undefined ?
                    jQuery.style(elem, name, value) :
                    jQuery.css(elem, name);
            }, name, value, arguments.length > 1);
        },
        show: function () {
            return showHide(this, true);
        },
        hide: function () {
            return showHide(this);
        },
        toggle: function (state, fn2) {
            var bool = typeof state === "boolean";

            if (jQuery.isFunction(state) && jQuery.isFunction(fn2)) {
                return eventsToggle.apply(this, arguments);
            }

            return this.each(function () {
                if (bool ? state : isHidden(this)) {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            });
        }
    });

    jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function (elem, computed) {
                    if (computed) {
                        // We should always get a number back from opacity
                        var ret = curCSS(elem, "opacity");
                        return ret === "" ? "1" : ret;

                    }
                }
            }
        },

        // Exclude the following css properties to add px
        cssNumber: {
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            // normalize float css property
            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },

        // Get and set the style property on a DOM Node
        style: function (elem, name, value, extra) {
            // Don't set styles on text and comment nodes
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }

            // Make sure that we're working with the right name
            var ret, type, hooks,
                origName = jQuery.camelCase(name),
                style = elem.style;

            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));

            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

            // Check if we're setting a value
            if (value !== undefined) {
                type = typeof value;

                // convert relative number strings (+= or -=) to relative numbers. #7345
                if (type === "string" && (ret = rrelNum.exec(value))) {
                    value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
                    // Fixes bug #9237
                    type = "number";
                }

                // Make sure that NaN and null values aren't set. See: #7116
                if (value == null || type === "number" && isNaN(value)) {
                    return;
                }

                // If a number was passed in, add 'px' to the (except for certain CSS properties)
                if (type === "number" && !jQuery.cssNumber[origName]) {
                    value += "px";
                }

                // If a hook was provided, use that value, otherwise just set the specified value
                if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
                    // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                    // Fixes bug #5509
                    try {
                        style[name] = value;
                    } catch (e) { }
                }

            } else {
                // If a hook was provided get the non-computed value from there
                if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                    return ret;
                }

                // Otherwise just get the value from the style object
                return style[name];
            }
        },

        css: function (elem, name, numeric, extra) {
            var val, num, hooks,
                origName = jQuery.camelCase(name);

            // Make sure that we're working with the right name
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));

            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

            // If a hook was provided get the computed value from there
            if (hooks && "get" in hooks) {
                val = hooks.get(elem, true, extra);
            }

            // Otherwise, if a way to get the computed value exists, use that
            if (val === undefined) {
                val = curCSS(elem, name);
            }

            //convert "normal" to computed value
            if (val === "normal" && name in cssNormalTransform) {
                val = cssNormalTransform[name];
            }

            // Return, converting to number if forced or a qualifier was provided and val looks numeric
            if (numeric || extra !== undefined) {
                num = parseFloat(val);
                return numeric || jQuery.isNumeric(num) ? num || 0 : val;
            }
            return val;
        },

        // A method for quickly swapping in/out CSS properties to get correct calculations
        swap: function (elem, options, callback) {
            var ret, name,
                old = {};

            // Remember the old values, and insert the new ones
            for (name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }

            ret = callback.call(elem);

            // Revert the old values
            for (name in options) {
                elem.style[name] = old[name];
            }

            return ret;
        }
    });

    // NOTE: To any future maintainer, we've window.getComputedStyle
    // because jsdom on node.js will break without it.
    if (window.getComputedStyle) {
        curCSS = function (elem, name) {
            var ret, width, minWidth, maxWidth,
                computed = window.getComputedStyle(elem, null),
                style = elem.style;

            if (computed) {

                // getPropertyValue is only needed for .css('filter') in IE9, see #12537
                ret = computed.getPropertyValue(name) || computed[name];

                if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
                    ret = jQuery.style(elem, name);
                }

                // A tribute to the "awesome hack by Dean Edwards"
                // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
                // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
                // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
                if (rnumnonpx.test(ret) && rmargin.test(name)) {
                    width = style.width;
                    minWidth = style.minWidth;
                    maxWidth = style.maxWidth;

                    style.minWidth = style.maxWidth = style.width = ret;
                    ret = computed.width;

                    style.width = width;
                    style.minWidth = minWidth;
                    style.maxWidth = maxWidth;
                }
            }

            return ret;
        };
    } else if (document.documentElement.currentStyle) {
        curCSS = function (elem, name) {
            var left, rsLeft,
                ret = elem.currentStyle && elem.currentStyle[name],
                style = elem.style;

            // Avoid setting ret to empty string here
            // so we don't default to auto
            if (ret == null && style && style[name]) {
                ret = style[name];
            }

            // From the awesome hack by Dean Edwards
            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels
            // but not position css attributes, as those are proportional to the parent element instead
            // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
            if (rnumnonpx.test(ret) && !rposition.test(name)) {

                // Remember the original values
                left = style.left;
                rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

                // Put in the new values to get a computed value out
                if (rsLeft) {
                    elem.runtimeStyle.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : ret;
                ret = style.pixelLeft + "px";

                // Revert the changed values
                style.left = left;
                if (rsLeft) {
                    elem.runtimeStyle.left = rsLeft;
                }
            }

            return ret === "" ? "auto" : ret;
        };
    }

    function setPositiveNumber(elem, value, subtract) {
        var matches = rnumsplit.exec(value);
        return matches ?
                Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") :
                value;
    }

    function augmentWidthOrHeight(elem, name, extra, isBorderBox) {
        var i = extra === (isBorderBox ? "border" : "content") ?
            // If we already have the right measurement, avoid augmentation
            4 :
            // Otherwise initialize for horizontal or vertical properties
            name === "width" ? 1 : 0,

            val = 0;

        for (; i < 4; i += 2) {
            // both box models exclude margin, so add it if we want it
            if (extra === "margin") {
                // we use jQuery.css instead of curCSS here
                // because of the reliableMarginRight CSS hook!
                val += jQuery.css(elem, extra + cssExpand[i], true);
            }

            // From this point on we use curCSS for maximum performance (relevant in animations)
            if (isBorderBox) {
                // border-box includes padding, so remove it if we want content
                if (extra === "content") {
                    val -= parseFloat(curCSS(elem, "padding" + cssExpand[i])) || 0;
                }

                // at this point, extra isn't border nor margin, so remove border
                if (extra !== "margin") {
                    val -= parseFloat(curCSS(elem, "border" + cssExpand[i] + "Width")) || 0;
                }
            } else {
                // at this point, extra isn't content, so add padding
                val += parseFloat(curCSS(elem, "padding" + cssExpand[i])) || 0;

                // at this point, extra isn't content nor padding, so add border
                if (extra !== "padding") {
                    val += parseFloat(curCSS(elem, "border" + cssExpand[i] + "Width")) || 0;
                }
            }
        }

        return val;
    }

    function getWidthOrHeight(elem, name, extra) {

        // Start with offset property, which is equivalent to the border-box value
        var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
            valueIsBorderBox = true,
            isBorderBox = jQuery.support.boxSizing && jQuery.css(elem, "boxSizing") === "border-box";

        // some non-html elements return undefined for offsetWidth, so check for null/undefined
        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
        if (val <= 0 || val == null) {
            // Fall back to computed then uncomputed css if necessary
            val = curCSS(elem, name);
            if (val < 0 || val == null) {
                val = elem.style[name];
            }

            // Computed unit is not pixels. Stop here and return.
            if (rnumnonpx.test(val)) {
                return val;
            }

            // we need the check for style in case a browser which returns unreliable values
            // for getComputedStyle silently falls back to the reliable elem.style
            valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable || val === elem.style[name]);

            // Normalize "", auto, and prepare for extra
            val = parseFloat(val) || 0;
        }

        // use the active box-sizing model to add/subtract irrelevant styles
        return (val +
            augmentWidthOrHeight(
                elem,
                name,
                extra || (isBorderBox ? "border" : "content"),
                valueIsBorderBox
            )
        ) + "px";
    }


    // Try to determine the default display value of an element
    function css_defaultDisplay(nodeName) {
        if (elemdisplay[nodeName]) {
            return elemdisplay[nodeName];
        }

        var elem = jQuery("<" + nodeName + ">").appendTo(document.body),
            display = elem.css("display");
        elem.remove();

        // If the simple way fails,
        // get element's real default display by attaching it to a temp iframe
        if (display === "none" || display === "") {
            // Use the already-created iframe if possible
            iframe = document.body.appendChild(
                iframe || jQuery.extend(document.createElement("iframe"), {
                    frameBorder: 0,
                    width: 0,
                    height: 0
                })
            );

            // Create a cacheable copy of the iframe document on first call.
            // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
            // document to it; WebKit & Firefox won't allow reusing the iframe document.
            if (!iframeDoc || !iframe.createElement) {
                iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
                iframeDoc.write("<!doctype html><html><body>");
                iframeDoc.close();
            }

            elem = iframeDoc.body.appendChild(iframeDoc.createElement(nodeName));

            display = curCSS(elem, "display");
            document.body.removeChild(iframe);
        }

        // Store the correct default display
        elemdisplay[nodeName] = display;

        return display;
    }

    jQuery.each(["height", "width"], function (i, name) {
        jQuery.cssHooks[name] = {
            get: function (elem, computed, extra) {
                if (computed) {
                    // certain elements can have dimension info if we invisibly show them
                    // however, it must have a current display style that would benefit from this
                    if (elem.offsetWidth === 0 && rdisplayswap.test(curCSS(elem, "display"))) {
                        return jQuery.swap(elem, cssShow, function () {
                            return getWidthOrHeight(elem, name, extra);
                        });
                    } else {
                        return getWidthOrHeight(elem, name, extra);
                    }
                }
            },

            set: function (elem, value, extra) {
                return setPositiveNumber(elem, value, extra ?
                    augmentWidthOrHeight(
                        elem,
                        name,
                        extra,
                        jQuery.support.boxSizing && jQuery.css(elem, "boxSizing") === "border-box"
                    ) : 0
                );
            }
        };
    });

    if (!jQuery.support.opacity) {
        jQuery.cssHooks.opacity = {
            get: function (elem, computed) {
                // IE uses filters for opacity
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
                    (0.01 * parseFloat(RegExp.$1)) + "" :
                    computed ? "1" : "";
            },

            set: function (elem, value) {
                var style = elem.style,
                    currentStyle = elem.currentStyle,
                    opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "",
                    filter = currentStyle && currentStyle.filter || style.filter || "";

                // IE has trouble with opacity if it does not have layout
                // Force it by setting the zoom level
                style.zoom = 1;

                // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
                if (value >= 1 && jQuery.trim(filter.replace(ralpha, "")) === "" &&
                    style.removeAttribute) {

                    // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
                    // if "filter:" is present at all, clearType is disabled, we want to avoid this
                    // style.removeAttribute is IE Only, but so apparently is this code path...
                    style.removeAttribute("filter");

                    // if there there is no filter style applied in a css rule, we are done
                    if (currentStyle && !currentStyle.filter) {
                        return;
                    }
                }

                // otherwise, set new filter values
                style.filter = ralpha.test(filter) ?
                    filter.replace(ralpha, opacity) :
                    filter + " " + opacity;
            }
        };
    }

    // These hooks cannot be added until DOM ready because the support test
    // for it is not run until after DOM ready
    jQuery(function () {
        if (!jQuery.support.reliableMarginRight) {
            jQuery.cssHooks.marginRight = {
                get: function (elem, computed) {
                    // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                    // Work around by temporarily setting element display to inline-block
                    return jQuery.swap(elem, { "display": "inline-block" }, function () {
                        if (computed) {
                            return curCSS(elem, "marginRight");
                        }
                    });
                }
            };
        }

        // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
        // getComputedStyle returns percent when specified for top/left/bottom/right
        // rather than make the css module depend on the offset module, we just check for it here
        if (!jQuery.support.pixelPosition && jQuery.fn.position) {
            jQuery.each(["top", "left"], function (i, prop) {
                jQuery.cssHooks[prop] = {
                    get: function (elem, computed) {
                        if (computed) {
                            var ret = curCSS(elem, prop);
                            // if curCSS returns percentage, fallback to offset
                            return rnumnonpx.test(ret) ? jQuery(elem).position()[prop] + "px" : ret;
                        }
                    }
                };
            });
        }

    });

    if (jQuery.expr && jQuery.expr.filters) {
        jQuery.expr.filters.hidden = function (elem) {
            return (elem.offsetWidth === 0 && elem.offsetHeight === 0) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS(elem, "display")) === "none");
        };

        jQuery.expr.filters.visible = function (elem) {
            return !jQuery.expr.filters.hidden(elem);
        };
    }

    // These hooks are used by animate to expand properties
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function (prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function (value) {
                var i,

                    // assumes a single number if not a string
                    parts = typeof value === "string" ? value.split(" ") : [value],
                    expanded = {};

                for (i = 0; i < 4; i++) {
                    expanded[prefix + cssExpand[i] + suffix] =
                        parts[i] || parts[i - 2] || parts[0];
                }

                return expanded;
            }
        };

        if (!rmargin.test(prefix)) {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
    });
    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        rselectTextarea = /^(?:select|textarea)/i;

    jQuery.fn.extend({
        serialize: function () {
            return jQuery.param(this.serializeArray());
        },
        serializeArray: function () {
            return this.map(function () {
                return this.elements ? jQuery.makeArray(this.elements) : this;
            })
            .filter(function () {
                return this.name && !this.disabled &&
                    (this.checked || rselectTextarea.test(this.nodeName) ||
                        rinput.test(this.type));
            })
            .map(function (i, elem) {
                var val = jQuery(this).val();

                return val == null ?
                    null :
                    jQuery.isArray(val) ?
                        jQuery.map(val, function (val, i) {
                            return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
                        }) :
					{ name: elem.name, value: val.replace(rCRLF, "\r\n") };
            }).get();
        }
    });

    //Serialize an array of form elements or a set of
    //key/values into a query string
    jQuery.param = function (a, traditional) {
        var prefix,
            s = [],
            add = function (key, value) {
                // If value is a function, invoke it and return its value
                value = jQuery.isFunction(value) ? value() : (value == null ? "" : value);
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };

        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if (traditional === undefined) {
            traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
            // Serialize the form elements
            jQuery.each(a, function () {
                add(this.name, this.value);
            });

        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for (prefix in a) {
                buildParams(prefix, a[prefix], traditional, add);
            }
        }

        // Return the resulting serialization
        return s.join("&").replace(r20, "+");
    };

    function buildParams(prefix, obj, traditional, add) {
        var name;

        if (jQuery.isArray(obj)) {
            // Serialize array item.
            jQuery.each(obj, function (i, v) {
                if (traditional || rbracket.test(prefix)) {
                    // Treat each array item as a scalar.
                    add(prefix, v);

                } else {
                    // If array item is non-scalar (array or object), encode its
                    // numeric index to resolve deserialization ambiguity issues.
                    // Note that rack (as of 1.0.0) can't currently deserialize
                    // nested arrays properly, and attempting to do so may cause
                    // a server error. Possible fixes are to modify rack's
                    // deserialization algorithm or to provide an option or flag
                    // to force array serialization to be shallow.
                    buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
                }
            });

        } else if (!traditional && jQuery.type(obj) === "object") {
            // Serialize object item.
            for (name in obj) {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }

        } else {
            // Serialize scalar item.
            add(prefix, obj);
        }
    }
    var
        // Document location
        ajaxLocParts,
        ajaxLocation,

        rhash = /#.*$/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
        // #7653, #8125, #8152: local protocol detection
        rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,
        rquery = /\?/,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        rts = /([?&])_=[^&]*/,
        rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

        // Keep a copy of the old load method
        _load = jQuery.fn.load,

        /* Prefilters
         * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
         * 2) These are called:
         *    - BEFORE asking for a transport
         *    - AFTER param serialization (s.data is a string if s.processData is true)
         * 3) key is the dataType
         * 4) the catchall symbol "*" can be used
         * 5) execution will start with transport dataType and THEN continue down to "*" if needed
         */
        prefilters = {},

        /* Transports bindings
         * 1) key is the dataType
         * 2) the catchall symbol "*" can be used
         * 3) selection will start with transport dataType and THEN go to "*" if needed
         */
        transports = {},

        // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
        allTypes = ["*/"] + ["*"];

    // #8138, IE may throw an exception when accessing
    // a field from window.location if document.domain has been set
    try {
        ajaxLocation = location.href;
    } catch (e) {
        // Use the href attribute of an A element
        // since IE will modify it given document.location
        ajaxLocation = document.createElement("a");
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }

    // Segment location into parts
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports(structure) {

        // dataTypeExpression is optional and defaults to "*"
        return function (dataTypeExpression, func) {

            if (typeof dataTypeExpression !== "string") {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            var dataType, list, placeBefore,
                dataTypes = dataTypeExpression.toLowerCase().split(core_rspace),
                i = 0,
                length = dataTypes.length;

            if (jQuery.isFunction(func)) {
                // For each dataType in the dataTypeExpression
                for (; i < length; i++) {
                    dataType = dataTypes[i];
                    // We control if we're asked to add before
                    // any existing element
                    placeBefore = /^\+/.test(dataType);
                    if (placeBefore) {
                        dataType = dataType.substr(1) || "*";
                    }
                    list = structure[dataType] = structure[dataType] || [];
                    // then we add to the structure accordingly
                    list[placeBefore ? "unshift" : "push"](func);
                }
            }
        };
    }

    // Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR,
            dataType /* internal */, inspected /* internal */) {

        dataType = dataType || options.dataTypes[0];
        inspected = inspected || {};

        inspected[dataType] = true;

        var selection,
            list = structure[dataType],
            i = 0,
            length = list ? list.length : 0,
            executeOnly = (structure === prefilters);

        for (; i < length && (executeOnly || !selection) ; i++) {
            selection = list[i](options, originalOptions, jqXHR);
            // If we got redirected to another dataType
            // we try there if executing only and not done already
            if (typeof selection === "string") {
                if (!executeOnly || inspected[selection]) {
                    selection = undefined;
                } else {
                    options.dataTypes.unshift(selection);
                    selection = inspectPrefiltersOrTransports(
                            structure, options, originalOptions, jqXHR, selection, inspected);
                }
            }
        }
        // If we're only executing or nothing was selected
        // we try the catchall dataType if not done already
        if ((executeOnly || !selection) && !inspected["*"]) {
            selection = inspectPrefiltersOrTransports(
                    structure, options, originalOptions, jqXHR, "*", inspected);
        }
        // unnecessary when only executing (prefilters)
        // but it'll be ignored by the caller in that case
        return selection;
    }

    // A special extend for ajax options
    // that takes "flat" options (not to be deep extended)
    // Fixes #9887
    function ajaxExtend(target, src) {
        var key, deep,
            flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) {
            if (src[key] !== undefined) {
                (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
            }
        }
        if (deep) {
            jQuery.extend(true, target, deep);
        }
    }

    jQuery.fn.load = function (url, params, callback) {
        if (typeof url !== "string" && _load) {
            return _load.apply(this, arguments);
        }

        // Don't do a request if no elements are being requested
        if (!this.length) {
            return this;
        }

        var selector, type, response,
            self = this,
            off = url.indexOf(" ");

        if (off >= 0) {
            selector = url.slice(off, url.length);
            url = url.slice(0, off);
        }

        // If it's a function
        if (jQuery.isFunction(params)) {

            // We assume that it's the callback
            callback = params;
            params = undefined;

            // Otherwise, build a param string
        } else if (params && typeof params === "object") {
            type = "POST";
        }

        // Request the remote document
        jQuery.ajax({
            url: url,

            // if "type" variable is undefined, then "GET" method will be used
            type: type,
            dataType: "html",
            data: params,
            complete: function (jqXHR, status) {
                if (callback) {
                    self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
                }
            }
        }).done(function (responseText) {

            // Save response for use in complete callback
            response = arguments;

            // See if a selector was specified
            self.html(selector ?

                // Create a dummy div to hold the results
                jQuery("<div>")

                    // inject the contents of the document in, removing the scripts
                    // to avoid any 'Permission Denied' errors in IE
                    .append(responseText.replace(rscript, ""))

                    // Locate the specified elements
                    .find(selector) :

                // If not, just inject the full result
                responseText);

        });

        return this;
    };

    // Attach a bunch of functions for handling common AJAX events
    jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (i, o) {
        jQuery.fn[o] = function (f) {
            return this.on(o, f);
        };
    });

    jQuery.each(["get", "post"], function (i, method) {
        jQuery[method] = function (url, data, callback, type) {
            // shift arguments if data argument was omitted
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return jQuery.ajax({
                type: method,
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        };
    });

    jQuery.extend({

        getScript: function (url, callback) {
            return jQuery.get(url, undefined, callback, "script");
        },

        getJSON: function (url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },

        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function (target, settings) {
            if (settings) {
                // Building a settings object
                ajaxExtend(target, jQuery.ajaxSettings);
            } else {
                // Extending ajaxSettings
                settings = target;
                target = jQuery.ajaxSettings;
            }
            ajaxExtend(target, settings);
            return target;
        },

        ajaxSettings: {
            url: ajaxLocation,
            isLocal: rlocalProtocol.test(ajaxLocParts[1]),
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: true,
            async: true,
            /*
            timeout: 0,
            data: null,
            dataType: null,
            username: null,
            password: null,
            cache: null,
            throws: false,
            traditional: false,
            headers: {},
            */

            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": allTypes
            },

            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },

            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },

            // List of data converters
            // 1) key format is "source_type destination_type" (a single space in-between)
            // 2) the catchall symbol "*" can be used for source_type
            converters: {

                // Convert anything to text
                "* text": window.String,

                // Text to html (true = no transformation)
                "text html": true,

                // Evaluate text as a json expression
                "text json": jQuery.parseJSON,

                // Parse text as xml
                "text xml": jQuery.parseXML
            },

            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
                context: true,
                url: true
            }
        },

        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),

        // Main method
        ajax: function (url, options) {

            // If url is an object, simulate pre-1.5 signature
            if (typeof url === "object") {
                options = url;
                url = undefined;
            }

            // Force options to be an object
            options = options || {};

            var // ifModified key
                ifModifiedKey,
                // Response headers
                responseHeadersString,
                responseHeaders,
                // transport
                transport,
                // timeout handle
                timeoutTimer,
                // Cross-domain detection vars
                parts,
                // To know if global events are to be dispatched
                fireGlobals,
                // Loop variable
                i,
                // Create the final options object
                s = jQuery.ajaxSetup({}, options),
                // Callbacks context
                callbackContext = s.context || s,
                // Context for global events
                // It's the callbackContext if one was provided in the options
                // and if it's a DOM node or a jQuery collection
                globalEventContext = callbackContext !== s &&
                    (callbackContext.nodeType || callbackContext instanceof jQuery) ?
                            jQuery(callbackContext) : jQuery.event,
                // Deferreds
                deferred = jQuery.Deferred(),
                completeDeferred = jQuery.Callbacks("once memory"),
                // Status-dependent callbacks
                statusCode = s.statusCode || {},
                // Headers (they are sent all at once)
                requestHeaders = {},
                requestHeadersNames = {},
                // The jqXHR state
                state = 0,
                // Default abort message
                strAbort = "canceled",
                // Fake xhr
                jqXHR = {

                    readyState: 0,

                    // Caches the header
                    setRequestHeader: function (name, value) {
                        if (!state) {
                            var lname = name.toLowerCase();
                            name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                            requestHeaders[name] = value;
                        }
                        return this;
                    },

                    // Raw string
                    getAllResponseHeaders: function () {
                        return state === 2 ? responseHeadersString : null;
                    },

                    // Builds headers hashtable if needed
                    getResponseHeader: function (key) {
                        var match;
                        if (state === 2) {
                            if (!responseHeaders) {
                                responseHeaders = {};
                                while ((match = rheaders.exec(responseHeadersString))) {
                                    responseHeaders[match[1].toLowerCase()] = match[2];
                                }
                            }
                            match = responseHeaders[key.toLowerCase()];
                        }
                        return match === undefined ? null : match;
                    },

                    // Overrides response content-type header
                    overrideMimeType: function (type) {
                        if (!state) {
                            s.mimeType = type;
                        }
                        return this;
                    },

                    // Cancel the request
                    abort: function (statusText) {
                        statusText = statusText || strAbort;
                        if (transport) {
                            transport.abort(statusText);
                        }
                        done(0, statusText);
                        return this;
                    }
                };

            // Callback for when everything is done
            // It is defined here because jslint complains if it is declared
            // at the end of the function (which would be more logical and readable)
            function done(status, nativeStatusText, responses, headers) {
                var isSuccess, success, error, response, modified,
                    statusText = nativeStatusText;

                // Called once
                if (state === 2) {
                    return;
                }

                // State is "done" now
                state = 2;

                // Clear timeout if it exists
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }

                // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = undefined;

                // Cache response headers
                responseHeadersString = headers || "";

                // Set readyState
                jqXHR.readyState = status > 0 ? 4 : 0;

                // Get response data
                if (responses) {
                    response = ajaxHandleResponses(s, jqXHR, responses);
                }

                // If successful, handle type chaining
                if (status >= 200 && status < 300 || status === 304) {

                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                    if (s.ifModified) {

                        modified = jqXHR.getResponseHeader("Last-Modified");
                        if (modified) {
                            jQuery.lastModified[ifModifiedKey] = modified;
                        }
                        modified = jqXHR.getResponseHeader("Etag");
                        if (modified) {
                            jQuery.etag[ifModifiedKey] = modified;
                        }
                    }

                    // If not modified
                    if (status === 304) {

                        statusText = "notmodified";
                        isSuccess = true;

                        // If we have data
                    } else {

                        isSuccess = ajaxConvert(s, response);
                        statusText = isSuccess.state;
                        success = isSuccess.data;
                        error = isSuccess.error;
                        isSuccess = !error;
                    }
                } else {
                    // We extract error from statusText
                    // then normalize statusText and status for non-aborts
                    error = statusText;
                    if (!statusText || status) {
                        statusText = "error";
                        if (status < 0) {
                            status = 0;
                        }
                    }
                }

                // Set data for the fake xhr object
                jqXHR.status = status;
                jqXHR.statusText = (nativeStatusText || statusText) + "";

                // Success/Error
                if (isSuccess) {
                    deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
                } else {
                    deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
                }

                // Status-dependent callbacks
                jqXHR.statusCode(statusCode);
                statusCode = undefined;

                if (fireGlobals) {
                    globalEventContext.trigger("ajax" + (isSuccess ? "Success" : "Error"),
                            [jqXHR, s, isSuccess ? success : error]);
                }

                // Complete
                completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

                if (fireGlobals) {
                    globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                    // Handle the global AJAX counter
                    if (!(--jQuery.active)) {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }

            // Attach deferreds
            deferred.promise(jqXHR);
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;
            jqXHR.complete = completeDeferred.add;

            // Status-dependent callbacks
            jqXHR.statusCode = function (map) {
                if (map) {
                    var tmp;
                    if (state < 2) {
                        for (tmp in map) {
                            statusCode[tmp] = [statusCode[tmp], map[tmp]];
                        }
                    } else {
                        tmp = map[jqXHR.status];
                        jqXHR.always(tmp);
                    }
                }
                return this;
            };

            // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
            // We also use the url parameter if available
            s.url = ((url || s.url) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");

            // Extract dataTypes list
            s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().split(core_rspace);

            // A cross-domain request is in order when we have a protocol:host:port mismatch
            if (s.crossDomain == null) {
                parts = rurl.exec(s.url.toLowerCase());
                s.crossDomain = !!(parts &&
                    (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] ||
                        (parts[3] || (parts[1] === "http:" ? 80 : 443)) !=
                            (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443)))
                );
            }

            // Convert data if not already a string
            if (s.data && s.processData && typeof s.data !== "string") {
                s.data = jQuery.param(s.data, s.traditional);
            }

            // Apply prefilters
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

            // If request was aborted inside a prefilter, stop there
            if (state === 2) {
                return jqXHR;
            }

            // We can fire global events as of now if asked to
            fireGlobals = s.global;

            // Uppercase the type
            s.type = s.type.toUpperCase();

            // Determine if request has content
            s.hasContent = !rnoContent.test(s.type);

            // Watch for a new set of requests
            if (fireGlobals && jQuery.active++ === 0) {
                jQuery.event.trigger("ajaxStart");
            }

            // More options handling for requests with no content
            if (!s.hasContent) {

                // If data is available, append data to url
                if (s.data) {
                    s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
                    // #9682: remove data so that it's not used in an eventual retry
                    delete s.data;
                }

                // Get ifModifiedKey before adding the anti-cache parameter
                ifModifiedKey = s.url;

                // Add anti-cache in url if needed
                if (s.cache === false) {

                    var ts = jQuery.now(),
                        // try replacing _= if it is there
                        ret = s.url.replace(rts, "$1_=" + ts);

                    // if nothing was replaced, add timestamp to the end
                    s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
                }
            }

            // Set the correct header, if data is being sent
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
                jqXHR.setRequestHeader("Content-Type", s.contentType);
            }

            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if (s.ifModified) {
                ifModifiedKey = ifModifiedKey || s.url;
                if (jQuery.lastModified[ifModifiedKey]) {
                    jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[ifModifiedKey]);
                }
                if (jQuery.etag[ifModifiedKey]) {
                    jqXHR.setRequestHeader("If-None-Match", jQuery.etag[ifModifiedKey]);
                }
            }

            // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader(
                "Accept",
                s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
                    s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") :
                    s.accepts["*"]
            );

            // Check for headers option
            for (i in s.headers) {
                jqXHR.setRequestHeader(i, s.headers[i]);
            }

            // Allow custom headers/mimetypes and early abort
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
                // Abort if not done already and return
                return jqXHR.abort();

            }

            // aborting is no longer a cancellation
            strAbort = "abort";

            // Install callbacks on deferreds
            for (i in { success: 1, error: 1, complete: 1 }) {
                jqXHR[i](s[i]);
            }

            // Get transport
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

            // If no transport, we auto-abort
            if (!transport) {
                done(-1, "No Transport");
            } else {
                jqXHR.readyState = 1;
                // Send global event
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxSend", [jqXHR, s]);
                }
                // Timeout
                if (s.async && s.timeout > 0) {
                    timeoutTimer = setTimeout(function () {
                        jqXHR.abort("timeout");
                    }, s.timeout);
                }

                try {
                    state = 1;
                    transport.send(requestHeaders, done);
                } catch (e) {
                    // Propagate exception as error if not done
                    if (state < 2) {
                        done(-1, e);
                        // Simply rethrow otherwise
                    } else {
                        throw e;
                    }
                }
            }

            return jqXHR;
        },

        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {}

    });

    /* Handles responses to an ajax request:
     * - sets all responseXXX fields accordingly
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses(s, jqXHR, responses) {

        var ct, type, finalDataType, firstDataType,
            contents = s.contents,
            dataTypes = s.dataTypes,
            responseFields = s.responseFields;

        // Fill responseXXX fields
        for (type in responseFields) {
            if (type in responses) {
                jqXHR[responseFields[type]] = responses[type];
            }
        }

        // Remove auto dataType and get content-type in the process
        while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === undefined) {
                ct = s.mimeType || jqXHR.getResponseHeader("content-type");
            }
        }

        // Check if we're dealing with a known content-type
        if (ct) {
            for (type in contents) {
                if (contents[type] && contents[type].test(ct)) {
                    dataTypes.unshift(type);
                    break;
                }
            }
        }

        // Check to see if we have a response for the expected dataType
        if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
        } else {
            // Try convertible dataTypes
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                if (!firstDataType) {
                    firstDataType = type;
                }
            }
            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
                dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
        }
    }

    // Chain conversions given the request and the original response
    function ajaxConvert(s, response) {

        var conv, conv2, current, tmp,
            // Work with a copy of dataTypes in case we need to modify it for conversion
            dataTypes = s.dataTypes.slice(),
            prev = dataTypes[0],
            converters = {},
            i = 0;

        // Apply the dataFilter if provided
        if (s.dataFilter) {
            response = s.dataFilter(response, s.dataType);
        }

        // Create converters map with lowercased keys
        if (dataTypes[1]) {
            for (conv in s.converters) {
                converters[conv.toLowerCase()] = s.converters[conv];
            }
        }

        // Convert to each sequential dataType, tolerating list modification
        for (; (current = dataTypes[++i]) ;) {

            // There's only work to do if current dataType is non-auto
            if (current !== "*") {

                // Convert response if prev dataType is non-auto and differs from current
                if (prev !== "*" && prev !== current) {

                    // Seek a direct converter
                    conv = converters[prev + " " + current] || converters["* " + current];

                    // If none found, seek a pair
                    if (!conv) {
                        for (conv2 in converters) {

                            // If conv2 outputs current
                            tmp = conv2.split(" ");
                            if (tmp[1] === current) {

                                // If prev can be converted to accepted input
                                conv = converters[prev + " " + tmp[0]] ||
                                    converters["* " + tmp[0]];
                                if (conv) {
                                    // Condense equivalence converters
                                    if (conv === true) {
                                        conv = converters[conv2];

                                        // Otherwise, insert the intermediate dataType
                                    } else if (converters[conv2] !== true) {
                                        current = tmp[0];
                                        dataTypes.splice(i--, 0, current);
                                    }

                                    break;
                                }
                            }
                        }
                    }

                    // Apply converter (if not an equivalence)
                    if (conv !== true) {

                        // Unless errors are allowed to bubble, catch and return them
                        if (conv && s["throws"]) {
                            response = conv(response);
                        } else {
                            try {
                                response = conv(response);
                            } catch (e) {
                                return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
                            }
                        }
                    }
                }

                // Update prev for next iteration
                prev = current;
            }
        }

        return { state: "success", data: response };
    }
    var oldCallbacks = [],
        rquestion = /\?/,
        rjsonp = /(=)\?(?=&|$)|\?\?/,
        nonce = jQuery.now();

    // Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (nonce++));
            this[callback] = true;
            return callback;
        }
    });

    // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

        var callbackName, overwritten, responseContainer,
            data = s.data,
            url = s.url,
            hasCallback = s.jsonp !== false,
            replaceInUrl = hasCallback && rjsonp.test(url),
            replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
                !(s.contentType || "").indexOf("application/x-www-form-urlencoded") &&
                rjsonp.test(data);

        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if (s.dataTypes[0] === "jsonp" || replaceInUrl || replaceInData) {

            // Get callback name, remembering preexisting value associated with it
            callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ?
                s.jsonpCallback() :
                s.jsonpCallback;
            overwritten = window[callbackName];

            // Insert callback into url or form data
            if (replaceInUrl) {
                s.url = url.replace(rjsonp, "$1" + callbackName);
            } else if (replaceInData) {
                s.data = data.replace(rjsonp, "$1" + callbackName);
            } else if (hasCallback) {
                s.url += (rquestion.test(url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }

            // Use data converter to retrieve json after script execution
            s.converters["script json"] = function () {
                if (!responseContainer) {
                    jQuery.error(callbackName + " was not called");
                }
                return responseContainer[0];
            };

            // force json dataType
            s.dataTypes[0] = "json";

            // Install callback
            window[callbackName] = function () {
                responseContainer = arguments;
            };

            // Clean-up function (fires after converters)
            jqXHR.always(function () {
                // Restore preexisting value
                window[callbackName] = overwritten;

                // Save back as free
                if (s[callbackName]) {
                    // make sure that re-using the options doesn't screw things around
                    s.jsonpCallback = originalSettings.jsonpCallback;

                    // save the callback name for future use
                    oldCallbacks.push(callbackName);
                }

                // Call if it was a function and we have a response
                if (responseContainer && jQuery.isFunction(overwritten)) {
                    overwritten(responseContainer[0]);
                }

                responseContainer = overwritten = undefined;
            });

            // Delegate to script
            return "script";
        }
    });
    // Install script dataType
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function (text) {
                jQuery.globalEval(text);
                return text;
            }
        }
    });

    // Handle cache's special case and global
    jQuery.ajaxPrefilter("script", function (s) {
        if (s.cache === undefined) {
            s.cache = false;
        }
        if (s.crossDomain) {
            s.type = "GET";
            s.global = false;
        }
    });

    // Bind script tag hack transport
    jQuery.ajaxTransport("script", function (s) {

        // This transport only deals with cross domain requests
        if (s.crossDomain) {

            var script,
                head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

            return {

                send: function (_, callback) {

                    script = document.createElement("script");

                    script.async = "async";

                    if (s.scriptCharset) {
                        script.charset = s.scriptCharset;
                    }

                    script.src = s.url;

                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function (_, isAbort) {

                        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {

                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;

                            // Remove the script
                            if (head && script.parentNode) {
                                head.removeChild(script);
                            }

                            // Dereference the script
                            script = undefined;

                            // Callback if not abort
                            if (!isAbort) {
                                callback(200, "success");
                            }
                        }
                    };
                    // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                    // This arises when a base node is used (#2709 and #4378).
                    head.insertBefore(script, head.firstChild);
                },

                abort: function () {
                    if (script) {
                        script.onload(0, 1);
                    }
                }
            };
        }
    });
    var xhrCallbacks,
        // #5280: Internet Explorer will keep connections alive if we don't abort on unload
        xhrOnUnloadAbort = window.ActiveXObject ? function () {
            // Abort all pending requests
            for (var key in xhrCallbacks) {
                xhrCallbacks[key](0, 1);
            }
        } : false,
        xhrId = 0;

    // Functions to create xhrs
    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch (e) { }
    }

    function createActiveXHR() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) { }
    }

    // Create the request object
    // (This is still attached to ajaxSettings for backward compatibility)
    jQuery.ajaxSettings.xhr = window.ActiveXObject ?
        /* Microsoft failed to properly
         * implement the XMLHttpRequest in IE7 (can't request local files),
         * so we use the ActiveXObject when it is available
         * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
         * we need a fallback.
         */
        function () {
            return !this.isLocal && createStandardXHR() || createActiveXHR();
        } :
        // For all other browsers, use the standard XMLHttpRequest object
        createStandardXHR;

    // Determine support properties
    (function (xhr) {
        jQuery.extend(jQuery.support, {
            ajax: !!xhr,
            cors: !!xhr && ("withCredentials" in xhr)
        });
    })(jQuery.ajaxSettings.xhr());

    // Create transport if the browser can provide an xhr
    if (jQuery.support.ajax) {

        jQuery.ajaxTransport(function (s) {
            // Cross domain only allowed if supported through XMLHttpRequest
            if (!s.crossDomain || jQuery.support.cors) {

                var callback;

                return {
                    send: function (headers, complete) {

                        // Get a new xhr
                        var handle, i,
                            xhr = s.xhr();

                        // Open the socket
                        // Passing null username, generates a login popup on Opera (#2865)
                        if (s.username) {
                            xhr.open(s.type, s.url, s.async, s.username, s.password);
                        } else {
                            xhr.open(s.type, s.url, s.async);
                        }

                        // Apply custom fields if provided
                        if (s.xhrFields) {
                            for (i in s.xhrFields) {
                                xhr[i] = s.xhrFields[i];
                            }
                        }

                        // Override mime type if needed
                        if (s.mimeType && xhr.overrideMimeType) {
                            xhr.overrideMimeType(s.mimeType);
                        }

                        // X-Requested-With header
                        // For cross-domain requests, seeing as conditions for a preflight are
                        // akin to a jigsaw puzzle, we simply never set it to be sure.
                        // (it can always be set on a per-request basis or even using ajaxSetup)
                        // For same-domain requests, won't change header if already provided.
                        if (!s.crossDomain && !headers["X-Requested-With"]) {
                            headers["X-Requested-With"] = "XMLHttpRequest";
                        }

                        // Need an extra try/catch for cross domain requests in Firefox 3
                        try {
                            for (i in headers) {
                                xhr.setRequestHeader(i, headers[i]);
                            }
                        } catch (_) { }

                        // Do send the request
                        // This may raise an exception which is actually
                        // handled in jQuery.ajax (so no try/catch here)
                        xhr.send((s.hasContent && s.data) || null);

                        // Listener
                        callback = function (_, isAbort) {

                            var status,
                                statusText,
                                responseHeaders,
                                responses,
                                xml;

                            // Firefox throws exceptions when accessing properties
                            // of an xhr when a network error occurred
                            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                            try {

                                // Was never called and is aborted or complete
                                if (callback && (isAbort || xhr.readyState === 4)) {

                                    // Only called once
                                    callback = undefined;

                                    // Do not keep as active anymore
                                    if (handle) {
                                        xhr.onreadystatechange = jQuery.noop;
                                        if (xhrOnUnloadAbort) {
                                            delete xhrCallbacks[handle];
                                        }
                                    }

                                    // If it's an abort
                                    if (isAbort) {
                                        // Abort it manually if needed
                                        if (xhr.readyState !== 4) {
                                            xhr.abort();
                                        }
                                    } else {
                                        status = xhr.status;
                                        responseHeaders = xhr.getAllResponseHeaders();
                                        responses = {};
                                        xml = xhr.responseXML;

                                        // Construct response list
                                        if (xml && xml.documentElement /* #4958 */) {
                                            responses.xml = xml;
                                        }

                                        // When requesting binary data, IE6-9 will throw an exception
                                        // on any attempt to access responseText (#11426)
                                        try {
                                            responses.text = xhr.responseText;
                                        } catch (e) {
                                        }

                                        // Firefox throws an exception when accessing
                                        // statusText for faulty cross-domain requests
                                        try {
                                            statusText = xhr.statusText;
                                        } catch (e) {
                                            // We normalize with Webkit giving an empty statusText
                                            statusText = "";
                                        }

                                        // Filter status for non standard behaviors

                                        // If the request is local and we have data: assume a success
                                        // (success with no data won't get notified, that's the best we
                                        // can do given current implementations)
                                        if (!status && s.isLocal && !s.crossDomain) {
                                            status = responses.text ? 200 : 404;
                                            // IE - #1450: sometimes returns 1223 when it should be 204
                                        } else if (status === 1223) {
                                            status = 204;
                                        }
                                    }
                                }
                            } catch (firefoxAccessException) {
                                if (!isAbort) {
                                    complete(-1, firefoxAccessException);
                                }
                            }

                            // Call complete if needed
                            if (responses) {
                                complete(status, statusText, responses, responseHeaders);
                            }
                        };

                        if (!s.async) {
                            // if we're in sync mode we fire the callback
                            callback();
                        } else if (xhr.readyState === 4) {
                            // (IE6 & IE7) if it's in cache and has been
                            // retrieved directly we need to fire the callback
                            setTimeout(callback, 0);
                        } else {
                            handle = ++xhrId;
                            if (xhrOnUnloadAbort) {
                                // Create the active xhrs callbacks list if needed
                                // and attach the unload handler
                                if (!xhrCallbacks) {
                                    xhrCallbacks = {};
                                    jQuery(window).unload(xhrOnUnloadAbort);
                                }
                                // Add to list of active xhrs callbacks
                                xhrCallbacks[handle] = callback;
                            }
                            xhr.onreadystatechange = callback;
                        }
                    },

                    abort: function () {
                        if (callback) {
                            callback(0, 1);
                        }
                    }
                };
            }
        });
    }
    var fxNow, timerId,
        rfxtypes = /^(?:toggle|show|hide)$/,
        rfxnum = new RegExp("^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i"),
        rrun = /queueHooks$/,
        animationPrefilters = [defaultPrefilter],
        tweeners = {
            "*": [function (prop, value) {
                var end, unit,
                    tween = this.createTween(prop, value),
                    parts = rfxnum.exec(value),
                    target = tween.cur(),
                    start = +target || 0,
                    scale = 1,
                    maxIterations = 20;

                if (parts) {
                    end = +parts[2];
                    unit = parts[3] || (jQuery.cssNumber[prop] ? "" : "px");

                    // We need to compute starting value
                    if (unit !== "px" && start) {
                        // Iteratively approximate from a nonzero starting point
                        // Prefer the current property, because this process will be trivial if it uses the same units
                        // Fallback to end or a simple constant
                        start = jQuery.css(tween.elem, prop, true) || end || 1;

                        do {
                            // If previous iteration zeroed out, double until we get *something*
                            // Use a string for doubling factor so we don't accidentally see scale as unchanged below
                            scale = scale || ".5";

                            // Adjust and apply
                            start = start / scale;
                            jQuery.style(tween.elem, prop, start + unit);

                            // Update scale, tolerating zero or NaN from tween.cur()
                            // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
                        } while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations);
                    }

                    tween.unit = unit;
                    tween.start = start;
                    // If a +=/-= token was provided, we're doing a relative animation
                    tween.end = parts[1] ? start + (parts[1] + 1) * end : end;
                }
                return tween;
            }]
        };

    // Animations created synchronously will run synchronously
    function createFxNow() {
        setTimeout(function () {
            fxNow = undefined;
        }, 0);
        return (fxNow = jQuery.now());
    }

    function createTweens(animation, props) {
        jQuery.each(props, function (prop, value) {
            var collection = (tweeners[prop] || []).concat(tweeners["*"]),
                index = 0,
                length = collection.length;
            for (; index < length; index++) {
                if (collection[index].call(animation, prop, value)) {

                    // we're done with this property
                    return;
                }
            }
        });
    }

    function Animation(elem, properties, options) {
        var result,
            index = 0,
            tweenerIndex = 0,
            length = animationPrefilters.length,
            deferred = jQuery.Deferred().always(function () {
                // don't match elem in the :animated selector
                delete tick.elem;
            }),
            tick = function () {
                var currentTime = fxNow || createFxNow(),
                    remaining = Math.max(0, animation.startTime + animation.duration - currentTime),
                    // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
                    temp = remaining / animation.duration || 0,
                    percent = 1 - temp,
                    index = 0,
                    length = animation.tweens.length;

                for (; index < length ; index++) {
                    animation.tweens[index].run(percent);
                }

                deferred.notifyWith(elem, [animation, percent, remaining]);

                if (percent < 1 && length) {
                    return remaining;
                } else {
                    deferred.resolveWith(elem, [animation]);
                    return false;
                }
            },
            animation = deferred.promise({
                elem: elem,
                props: jQuery.extend({}, properties),
                opts: jQuery.extend(true, { specialEasing: {} }, options),
                originalProperties: properties,
                originalOptions: options,
                startTime: fxNow || createFxNow(),
                duration: options.duration,
                tweens: [],
                createTween: function (prop, end, easing) {
                    var tween = jQuery.Tween(elem, animation.opts, prop, end,
                            animation.opts.specialEasing[prop] || animation.opts.easing);
                    animation.tweens.push(tween);
                    return tween;
                },
                stop: function (gotoEnd) {
                    var index = 0,
                        // if we are going to the end, we want to run all the tweens
                        // otherwise we skip this part
                        length = gotoEnd ? animation.tweens.length : 0;

                    for (; index < length ; index++) {
                        animation.tweens[index].run(1);
                    }

                    // resolve when we played the last frame
                    // otherwise, reject
                    if (gotoEnd) {
                        deferred.resolveWith(elem, [animation, gotoEnd]);
                    } else {
                        deferred.rejectWith(elem, [animation, gotoEnd]);
                    }
                    return this;
                }
            }),
            props = animation.props;

        propFilter(props, animation.opts.specialEasing);

        for (; index < length ; index++) {
            result = animationPrefilters[index].call(animation, elem, props, animation.opts);
            if (result) {
                return result;
            }
        }

        createTweens(animation, props);

        if (jQuery.isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
        }

        jQuery.fx.timer(
            jQuery.extend(tick, {
                anim: animation,
                queue: animation.opts.queue,
                elem: elem
            })
        );

        // attach callbacks from options
        return animation.progress(animation.opts.progress)
            .done(animation.opts.done, animation.opts.complete)
            .fail(animation.opts.fail)
            .always(animation.opts.always);
    }

    function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;

        // camelCase, specialEasing and expand cssHook pass
        for (index in props) {
            name = jQuery.camelCase(index);
            easing = specialEasing[name];
            value = props[index];
            if (jQuery.isArray(value)) {
                easing = value[1];
                value = props[index] = value[0];
            }

            if (index !== name) {
                props[name] = value;
                delete props[index];
            }

            hooks = jQuery.cssHooks[name];
            if (hooks && "expand" in hooks) {
                value = hooks.expand(value);
                delete props[name];

                // not quite $.extend, this wont overwrite keys already present.
                // also - reusing 'index' from above because we have the correct "name"
                for (index in value) {
                    if (!(index in props)) {
                        props[index] = value[index];
                        specialEasing[index] = easing;
                    }
                }
            } else {
                specialEasing[name] = easing;
            }
        }
    }

    jQuery.Animation = jQuery.extend(Animation, {

        tweener: function (props, callback) {
            if (jQuery.isFunction(props)) {
                callback = props;
                props = ["*"];
            } else {
                props = props.split(" ");
            }

            var prop,
                index = 0,
                length = props.length;

            for (; index < length ; index++) {
                prop = props[index];
                tweeners[prop] = tweeners[prop] || [];
                tweeners[prop].unshift(callback);
            }
        },

        prefilter: function (callback, prepend) {
            if (prepend) {
                animationPrefilters.unshift(callback);
            } else {
                animationPrefilters.push(callback);
            }
        }
    });

    function defaultPrefilter(elem, props, opts) {
        var index, prop, value, length, dataShow, toggle, tween, hooks, oldfire,
            anim = this,
            style = elem.style,
            orig = {},
            handled = [],
            hidden = elem.nodeType && isHidden(elem);

        // handle queue: false promises
        if (!opts.queue) {
            hooks = jQuery._queueHooks(elem, "fx");
            if (hooks.unqueued == null) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function () {
                    if (!hooks.unqueued) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;

            anim.always(function () {
                // doing this makes sure that the complete handler will be called
                // before this completes
                anim.always(function () {
                    hooks.unqueued--;
                    if (!jQuery.queue(elem, "fx").length) {
                        hooks.empty.fire();
                    }
                });
            });
        }

        // height/width overflow pass
        if (elem.nodeType === 1 && ("height" in props || "width" in props)) {
            // Make sure that nothing sneaks out
            // Record all 3 overflow attributes because IE does not
            // change the overflow attribute when overflowX and
            // overflowY are set to the same value
            opts.overflow = [style.overflow, style.overflowX, style.overflowY];

            // Set display property to inline-block for height/width
            // animations on inline elements that are having width/height animated
            if (jQuery.css(elem, "display") === "inline" &&
                    jQuery.css(elem, "float") === "none") {

                // inline-level elements accept inline-block;
                // block-level elements need to be inline with layout
                if (!jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay(elem.nodeName) === "inline") {
                    style.display = "inline-block";

                } else {
                    style.zoom = 1;
                }
            }
        }

        if (opts.overflow) {
            style.overflow = "hidden";
            if (!jQuery.support.shrinkWrapBlocks) {
                anim.done(function () {
                    style.overflow = opts.overflow[0];
                    style.overflowX = opts.overflow[1];
                    style.overflowY = opts.overflow[2];
                });
            }
        }


        // show/hide pass
        for (index in props) {
            value = props[index];
            if (rfxtypes.exec(value)) {
                delete props[index];
                toggle = toggle || value === "toggle";
                if (value === (hidden ? "hide" : "show")) {
                    continue;
                }
                handled.push(index);
            }
        }

        length = handled.length;
        if (length) {
            dataShow = jQuery._data(elem, "fxshow") || jQuery._data(elem, "fxshow", {});
            if ("hidden" in dataShow) {
                hidden = dataShow.hidden;
            }

            // store state if its toggle - enables .stop().toggle() to "reverse"
            if (toggle) {
                dataShow.hidden = !hidden;
            }
            if (hidden) {
                jQuery(elem).show();
            } else {
                anim.done(function () {
                    jQuery(elem).hide();
                });
            }
            anim.done(function () {
                var prop;
                jQuery.removeData(elem, "fxshow", true);
                for (prop in orig) {
                    jQuery.style(elem, prop, orig[prop]);
                }
            });
            for (index = 0 ; index < length ; index++) {
                prop = handled[index];
                tween = anim.createTween(prop, hidden ? dataShow[prop] : 0);
                orig[prop] = dataShow[prop] || jQuery.style(elem, prop);

                if (!(prop in dataShow)) {
                    dataShow[prop] = tween.start;
                    if (hidden) {
                        tween.end = tween.start;
                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                    }
                }
            }
        }
    }

    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }
    jQuery.Tween = Tween;

    Tween.prototype = {
        constructor: Tween,
        init: function (elem, options, prop, end, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || "swing";
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function () {
            var hooks = Tween.propHooks[this.prop];

            return hooks && hooks.get ?
                hooks.get(this) :
                Tween.propHooks._default.get(this);
        },
        run: function (percent) {
            var eased,
                hooks = Tween.propHooks[this.prop];

            if (this.options.duration) {
                this.pos = eased = jQuery.easing[this.easing](
                    percent, this.options.duration * percent, 0, 1, this.options.duration
                );
            } else {
                this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;

            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this);
            }

            if (hooks && hooks.set) {
                hooks.set(this);
            } else {
                Tween.propHooks._default.set(this);
            }
            return this;
        }
    };

    Tween.prototype.init.prototype = Tween.prototype;

    Tween.propHooks = {
        _default: {
            get: function (tween) {
                var result;

                if (tween.elem[tween.prop] != null &&
                    (!tween.elem.style || tween.elem.style[tween.prop] == null)) {
                    return tween.elem[tween.prop];
                }

                // passing any value as a 4th parameter to .css will automatically
                // attempt a parseFloat and fallback to a string if the parse fails
                // so, simple values such as "10px" are parsed to Float.
                // complex values such as "rotate(1rad)" are returned as is.
                result = jQuery.css(tween.elem, tween.prop, false, "");
                // Empty strings, null, undefined and "auto" are converted to 0.
                return !result || result === "auto" ? 0 : result;
            },
            set: function (tween) {
                // use step hook for back compat - use cssHook if its there - use .style if its
                // available and use plain properties where available
                if (jQuery.fx.step[tween.prop]) {
                    jQuery.fx.step[tween.prop](tween);
                } else if (tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
                    jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
                } else {
                    tween.elem[tween.prop] = tween.now;
                }
            }
        }
    };

    // Remove in 2.0 - this supports IE8's panic based approach
    // to setting things on disconnected nodes

    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function (tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
                tween.elem[tween.prop] = tween.now;
            }
        }
    };

    jQuery.each(["toggle", "show", "hide"], function (i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function (speed, easing, callback) {
            return speed == null || typeof speed === "boolean" ||
                // special check for .toggle( handler, handler, ... )
                (!i && jQuery.isFunction(speed) && jQuery.isFunction(easing)) ?
                cssFn.apply(this, arguments) :
                this.animate(genFx(name, true), speed, easing, callback);
        };
    });

    jQuery.fn.extend({
        fadeTo: function (speed, to, easing, callback) {

            // show any hidden elements after setting opacity to 0
            return this.filter(isHidden).css("opacity", 0).show()

                // animate to the value specified
                .end().animate({ opacity: to }, speed, easing, callback);
        },
        animate: function (prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop),
                optall = jQuery.speed(speed, easing, callback),
                doAnimation = function () {
                    // Operate on a copy of prop so per-property easing won't be lost
                    var anim = Animation(this, jQuery.extend({}, prop), optall);

                    // Empty animations resolve immediately
                    if (empty) {
                        anim.stop(true);
                    }
                };

            return empty || optall.queue === false ?
                this.each(doAnimation) :
                this.queue(optall.queue, doAnimation);
        },
        stop: function (type, clearQueue, gotoEnd) {
            var stopQueue = function (hooks) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop(gotoEnd);
            };

            if (typeof type !== "string") {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if (clearQueue && type !== false) {
                this.queue(type || "fx", []);
            }

            return this.each(function () {
                var dequeue = true,
                    index = type != null && type + "queueHooks",
                    timers = jQuery.timers,
                    data = jQuery._data(this);

                if (index) {
                    if (data[index] && data[index].stop) {
                        stopQueue(data[index]);
                    }
                } else {
                    for (index in data) {
                        if (data[index] && data[index].stop && rrun.test(index)) {
                            stopQueue(data[index]);
                        }
                    }
                }

                for (index = timers.length; index--;) {
                    if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                        timers[index].anim.stop(gotoEnd);
                        dequeue = false;
                        timers.splice(index, 1);
                    }
                }

                // start the next in the queue if the last step wasn't forced
                // timers currently will call their complete callbacks, which will dequeue
                // but only if they were gotoEnd
                if (dequeue || !gotoEnd) {
                    jQuery.dequeue(this, type);
                }
            });
        }
    });

    // Generate parameters to create a standard animation
    function genFx(type, includeWidth) {
        var which,
            attrs = { height: type },
            i = 0;

        // if we include width, step value is 1 to do all cssExpand values,
        // if we don't include width, step value is 2 to skip over Left and Right
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4 ; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs["margin" + which] = attrs["padding" + which] = type;
        }

        if (includeWidth) {
            attrs.opacity = attrs.width = type;
        }

        return attrs;
    }

    // Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function (name, props) {
        jQuery.fn[name] = function (speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    });

    jQuery.speed = function (speed, easing, fn) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing ||
                jQuery.isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
        };

        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
            opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

        // normalize opt.queue - true/undefined/null -> "fx"
        if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
        }

        // Queueing
        opt.old = opt.complete;

        opt.complete = function () {
            if (jQuery.isFunction(opt.old)) {
                opt.old.call(this);
            }

            if (opt.queue) {
                jQuery.dequeue(this, opt.queue);
            }
        };

        return opt;
    };

    jQuery.easing = {
        linear: function (p) {
            return p;
        },
        swing: function (p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
        }
    };

    jQuery.timers = [];
    jQuery.fx = Tween.prototype.init;
    jQuery.fx.tick = function () {
        var timer,
            timers = jQuery.timers,
            i = 0;

        fxNow = jQuery.now();

        for (; i < timers.length; i++) {
            timer = timers[i];
            // Checks the timer has not already been removed
            if (!timer() && timers[i] === timer) {
                timers.splice(i--, 1);
            }
        }

        if (!timers.length) {
            jQuery.fx.stop();
        }
        fxNow = undefined;
    };

    jQuery.fx.timer = function (timer) {
        if (timer() && jQuery.timers.push(timer) && !timerId) {
            timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
        }
    };

    jQuery.fx.interval = 13;

    jQuery.fx.stop = function () {
        clearInterval(timerId);
        timerId = null;
    };

    jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    };

    // Back Compat <1.8 extension point
    jQuery.fx.step = {};

    if (jQuery.expr && jQuery.expr.filters) {
        jQuery.expr.filters.animated = function (elem) {
            return jQuery.grep(jQuery.timers, function (fn) {
                return elem === fn.elem;
            }).length;
        };
    }
    var rroot = /^(?:body|html)$/i;

    jQuery.fn.offset = function (options) {
        if (arguments.length) {
            return options === undefined ?
                this :
                this.each(function (i) {
                    jQuery.offset.setOffset(this, options, i);
                });
        }

        var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
            box = { top: 0, left: 0 },
            elem = this[0],
            doc = elem && elem.ownerDocument;

        if (!doc) {
            return;
        }

        if ((body = doc.body) === elem) {
            return jQuery.offset.bodyOffset(elem);
        }

        docElem = doc.documentElement;

        // Make sure it's not a disconnected DOM node
        if (!jQuery.contains(docElem, elem)) {
            return box;
        }

        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if (typeof elem.getBoundingClientRect !== "undefined") {
            box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        clientTop = docElem.clientTop || body.clientTop || 0;
        clientLeft = docElem.clientLeft || body.clientLeft || 0;
        scrollTop = win.pageYOffset || docElem.scrollTop;
        scrollLeft = win.pageXOffset || docElem.scrollLeft;
        return {
            top: box.top + scrollTop - clientTop,
            left: box.left + scrollLeft - clientLeft
        };
    };

    jQuery.offset = {

        bodyOffset: function (body) {
            var top = body.offsetTop,
                left = body.offsetLeft;

            if (jQuery.support.doesNotIncludeMarginInBodyOffset) {
                top += parseFloat(jQuery.css(body, "marginTop")) || 0;
                left += parseFloat(jQuery.css(body, "marginLeft")) || 0;
            }

            return { top: top, left: left };
        },

        setOffset: function (elem, options, i) {
            var position = jQuery.css(elem, "position");

            // set position first, in-case top/left are set even on static elem
            if (position === "static") {
                elem.style.position = "relative";
            }

            var curElem = jQuery(elem),
                curOffset = curElem.offset(),
                curCSSTop = jQuery.css(elem, "top"),
                curCSSLeft = jQuery.css(elem, "left"),
                calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
                props = {}, curPosition = {}, curTop, curLeft;

            // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
            if (calculatePosition) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }

            if (jQuery.isFunction(options)) {
                options = options.call(elem, i, curOffset);
            }

            if (options.top != null) {
                props.top = (options.top - curOffset.top) + curTop;
            }
            if (options.left != null) {
                props.left = (options.left - curOffset.left) + curLeft;
            }

            if ("using" in options) {
                options.using.call(elem, props);
            } else {
                curElem.css(props);
            }
        }
    };


    jQuery.fn.extend({

        position: function () {
            if (!this[0]) {
                return;
            }

            var elem = this[0],

            // Get *real* offsetParent
            offsetParent = this.offsetParent(),

            // Get correct offsets
            offset = this.offset(),
            parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top -= parseFloat(jQuery.css(elem, "marginTop")) || 0;
            offset.left -= parseFloat(jQuery.css(elem, "marginLeft")) || 0;

            // Add offsetParent borders
            parentOffset.top += parseFloat(jQuery.css(offsetParent[0], "borderTopWidth")) || 0;
            parentOffset.left += parseFloat(jQuery.css(offsetParent[0], "borderLeftWidth")) || 0;

            // Subtract the two offsets
            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },

        offsetParent: function () {
            return this.map(function () {
                var offsetParent = this.offsetParent || document.body;
                while (offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent || document.body;
            });
        }
    });


    // Create scrollLeft and scrollTop methods
    jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (method, prop) {
        var top = /Y/.test(prop);

        jQuery.fn[method] = function (val) {
            return jQuery.access(this, function (elem, method, val) {
                var win = getWindow(elem);

                if (val === undefined) {
                    return win ? (prop in win) ? win[prop] :
                        win.document.documentElement[method] :
                        elem[method];
                }

                if (win) {
                    win.scrollTo(
                        !top ? val : jQuery(win).scrollLeft(),
                         top ? val : jQuery(win).scrollTop()
                    );

                } else {
                    elem[method] = val;
                }
            }, method, val, arguments.length, null);
        };
    });

    function getWindow(elem) {
        return jQuery.isWindow(elem) ?
            elem :
            elem.nodeType === 9 ?
                elem.defaultView || elem.parentWindow :
                false;
    }
    // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
        jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name }, function (defaultExtra, funcName) {
            // margin is only for outerHeight, outerWidth
            jQuery.fn[funcName] = function (margin, value) {
                var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
                    extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

                return jQuery.access(this, function (elem, type, value) {
                    var doc;

                    if (jQuery.isWindow(elem)) {
                        // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                        // isn't a whole lot we can do. See pull request at this URL for discussion:
                        // https://github.com/jquery/jquery/pull/764
                        return elem.document.documentElement["client" + name];
                    }

                    // Get document width or height
                    if (elem.nodeType === 9) {
                        doc = elem.documentElement;

                        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
                        // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
                        return Math.max(
                            elem.body["scroll" + name], doc["scroll" + name],
                            elem.body["offset" + name], doc["offset" + name],
                            doc["client" + name]
                        );
                    }

                    return value === undefined ?
                        // Get width or height on the element, requesting but not forcing parseFloat
                        jQuery.css(elem, type, value, extra) :

                        // Set width or height on the element
                        jQuery.style(elem, type, value, extra);
                }, type, chainable ? margin : undefined, chainable, null);
            };
        });
    });
    // Expose jQuery to the global object
    window.jQuery = window.$ = jQuery;

    // Expose jQuery as an AMD module, but only for AMD loaders that
    // understand the issues with loading multiple versions of jQuery
    // in a page that all might call define(). The loader will indicate
    // they have special allowances for multiple jQuery versions by
    // specifying define.amd.jQuery = true. Register as a named module,
    // since jQuery can be concatenated with other files that may use define,
    // but not use a proper concatenation script that understands anonymous
    // AMD modules. A named AMD is safest and most robust way to register.
    // Lowercase jquery is used because AMD module names are derived from
    // file names, and jQuery is normally delivered in a lowercase file name.
    // Do this after creating the global so that if an AMD module wants to call
    // noConflict to hide this version of jQuery, it will work.
    if (typeof define === "function" && define.amd && define.amd.jQuery) {
        define("jquery", [], function () { return jQuery; });
    }

})(window);
/**
 * @license
 * lodash 3.9.3 (Custom Build) lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 * Build: `lodash modern -o ./lodash.js`
 */
; (function () {
    function n(n, t) { if (n !== t) { var r = null === n, e = n === m, u = n === n, i = null === t, o = t === m, f = t === t; if (n > t && !i || !u || r && !o && f || e && f) return 1; if (n < t && !r || !f || i && !e && u || o && u) return -1 } return 0 } function t(n, t, r) { for (var e = n.length, u = r ? e : -1; r ? u-- : ++u < e;) if (t(n[u], u, n)) return u; return -1 } function r(n, t, r) { if (t !== t) return s(n, r); r -= 1; for (var e = n.length; ++r < e;) if (n[r] === t) return r; return -1 } function e(n) { return typeof n == "function" || false } function u(n) { return typeof n == "string" ? n : null == n ? "" : n + "" } function i(n, t) {
        for (var r = -1, e = n.length; ++r < e && -1 < t.indexOf(n.charAt(r)) ;);
        return r
    } function o(n, t) { for (var r = n.length; r-- && -1 < t.indexOf(n.charAt(r)) ;); return r } function f(t, r) { return n(t.a, r.a) || t.b - r.b } function l(n) { return Nn[n] } function a(n) { return Ln[n] } function c(n) { return "\\" + Mn[n] } function s(n, t, r) { var e = n.length; for (t += r ? 0 : -1; r ? t-- : ++t < e;) { var u = n[t]; if (u !== u) return t } return -1 } function p(n) { return !!n && typeof n == "object" } function h(n) {
        return 160 >= n && 9 <= n && 13 >= n || 32 == n || 160 == n || 5760 == n || 6158 == n || 8192 <= n && (8202 >= n || 8232 == n || 8233 == n || 8239 == n || 8287 == n || 12288 == n || 65279 == n);
    } function _(n, t) { for (var r = -1, e = n.length, u = -1, i = []; ++r < e;) n[r] === t && (n[r] = L, i[++u] = r); return i } function v(n) { for (var t = -1, r = n.length; ++t < r && h(n.charCodeAt(t)) ;); return t } function g(n) { for (var t = n.length; t-- && h(n.charCodeAt(t)) ;); return t } function y(n) { return zn[n] } function d(h) {
        function Nn(n) { if (p(n) && !(Ti(n) || n instanceof Bn)) { if (n instanceof zn) return n; if (ru.call(n, "__chain__") && ru.call(n, "__wrapped__")) return Mr(n) } return new zn(n) } function Ln() { } function zn(n, t, r) {
            this.__wrapped__ = n, this.__actions__ = r || [],
            this.__chain__ = !!t
        } function Bn(n) { this.__wrapped__ = n, this.__actions__ = null, this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = null, this.__takeCount__ = Su, this.__views__ = null } function Mn() { this.__data__ = {} } function Pn(n) { var t = n ? n.length : 0; for (this.data = { hash: bu(null), set: new vu }; t--;) this.push(n[t]) } function qn(n, t) { var r = n.data; return (typeof t == "string" || ve(t) ? r.set.has(t) : r.hash[t]) ? 0 : -1 } function Dn(n, t) { var r = -1, e = n.length; for (t || (t = Me(e)) ; ++r < e;) t[r] = n[r]; return t } function Kn(n, t) {
            for (var r = -1, e = n.length; ++r < e && false !== t(n[r], r, n) ;);
            return n
        } function Vn(n, t) { for (var r = -1, e = n.length; ++r < e;) if (!t(n[r], r, n)) return false; return true } function Gn(n, t) { for (var r = -1, e = n.length, u = -1, i = []; ++r < e;) { var o = n[r]; t(o, r, n) && (i[++u] = o) } return i } function Jn(n, t) { for (var r = -1, e = n.length, u = Me(e) ; ++r < e;) u[r] = t(n[r], r, n); return u } function Xn(n, t, r, e) { var u = -1, i = n.length; for (e && i && (r = n[++u]) ; ++u < i;) r = t(r, n[u], u, n); return r } function Hn(n, t) { for (var r = -1, e = n.length; ++r < e;) if (t(n[r], r, n)) return true; return false } function Qn(n, t) { return n === m ? t : n } function nt(n, t, r, e) {
            return n !== m && ru.call(e, r) ? n : t
        } function tt(n, t, r) { for (var e = -1, u = Ki(t), i = u.length; ++e < i;) { var o = u[e], f = n[o], l = r(f, t[o], o, n, t); (l === l ? l === f : f !== f) && (f !== m || o in n) || (n[o] = l) } return n } function rt(n, t) { return null == t ? n : ut(t, Ki(t), n) } function et(n, t) { for (var r = -1, e = null == n, u = !e && Ir(n), i = u ? n.length : 0, o = t.length, f = Me(o) ; ++r < o;) { var l = t[r]; f[r] = u ? Er(l, i) ? n[l] : m : e ? m : n[l] } return f } function ut(n, t, r) { r || (r = {}); for (var e = -1, u = t.length; ++e < u;) { var i = t[e]; r[i] = n[i] } return r } function it(n, t, r) {
            var e = typeof n; return "function" == e ? t === m ? n : Mt(n, t, r) : null == n ? Fe : "object" == e ? xt(n) : t === m ? Be(n) : At(n, t);
        } function ot(n, t, r, e, u, i, o) { var f; if (r && (f = u ? r(n, e, u) : r(n)), f !== m) return f; if (!ve(n)) return n; if (e = Ti(n)) { if (f = jr(n), !t) return Dn(n, f) } else { var l = uu.call(n), a = l == D; if (l != V && l != z && (!a || u)) return $n[l] ? Or(n, l, t) : u ? n : {}; if (f = kr(a ? {} : n), !t) return rt(f, n) } for (i || (i = []), o || (o = []), u = i.length; u--;) if (i[u] == n) return o[u]; return i.push(n), o.push(f), (e ? Kn : vt)(n, function (e, u) { f[u] = ot(e, t, r, u, n, i, o) }), f } function ft(n, t, r) { if (typeof n != "function") throw new Je(N); return gu(function () { n.apply(m, r) }, t) } function lt(n, t) {
            var e = n ? n.length : 0, u = []; if (!e) return u; var i = -1, o = br(), f = o == r, l = f && 200 <= t.length ? Vu(t) : null, a = t.length; l && (o = qn, f = false, t = l); n: for (; ++i < e;) if (l = n[i], f && l === l) { for (var c = a; c--;) if (t[c] === l) continue n; u.push(l) } else 0 > o(t, l, 0) && u.push(l); return u
        } function at(n, t) { var r = true; return Mu(n, function (n, e, u) { return r = !!t(n, e, u) }), r } function ct(n, t, r, e) { var u = e, i = u; return Mu(n, function (n, o, f) { o = +t(n, o, f), (r(o, u) || o === e && o === i) && (u = o, i = n) }), i } function st(n, t) {
            var r = []; return Mu(n, function (n, e, u) {
                t(n, e, u) && r.push(n);
            }), r
        } function pt(n, t, r, e) { var u; return r(n, function (n, r, i) { return t(n, r, i) ? (u = e ? r : n, false) : void 0 }), u } function ht(n, t, r) { for (var e = -1, u = n.length, i = -1, o = []; ++e < u;) { var f = n[e]; if (p(f) && Ir(f) && (r || Ti(f) || se(f))) { t && (f = ht(f, t, r)); for (var l = -1, a = f.length; ++l < a;) o[++i] = f[l] } else r || (o[++i] = f) } return o } function _t(n, t) { qu(n, t, ke) } function vt(n, t) { return qu(n, t, Ki) } function gt(n, t) { return Du(n, t, Ki) } function yt(n, t) { for (var r = -1, e = t.length, u = -1, i = []; ++r < e;) { var o = t[r]; $i(n[o]) && (i[++u] = o) } return i } function dt(n, t, r) {
            if (null != n) { r !== m && r in zr(n) && (t = [r]), r = 0; for (var e = t.length; null != n && r < e;) n = n[t[r++]]; return r && r == e ? n : m }
        } function mt(n, t, r, e, u, i) {
            if (n === t) n = true; else if (null == n || null == t || !ve(n) && !p(t)) n = n !== n && t !== t; else n: {
                var o = mt, f = Ti(n), l = Ti(t), a = B, c = B; f || (a = uu.call(n), a == z ? a = V : a != V && (f = we(n))), l || (c = uu.call(t), c == z ? c = V : c != V && we(t)); var s = a == V, l = c == V, c = a == c; if (!c || f || s) {
                    if (!e && (a = s && ru.call(n, "__wrapped__"), l = l && ru.call(t, "__wrapped__"), a || l)) { n = o(a ? n.value() : n, l ? t.value() : t, r, e, u, i); break n } if (c) {
                        for (u || (u = []),
                        i || (i = []), a = u.length; a--;) if (u[a] == n) { n = i[a] == t; break n } u.push(n), i.push(t), n = (f ? gr : dr)(n, t, o, r, e, u, i), u.pop(), i.pop()
                    } else n = false
                } else n = yr(n, t, a)
            } return n
        } function wt(n, t, r) { var e = t.length, u = e, i = !r; if (null == n) return !u; for (n = zr(n) ; e--;) { var o = t[e]; if (i && o[2] ? o[1] !== n[o[0]] : !(o[0] in n)) return false } for (; ++e < u;) { var o = t[e], f = o[0], l = n[f], a = o[1]; if (i && o[2]) { if (l === m && !(f in n)) return false } else if (o = r ? r(l, a, f) : m, o === m ? !mt(a, l, r, true) : !o) return false } return true } function bt(n, t) {
            var r = -1, e = Ir(n) ? Me(n.length) : []; return Mu(n, function (n, u, i) {
                e[++r] = t(n, u, i)
            }), e
        } function xt(n) { var t = xr(n); if (1 == t.length && t[0][2]) { var r = t[0][0], e = t[0][1]; return function (n) { return null == n ? false : n[r] === e && (e !== m || r in zr(n)) } } return function (n) { return wt(n, t) } } function At(n, t) { var r = Ti(n), e = Wr(n) && t === t && !ve(t), u = n + ""; return n = Br(n), function (i) { if (null == i) return false; var o = u; if (i = zr(i), !(!r && e || o in i)) { if (i = 1 == n.length ? i : dt(i, Ct(n, 0, -1)), null == i) return false; o = Vr(n), i = zr(i) } return i[o] === t ? t !== m || o in i : mt(t, i[o], m, true) } } function jt(n, t, r, e, u) {
            if (!ve(n)) return n; var i = Ir(t) && (Ti(t) || we(t)), o = i ? null : Ki(t);
            return Kn(o || t, function (f, l) { if (o && (l = f, f = t[l]), p(f)) { e || (e = []), u || (u = []); n: { for (var a = l, c = e, s = u, h = c.length, _ = t[a]; h--;) if (c[h] == _) { n[a] = s[h]; break n } var h = n[a], v = r ? r(h, _, a, n, t) : m, g = v === m; g && (v = _, Ir(_) && (Ti(_) || we(_)) ? v = Ti(h) ? h : Ir(h) ? Dn(h) : [] : Fi(_) || se(_) ? v = se(h) ? Ae(h) : Fi(h) ? h : {} : g = false), c.push(_), s.push(v), g ? n[a] = jt(v, _, r, c, s) : (v === v ? v !== h : h === h) && (n[a] = v) } } else a = n[l], c = r ? r(a, f, l, n, t) : m, (s = c === m) && (c = f), c === m && (!i || l in n) || !s && (c === c ? c === a : a !== a) || (n[l] = c) }), n
        } function kt(n) {
            return function (t) {
                return null == t ? m : t[n];
            }
        } function Ot(n) { var t = n + ""; return n = Br(n), function (r) { return dt(r, n, t) } } function Rt(n, t) { for (var r = n ? t.length : 0; r--;) { var e = t[r]; if (e != u && Er(e)) { var u = e; yu.call(n, e, 1) } } } function It(n, t) { return n + su(Cu() * (t - n + 1)) } function Et(n, t, r, e, u) { return u(n, function (n, u, i) { r = e ? (e = false, n) : t(r, n, u, i) }), r } function Ct(n, t, r) { var e = -1, u = n.length; for (t = null == t ? 0 : +t || 0, 0 > t && (t = -t > u ? 0 : u + t), r = r === m || r > u ? u : +r || 0, 0 > r && (r += u), u = t > r ? 0 : r - t >>> 0, t >>>= 0, r = Me(u) ; ++e < u;) r[e] = n[e + t]; return r } function Wt(n, t) {
            var r; return Mu(n, function (n, e, u) {
                return r = t(n, e, u), !r
            }), !!r
        } function St(n, t) { var r = n.length; for (n.sort(t) ; r--;) n[r] = n[r].c; return n } function Tt(t, r, e) { var u = mr(), i = -1; return r = Jn(r, function (n) { return u(n) }), t = bt(t, function (n) { return { a: Jn(r, function (t) { return t(n) }), b: ++i, c: n } }), St(t, function (t, r) { var u; n: { u = -1; for (var i = t.a, o = r.a, f = i.length, l = e.length; ++u < f;) { var a = n(i[u], o[u]); if (a) { u = u < l ? a * (e[u] ? 1 : -1) : a; break n } } u = t.b - r.b } return u }) } function Ut(n, t) { var r = 0; return Mu(n, function (n, e, u) { r += +t(n, e, u) || 0 }), r } function $t(n, t) {
            var e = -1, u = br(), i = n.length, o = u == r, f = o && 200 <= i, l = f ? Vu() : null, a = [];
            l ? (u = qn, o = false) : (f = false, l = t ? [] : a); n: for (; ++e < i;) { var c = n[e], s = t ? t(c, e, n) : c; if (o && c === c) { for (var p = l.length; p--;) if (l[p] === s) continue n; t && l.push(s), a.push(c) } else 0 > u(l, s, 0) && ((t || f) && l.push(s), a.push(c)) } return a
        } function Ft(n, t) { for (var r = -1, e = t.length, u = Me(e) ; ++r < e;) u[r] = n[t[r]]; return u } function Nt(n, t, r, e) { for (var u = n.length, i = e ? u : -1; (e ? i-- : ++i < u) && t(n[i], i, n) ;); return r ? Ct(n, e ? 0 : i, e ? i + 1 : u) : Ct(n, e ? i + 1 : 0, e ? u : i) } function Lt(n, t) {
            var r = n; r instanceof Bn && (r = r.value()); for (var e = -1, u = t.length; ++e < u;) {
                var r = [r], i = t[e]; _u.apply(r, i.args), r = i.func.apply(i.thisArg, r)
            } return r
        } function zt(n, t, r) { var e = 0, u = n ? n.length : e; if (typeof t == "number" && t === t && u <= Uu) { for (; e < u;) { var i = e + u >>> 1, o = n[i]; (r ? o <= t : o < t) && null !== o ? e = i + 1 : u = i } return u } return Bt(n, t, Fe, r) } function Bt(n, t, r, e) { t = r(t); for (var u = 0, i = n ? n.length : 0, o = t !== t, f = null === t, l = t === m; u < i;) { var a = su((u + i) / 2), c = r(n[a]), s = c !== m, p = c === c; (o ? p || e : f ? p && s && (e || null != c) : l ? p && (e || s) : null == c ? 0 : e ? c <= t : c < t) ? u = a + 1 : i = a } return Ou(i, Tu) } function Mt(n, t, r) {
            if (typeof n != "function") return Fe;
            if (t === m) return n; switch (r) { case 1: return function (r) { return n.call(t, r) }; case 3: return function (r, e, u) { return n.call(t, r, e, u) }; case 4: return function (r, e, u, i) { return n.call(t, r, e, u, i) }; case 5: return function (r, e, u, i, o) { return n.call(t, r, e, u, i, o) } } return function () { return n.apply(t, arguments) }
        } function Pt(n) { return lu.call(n, 0) } function qt(n, t, r) { for (var e = r.length, u = -1, i = ku(n.length - e, 0), o = -1, f = t.length, l = Me(i + f) ; ++o < f;) l[o] = t[o]; for (; ++u < e;) l[r[u]] = n[u]; for (; i--;) l[o++] = n[u++]; return l } function Dt(n, t, r) {
            for (var e = -1, u = r.length, i = -1, o = ku(n.length - u, 0), f = -1, l = t.length, a = Me(o + l) ; ++i < o;) a[i] = n[i]; for (o = i; ++f < l;) a[o + f] = t[f]; for (; ++e < u;) a[o + r[e]] = n[i++]; return a
        } function Kt(n, t) { return function (r, e, u) { var i = t ? t() : {}; if (e = mr(e, u, 3), Ti(r)) { u = -1; for (var o = r.length; ++u < o;) { var f = r[u]; n(i, f, e(f, u, r), r) } } else Mu(r, function (t, r, u) { n(i, t, e(t, r, u), u) }); return i } } function Vt(n) {
            return ae(function (t, r) {
                var e = -1, u = null == t ? 0 : r.length, i = 2 < u ? r[u - 2] : m, o = 2 < u ? r[2] : m, f = 1 < u ? r[u - 1] : m; for (typeof i == "function" ? (i = Mt(i, f, 5),
                u -= 2) : (i = typeof f == "function" ? f : m, u -= i ? 1 : 0), o && Cr(r[0], r[1], o) && (i = 3 > u ? m : i, u = 1) ; ++e < u;) (o = r[e]) && n(t, o, i); return t
            })
        } function Yt(n, t) { return function (r, e) { var u = r ? Zu(r) : 0; if (!Tr(u)) return n(r, e); for (var i = t ? u : -1, o = zr(r) ; (t ? i-- : ++i < u) && false !== e(o[i], i, o) ;); return r } } function Zt(n) { return function (t, r, e) { var u = zr(t); e = e(t); for (var i = e.length, o = n ? i : -1; n ? o-- : ++o < i;) { var f = e[o]; if (false === r(u[f], f, u)) break } return t } } function Gt(n, t) {
            function r() {
                return (this && this !== Yn && this instanceof r ? e : n).apply(t, arguments);
            } var e = Xt(n); return r
        } function Jt(n) { return function (t) { var r = -1; t = Te(Ie(t)); for (var e = t.length, u = ""; ++r < e;) u = n(u, t[r], r); return u } } function Xt(n) { return function () { var t = arguments; switch (t.length) { case 0: return new n; case 1: return new n(t[0]); case 2: return new n(t[0], t[1]); case 3: return new n(t[0], t[1], t[2]); case 4: return new n(t[0], t[1], t[2], t[3]); case 5: return new n(t[0], t[1], t[2], t[3], t[4]) } var r = Bu(n.prototype), t = n.apply(r, t); return ve(t) ? t : r } } function Ht(n) {
            function t(r, e, u) {
                return u && Cr(r, e, u) && (e = null),
                r = vr(r, n, null, null, null, null, null, e), r.placeholder = t.placeholder, r
            } return t
        } function Qt(n, t) { return function (r, e, u) { if (u && Cr(r, e, u) && (e = null), e = mr(e, u, 3), 1 == e.length) { u = r = Lr(r); for (var i = e, o = -1, f = u.length, l = t, a = l; ++o < f;) { var c = u[o], s = +i(c); n(s, l) && (l = s, a = c) } if (u = a, !r.length || u !== t) return u } return ct(r, e, n, t) } } function nr(n, r) { return function (e, u, i) { return u = mr(u, i, 3), Ti(e) ? (u = t(e, u, r), -1 < u ? e[u] : m) : pt(e, u, n) } } function tr(n) { return function (r, e, u) { return r && r.length ? (e = mr(e, u, 3), t(r, e, n)) : -1 } } function rr(n) {
            return function (t, r, e) { return r = mr(r, e, 3), pt(t, r, n, true) }
        } function er(n) {
            return function () {
                for (var t, r = arguments.length, e = n ? r : -1, u = 0, i = Me(r) ; n ? e-- : ++e < r;) { var o = i[u++] = arguments[e]; if (typeof o != "function") throw new Je(N); !t && zn.prototype.thru && "wrapper" == wr(o) && (t = new zn([])) } for (e = t ? -1 : r; ++e < r;) { var o = i[e], u = wr(o), f = "wrapper" == u ? Yu(o) : null; t = f && Sr(f[0]) && f[1] == (I | j | O | E) && !f[4].length && 1 == f[9] ? t[wr(f[0])].apply(t, f[3]) : 1 == o.length && Sr(o) ? t[u]() : t.thru(o) } return function () {
                    var n = arguments; if (t && 1 == n.length && Ti(n[0])) return t.plant(n[0]).value();
                    for (var e = 0, n = r ? i[e].apply(this, n) : n[0]; ++e < r;) n = i[e].call(this, n); return n
                }
            }
        } function ur(n, t) { return function (r, e, u) { return typeof e == "function" && u === m && Ti(r) ? n(r, e) : t(r, Mt(e, u, 3)) } } function ir(n) { return function (t, r, e) { return (typeof r != "function" || e !== m) && (r = Mt(r, e, 3)), n(t, r, ke) } } function or(n) { return function (t, r, e) { return (typeof r != "function" || e !== m) && (r = Mt(r, e, 3)), n(t, r) } } function fr(n) {
            return function (t, r, e) {
                var u = {}; return r = mr(r, e, 3), vt(t, function (t, e, i) { i = r(t, e, i), e = n ? i : e, t = n ? t : i, u[e] = t }),
                u
            }
        } function lr(n) { return function (t, r, e) { return t = u(t), (n ? t : "") + pr(t, r, e) + (n ? "" : t) } } function ar(n) { var t = ae(function (r, e) { var u = _(e, t.placeholder); return vr(r, n, null, e, u) }); return t } function cr(n, t) { return function (r, e, u, i) { var o = 3 > arguments.length; return typeof e == "function" && i === m && Ti(r) ? n(r, e, u, o) : Et(r, mr(e, i, 4), u, o, t) } } function sr(n, t, r, e, u, i, o, f, l, a) {
            function c() {
                for (var w = arguments.length, A = w, j = Me(w) ; A--;) j[A] = arguments[A]; if (e && (j = qt(j, e, u)), i && (j = Dt(j, i, o)), v || y) {
                    var A = c.placeholder, k = _(j, A), w = w - k.length;
                    if (w < a) { var I = f ? Dn(f) : null, w = ku(a - w, 0), E = v ? k : null, k = v ? null : k, C = v ? j : null, j = v ? null : j; return t |= v ? O : R, t &= ~(v ? R : O), g || (t &= ~(b | x)), j = [n, t, r, C, E, j, k, I, l, w], I = sr.apply(m, j), Sr(n) && Gu(I, j), I.placeholder = A, I }
                } if (A = p ? r : this, I = h ? A[n] : n, f) for (w = j.length, E = Ou(f.length, w), k = Dn(j) ; E--;) C = f[E], j[E] = Er(C, w) ? k[C] : m; return s && l < j.length && (j.length = l), this && this !== Yn && this instanceof c && (I = d || Xt(n)), I.apply(A, j)
            } var s = t & I, p = t & b, h = t & x, v = t & j, g = t & A, y = t & k, d = h ? null : Xt(n); return c
        } function pr(n, t, r) {
            return n = n.length, t = +t,
            n < t && Au(t) ? (t -= n, r = null == r ? " " : r + "", We(r, au(t / r.length)).slice(0, t)) : ""
        } function hr(n, t, r, e) { function u() { for (var t = -1, f = arguments.length, l = -1, a = e.length, c = Me(f + a) ; ++l < a;) c[l] = e[l]; for (; f--;) c[l++] = arguments[++t]; return (this && this !== Yn && this instanceof u ? o : n).apply(i ? r : this, c) } var i = t & b, o = Xt(n); return u } function _r(n) { return function (t, r, e, u) { var i = mr(e); return null == e && i === it ? zt(t, r, n) : Bt(t, r, i(e, u, 1), n) } } function vr(n, t, r, e, u, i, o, f) {
            var l = t & x; if (!l && typeof n != "function") throw new Je(N); var a = e ? e.length : 0;
            if (a || (t &= ~(O | R), e = u = null), a -= u ? u.length : 0, t & R) { var c = e, s = u; e = u = null } var p = l ? null : Yu(n); return r = [n, t, r, e, u, c, s, i, o, f], p && (e = r[1], t = p[1], f = e | t, u = t == I && e == j || t == I && e == E && r[7].length <= p[8] || t == (I | E) && e == j, (f < I || u) && (t & b && (r[2] = p[2], f |= e & b ? 0 : A), (e = p[3]) && (u = r[3], r[3] = u ? qt(u, e, p[4]) : Dn(e), r[4] = u ? _(r[3], L) : Dn(p[4])), (e = p[5]) && (u = r[5], r[5] = u ? Dt(u, e, p[6]) : Dn(e), r[6] = u ? _(r[5], L) : Dn(p[6])), (e = p[7]) && (r[7] = Dn(e)), t & I && (r[8] = null == r[8] ? p[8] : Ou(r[8], p[8])), null == r[9] && (r[9] = p[9]), r[0] = p[0], r[1] = f), t = r[1], f = r[9]),
            r[9] = null == f ? l ? 0 : n.length : ku(f - a, 0) || 0, (p ? Ku : Gu)(t == b ? Gt(r[0], r[2]) : t != O && t != (b | O) || r[4].length ? sr.apply(m, r) : hr.apply(m, r), r)
        } function gr(n, t, r, e, u, i, o) { var f = -1, l = n.length, a = t.length; if (l != a && (!u || a <= l)) return false; for (; ++f < l;) { var c = n[f], a = t[f], s = e ? e(u ? a : c, u ? c : a, f) : m; if (s !== m) { if (s) continue; return false } if (u) { if (!Hn(t, function (n) { return c === n || r(c, n, e, u, i, o) })) return false } else if (c !== a && !r(c, a, e, u, i, o)) return false } return true } function yr(n, t, r) {
            switch (r) {
                case M: case P: return +n == +t; case q: return n.name == t.name && n.message == t.message;
                case K: return n != +n ? t != +t : n == +t; case Y: case Z: return n == t + ""
            } return false
        } function dr(n, t, r, e, u, i, o) {
            var f = Ki(n), l = f.length, a = Ki(t).length; if (l != a && !u) return false; for (a = l; a--;) { var c = f[a]; if (!(u ? c in t : ru.call(t, c))) return false } for (var s = u; ++a < l;) { var c = f[a], p = n[c], h = t[c], _ = e ? e(u ? h : p, u ? p : h, c) : m; if (_ === m ? !r(p, h, e, u, i, o) : !_) return false; s || (s = "constructor" == c) } return s || (r = n.constructor, e = t.constructor, !(r != e && "constructor" in n && "constructor" in t) || typeof r == "function" && r instanceof r && typeof e == "function" && e instanceof e) ? true : false;
        } function mr(n, t, r) { var e = Nn.callback || Ue, e = e === Ue ? it : e; return r ? e(n, t, r) : e } function wr(n) { for (var t = n.name, r = Lu[t], e = r ? r.length : 0; e--;) { var u = r[e], i = u.func; if (null == i || i == n) return u.name } return t } function br(n, t, e) { var u = Nn.indexOf || Kr, u = u === Kr ? r : u; return n ? u(n, t, e) : u } function xr(n) { n = Oe(n); for (var t = n.length; t--;) { var r = n[t][1]; n[t][2] = r === r && !ve(r) } return n } function Ar(n, t) { var r = null == n ? m : n[t]; return ge(r) ? r : m } function jr(n) {
            var t = n.length, r = new n.constructor(t); return t && "string" == typeof n[0] && ru.call(n, "index") && (r.index = n.index,
            r.input = n.input), r
        } function kr(n) { return n = n.constructor, typeof n == "function" && n instanceof n || (n = Ye), new n } function Or(n, t, r) { var e = n.constructor; switch (t) { case G: return Pt(n); case M: case P: return new e(+n); case J: case X: case H: case Q: case nn: case tn: case rn: case en: case un: return t = n.buffer, new e(r ? Pt(t) : t, n.byteOffset, n.length); case K: case Z: return new e(n); case Y: var u = new e(n.source, jn.exec(n)); u.lastIndex = n.lastIndex } return u } function Rr(n, t, r) {
            return null == n || Wr(t, n) || (t = Br(t), n = 1 == t.length ? n : dt(n, Ct(t, 0, -1)),
            t = Vr(t)), t = null == n ? n : n[t], null == t ? m : t.apply(n, r)
        } function Ir(n) { return null != n && Tr(Zu(n)) } function Er(n, t) { return n = typeof n == "number" || Rn.test(n) ? +n : -1, t = null == t ? Fu : t, -1 < n && 0 == n % 1 && n < t } function Cr(n, t, r) { if (!ve(r)) return false; var e = typeof t; return ("number" == e ? Ir(r) && Er(t, r.length) : "string" == e && t in r) ? (t = r[t], n === n ? n === t : t !== t) : false } function Wr(n, t) { var r = typeof n; return "string" == r && yn.test(n) || "number" == r ? true : Ti(n) ? false : !gn.test(n) || null != t && n in zr(t) } function Sr(n) {
            var t = wr(n); return t in Bn.prototype ? (t = Nn[t],
            n === t ? true : (t = Yu(t), !!t && n === t[0])) : false
        } function Tr(n) { return typeof n == "number" && -1 < n && 0 == n % 1 && n <= Fu } function Ur(n, t) { n = zr(n); for (var r = -1, e = t.length, u = {}; ++r < e;) { var i = t[r]; i in n && (u[i] = n[i]) } return u } function $r(n, t) { var r = {}; return _t(n, function (n, e, u) { t(n, e, u) && (r[e] = n) }), r } function Fr(n) { var t; if (!p(n) || uu.call(n) != V || !(ru.call(n, "constructor") || (t = n.constructor, typeof t != "function" || t instanceof t))) return false; var r; return _t(n, function (n, t) { r = t }), r === m || ru.call(n, r) } function Nr(n) {
            for (var t = ke(n), r = t.length, e = r && n.length, u = !!e && Tr(e) && (Ti(n) || se(n)), i = -1, o = []; ++i < r;) {
                var f = t[i]; (u && Er(f, e) || ru.call(n, f)) && o.push(f)
            } return o
        } function Lr(n) { return null == n ? [] : Ir(n) ? ve(n) ? n : Ye(n) : Re(n) } function zr(n) { return ve(n) ? n : Ye(n) } function Br(n) { if (Ti(n)) return n; var t = []; return u(n).replace(dn, function (n, r, e, u) { t.push(e ? u.replace(xn, "$1") : r || n) }), t } function Mr(n) { return n instanceof Bn ? n.clone() : new zn(n.__wrapped__, n.__chain__, Dn(n.__actions__)) } function Pr(n, t, r) { return n && n.length ? ((r ? Cr(n, t, r) : null == t) && (t = 1), Ct(n, 0 > t ? 0 : t)) : [] } function qr(n, t, r) {
            var e = n ? n.length : 0; return e ? ((r ? Cr(n, t, r) : null == t) && (t = 1),
            t = e - (+t || 0), Ct(n, 0, 0 > t ? 0 : t)) : []
        } function Dr(n) { return n ? n[0] : m } function Kr(n, t, e) { var u = n ? n.length : 0; if (!u) return -1; if (typeof e == "number") e = 0 > e ? ku(u + e, 0) : e; else if (e) return e = zt(n, t), n = n[e], (t === t ? t === n : n !== n) ? e : -1; return r(n, t, e || 0) } function Vr(n) { var t = n ? n.length : 0; return t ? n[t - 1] : m } function Yr(n) { return Pr(n, 1) } function Zr(n, t, e, u) {
            if (!n || !n.length) return []; null != t && typeof t != "boolean" && (u = e, e = Cr(n, t, u) ? null : t, t = false); var i = mr(); if ((null != e || i !== it) && (e = i(e, u, 3)), t && br() == r) {
                t = e; var o; e = -1, u = n.length;
                for (var i = -1, f = []; ++e < u;) { var l = n[e], a = t ? t(l, e, n) : l; e && o === a || (o = a, f[++i] = l) } n = f
            } else n = $t(n, e); return n
        } function Gr(n) { if (!n || !n.length) return []; var t = -1, r = 0; n = Gn(n, function (n) { return Ir(n) ? (r = ku(n.length, r), true) : void 0 }); for (var e = Me(r) ; ++t < r;) e[t] = Jn(n, kt(t)); return e } function Jr(n, t, r) { return n && n.length ? (n = Gr(n), null == t ? n : (t = Mt(t, r, 4), Jn(n, function (n) { return Xn(n, t, m, true) }))) : [] } function Xr(n, t) {
            var r = -1, e = n ? n.length : 0, u = {}; for (!e || t || Ti(n[0]) || (t = []) ; ++r < e;) {
                var i = n[r]; t ? u[i] = t[r] : i && (u[i[0]] = i[1]);
            } return u
        } function Hr(n) { return n = Nn(n), n.__chain__ = true, n } function Qr(n, t, r) { return t.call(r, n) } function ne(n, t, r) { var e = Ti(n) ? Vn : at; return r && Cr(n, t, r) && (t = null), (typeof t != "function" || r !== m) && (t = mr(t, r, 3)), e(n, t) } function te(n, t, r) { var e = Ti(n) ? Gn : st; return t = mr(t, r, 3), e(n, t) } function re(n, t, r, e) { var u = n ? Zu(n) : 0; return Tr(u) || (n = Re(n), u = n.length), u ? (r = typeof r != "number" || e && Cr(t, r, e) ? 0 : 0 > r ? ku(u + r, 0) : r || 0, typeof n == "string" || !Ti(n) && me(n) ? r < u && -1 < n.indexOf(t, r) : -1 < br(n, t, r)) : false } function ee(n, t, r) {
            var e = Ti(n) ? Jn : bt; return t = mr(t, r, 3), e(n, t)
        } function ue(n, t, r) { if (r ? Cr(n, t, r) : null == t) { n = Lr(n); var e = n.length; return 0 < e ? n[It(0, e - 1)] : m } r = -1, n = xe(n); var e = n.length, u = e - 1; for (t = Ou(0 > t ? 0 : +t || 0, e) ; ++r < t;) { var e = It(r, u), i = n[e]; n[e] = n[r], n[r] = i } return n.length = t, n } function ie(n, t, r) { var e = Ti(n) ? Hn : Wt; return r && Cr(n, t, r) && (t = null), (typeof t != "function" || r !== m) && (t = mr(t, r, 3)), e(n, t) } function oe(n, t) {
            var r; if (typeof t != "function") { if (typeof n != "function") throw new Je(N); var e = n; n = t, t = e } return function () {
                return 0 < --n && (r = t.apply(this, arguments)), 1 >= n && (t = null), r
            }
        } function fe(n, t, r) {
            function e() { var r = t - (wi() - a); 0 >= r || r > t ? (f && cu(f), r = p, f = s = p = m, r && (h = wi(), l = n.apply(c, o), s || f || (o = c = null))) : s = gu(e, r) } function u() { s && cu(s), f = s = p = m, (v || _ !== t) && (h = wi(), l = n.apply(c, o), s || f || (o = c = null)) } function i() {
                if (o = arguments, a = wi(), c = this, p = v && (s || !g), false === _) var r = g && !s; else { f || g || (h = a); var i = _ - (a - h), y = 0 >= i || i > _; y ? (f && (f = cu(f)), h = a, l = n.apply(c, o)) : f || (f = gu(u, i)) } return y && s ? s = cu(s) : s || t === _ || (s = gu(e, t)), r && (y = true, l = n.apply(c, o)),
                !y || s || f || (o = c = null), l
            } var o, f, l, a, c, s, p, h = 0, _ = false, v = true; if (typeof n != "function") throw new Je(N); if (t = 0 > t ? 0 : +t || 0, true === r) var g = true, v = false; else ve(r) && (g = r.leading, _ = "maxWait" in r && ku(+r.maxWait || 0, t), v = "trailing" in r ? r.trailing : v); return i.cancel = function () { s && cu(s), f && cu(f), f = s = p = m }, i
        } function le(n, t) {
            function r() { var e = arguments, u = t ? t.apply(this, e) : e[0], i = r.cache; return i.has(u) ? i.get(u) : (e = n.apply(this, e), r.cache = i.set(u, e), e) } if (typeof n != "function" || t && typeof t != "function") throw new Je(N); return r.cache = new le.Cache,
            r
        } function ae(n, t) { if (typeof n != "function") throw new Je(N); return t = ku(t === m ? n.length - 1 : +t || 0, 0), function () { for (var r = arguments, e = -1, u = ku(r.length - t, 0), i = Me(u) ; ++e < u;) i[e] = r[t + e]; switch (t) { case 0: return n.call(this, i); case 1: return n.call(this, r[0], i); case 2: return n.call(this, r[0], r[1], i) } for (u = Me(t + 1), e = -1; ++e < t;) u[e] = r[e]; return u[t] = i, n.apply(this, u) } } function ce(n, t) { return n > t } function se(n) { return p(n) && Ir(n) && uu.call(n) == z } function pe(n) {
            return !!n && 1 === n.nodeType && p(n) && -1 < uu.call(n).indexOf("Element");
        } function he(n, t, r, e) { return e = (r = typeof r == "function" ? Mt(r, e, 3) : m) ? r(n, t) : m, e === m ? mt(n, t, r) : !!e } function _e(n) { return p(n) && typeof n.message == "string" && uu.call(n) == q } function ve(n) { var t = typeof n; return !!n && ("object" == t || "function" == t) } function ge(n) { return null == n ? false : uu.call(n) == D ? ou.test(tu.call(n)) : p(n) && On.test(n) } function ye(n) { return typeof n == "number" || p(n) && uu.call(n) == K } function de(n) { return p(n) && uu.call(n) == Y } function me(n) { return typeof n == "string" || p(n) && uu.call(n) == Z } function we(n) {
            return p(n) && Tr(n.length) && !!Un[uu.call(n)];
        } function be(n, t) { return n < t } function xe(n) { var t = n ? Zu(n) : 0; return Tr(t) ? t ? Dn(n) : [] : Re(n) } function Ae(n) { return ut(n, ke(n)) } function je(n) { return yt(n, ke(n)) } function ke(n) { if (null == n) return []; ve(n) || (n = Ye(n)); for (var t = n.length, t = t && Tr(t) && (Ti(n) || se(n)) && t || 0, r = n.constructor, e = -1, r = typeof r == "function" && r.prototype === n, u = Me(t), i = 0 < t; ++e < t;) u[e] = e + ""; for (var o in n) i && Er(o, t) || "constructor" == o && (r || !ru.call(n, o)) || u.push(o); return u } function Oe(n) {
            n = zr(n); for (var t = -1, r = Ki(n), e = r.length, u = Me(e) ; ++t < e;) {
                var i = r[t]; u[t] = [i, n[i]]
            } return u
        } function Re(n) { return Ft(n, Ki(n)) } function Ie(n) { return (n = u(n)) && n.replace(In, l).replace(bn, "") } function Ee(n) { return (n = u(n)) && wn.test(n) ? n.replace(mn, "\\$&") : n } function Ce(n, t, r) { return r && Cr(n, t, r) && (t = 0), Eu(n, t) } function We(n, t) { var r = ""; if (n = u(n), t = +t, 1 > t || !n || !Au(t)) return r; do t % 2 && (r += n), t = su(t / 2), n += n; while (t); return r } function Se(n, t, r) { var e = n; return (n = u(n)) ? (r ? Cr(e, t, r) : null == t) ? n.slice(v(n), g(n) + 1) : (t += "", n.slice(i(n, t), o(n, t) + 1)) : n } function Te(n, t, r) {
            return r && Cr(n, t, r) && (t = null), n = u(n), n.match(t || Wn) || []
        } function Ue(n, t, r) { return r && Cr(n, t, r) && (t = null), p(n) ? Ne(n) : it(n, t) } function $e(n) { return function () { return n } } function Fe(n) { return n } function Ne(n) { return xt(ot(n, true)) } function Le(n, t, r) {
            if (null == r) { var e = ve(t), u = e ? Ki(t) : null; ((u = u && u.length ? yt(t, u) : null) ? u.length : e) || (u = false, r = t, t = n, n = this) } u || (u = yt(t, Ki(t))); var i = true, e = -1, o = $i(n), f = u.length; false === r ? i = false : ve(r) && "chain" in r && (i = r.chain); for (; ++e < f;) {
                r = u[e]; var l = t[r]; n[r] = l, o && (n.prototype[r] = function (t) {
                    return function () { var r = this.__chain__; if (i || r) { var e = n(this.__wrapped__); return (e.__actions__ = Dn(this.__actions__)).push({ func: t, args: arguments, thisArg: n }), e.__chain__ = r, e } return r = [this.value()], _u.apply(r, arguments), t.apply(n, r) }
                }(l))
            } return n
        } function ze() { } function Be(n) { return Wr(n) ? kt(n) : Ot(n) } h = h ? Zn.defaults(Yn.Object(), h, Zn.pick(Yn, Tn)) : Yn; var Me = h.Array, Pe = h.Date, qe = h.Error, De = h.Function, Ke = h.Math, Ve = h.Number, Ye = h.Object, Ze = h.RegExp, Ge = h.String, Je = h.TypeError, Xe = Me.prototype, He = Ye.prototype, Qe = Ge.prototype, nu = (nu = h.window) ? nu.document : null, tu = De.prototype.toString, ru = He.hasOwnProperty, eu = 0, uu = He.toString, iu = h._, ou = Ze("^" + Ee(tu.call(ru)).replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), fu = Ar(h, "ArrayBuffer"), lu = Ar(fu && new fu(0), "slice"), au = Ke.ceil, cu = h.clearTimeout, su = Ke.floor, pu = Ar(Ye, "getPrototypeOf"), hu = h.parseFloat, _u = Xe.push, vu = Ar(h, "Set"), gu = h.setTimeout, yu = Xe.splice, du = Ar(h, "Uint8Array"), mu = Ar(h, "WeakMap"), wu = function () {
            try { var n = Ar(h, "Float64Array"), t = new n(new fu(10), 0, 1) && n } catch (r) { } return t || null
        }(), bu = Ar(Ye, "create"), xu = Ar(Me, "isArray"), Au = h.isFinite, ju = Ar(Ye, "keys"), ku = Ke.max, Ou = Ke.min, Ru = Ar(Pe, "now"), Iu = Ar(Ve, "isFinite"), Eu = h.parseInt, Cu = Ke.random, Wu = Ve.NEGATIVE_INFINITY, Su = Ve.POSITIVE_INFINITY, Tu = 4294967294, Uu = 2147483647, $u = wu ? wu.BYTES_PER_ELEMENT : 0, Fu = 9007199254740991, Nu = mu && new mu, Lu = {}, zu = Nn.support = {}; !function (n) {
            function t() { this.x = n } var r = []; t.prototype = { valueOf: n, y: n }; for (var e in new t) r.push(e);
            try { zu.dom = 11 === nu.createDocumentFragment().nodeType } catch (u) { zu.dom = false }
        }(1, 0), Nn.templateSettings = { escape: hn, evaluate: _n, interpolate: vn, variable: "", imports: { _: Nn } }; var Bu = function () { function n() { } return function (t) { if (ve(t)) { n.prototype = t; var r = new n; n.prototype = null } return r || {} } }(), Mu = Yt(vt), Pu = Yt(gt, true), qu = Zt(), Du = Zt(true), Ku = Nu ? function (n, t) { return Nu.set(n, t), n } : Fe; lu || (Pt = fu && du ? function (n) {
            var t = n.byteLength, r = wu ? su(t / $u) : 0, e = r * $u, u = new fu(t); if (r) { var i = new wu(u, 0, r); i.set(new wu(n, 0, r)) } return t != e && (i = new du(u, e),
            i.set(new du(n, e))), u
        } : $e(null)); var Vu = bu && vu ? function (n) { return new Pn(n) } : $e(null), Yu = Nu ? function (n) { return Nu.get(n) } : ze, Zu = kt("length"), Gu = function () { var n = 0, t = 0; return function (r, e) { var u = wi(), i = T - (u - t); if (t = u, 0 < i) { if (++n >= S) return r } else n = 0; return Ku(r, e) } }(), Ju = ae(function (n, t) { return Ir(n) ? lt(n, ht(t, false, true)) : [] }), Xu = tr(), Hu = tr(true), Qu = ae(function (n) {
            for (var t = n.length, e = t, u = Me(c), i = br(), o = i == r, f = []; e--;) { var l = n[e] = Ir(l = n[e]) ? l : []; u[e] = o && 120 <= l.length ? Vu(e && l) : null } var o = n[0], a = -1, c = o ? o.length : 0, s = u[0];
            n: for (; ++a < c;) if (l = o[a], 0 > (s ? qn(s, l) : i(f, l, 0))) { for (e = t; --e;) { var p = u[e]; if (0 > (p ? qn(p, l) : i(n[e], l, 0))) continue n } s && s.push(l), f.push(l) } return f
        }), ni = ae(function (t, r) { r = ht(r); var e = et(t, r); return Rt(t, r.sort(n)), e }), ti = _r(), ri = _r(true), ei = ae(function (n) { return $t(ht(n, false, true)) }), ui = ae(function (n, t) { return Ir(n) ? lt(n, t) : [] }), ii = ae(Gr), oi = ae(function (n) { var t = n.length, r = 2 < t ? n[t - 2] : m, e = 1 < t ? n[t - 1] : m; return 2 < t && typeof r == "function" ? t -= 2 : (r = 1 < t && typeof e == "function" ? (--t, e) : m, e = m), n.length = t, Jr(n, r, e) }), fi = ae(function (n, t) {
            return et(n, ht(t))
        }), li = Kt(function (n, t, r) { ru.call(n, r) ? ++n[r] : n[r] = 1 }), ai = nr(Mu), ci = nr(Pu, true), si = ur(Kn, Mu), pi = ur(function (n, t) { for (var r = n.length; r-- && false !== t(n[r], r, n) ;); return n }, Pu), hi = Kt(function (n, t, r) { ru.call(n, r) ? n[r].push(t) : n[r] = [t] }), _i = Kt(function (n, t, r) { n[r] = t }), vi = ae(function (n, t, r) { var e = -1, u = typeof t == "function", i = Wr(t), o = Ir(n) ? Me(n.length) : []; return Mu(n, function (n) { var f = u ? t : i && null != n ? n[t] : null; o[++e] = f ? f.apply(n, r) : Rr(n, t, r) }), o }), gi = Kt(function (n, t, r) { n[r ? 0 : 1].push(t) }, function () {
            return [[], []]
        }), yi = cr(Xn, Mu), di = cr(function (n, t, r, e) { var u = n.length; for (e && u && (r = n[--u]) ; u--;) r = t(r, n[u], u, n); return r }, Pu), mi = ae(function (n, t) { if (null == n) return []; var r = t[2]; return r && Cr(t[0], t[1], r) && (t.length = 1), Tt(n, ht(t), []) }), wi = Ru || function () { return (new Pe).getTime() }, bi = ae(function (n, t, r) { var e = b; if (r.length) var u = _(r, bi.placeholder), e = e | O; return vr(n, e, t, r, u) }), xi = ae(function (n, t) { t = t.length ? ht(t) : je(n); for (var r = -1, e = t.length; ++r < e;) { var u = t[r]; n[u] = vr(n[u], b, n) } return n }), Ai = ae(function (n, t, r) {
            var e = b | x; if (r.length) var u = _(r, Ai.placeholder), e = e | O; return vr(t, e, n, r, u)
        }), ji = Ht(j), ki = Ht(k), Oi = ae(function (n, t) { return ft(n, 1, t) }), Ri = ae(function (n, t, r) { return ft(n, t, r) }), Ii = er(), Ei = er(true), Ci = ar(O), Wi = ar(R), Si = ae(function (n, t) { return vr(n, E, null, null, null, ht(t)) }), Ti = xu || function (n) { return p(n) && Tr(n.length) && uu.call(n) == B }; zu.dom || (pe = function (n) { return !!n && 1 === n.nodeType && p(n) && !Fi(n) }); var Ui = Iu || function (n) { return typeof n == "number" && Au(n) }, $i = e(/x/) || du && !e(du) ? function (n) {
            return uu.call(n) == D;
        } : e, Fi = pu ? function (n) { if (!n || uu.call(n) != V) return false; var t = Ar(n, "valueOf"), r = t && (r = pu(t)) && pu(r); return r ? n == r || pu(n) == r : Fr(n) } : Fr, Ni = Vt(function (n, t, r) { return r ? tt(n, t, r) : rt(n, t) }), Li = ae(function (n) { var t = n[0]; return null == t ? t : (n.push(Qn), Ni.apply(m, n)) }), zi = rr(vt), Bi = rr(gt), Mi = ir(qu), Pi = ir(Du), qi = or(vt), Di = or(gt), Ki = ju ? function (n) { var t = null == n ? null : n.constructor; return typeof t == "function" && t.prototype === n || typeof n != "function" && Ir(n) ? Nr(n) : ve(n) ? ju(n) : [] } : Nr, Vi = fr(true), Yi = fr(), Zi = Vt(jt), Gi = ae(function (n, t) {
            if (null == n) return {}; if ("function" != typeof t[0]) return t = Jn(ht(t), Ge), Ur(n, lt(ke(n), t)); var r = Mt(t[0], t[1], 3); return $r(n, function (n, t, e) { return !r(n, t, e) })
        }), Ji = ae(function (n, t) { return null == n ? {} : "function" == typeof t[0] ? $r(n, Mt(t[0], t[1], 3)) : Ur(n, ht(t)) }), Xi = Jt(function (n, t, r) { return t = t.toLowerCase(), n + (r ? t.charAt(0).toUpperCase() + t.slice(1) : t) }), Hi = Jt(function (n, t, r) { return n + (r ? "-" : "") + t.toLowerCase() }), Qi = lr(), no = lr(true); 8 != Eu(Sn + "08") && (Ce = function (n, t, r) {
            return (r ? Cr(n, t, r) : null == t) ? t = 0 : t && (t = +t),
            n = Se(n), Eu(n, t || (kn.test(n) ? 16 : 10))
        }); var to = Jt(function (n, t, r) { return n + (r ? "_" : "") + t.toLowerCase() }), ro = Jt(function (n, t, r) { return n + (r ? " " : "") + (t.charAt(0).toUpperCase() + t.slice(1)) }), eo = ae(function (n, t) { try { return n.apply(m, t) } catch (r) { return _e(r) ? r : new qe(r) } }), uo = ae(function (n, t) { return function (r) { return Rr(r, n, t) } }), io = ae(function (n, t) { return function (r) { return Rr(n, r, t) } }), oo = Qt(ce, Wu), fo = Qt(be, Su); return Nn.prototype = Ln.prototype, zn.prototype = Bu(Ln.prototype), zn.prototype.constructor = zn,
        Bn.prototype = Bu(Ln.prototype), Bn.prototype.constructor = Bn, Mn.prototype["delete"] = function (n) { return this.has(n) && delete this.__data__[n] }, Mn.prototype.get = function (n) { return "__proto__" == n ? m : this.__data__[n] }, Mn.prototype.has = function (n) { return "__proto__" != n && ru.call(this.__data__, n) }, Mn.prototype.set = function (n, t) { return "__proto__" != n && (this.__data__[n] = t), this }, Pn.prototype.push = function (n) { var t = this.data; typeof n == "string" || ve(n) ? t.set.add(n) : t.hash[n] = true }, le.Cache = Mn, Nn.after = function (n, t) {
            if (typeof t != "function") {
                if (typeof n != "function") throw new Je(N); var r = n; n = t, t = r
            } return n = Au(n = +n) ? n : 0, function () { return 1 > --n ? t.apply(this, arguments) : void 0 }
        }, Nn.ary = function (n, t, r) { return r && Cr(n, t, r) && (t = null), t = n && null == t ? n.length : ku(+t || 0, 0), vr(n, I, null, null, null, null, t) }, Nn.assign = Ni, Nn.at = fi, Nn.before = oe, Nn.bind = bi, Nn.bindAll = xi, Nn.bindKey = Ai, Nn.callback = Ue, Nn.chain = Hr, Nn.chunk = function (n, t, r) { t = (r ? Cr(n, t, r) : null == t) ? 1 : ku(+t || 1, 1), r = 0; for (var e = n ? n.length : 0, u = -1, i = Me(au(e / t)) ; r < e;) i[++u] = Ct(n, r, r += t); return i }, Nn.compact = function (n) {
            for (var t = -1, r = n ? n.length : 0, e = -1, u = []; ++t < r;) { var i = n[t]; i && (u[++e] = i) } return u
        }, Nn.constant = $e, Nn.countBy = li, Nn.create = function (n, t, r) { var e = Bu(n); return r && Cr(n, t, r) && (t = null), t ? rt(e, t) : e }, Nn.curry = ji, Nn.curryRight = ki, Nn.debounce = fe, Nn.defaults = Li, Nn.defer = Oi, Nn.delay = Ri, Nn.difference = Ju, Nn.drop = Pr, Nn.dropRight = qr, Nn.dropRightWhile = function (n, t, r) { return n && n.length ? Nt(n, mr(t, r, 3), true, true) : [] }, Nn.dropWhile = function (n, t, r) { return n && n.length ? Nt(n, mr(t, r, 3), true) : [] }, Nn.fill = function (n, t, r, e) {
            var u = n ? n.length : 0;
            if (!u) return []; for (r && typeof r != "number" && Cr(n, t, r) && (r = 0, e = u), u = n.length, r = null == r ? 0 : +r || 0, 0 > r && (r = -r > u ? 0 : u + r), e = e === m || e > u ? u : +e || 0, 0 > e && (e += u), u = r > e ? 0 : e >>> 0, r >>>= 0; r < u;) n[r++] = t; return n
        }, Nn.filter = te, Nn.flatten = function (n, t, r) { var e = n ? n.length : 0; return r && Cr(n, t, r) && (t = false), e ? ht(n, t) : [] }, Nn.flattenDeep = function (n) { return n && n.length ? ht(n, true) : [] }, Nn.flow = Ii, Nn.flowRight = Ei, Nn.forEach = si, Nn.forEachRight = pi, Nn.forIn = Mi, Nn.forInRight = Pi, Nn.forOwn = qi, Nn.forOwnRight = Di, Nn.functions = je, Nn.groupBy = hi, Nn.indexBy = _i,
        Nn.initial = function (n) { return qr(n, 1) }, Nn.intersection = Qu, Nn.invert = function (n, t, r) { r && Cr(n, t, r) && (t = null), r = -1; for (var e = Ki(n), u = e.length, i = {}; ++r < u;) { var o = e[r], f = n[o]; t ? ru.call(i, f) ? i[f].push(o) : i[f] = [o] : i[f] = o } return i }, Nn.invoke = vi, Nn.keys = Ki, Nn.keysIn = ke, Nn.map = ee, Nn.mapKeys = Vi, Nn.mapValues = Yi, Nn.matches = Ne, Nn.matchesProperty = function (n, t) { return At(n, ot(t, true)) }, Nn.memoize = le, Nn.merge = Zi, Nn.method = uo, Nn.methodOf = io, Nn.mixin = Le, Nn.negate = function (n) {
            if (typeof n != "function") throw new Je(N); return function () {
                return !n.apply(this, arguments)
            }
        }, Nn.omit = Gi, Nn.once = function (n) { return oe(2, n) }, Nn.pairs = Oe, Nn.partial = Ci, Nn.partialRight = Wi, Nn.partition = gi, Nn.pick = Ji, Nn.pluck = function (n, t) { return ee(n, Be(t)) }, Nn.property = Be, Nn.propertyOf = function (n) { return function (t) { return dt(n, Br(t), t + "") } }, Nn.pull = function () { var n = arguments, t = n[0]; if (!t || !t.length) return t; for (var r = 0, e = br(), u = n.length; ++r < u;) for (var i = 0, o = n[r]; -1 < (i = e(t, o, i)) ;) yu.call(t, i, 1); return t }, Nn.pullAt = ni, Nn.range = function (n, t, r) {
            r && Cr(n, t, r) && (t = r = null),
            n = +n || 0, r = null == r ? 1 : +r || 0, null == t ? (t = n, n = 0) : t = +t || 0; var e = -1; t = ku(au((t - n) / (r || 1)), 0); for (var u = Me(t) ; ++e < t;) u[e] = n, n += r; return u
        }, Nn.rearg = Si, Nn.reject = function (n, t, r) { var e = Ti(n) ? Gn : st; return t = mr(t, r, 3), e(n, function (n, r, e) { return !t(n, r, e) }) }, Nn.remove = function (n, t, r) { var e = []; if (!n || !n.length) return e; var u = -1, i = [], o = n.length; for (t = mr(t, r, 3) ; ++u < o;) r = n[u], t(r, u, n) && (e.push(r), i.push(u)); return Rt(n, i), e }, Nn.rest = Yr, Nn.restParam = ae, Nn.set = function (n, t, r) {
            if (null == n) return n; var e = t + ""; t = null != n[e] || Wr(t, n) ? [e] : Br(t);
            for (var e = -1, u = t.length, i = u - 1, o = n; null != o && ++e < u;) { var f = t[e]; ve(o) && (e == i ? o[f] = r : null == o[f] && (o[f] = Er(t[e + 1]) ? [] : {})), o = o[f] } return n
        }, Nn.shuffle = function (n) { return ue(n, Su) }, Nn.slice = function (n, t, r) { var e = n ? n.length : 0; return e ? (r && typeof r != "number" && Cr(n, t, r) && (t = 0, r = e), Ct(n, t, r)) : [] }, Nn.sortBy = function (n, t, r) { if (null == n) return []; r && Cr(n, t, r) && (t = null); var e = -1; return t = mr(t, r, 3), n = bt(n, function (n, r, u) { return { a: t(n, r, u), b: ++e, c: n } }), St(n, f) }, Nn.sortByAll = mi, Nn.sortByOrder = function (n, t, r, e) {
            return null == n ? [] : (e && Cr(t, r, e) && (r = null),
            Ti(t) || (t = null == t ? [] : [t]), Ti(r) || (r = null == r ? [] : [r]), Tt(n, t, r))
        }, Nn.spread = function (n) { if (typeof n != "function") throw new Je(N); return function (t) { return n.apply(this, t) } }, Nn.take = function (n, t, r) { return n && n.length ? ((r ? Cr(n, t, r) : null == t) && (t = 1), Ct(n, 0, 0 > t ? 0 : t)) : [] }, Nn.takeRight = function (n, t, r) { var e = n ? n.length : 0; return e ? ((r ? Cr(n, t, r) : null == t) && (t = 1), t = e - (+t || 0), Ct(n, 0 > t ? 0 : t)) : [] }, Nn.takeRightWhile = function (n, t, r) { return n && n.length ? Nt(n, mr(t, r, 3), false, true) : [] }, Nn.takeWhile = function (n, t, r) {
            return n && n.length ? Nt(n, mr(t, r, 3)) : [];
        }, Nn.tap = function (n, t, r) { return t.call(r, n), n }, Nn.throttle = function (n, t, r) { var e = true, u = true; if (typeof n != "function") throw new Je(N); return false === r ? e = false : ve(r) && (e = "leading" in r ? !!r.leading : e, u = "trailing" in r ? !!r.trailing : u), Fn.leading = e, Fn.maxWait = +t, Fn.trailing = u, fe(n, t, Fn) }, Nn.thru = Qr, Nn.times = function (n, t, r) { if (n = su(n), 1 > n || !Au(n)) return []; var e = -1, u = Me(Ou(n, 4294967295)); for (t = Mt(t, r, 1) ; ++e < n;) 4294967295 > e ? u[e] = t(e) : t(e); return u }, Nn.toArray = xe, Nn.toPlainObject = Ae, Nn.transform = function (n, t, r, e) {
            var u = Ti(n) || we(n);
            return t = mr(t, e, 4), null == r && (u || ve(n) ? (e = n.constructor, r = u ? Ti(n) ? new e : [] : Bu($i(e) ? e.prototype : null)) : r = {}), (u ? Kn : vt)(n, function (n, e, u) { return t(r, n, e, u) }), r
        }, Nn.union = ei, Nn.uniq = Zr, Nn.unzip = Gr, Nn.unzipWith = Jr, Nn.values = Re, Nn.valuesIn = function (n) { return Ft(n, ke(n)) }, Nn.where = function (n, t) { return te(n, xt(t)) }, Nn.without = ui, Nn.wrap = function (n, t) { return t = null == t ? Fe : t, vr(t, O, null, [n], []) }, Nn.xor = function () {
            for (var n = -1, t = arguments.length; ++n < t;) {
                var r = arguments[n]; if (Ir(r)) var e = e ? lt(e, r).concat(lt(r, e)) : r;
            } return e ? $t(e) : []
        }, Nn.zip = ii, Nn.zipObject = Xr, Nn.zipWith = oi, Nn.backflow = Ei, Nn.collect = ee, Nn.compose = Ei, Nn.each = si, Nn.eachRight = pi, Nn.extend = Ni, Nn.iteratee = Ue, Nn.methods = je, Nn.object = Xr, Nn.select = te, Nn.tail = Yr, Nn.unique = Zr, Le(Nn, Nn), Nn.add = function (n, t) { return (+n || 0) + (+t || 0) }, Nn.attempt = eo, Nn.camelCase = Xi, Nn.capitalize = function (n) { return (n = u(n)) && n.charAt(0).toUpperCase() + n.slice(1) }, Nn.clone = function (n, t, r, e) {
            return t && typeof t != "boolean" && Cr(n, t, r) ? t = false : typeof t == "function" && (e = r, r = t, t = false), typeof r == "function" ? ot(n, t, Mt(r, e, 1)) : ot(n, t);
        }, Nn.cloneDeep = function (n, t, r) { return typeof t == "function" ? ot(n, true, Mt(t, r, 1)) : ot(n, true) }, Nn.deburr = Ie, Nn.endsWith = function (n, t, r) { n = u(n), t += ""; var e = n.length; return r = r === m ? e : Ou(0 > r ? 0 : +r || 0, e), r -= t.length, 0 <= r && n.indexOf(t, r) == r }, Nn.escape = function (n) { return (n = u(n)) && pn.test(n) ? n.replace(cn, a) : n }, Nn.escapeRegExp = Ee, Nn.every = ne, Nn.find = ai, Nn.findIndex = Xu, Nn.findKey = zi, Nn.findLast = ci, Nn.findLastIndex = Hu, Nn.findLastKey = Bi, Nn.findWhere = function (n, t) { return ai(n, xt(t)) }, Nn.first = Dr, Nn.get = function (n, t, r) {
            return n = null == n ? m : dt(n, Br(t), t + ""), n === m ? r : n
        }, Nn.gt = ce, Nn.gte = function (n, t) { return n >= t }, Nn.has = function (n, t) { if (null == n) return false; var r = ru.call(n, t); if (!r && !Wr(t)) { if (t = Br(t), n = 1 == t.length ? n : dt(n, Ct(t, 0, -1)), null == n) return false; t = Vr(t), r = ru.call(n, t) } return r || Tr(n.length) && Er(t, n.length) && (Ti(n) || se(n)) }, Nn.identity = Fe, Nn.includes = re, Nn.indexOf = Kr, Nn.inRange = function (n, t, r) { return t = +t || 0, "undefined" === typeof r ? (r = t, t = 0) : r = +r || 0, n >= Ou(t, r) && n < ku(t, r) }, Nn.isArguments = se, Nn.isArray = Ti, Nn.isBoolean = function (n) {
            return true === n || false === n || p(n) && uu.call(n) == M
        }, Nn.isDate = function (n) { return p(n) && uu.call(n) == P }, Nn.isElement = pe, Nn.isEmpty = function (n) { return null == n ? true : Ir(n) && (Ti(n) || me(n) || se(n) || p(n) && $i(n.splice)) ? !n.length : !Ki(n).length }, Nn.isEqual = he, Nn.isError = _e, Nn.isFinite = Ui, Nn.isFunction = $i, Nn.isMatch = function (n, t, r, e) { return r = typeof r == "function" ? Mt(r, e, 3) : m, wt(n, xr(t), r) }, Nn.isNaN = function (n) { return ye(n) && n != +n }, Nn.isNative = ge, Nn.isNull = function (n) { return null === n }, Nn.isNumber = ye, Nn.isObject = ve, Nn.isPlainObject = Fi,
        Nn.isRegExp = de, Nn.isString = me, Nn.isTypedArray = we, Nn.isUndefined = function (n) { return n === m }, Nn.kebabCase = Hi, Nn.last = Vr, Nn.lastIndexOf = function (n, t, r) { var e = n ? n.length : 0; if (!e) return -1; var u = e; if (typeof r == "number") u = (0 > r ? ku(e + r, 0) : Ou(r || 0, e - 1)) + 1; else if (r) return u = zt(n, t, true) - 1, n = n[u], (t === t ? t === n : n !== n) ? u : -1; if (t !== t) return s(n, u, true); for (; u--;) if (n[u] === t) return u; return -1 }, Nn.lt = be, Nn.lte = function (n, t) { return n <= t }, Nn.max = oo, Nn.min = fo, Nn.noConflict = function () { return h._ = iu, this }, Nn.noop = ze, Nn.now = wi,
        Nn.pad = function (n, t, r) { n = u(n), t = +t; var e = n.length; return e < t && Au(t) ? (e = (t - e) / 2, t = su(e), e = au(e), r = pr("", e, r), r.slice(0, t) + n + r) : n }, Nn.padLeft = Qi, Nn.padRight = no, Nn.parseInt = Ce, Nn.random = function (n, t, r) { r && Cr(n, t, r) && (t = r = null); var e = null == n, u = null == t; return null == r && (u && typeof n == "boolean" ? (r = n, n = 1) : typeof t == "boolean" && (r = t, u = true)), e && u && (t = 1, u = false), n = +n || 0, u ? (t = n, n = 0) : t = +t || 0, r || n % 1 || t % 1 ? (r = Cu(), Ou(n + r * (t - n + hu("1e-" + ((r + "").length - 1))), t)) : It(n, t) }, Nn.reduce = yi, Nn.reduceRight = di, Nn.repeat = We, Nn.result = function (n, t, r) {
            var e = null == n ? m : n[t]; return e === m && (null == n || Wr(t, n) || (t = Br(t), n = 1 == t.length ? n : dt(n, Ct(t, 0, -1)), e = null == n ? m : n[Vr(t)]), e = e === m ? r : e), $i(e) ? e.call(n) : e
        }, Nn.runInContext = d, Nn.size = function (n) { var t = n ? Zu(n) : 0; return Tr(t) ? t : Ki(n).length }, Nn.snakeCase = to, Nn.some = ie, Nn.sortedIndex = ti, Nn.sortedLastIndex = ri, Nn.startCase = ro, Nn.startsWith = function (n, t, r) { return n = u(n), r = null == r ? 0 : Ou(0 > r ? 0 : +r || 0, n.length), n.lastIndexOf(t, r) == r }, Nn.sum = function (n, t, r) {
            r && Cr(n, t, r) && (t = null); var e = mr(), u = null == t; if (u && e === it || (u = false,
            t = e(t, r, 3)), u) { for (n = Ti(n) ? n : Lr(n), t = n.length, r = 0; t--;) r += +n[t] || 0; n = r } else n = Ut(n, t); return n
        }, Nn.template = function (n, t, r) {
            var e = Nn.templateSettings; r && Cr(n, t, r) && (t = r = null), n = u(n), t = tt(rt({}, r || t), e, nt), r = tt(rt({}, t.imports), e.imports, nt); var i, o, f = Ki(r), l = Ft(r, f), a = 0; r = t.interpolate || En; var s = "__p+='"; r = Ze((t.escape || En).source + "|" + r.source + "|" + (r === vn ? An : En).source + "|" + (t.evaluate || En).source + "|$", "g"); var p = "sourceURL" in t ? "//# sourceURL=" + t.sourceURL + "\n" : ""; if (n.replace(r, function (t, r, e, u, f, l) {
            return e || (e = u), s += n.slice(a, l).replace(Cn, c), r && (i = true, s += "'+__e(" + r + ")+'"), f && (o = true, s += "';" + f + ";\n__p+='"), e && (s += "'+((__t=(" + e + "))==null?'':__t)+'"), a = l + t.length, t
            }), s += "';", (t = t.variable) || (s = "with(obj){" + s + "}"), s = (o ? s.replace(on, "") : s).replace(fn, "$1").replace(ln, "$1;"), s = "function(" + (t || "obj") + "){" + (t ? "" : "obj||(obj={});") + "var __t,__p=''" + (i ? ",__e=_.escape" : "") + (o ? ",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}" : ";") + s + "return __p}", t = eo(function () {
            return De(f, p + "return " + s).apply(m, l);
            }), t.source = s, _e(t)) throw t; return t
        }, Nn.trim = Se, Nn.trimLeft = function (n, t, r) { var e = n; return (n = u(n)) ? n.slice((r ? Cr(e, t, r) : null == t) ? v(n) : i(n, t + "")) : n }, Nn.trimRight = function (n, t, r) { var e = n; return (n = u(n)) ? (r ? Cr(e, t, r) : null == t) ? n.slice(0, g(n) + 1) : n.slice(0, o(n, t + "") + 1) : n }, Nn.trunc = function (n, t, r) {
            r && Cr(n, t, r) && (t = null); var e = C; if (r = W, null != t) if (ve(t)) { var i = "separator" in t ? t.separator : i, e = "length" in t ? +t.length || 0 : e; r = "omission" in t ? u(t.omission) : r } else e = +t || 0; if (n = u(n), e >= n.length) return n; if (e -= r.length,
            1 > e) return r; if (t = n.slice(0, e), null == i) return t + r; if (de(i)) { if (n.slice(e).search(i)) { var o, f = n.slice(0, e); for (i.global || (i = Ze(i.source, (jn.exec(i) || "") + "g")), i.lastIndex = 0; n = i.exec(f) ;) o = n.index; t = t.slice(0, null == o ? e : o) } } else n.indexOf(i, e) != e && (i = t.lastIndexOf(i), -1 < i && (t = t.slice(0, i))); return t + r
        }, Nn.unescape = function (n) { return (n = u(n)) && sn.test(n) ? n.replace(an, y) : n }, Nn.uniqueId = function (n) { var t = ++eu; return u(n) + t }, Nn.words = Te, Nn.all = ne, Nn.any = ie, Nn.contains = re, Nn.eq = he, Nn.detect = ai, Nn.foldl = yi,
        Nn.foldr = di, Nn.head = Dr, Nn.include = re, Nn.inject = yi, Le(Nn, function () { var n = {}; return vt(Nn, function (t, r) { Nn.prototype[r] || (n[r] = t) }), n }(), false), Nn.sample = ue, Nn.prototype.sample = function (n) { return this.__chain__ || null != n ? this.thru(function (t) { return ue(t, n) }) : ue(this.value()) }, Nn.VERSION = w, Kn("bind bindKey curry curryRight partial partialRight".split(" "), function (n) { Nn[n].placeholder = Nn }), Kn(["dropWhile", "filter", "map", "takeWhile"], function (n, t) {
            var r = t != F, e = t == U; Bn.prototype[n] = function (n, u) {
                var i = this.__filtered__, o = i && e ? new Bn(this) : this.clone();
                return (o.__iteratees__ || (o.__iteratees__ = [])).push({ done: false, count: 0, index: 0, iteratee: mr(n, u, 1), limit: -1, type: t }), o.__filtered__ = i || r, o
            }
        }), Kn(["drop", "take"], function (n, t) {
            var r = n + "While"; Bn.prototype[n] = function (r) { var e = this.__filtered__, u = e && !t ? this.dropWhile() : this.clone(); return r = null == r ? 1 : ku(su(r) || 0, 0), e ? t ? u.__takeCount__ = Ou(u.__takeCount__, r) : Vr(u.__iteratees__).limit = r : (u.__views__ || (u.__views__ = [])).push({ size: r, type: n + (0 > u.__dir__ ? "Right" : "") }), u }, Bn.prototype[n + "Right"] = function (t) {
                return this.reverse()[n](t).reverse();
            }, Bn.prototype[n + "RightWhile"] = function (n, t) { return this.reverse()[r](n, t).reverse() }
        }), Kn(["first", "last"], function (n, t) { var r = "take" + (t ? "Right" : ""); Bn.prototype[n] = function () { return this[r](1).value()[0] } }), Kn(["initial", "rest"], function (n, t) { var r = "drop" + (t ? "" : "Right"); Bn.prototype[n] = function () { return this[r](1) } }), Kn(["pluck", "where"], function (n, t) { var r = t ? "filter" : "map", e = t ? xt : Be; Bn.prototype[n] = function (n) { return this[r](e(n)) } }), Bn.prototype.compact = function () { return this.filter(Fe) }, Bn.prototype.reject = function (n, t) {
            return n = mr(n, t, 1), this.filter(function (t) { return !n(t) })
        }, Bn.prototype.slice = function (n, t) { n = null == n ? 0 : +n || 0; var r = this; return 0 > n ? r = this.takeRight(-n) : n && (r = this.drop(n)), t !== m && (t = +t || 0, r = 0 > t ? r.dropRight(-t) : r.take(t - n)), r }, Bn.prototype.toArray = function () { return this.drop(0) }, vt(Bn.prototype, function (n, t) {
            var r = Nn[t]; if (r) {
                var e = /^(?:filter|map|reject)|While$/.test(t), u = /^(?:first|last)$/.test(t); Nn.prototype[t] = function () {
                    function t(n) { return n = [n], _u.apply(n, i), r.apply(Nn, n) } var i = arguments, o = this.__chain__, f = this.__wrapped__, l = !!this.__actions__.length, a = f instanceof Bn, c = i[0], s = a || Ti(f);
                    return s && e && typeof c == "function" && 1 != c.length && (a = s = false), a = a && !l, u && !o ? a ? n.call(f) : r.call(Nn, this.value()) : s ? (f = n.apply(a ? f : new Bn(this), i), u || !l && !f.__actions__ || (f.__actions__ || (f.__actions__ = [])).push({ func: Qr, args: [t], thisArg: Nn }), new zn(f, o)) : this.thru(t)
                }
            }
        }), Kn("concat join pop push replace shift sort splice split unshift".split(" "), function (n) {
            var t = (/^(?:replace|split)$/.test(n) ? Qe : Xe)[n], r = /^(?:push|sort|unshift)$/.test(n) ? "tap" : "thru", e = /^(?:join|pop|replace|shift)$/.test(n); Nn.prototype[n] = function () {
                var n = arguments; return e && !this.__chain__ ? t.apply(this.value(), n) : this[r](function (r) { return t.apply(r, n) })
            }
        }), vt(Bn.prototype, function (n, t) { var r = Nn[t]; if (r) { var e = r.name; (Lu[e] || (Lu[e] = [])).push({ name: t, func: r }) } }), Lu[sr(null, x).name] = [{ name: "wrapper", func: null }], Bn.prototype.clone = function () {
            var n = this.__actions__, t = this.__iteratees__, r = this.__views__, e = new Bn(this.__wrapped__); return e.__actions__ = n ? Dn(n) : null, e.__dir__ = this.__dir__, e.__filtered__ = this.__filtered__, e.__iteratees__ = t ? Dn(t) : null,
            e.__takeCount__ = this.__takeCount__, e.__views__ = r ? Dn(r) : null, e
        }, Bn.prototype.reverse = function () { if (this.__filtered__) { var n = new Bn(this); n.__dir__ = -1, n.__filtered__ = true } else n = this.clone(), n.__dir__ *= -1; return n }, Bn.prototype.value = function () {
            var n = this.__wrapped__.value(); if (!Ti(n)) return Lt(n, this.__actions__); var t, r = this.__dir__, e = 0 > r; t = n.length; for (var u = this.__views__, i = 0, o = -1, f = u ? u.length : 0; ++o < f;) {
                var l = u[o], a = l.size; switch (l.type) {
                    case "drop": i += a; break; case "dropRight": t -= a; break; case "take":
                        t = Ou(t, i + a); break; case "takeRight": i = ku(i, t - a)
                }
            } t = { start: i, end: t }, u = t.start, i = t.end, t = i - u, u = e ? i : u - 1, i = Ou(t, this.__takeCount__), f = (o = this.__iteratees__) ? o.length : 0, l = 0, a = []; n: for (; t-- && l < i;) { for (var u = u + r, c = -1, s = n[u]; ++c < f;) { var p = o[c], h = p.iteratee, _ = p.type; if (_ == U) { if (p.done && (e ? u > p.index : u < p.index) && (p.count = 0, p.done = false), p.index = u, !(p.done || (_ = p.limit, p.done = -1 < _ ? p.count++ >= _ : !h(s)))) continue n } else if (p = h(s), _ == F) s = p; else if (!p) { if (_ == $) continue n; break n } } a[l++] = s } return a
        }, Nn.prototype.chain = function () {
            return Hr(this)
        }, Nn.prototype.commit = function () { return new zn(this.value(), this.__chain__) }, Nn.prototype.plant = function (n) { for (var t, r = this; r instanceof Ln;) { var e = Mr(r); t ? u.__wrapped__ = e : t = e; var u = e, r = r.__wrapped__ } return u.__wrapped__ = n, t }, Nn.prototype.reverse = function () { var n = this.__wrapped__; return n instanceof Bn ? (this.__actions__.length && (n = new Bn(this)), new zn(n.reverse(), this.__chain__)) : this.thru(function (n) { return n.reverse() }) }, Nn.prototype.toString = function () { return this.value() + "" }, Nn.prototype.run = Nn.prototype.toJSON = Nn.prototype.valueOf = Nn.prototype.value = function () {
            return Lt(this.__wrapped__, this.__actions__)
        }, Nn.prototype.collect = Nn.prototype.map, Nn.prototype.head = Nn.prototype.first, Nn.prototype.select = Nn.prototype.filter, Nn.prototype.tail = Nn.prototype.rest, Nn
    } var m, w = "3.9.3", b = 1, x = 2, A = 4, j = 8, k = 16, O = 32, R = 64, I = 128, E = 256, C = 30, W = "...", S = 150, T = 16, U = 0, $ = 1, F = 2, N = "Expected a function", L = "__lodash_placeholder__", z = "[object Arguments]", B = "[object Array]", M = "[object Boolean]", P = "[object Date]", q = "[object Error]", D = "[object Function]", K = "[object Number]", V = "[object Object]", Y = "[object RegExp]", Z = "[object String]", G = "[object ArrayBuffer]", J = "[object Float32Array]", X = "[object Float64Array]", H = "[object Int8Array]", Q = "[object Int16Array]", nn = "[object Int32Array]", tn = "[object Uint8Array]", rn = "[object Uint8ClampedArray]", en = "[object Uint16Array]", un = "[object Uint32Array]", on = /\b__p\+='';/g, fn = /\b(__p\+=)''\+/g, ln = /(__e\(.*?\)|\b__t\))\+'';/g, an = /&(?:amp|lt|gt|quot|#39|#96);/g, cn = /[&<>"'`]/g, sn = RegExp(an.source), pn = RegExp(cn.source), hn = /<%-([\s\S]+?)%>/g, _n = /<%([\s\S]+?)%>/g, vn = /<%=([\s\S]+?)%>/g, gn = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/, yn = /^\w*$/, dn = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g, mn = /[.*+?^${}()|[\]\/\\]/g, wn = RegExp(mn.source), bn = /[\u0300-\u036f\ufe20-\ufe23]/g, xn = /\\(\\)?/g, An = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, jn = /\w*$/, kn = /^0[xX]/, On = /^\[object .+?Constructor\]$/, Rn = /^\d+$/, In = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g, En = /($^)/, Cn = /['\n\r\u2028\u2029\\]/g, Wn = RegExp("[A-Z\\xc0-\\xd6\\xd8-\\xde]+(?=[A-Z\\xc0-\\xd6\\xd8-\\xde][a-z\\xdf-\\xf6\\xf8-\\xff]+)|[A-Z\\xc0-\\xd6\\xd8-\\xde]?[a-z\\xdf-\\xf6\\xf8-\\xff]+|[A-Z\\xc0-\\xd6\\xd8-\\xde]+|[0-9]+", "g"), Sn = " \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000", Tn = "Array ArrayBuffer Date Error Float32Array Float64Array Function Int8Array Int16Array Int32Array Math Number Object RegExp Set String _ clearTimeout document isFinite parseFloat parseInt setTimeout TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array WeakMap window".split(" "), Un = {};
    Un[J] = Un[X] = Un[H] = Un[Q] = Un[nn] = Un[tn] = Un[rn] = Un[en] = Un[un] = true, Un[z] = Un[B] = Un[G] = Un[M] = Un[P] = Un[q] = Un[D] = Un["[object Map]"] = Un[K] = Un[V] = Un[Y] = Un["[object Set]"] = Un[Z] = Un["[object WeakMap]"] = false; var $n = {}; $n[z] = $n[B] = $n[G] = $n[M] = $n[P] = $n[J] = $n[X] = $n[H] = $n[Q] = $n[nn] = $n[K] = $n[V] = $n[Y] = $n[Z] = $n[tn] = $n[rn] = $n[en] = $n[un] = true, $n[q] = $n[D] = $n["[object Map]"] = $n["[object Set]"] = $n["[object WeakMap]"] = false; var Fn = { leading: false, maxWait: 0, trailing: false }, Nn = {
        "\xc0": "A", "\xc1": "A", "\xc2": "A", "\xc3": "A", "\xc4": "A", "\xc5": "A",
        "\xe0": "a", "\xe1": "a", "\xe2": "a", "\xe3": "a", "\xe4": "a", "\xe5": "a", "\xc7": "C", "\xe7": "c", "\xd0": "D", "\xf0": "d", "\xc8": "E", "\xc9": "E", "\xca": "E", "\xcb": "E", "\xe8": "e", "\xe9": "e", "\xea": "e", "\xeb": "e", "\xcc": "I", "\xcd": "I", "\xce": "I", "\xcf": "I", "\xec": "i", "\xed": "i", "\xee": "i", "\xef": "i", "\xd1": "N", "\xf1": "n", "\xd2": "O", "\xd3": "O", "\xd4": "O", "\xd5": "O", "\xd6": "O", "\xd8": "O", "\xf2": "o", "\xf3": "o", "\xf4": "o", "\xf5": "o", "\xf6": "o", "\xf8": "o", "\xd9": "U", "\xda": "U", "\xdb": "U", "\xdc": "U", "\xf9": "u", "\xfa": "u",
        "\xfb": "u", "\xfc": "u", "\xdd": "Y", "\xfd": "y", "\xff": "y", "\xc6": "Ae", "\xe6": "ae", "\xde": "Th", "\xfe": "th", "\xdf": "ss"
    }, Ln = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" }, zn = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&#96;": "`" }, Bn = { "function": true, object: true }, Mn = { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" }, Pn = Bn[typeof exports] && exports && !exports.nodeType && exports, qn = Bn[typeof module] && module && !module.nodeType && module, Dn = Bn[typeof self] && self && self.Object && self, Kn = Bn[typeof window] && window && window.Object && window, Vn = qn && qn.exports === Pn && Pn, Yn = Pn && qn && typeof global == "object" && global && global.Object && global || Kn !== (this && this.window) && Kn || Dn || this, Zn = d();
    typeof define == "function" && typeof define.amd == "object" && define.amd ? (Yn._ = Zn, define(function () { return Zn })) : Pn && qn ? Vn ? (qn.exports = Zn)._ = Zn : Pn._ = Zn : Yn._ = Zn
}).call(this);

(function ($, undefined) {
    $.fn.watch = function (options) {
        /// <summary>
        /// Allows you to monitor changes in a specific
        /// CSS property of an element by polling the value.
        /// when the value changes a function is called.
        /// The function called is called in the context
        /// of the selected element (ie. this)
        ///
        /// Uses the MutationObserver API of the DOM and
        /// falls back to setInterval to poll for changes
        /// for non-compliant browsers (pre IE 11)
        /// </summary>			
        /// <param name="options" type="Object">
        /// Option to set - see comments in code below.
        /// </param>		
        /// <returns type="jQuery" /> 

        var opt = $.extend({
            // CSS styles or Attributes to monitor as comma delimited list
            // For attributes use a attr_ prefix
            // Example: "top,left,opacity,attr_class"
            properties: null,

            // interval for 'manual polling' (IE 10 and older)			
            interval: 100,

            // a unique id for this watcher instance
            id: "_watcher",

            // flag to determine whether child elements are watched			
            watchChildren: false,

            // Callback function if not passed in callback parameter   
            callback: null
        }, options);

        return this.each(function () {
            var el = this;
            var el$ = $(this);
            var fnc = function (mRec, mObs) {
                __watcher.call(el, opt.id);
            };

            var data = {
                id: opt.id,
                props: opt.properties.split(","),
                vals: [opt.properties.split(",").length],
                func: opt.callback, // user function
                fnc: fnc, // __watcher internal
                origProps: opt.properties,
                interval: opt.interval,
                intervalId: null
            };
            // store initial props and values
            $.each(data.props, function (i) { data.vals[i] = el$.css(data.props[i]); });

            el$.data(opt.id, data);

            hookChange(el$, opt.id, data);
        });

        function hookChange(element$, id, data) {
            element$.each(function () {
                var el$ = $(this);

                if (window.MutationObserver) {
                    var observer = el$.data("__watcherObserver");
                    if (observer == null) {
                        observer = new MutationObserver(data.fnc);
                        el$.data("__watcherObserver", observer);
                    }
                    observer.observe(this, {
                        attributes: true,
                        subtree: opt.watchChildren,
                        childList: opt.watchChildren,
                        characterData: true
                    });
                } else
                    data.intervalId = setInterval(data.fnc, data.interval);
            });
        }

        function __watcher(id) {
            var el$ = $(this);
            var w = el$.data(id);
            if (!w) return;
            var el = this;

            if (!w.func)
                return;

            var changed = false;
            var i = 0;
            for (i; i < w.props.length; i++) {
                var key = w.props[i];

                var newVal = "";
                if (key.startsWith('attr_'))
                    newVal = el$.attr(key.replace('attr_', ''));
                else
                    newVal = el$.css(key);

                if (newVal == undefined)
                    continue;

                if (w.vals[i] != newVal) {
                    w.vals[i] = newVal;
                    changed = true;
                    break;
                }
            }
            if (changed) {
                // unbind to avoid recursive events
                el$.unwatch(id);

                // call the user handler
                w.func.call(el, w, i);

                // rebind the events
                hookChange(el$, id, w);
            }
        }
    }
    $.fn.unwatch = function (id) {
        this.each(function () {
            var el = $(this);
            var data = el.data(id);
            try {
                if (window.MutationObserver) {
                    var observer = el.data("__watcherObserver");
                    if (observer) {
                        observer.disconnect();
                        el.removeData("__watcherObserver");
                    }
                } else
                    clearInterval(data.intervalId);
            }
            // ignore if element was already unbound
            catch (e) {
            }
        });
        return this;
    }
    String.prototype.startsWith = function (sub) {
        if (this.length == 0) return false;
        return sub == this.substr(0, sub.length);
    }
})(jQuery, undefined);


// JavaScript Document
/*
 * jQuery placeholder, fix for IE6,7,8,9
 * @author JENA
 * @since 20131115.1504
 * @website ishere.cn
 */
var JPlaceHolder = {
    //检测
    _check: function () {
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init: function () {
        if (!this._check()) {
            this.fix();
        }
    },
    //修复
    fix: function () {
        jQuery(':input[placeholder]').each(function (index, element) {
            var self = $(this), txt = self.attr('placeholder');
            var width = self.outerWidth();
            var height = self.outerHeight();
            var fontSize = self.css('font-size');
            var fontFamily = self.css('font-family');
            var paddingLeft = self.css('padding-left');
            var lineHeiht = self.css('line-height');
            var mr = parseInt(self.css('margin-right'), 10);
            var cssfloat = self.css('float');

            // :fix ie6 double margin
            !!window.ActiveXObject && !window.XMLHttpRequest && (mr = mr / 2);
            paddingLeft = parseInt(paddingLeft, 10) + 3;
            lineHeiht = parseInt(lineHeiht, 10);
            fontSize = parseInt(fontSize, 10);
            var pt = (lineHeiht - fontSize) / 2;

            self.wrap($('<div></div>').css({
                position: 'relative',
                zoom: '1',
                border: 'none',
                background: 'none',
                padding: '0',
                width: width,
                height: height + 1,
                margin: '0',
                'margin-right': mr,
                display: 'inline-block',
                'float': cssfloat
            }));
            var holder = $('<span></span>').text(txt).css({
                position: 'absolute',
                display: 'block',
                width: width - paddingLeft,
                overflow: 'hidden',
                left: '0',
                'top': self.is('textarea') ? '10px' : '0px',
                'line-height': (self.is('textarea') ? lineHeiht : height) + 'px',
                'height': height,
                fontFamily: fontFamily,
                fontSize: fontSize,
                'padding-left': paddingLeft + 'px',
                color: '#aaa'
            }).hide().appendTo(self.parent());

            self.on('focus', function (e) {
                holder.hide();
            }).on('blur init', function (e) {
                if (!self.val() && self.is(':visible')) {
                    holder.show();
                } else {
                    holder.hide();
                }
            }).on('keydown', function () {
                if (holder.is(':visible') && self.val()) {
                    holder.hide();
                }
            }).trigger('init');
            // 监测value变动
            self.watch({
                'properties': 'attr_value',
                callback: function (data, i) {
                    self.trigger('init');
                }
            });
            holder.on('click', function (e) {
                self.trigger('focus');
            });
        });
    }
};


sPCLocation = new Array([340000, '安徽', [[340800, '安庆', [[340803, '大观区'], [340822, '怀宁县'], [340824, '潜山县'], [340826, '宿松县'], [340825, '太湖县'], [340881, '桐城市'], [340827, '望江县'], [340802, '迎江区'], [340811, '宜秀区'], [340828, '岳西县'], [340823, '枞阳县']]], [340300, '蚌埠', [[340303, '蚌山区'], [340323, '固镇县'], [340311, '淮上区'], [340321, '怀远县'], [340302, '龙子湖区'], [340322, '五河县'], [340304, '禹会区']]], [343000, '亳州', [[343023, '利辛县'], [343022, '蒙城县'], [343002, '谯城区'], [343021, '涡阳县']]], [342900, '池州', [[342921, '东至县'], [342902, '贵池区'], [342923, '青阳县'], [342922, '石台县']]], [341100, '滁州', [[341125, '定远县'], [341126, '凤阳县'], [341122, '来安县'], [341102, '琅琊区'], [341182, '明光市'], [341103, '南谯区'], [341124, '全椒县'], [341181, '天长市']]], [341200, '阜阳', [[341225, '阜南县'], [341282, '界首市'], [341221, '临泉县'], [341222, '太和县'], [341203, '颍东区'], [341204, '颍泉区'], [341226, '颍上县'], [341202, '颍州区']]], [340100, '合肥', [[340111, '包河区'], [340121, '长丰县'], [340105, '巢湖市'], [340122, '肥东县'], [340123, '肥西县'], [340101, '庐江县'], [340103, '庐阳区'], [340104, '蜀山区'], [340102, '瑶海区']]], [340600, '淮北', [[340602, '杜集区'], [340604, '烈山区'], [340621, '濉溪县'], [340603, '相山区']]], [340400, '淮南', [[340405, '八公山区'], [340402, '大通区'], [340421, '凤台县'], [340406, '潘集区'], [340403, '田家庵区'], [340404, '谢家集区']]], [341000, '黄山', [[341003, '黄山区'], [341004, '徽州区'], [341024, '祁门县'], [341021, '歙县'], [341002, '屯溪区'], [341022, '休宁县'], [341023, '黟县']]], [342400, '六安', [[342422, '霍邱县'], [342425, '霍山县'], [342402, '金安区'], [342424, '金寨县'], [342421, '寿县'], [342423, '舒城县'], [342403, '裕安区']]], [340500, '马鞍山', [[340522, '博望区'], [340521, '当涂县'], [340523, '含山县'], [340524, '和县'], [340503, '花山区'], [340504, '雨山区']]], [341300, '宿州', [[341321, '砀山县'], [341323, '灵璧县'], [341302, '埇桥区'], [341324, '泗县'], [341322, '萧县']]], [340700, '铜陵', [[340711, '郊区'], [340702, '铜官区'], [340721, '义安区']]], [340200, '芜湖', [[340222, '繁昌县'], [340202, '镜湖区'], [340207, '鸠江区'], [340223, '南陵县'], [340208, '三山区'], [340221, '芜湖县'], [340106, '无为县'], [340203, '弋江区']]], [342500, '宣城', [[342522, '广德县'], [342525, '旌德县'], [342523, '泾县'], [342524, '绩溪县'], [342521, '郎溪县'], [342581, '宁国市'], [342502, '宣州区']]]]], [820000, '澳门', [[820100, '市区', []]]], [110000, '北京', [[110221, '昌平区', []], [110105, '朝阳区', []], [110224, '大兴区', []], [110101, '东城区', []], [110111, '房山区', []], [110106, '丰台区', []], [110108, '海淀区', []], [110227, '怀柔区', []], [110109, '门头沟区', []], [110228, '密云区', []], [110226, '平谷区', []], [110107, '石景山区', []], [110113, '顺义区', []], [110112, '通州区', []], [110102, '西城区', []], [110104, '宣武区', []], [110229, '延庆区', []]]], [500000, '重庆', [[500113, '巴南区', []], [500109, '北碚区', []], [500227, '璧山区', []], [500221, '长寿区', []], [500229, '城口县', []], [500104, '大渡口区', []], [500225, '大足区', []], [500231, '垫江县', []], [500230, '丰都县', []], [500236, '奉节县', []], [500102, '涪陵区', []], [500382, '合川区', []], [500105, '江北区', []], [500381, '江津区', []], [500107, '九龙坡区', []], [500234, '开县', []], [500228, '梁平县', []], [500108, '南岸区', []], [500384, '南川区', []], [500243, '彭水县', []], [500239, '黔江区', []], [500222, '綦江区', []], [500226, '荣昌区', []], [500106, '沙坪坝区', []], [500240, '石柱县', []], [500224, '铜梁区', []], [500223, '潼南区', []], [500101, '万州区', []], [500232, '武隆县', []], [500237, '巫山县', []], [500238, '巫溪县', []], [500241, '秀山县', []], [500383, '永川区', []], [500242, '酉阳县', []], [500112, '渝北区', []], [500235, '云阳县', []], [500103, '渝中区', []], [500233, '忠县', []]]], [350000, '福建', [[350100, '福州', [[350104, '仓山区'], [350182, '长乐市'], [350181, '福清市'], [350102, '鼓楼区'], [350111, '晋安区'], [350122, '连江县'], [350123, '罗源县'], [350105, '马尾区'], [350121, '闽侯县'], [350124, '闽清县'], [350128, '平潭县'], [350103, '台江区'], [350125, '永泰县']]], [350800, '龙岩', [[350821, '长汀县'], [350825, '连城县'], [350823, '上杭县'], [350824, '武平县'], [350802, '新罗区'], [350822, '永定县'], [350881, '漳平市']]], [350700, '南平', [[350723, '光泽县'], [350783, '建瓯市'], [350784, '建阳区'], [350722, '浦城县'], [350781, '邵武市'], [350721, '顺昌县'], [350724, '松溪县'], [350782, '武夷山市'], [350702, '延平区'], [350725, '政和县']]], [352200, '宁德', [[352281, '福安市'], [352282, '福鼎市'], [352222, '古田县'], [352202, '蕉城区'], [352223, '屏南县'], [352224, '寿宁县'], [352221, '霞浦县'], [352226, '柘荣县'], [352225, '周宁县']]], [350300, '莆田', [[350302, '城厢区'], [350303, '涵江区'], [350304, '荔城区'], [350322, '仙游县'], [350305, '秀屿区']]], [350500, '泉州', [[350524, '安溪县'], [350526, '德化县'], [350503, '丰泽区'], [350521, '惠安县'], [350582, '晋江市'], [350527, '金门县'], [350502, '鲤城区'], [350504, '洛江区'], [350583, '南安市'], [350505, '泉港区'], [350581, '石狮市'], [350525, '永春县']]], [350400, '三明', [[350425, '大田县'], [350428, '将乐县'], [350430, '建宁县'], [350402, '梅列区'], [350421, '明溪县'], [350424, '宁化县'], [350423, '清流县'], [350403, '三元区'], [350427, '沙县'], [350429, '泰宁县'], [350481, '永安市'], [350426, '尤溪县']]], [350200, '厦门', [[350205, '海沧区'], [350206, '湖里区'], [350211, '集美区'], [350203, '思明区'], [350212, '同安区'], [350213, '翔安区']]], [350600, '漳州', [[350625, '长泰县'], [350626, '东山县'], [350629, '华安县'], [350681, '龙海市'], [350603, '龙文区'], [350627, '南靖县'], [350628, '平和县'], [350602, '芗城区'], [350622, '云霄县'], [350623, '漳浦县'], [350624, '诏安县']]]]], [620000, '甘肃', [[620400, '白银', [[620402, '白银区'], [620422, '会宁县'], [620423, '景泰县'], [620421, '靖远县'], [620403, '平川区']]], [622400, '定西', [[622402, '安定区'], [622424, '临洮县'], [622422, '陇西县'], [622426, '岷县'], [622421, '通渭县'], [622423, '渭源县'], [622425, '漳县']]], [623000, '甘南', [[623024, '迭部县'], [623001, '合作市'], [623021, '临潭县'], [623026, '碌曲县'], [623025, '玛曲县'], [623027, '夏河县'], [623023, '舟曲县'], [623022, '卓尼县']]], [620200, '嘉峪关', []], [623100, '金昌', [[623102, '金川区'], [623121, '永昌县']]], [622100, '酒泉', [[622124, '阿克塞哈萨克族自治县'], [622182, '敦煌市'], [622122, '瓜州县'], [622121, '金塔县'], [622123, '肃北蒙古族自治县'], [622102, '肃州区'], [622181, '玉门市']]], [620100, '兰州', [[620105, '安宁区'], [620102, '城关区'], [620122, '皋兰县'], [620111, '红古区'], [620103, '七里河区'], [620104, '西固区'], [620121, '永登县'], [620123, '榆中县']]], [622900, '临夏', [[622926, '东乡族自治县'], [622924, '广河县'], [622925, '和政县'], [622927, '积石山保安族东乡族撒拉族自治县'], [622922, '康乐县'], [622901, '临夏市'], [622921, '临夏县'], [622923, '永靖县']]], [622600, '陇南', [[622621, '成县'], [622623, '宕昌县'], [622627, '徽县'], [622624, '康县'], [622628, '两当县'], [622626, '礼县'], [622622, '文县'], [622602, '武都区'], [622625, '西和县']]], [622700, '平凉', [[622723, '崇信县'], [622724, '华亭县'], [622721, '泾川县'], [622726, '静宁县'], [622702, '崆峒区'], [622722, '灵台县'], [622725, '庄浪县']]], [622800, '庆阳', [[622824, '合水县'], [622823, '华池县'], [622822, '环县'], [622826, '宁县'], [622821, '庆城县'], [622802, '西峰区'], [622825, '正宁县'], [622827, '镇原县']]], [620500, '天水', [[620523, '甘谷县'], [620503, '麦积区'], [620522, '秦安县'], [620521, '清水县'], [620502, '秦州区'], [620524, '武山县'], [620525, '张家川回族自治县']]], [622300, '武威', [[622322, '古浪县'], [622302, '凉州区'], [622321, '民勤县'], [622323, '天祝藏族自治县']]], [622200, '张掖', [[622202, '甘州区'], [622224, '高台县'], [622223, '临泽县'], [622222, '民乐县'], [622225, '山丹县'], [622221, '肃南裕固族自治县']]]]], [440000, '广东', [[445100, '潮州', [[445121, '潮安区'], [445122, '饶平县'], [445102, '湘桥区']]], [441900, '东莞', []], [440600, '佛山', [[440604, '禅城区'], [440608, '高明区'], [440605, '南海区'], [440607, '三水区'], [440606, '顺德区']]], [440100, '广州', [[440111, '白云区'], [440184, '从化市'], [440113, '番禺区'], [440105, '海珠区'], [440114, '花都区'], [440112, '黄埔区'], [440103, '荔湾区'], [440115, '南沙区'], [440106, '天河区'], [440104, '越秀区'], [440183, '增城市']]], [441600, '河源', [[441625, '东源县'], [441624, '和平县'], [441623, '连平县'], [441622, '龙川县'], [441602, '源城区'], [441621, '紫金县']]], [441300, '惠州', [[441322, '博罗县'], [441302, '惠城区'], [441323, '惠东县'], [441303, '惠阳区'], [441324, '龙门县']]], [440700, '江门', [[440785, '恩平市'], [440784, '鹤山市'], [440704, '江海区'], [440783, '开平市'], [440703, '蓬江区'], [440781, '台山市'], [440705, '新会区']]], [445200, '揭阳', [[445224, '惠来县'], [445221, '揭东区'], [445222, '揭西县'], [445281, '普宁市'], [445202, '榕城区']]], [440900, '茂名', [[440923, '电白区'], [440981, '高州市'], [440982, '化州市'], [440903, '茂港区'], [440902, '茂南区'], [440983, '信宜市']]], [441400, '梅州', [[441422, '大埔县'], [441423, '丰顺县'], [441427, '蕉岭县'], [441402, '梅江区'], [441421, '梅县区'], [441426, '平远县'], [441424, '五华县'], [441481, '兴宁市']]], [441800, '清远', [[441821, '佛冈县'], [441826, '连南瑶族自治县'], [441825, '连山壮族瑶族自治县'], [441882, '连州市'], [441802, '清城区'], [441827, '清新区'], [441823, '阳山县'], [441881, '英德市']]], [440500, '汕头', [[440514, '潮南区'], [440513, '潮阳区'], [440515, '澄海区'], [440512, '濠江区'], [440511, '金平区'], [440507, '龙湖区'], [440523, '南澳县']]], [441500, '汕尾', [[441502, '城区'], [441521, '海丰县'], [441581, '陆丰市'], [441523, '陆河县']]], [440200, '韶关', [[440281, '乐昌市'], [440282, '南雄市'], [440205, '曲江区'], [440224, '仁化县'], [440232, '乳源瑶族自治县'], [440222, '始兴县'], [440229, '翁源县'], [440203, '武江区'], [440233, '新丰县'], [440204, '浈江区']]], [440300, '深圳', [[440306, '宝安区'], [440304, '福田区'], [440307, '龙岗区'], [440303, '罗湖区'], [440305, '南山区'], [440308, '盐田区']]], [441700, '阳江', [[441702, '江城区'], [441781, '阳春市'], [441723, '阳东区'], [441721, '阳西县']]], [445300, '云浮', [[445381, '罗定市'], [445321, '新兴县'], [445322, '郁南县'], [445323, '云安区'], [445302, '云城区']]], [440800, '湛江', [[440802, '赤坎区'], [440882, '雷州市'], [440881, '廉江市'], [440811, '麻章区'], [440804, '坡头区'], [440823, '遂溪县'], [440883, '吴川市'], [440803, '霞山区'], [440825, '徐闻县']]], [441200, '肇庆', [[441226, '德庆县'], [441203, '鼎湖区'], [441202, '端州区'], [441225, '封开县'], [441283, '高要区'], [441223, '广宁县'], [441224, '怀集县'], [441284, '四会市']]], [442000, '中山', []], [440400, '珠海', [[440403, '斗门区'], [440404, '金湾区'], [440402, '香洲区']]]]], [450000, '广西', [[452600, '百色', [[452624, '德保县'], [452625, '靖西市'], [452628, '乐业县'], [452627, '凌云县'], [452631, '隆林各族自治县'], [452626, '那坡县'], [452623, '平果县'], [452622, '田东县'], [452629, '田林县'], [452621, '田阳县'], [452630, '西林县'], [452602, '右江区']]], [450500, '北海', [[450502, '海城区'], [450521, '合浦县'], [450512, '铁山港区'], [450503, '银海区']]], [451400, '崇左市', [[451424, '大新县'], [451421, '扶绥县'], [451402, '江洲区'], [451423, '龙州县'], [451422, '宁明县'], [451481, '凭祥市'], [451425, '天等县']]], [450600, '防城港', [[450681, '东兴市'], [450603, '防城区'], [450602, '港口区'], [450621, '上思县']]], [450800, '贵港', [[450802, '港北区'], [450803, '港南区'], [450881, '桂平市'], [450821, '平南县'], [450804, '覃塘区']]], [450300, '桂林', [[450303, '叠彩区'], [450332, '恭城瑶族自治县'], [450327, '灌阳县'], [450323, '灵川县'], [450322, '临桂区'], [450331, '荔蒲县'], [450328, '龙胜各族自治县'], [450330, '平乐县'], [450305, '七星区'], [450324, '全州县'], [450304, '象山区'], [450325, '兴安县'], [450302, '秀峰区'], [450321, '阳朔县'], [450311, '雁山区'], [450326, '永福县'], [450329, '资源县']]], [452700, '河池', [[452727, '巴马瑶族自治县'], [452729, '大化瑶族自治县'], [452724, '东兰县'], [452728, '都安瑶族自治县'], [452723, '凤山县'], [452726, '环江毛南族自治县'], [452702, '金城江区'], [452725, '罗城仫佬族自治县'], [452721, '南丹县'], [452722, '天峨县'], [452781, '宜州市']]], [452400, '贺州', [[452402, '八步区'], [452423, '富川瑶族自治县'], [452421, '昭平县'], [452422, '钟山县']]], [452800, '来宾', [[452881, '合山市'], [452824, '金秀瑶族自治县'], [452823, '武宣县'], [452822, '象州县'], [452821, '忻城县'], [452802, '兴宾区']]], [450200, '柳州', [[450202, '城中区'], [450205, '柳北区'], [450222, '柳城县'], [450221, '柳江县'], [450204, '柳南区'], [450223, '鹿寨县'], [450224, '融安县'], [450225, '融水苗族自治县'], [450226, '三江侗族自治县'], [450203, '鱼峰区']]], [450100, '南宁', [[450126, '宾阳县'], [450127, '横县'], [450105, '江南区'], [450108, '良庆区'], [450123, '隆安县'], [450124, '马山县'], [450103, '青秀区'], [450125, '上林县'], [450122, '武鸣区'], [450102, '兴宁区'], [450107, '西乡塘区'], [450109, '邕宁区']]], [450700, '钦州', [[450721, '灵山县'], [450722, '浦北县'], [450703, '钦北区'], [450702, '钦南区']]], [450400, '梧州', [[450421, '苍梧县'], [450481, '岑溪市'], [450405, '长洲区'], [450482, '龙圩区'], [450423, '蒙山县'], [450422, '藤县'], [450403, '万秀区']]], [450900, '玉林', [[450981, '北流市'], [450923, '博白县'], [450982, '福绵区'], [450922, '陆川县'], [450921, '容县'], [450924, '兴业县'], [450902, '玉州区']]]]], [520000, '贵州', [[522500, '安顺', [[522524, '关岭布依族苗族自治县'], [522521, '平坝区'], [522522, '普定县'], [522502, '西秀区'], [522523, '镇宁布依族苗族自治县'], [522525, '紫云苗族布依族自治县']]], [522400, '毕节', [[522422, '大方县'], [522428, '赫章县'], [522424, '金沙县'], [522426, '纳雍县'], [522423, '黔西县'], [522429, '七星关区'], [522427, '威宁彝族回族苗族自治县'], [522425, '织金县']]], [520100, '贵阳', [[520113, '白云区'], [520182, '观山湖区'], [520111, '花溪区'], [520121, '开阳县'], [520102, '南明区'], [520181, '清镇市'], [520112, '乌当区'], [520122, '息烽县'], [520123, '修文县'], [520103, '云岩区']]], [520200, '六盘水', [[520203, '六枝特区'], [520222, '盘县'], [520221, '水城县'], [520201, '钟山区']]], [522600, '黔东南', [[522626, '岑巩县'], [522633, '从江县'], [522636, '丹寨县'], [522622, '黄平县'], [522629, '剑河县'], [522628, '锦屏县'], [522601, '凯里市'], [522634, '雷山县'], [522631, '黎平县'], [522635, '麻江县'], [522632, '榕江县'], [522624, '三穗县'], [522623, '施秉县'], [522630, '台江县'], [522627, '天柱县'], [522625, '镇远县']]], [522700, '黔南', [[522729, '长顺县'], [522726, '独山县'], [522701, '都匀市'], [522702, '福泉市'], [522723, '贵定县'], [522731, '惠水县'], [522722, '荔波县'], [522730, '龙里县'], [522728, '罗甸县'], [522727, '平塘县'], [522732, '三都水族自治县'], [522725, '瓮安县']]], [522300, '黔西南', [[522328, '安龙县'], [522327, '册亨县'], [522323, '普安县'], [522324, '晴隆县'], [522326, '望谟县'], [522322, '兴仁县'], [522301, '兴义市'], [522325, '贞丰县']]], [522200, '铜仁', [[522231, '碧江区'], [522227, '德江县'], [522222, '江口县'], [522224, '石阡县'], [522225, '思南县'], [522229, '松桃苗族自治县'], [522230, '万山特区'], [522228, '沿河土家族自治县'], [522226, '印江土家族苗族自治县'], [522223, '玉屏侗族自治县']]], [520300, '遵义', [[520381, '赤水市'], [520325, '道真仡佬族苗族自治县'], [520327, '凤冈县'], [520302, '红花岗区'], [520303, '汇川区'], [520328, '湄潭县'], [520382, '仁怀市'], [520323, '绥阳县'], [520322, '桐梓县'], [520326, '务川仡佬族苗族自治县'], [520330, '习水县'], [520329, '余庆县'], [520324, '正安县'], [520321, '遵义县']]]]], [460000, '海南', [[460300, '白沙县', []], [460600, '保亭县', []], [460400, '昌江县', []], [469800, '澄迈县', []], [469600, '定安县', []], [469500, '东方市', []], [460100, '海口市', [[460106, '龙华区'], [460108, '美兰区'], [460107, '琼山区'], [460105, '秀英区']]], [469000, '省直辖', [[469003, '儋州市']]], [460500, '乐东县', []], [469900, '临高县', []], [460800, '陵水县', []], [460200, '琼海', []], [460700, '琼中县', []], [461000, '三沙市', []], [460001, '三亚', [[460003, '海棠区'], [460004, '吉阳区'], [460005, '天涯区'], [460006, '崖州区']]], [469700, '屯昌县', []], [469400, '万宁市', []], [469300, '文昌市', []], [469100, '五指山市', []], [469200, '儋州市', []]]], [130000, '河北', [[130600, '保定', [[130683, '安国市'], [130632, '安新县'], [130637, '博野县'], [130626, '定兴县'], [130682, '定州市'], [130624, '阜平县'], [130684, '高碑店市'], [130628, '高阳县'], [130623, '涞水县'], [130630, '涞源县'], [130635, '蠡县'], [130621, '满城区'], [130604, '莲池区'], [130622, '清苑区'], [130634, '曲阳县'], [130629, '容城县'], [130636, '顺平县'], [130627, '唐县'], [130631, '望都县'], [130602, '竞秀区'], [130638, '雄县'], [130625, '徐水县'], [130633, '易县'], [130681, '涿州市']]], [130900, '沧州', [[130981, '泊头市'], [130921, '沧县'], [130923, '东光县'], [130924, '海兴县'], [130984, '河间市'], [130983, '黄骅市'], [130930, '孟村回族自治县'], [130927, '南皮县'], [130922, '青县'], [130982, '任丘市'], [130926, '肃宁县'], [130928, '吴桥县'], [130929, '献县'], [130902, '新华区'], [130925, '盐山县'], [130903, '运河区']]], [130800, '承德', [[130821, '承德县'], [130826, '丰宁满族自治县'], [130827, '宽城满族自治县'], [130825, '隆化县'], [130824, '滦平县'], [130823, '平泉县'], [130803, '双滦区'], [130802, '双桥区'], [130828, '围场满族蒙古族自治县'], [130822, '兴隆县'], [130804, '鹰手营子矿区']]], [130400, '邯郸', [[130424, '成安县'], [130427, '磁县'], [130403, '丛台区'], [130425, '大名县'], [130428, '肥乡县'], [130406, '峰峰矿区'], [130404, '复兴区'], [130432, '广平县'], [130433, '馆陶县'], [130421, '邯郸县'], [130402, '邯山区'], [130431, '鸡泽县'], [130423, '临漳县'], [130430, '邱县'], [130435, '曲周县'], [130426, '涉县'], [130434, '魏县'], [130481, '武安市'], [130429, '永年县']]], [131100, '衡水', [[131125, '安平县'], [131128, '阜城县'], [131126, '故城县'], [131127, '景县'], [131181, '冀州市'], [131124, '饶阳县'], [131182, '深州市'], [131102, '桃城区'], [131123, '武强县'], [131122, '武邑县'], [131121, '枣强县']]], [131000, '廊坊', [[131002, '安次区'], [131081, '霸州市'], [131028, '大厂回族自治县'], [131025, '大城县'], [131003, '广阳区'], [131022, '固安县'], [131082, '三河市'], [131026, '文安县'], [131024, '香河县'], [131023, '永清县']]], [130300, '秦皇岛', [[130304, '北戴河区'], [130322, '昌黎县'], [130323, '抚宁区'], [130302, '海港区'], [130324, '卢龙县'], [130321, '青龙满族自治县'], [130303, '山海关区']]], [130100, '石家庄', [[130102, '长安区'], [130182, '藁城市'], [130127, '高邑县'], [130107, '井陉矿区'], [130121, '井陉县'], [130183, '晋州市'], [130126, '灵寿县'], [130124, '栾城县'], [130185, '鹿泉市'], [130131, '平山县'], [130103, '桥东区'], [130104, '桥西区'], [130128, '深泽县'], [130130, '无极县'], [130125, '行唐县'], [130105, '新华区'], [130181, '辛集市'], [130184, '新乐市'], [130132, '元氏县'], [130108, '裕华区'], [130129, '赞皇县'], [130133, '赵县'], [130123, '正定县']]], [130200, '唐山', [[130284, '曹妃甸区'], [130207, '丰南区'], [130208, '丰润区'], [130204, '古冶区'], [130205, '开平区'], [130225, '乐亭县'], [130224, '滦南县'], [130223, '滦县'], [130203, '路北区'], [130202, '路南区'], [130283, '迁安'], [130227, '迁西县'], [130229, '玉田县'], [130281, '遵化市']]], [130500, '邢台', [[130524, '柏乡县'], [130531, '广宗县'], [130529, '巨鹿县'], [130522, '临城县'], [130535, '临西县'], [130525, '隆尧县'], [130581, '南宫市'], [130527, '南和县'], [130523, '内丘县'], [130528, '宁晋县'], [130532, '平乡县'], [130502, '桥东区'], [130503, '桥西区'], [130534, '清河县'], [130526, '任县'], [130582, '沙河市'], [130533, '威县'], [130521, '邢台县'], [130530, '新河县']]], [130700, '张家口', [[130732, '赤城县'], [130733, '崇礼县'], [130724, '沽源县'], [130728, '怀安县'], [130730, '怀来县'], [130723, '康保县'], [130702, '桥东区'], [130703, '桥西区'], [130725, '尚义县'], [130729, '万全县'], [130726, '蔚县'], [130706, '下花园区'], [130705, '宣化区'], [130721, '宣化县'], [130727, '阳原县'], [130722, '张北县'], [130731, '涿鹿县']]]]], [230000, '黑龙江', [[230600, '大庆', [[230606, '大同区'], [230624, '杜尔伯特蒙古族自治县'], [230605, '红岗区'], [230623, '林甸县'], [230603, '龙凤区'], [230604, '让胡路区'], [230602, '萨尔图区'], [230622, '肇源县'], [230621, '肇州县']]], [232700, '大兴安岭', [[232721, '呼玛县'], [232723, '漠河县'], [232722, '塔河县']]], [230100, '哈尔滨', [[230185, '阿城区'], [230126, '巴彦县'], [230125, '宾县'], [230102, '道里区'], [230104, '道外区'], [230124, '方正县'], [230111, '呼兰区'], [230127, '木兰县'], [230103, '南岗区'], [230108, '平房区'], [230183, '尚志市'], [230182, '双城区'], [230109, '松北区'], [230128, '通河县'], [230184, '五常市'], [230110, '香坊区'], [230129, '延寿县'], [230123, '依兰县']]], [230400, '鹤岗', [[230406, '东山区'], [230403, '工农区'], [230421, '萝北县'], [230404, '南山区'], [230422, '绥滨县'], [230402, '向阳区'], [230405, '兴安区'], [230407, '兴山区']]], [231100, '黑河', [[231102, '爱辉区'], [231181, '北安市'], [231121, '嫩江县'], [231124, '孙吴县'], [231182, '五大连池市'], [231123, '逊克县']]], [230800, '佳木斯', [[230805, '东风区'], [230882, '富锦市'], [230833, '抚远县'], [230826, '桦川县'], [230822, '桦南县'], [230811, '郊区'], [230804, '前进区'], [230828, '汤原县'], [230881, '同江市'], [230803, '向阳区']]], [230300, '鸡西', [[230306, '城子河区'], [230304, '滴道区'], [230303, '恒山区'], [230381, '虎林市'], [230321, '鸡东县'], [230302, '鸡冠区'], [230305, '梨树区'], [230307, '麻山区'], [230382, '密山市']]], [231000, '牡丹江', [[231004, '爱民区'], [231002, '东安区'], [231024, '东宁区'], [231083, '海林市'], [231025, '林口县'], [231085, '穆棱市'], [231084, '宁安市'], [231081, '绥芬河市'], [231005, '西安区'], [231003, '阳明区']]], [230200, '齐齐哈尔', [[230205, '昂昂溪区'], [230231, '拜泉县'], [230206, '富拉尔基区'], [230227, '富裕县'], [230225, '甘南县'], [230203, '建华区'], [230230, '克东县'], [230229, '克山县'], [230221, '龙江县'], [230202, '龙沙区'], [230208, '梅里斯达斡尔族区'], [230281, '讷河市'], [230207, '碾子山区'], [230224, '泰来县'], [230204, '铁锋区'], [230223, '依安县']]], [230900, '七台河', [[230921, '勃利县'], [230904, '茄子河区'], [230903, '桃山区'], [230902, '新兴区']]], [230500, '双鸭山', [[230523, '宝清县'], [230506, '宝山区'], [230502, '尖山区'], [230521, '集贤县'], [230503, '岭东区'], [230524, '饶河县'], [230505, '四方台区'], [230522, '友谊县']]], [232300, '绥化', [[232381, '安达市'], [232302, '北林区'], [232383, '海伦市'], [232322, '兰西县'], [232325, '明水县'], [232324, '庆安县'], [232323, '青冈县'], [232326, '绥棱县'], [232321, '望奎县'], [232382, '肇东市']]], [230700, '伊春', [[230706, '翠峦区'], [230713, '带岭区'], [230715, '红星区'], [230722, '嘉荫县'], [230709, '金山屯区'], [230708, '美溪区'], [230703, '南岔区'], [230716, '上甘岭区'], [230712, '汤旺河区'], [230781, '铁力市'], [230711, '乌马河区'], [230714, '乌伊岭区'], [230710, '五营区'], [230705, '西林区'], [230707, '新青区'], [230702, '伊春区'], [230704, '友好区']]]]], [410000, '河南', [[410500, '安阳', [[410522, '安阳县'], [410503, '北关区'], [410526, '滑县'], [410581, '林州市'], [410506, '龙安区'], [410527, '内黄县'], [410523, '汤阴县'], [410502, '文峰区'], [410505, '殷都区']]], [410600, '鹤壁', [[410602, '鹤山区'], [410621, '浚县'], [410611, '淇滨区'], [410622, '淇县'], [410603, '山城区']]], [410800, '焦作', [[410822, '博爱县'], [410802, '解放区'], [410804, '马村区'], [410883, '孟州市'], [410882, '沁阳市'], [410811, '山阳区'], [410825, '温县'], [410823, '武陟县'], [410821, '修武县'], [410803, '中站区']]], [412900, '济源市', []], [410200, '开封', [[410204, '鼓楼区'], [410211, '金明区'], [410225, '兰考县'], [410202, '龙亭区'], [410221, '杞县'], [410203, '顺河回族区'], [410222, '通许县'], [410223, '尉氏县'], [410205, '禹王台区']]], [411100, '漯河', [[411122, '临颍县'], [411121, '舞阳县'], [411103, '郾城区'], [411102, '源汇区'], [411104, '召陵区']]], [410300, '洛阳', [[410304, '瀍河回族区'], [410305, '涧西区'], [410306, '吉利区'], [410302, '老城区'], [410324, '栾川县'], [410311, '洛龙区'], [410328, '洛宁县'], [410322, '孟津县'], [410326, '汝阳县'], [410325, '嵩县'], [410303, '西工区'], [410323, '新安县'], [410381, '偃师市'], [410329, '伊川县'], [410327, '宜阳县']]], [411300, '南阳', [[411381, '邓州市'], [411322, '方城县'], [411321, '南召县'], [411325, '内乡县'], [411327, '社旗县'], [411328, '唐河县'], [411330, '桐柏县'], [411302, '宛城区'], [411303, '卧龙区'], [411326, '淅川县'], [411329, '新野县'], [411323, '西峡县'], [411324, '镇平县']]], [410400, '平顶山', [[410421, '宝丰县'], [410425, '郏县'], [410423, '鲁山县'], [410482, '汝州市'], [410404, '石龙区'], [410403, '卫东区'], [410481, '舞钢市'], [410402, '新华区'], [410422, '叶县'], [410411, '湛河区']]], [410900, '濮阳', [[410926, '范县'], [410902, '华龙区'], [410923, '南乐县'], [410928, '濮阳县'], [410922, '清丰县'], [410927, '台前县']]], [411200, '三门峡', [[411202, '湖滨区'], [411282, '灵宝市'], [411224, '卢氏县'], [411221, '渑池县'], [411222, '陕州区'], [411281, '义马市']]], [411400, '商丘', [[411402, '梁园区'], [411421, '民权县'], [411423, '宁陵县'], [411422, '睢县'], [411403, '睢阳区'], [411426, '夏邑县'], [411481, '永城市'], [411425, '虞城县'], [411424, '柘城县']]], [410700, '新乡', [[410728, '长垣县'], [410727, '封丘县'], [410704, '凤泉区'], [410702, '红旗区'], [410782, '辉县市'], [410724, '获嘉县'], [410711, '牧野区'], [410703, '卫滨区'], [410781, '卫辉市'], [410721, '新乡县'], [410726, '延津县'], [410725, '原阳县']]], [411500, '信阳', [[411522, '光山县'], [411525, '固始县'], [411502, '浉河区'], [411527, '淮滨县'], [411526, '潢川县'], [411521, '罗山县'], [411503, '平桥区'], [411524, '商城县'], [411523, '新县'], [411528, '息县']]], [411000, '许昌', [[411082, '长葛市'], [411002, '魏都区'], [411025, '襄城县'], [411023, '许昌县'], [411024, '鄢陵县'], [411081, '禹州市']]], [410100, '郑州', [[410185, '登封市'], [410103, '二七区'], [410181, '巩义市'], [410104, '管城回族区'], [410108, '惠济区'], [410105, '金水区'], [410106, '上街区'], [410182, '荥阳市'], [410183, '新密市'], [410184, '新郑市'], [410186, '郑东新区'], [410122, '中牟县'], [410102, '中原区']]], [412700, '周口', [[412702, '川汇区'], [412725, '郸城县'], [412721, '扶沟县'], [412726, '淮阳县'], [412728, '鹿邑县'], [412723, '商水县'], [412724, '沈丘县'], [412727, '太康县'], [412781, '项城市'], [412722, '西华县']]], [412800, '驻马店', [[412826, '泌阳县'], [412823, '平舆县'], [412825, '确山县'], [412827, '汝南县'], [412822, '上蔡县'], [412828, '遂平县'], [412829, '新蔡县'], [412821, '西平县'], [412802, '驿城区'], [412824, '正阳县']]]]], [420000, '湖北', [[422800, '恩施', [[422823, '巴东县'], [422801, '恩施市'], [422828, '鹤峰县'], [422822, '建始县'], [422827, '来凤县'], [422802, '利川市'], [422826, '咸丰县'], [422825, '宣恩县']]], [420700, '鄂州', [[420704, '鄂城区'], [420703, '华容区'], [420702, '梁子湖区']]], [421100, '黄冈', [[421122, '红安县'], [421127, '黄梅县'], [421102, '黄州区'], [421123, '罗田县'], [421181, '麻城市'], [421126, '蕲春县'], [421121, '团风县'], [421182, '武穴市'], [421125, '浠水县'], [421124, '英山县']]], [420200, '黄石', [[420281, '大冶市'], [420202, '黄石港区'], [420205, '铁山区'], [420204, '下陆区'], [420203, '西塞山区'], [420222, '阳新县']]], [420800, '荆门', [[420802, '东宝区'], [420804, '掇刀区'], [420821, '京山县'], [420822, '沙洋县'], [420881, '钟祥市']]], [421000, '荆州', [[421022, '公安县'], [421083, '洪湖市'], [421024, '江陵县'], [421023, '监利县'], [421003, '荆州区'], [421002, '沙市区'], [421081, '石首市'], [421087, '松滋市']]], [429005, '潜江', []], [429106, '神农架', []], [420300, '十堰', [[420381, '丹江口市'], [420325, '房县'], [420302, '茅箭区'], [420321, '郧阳区'], [420322, '郧西县'], [420303, '张湾区'], [420323, '竹山县'], [420324, '竹溪县']]], [429001, '随州', [[429081, '广水市'], [429082, '随县'], [429003, '曾都区']]], [429006, '天门', []], [420100, '武汉', [[420114, '蔡甸区'], [420104, '硚口区'], [420112, '东西湖区'], [420113, '汉南区'], [420105, '汉阳区'], [420111, '洪山区'], [420116, '黄陂区'], [420102, '江岸区'], [420103, '江汉区'], [420115, '江夏区'], [420107, '青山区'], [420106, '武昌区'], [420117, '新洲区']]], [420600, '襄阳', [[420626, '保康县'], [420606, '樊城区'], [420625, '谷城县'], [420682, '老河口市'], [420624, '南漳县'], [420602, '襄城区'], [420607, '襄州区'], [420684, '宜城市'], [420683, '枣阳市']]], [427000, '咸宁', [[427081, '赤壁市'], [427023, '崇阳县'], [427021, '嘉鱼县'], [427022, '通城县'], [427024, '通山县'], [427002, '咸安区']]], [429004, '仙桃', []], [420900, '孝感', [[420982, '安陆市'], [420922, '大悟县'], [420984, '汉川市'], [420921, '孝昌县'], [420902, '孝南区'], [420981, '应城市'], [420923, '云梦县']]], [420500, '宜昌', [[420528, '长阳土家族自治县'], [420582, '当阳市'], [420504, '点军区'], [420505, '猇亭区'], [420529, '五峰土家族自治县'], [420503, '伍家岗区'], [420502, '西陵区'], [420526, '兴山县'], [420581, '宜都市'], [420506, '夷陵区'], [420525, '远安县'], [420583, '枝江市'], [420527, '秭归县']]]]], [430000, '湖南', [[430700, '常德', [[430721, '安乡县'], [430703, '鼎城区'], [430722, '汉寿县'], [430781, '津市市'], [430724, '临澧县'], [430723, '澧县'], [430726, '石门县'], [430725, '桃源县'], [430702, '武陵区']]], [430100, '长沙', [[430121, '长沙县'], [430102, '芙蓉区'], [430105, '开福区'], [430181, '浏阳市'], [430124, '宁乡县'], [430103, '天心区'], [430122, '望城区'], [430104, '岳麓区'], [430111, '雨花区']]], [431000, '郴州', [[431028, '安仁县'], [431002, '北湖区'], [431027, '桂东县'], [431021, '桂阳县'], [431024, '嘉禾县'], [431025, '临武县'], [431026, '汝城县'], [431003, '苏仙区'], [431022, '宜章县'], [431023, '永兴县'], [431081, '资兴市']]], [430400, '衡阳', [[430482, '常宁市'], [430424, '衡东县'], [430422, '衡南县'], [430423, '衡山县'], [430421, '衡阳县'], [430481, '耒阳市'], [430412, '南岳区'], [430426, '祁东县'], [430407, '石鼓区'], [430406, '雁峰区'], [430408, '蒸湘区'], [430405, '珠晖区']]], [431200, '怀化', [[431223, '辰溪县'], [431202, '鹤城区'], [431281, '洪江市'], [431225, '会同县'], [431229, '靖州苗族侗族自治县'], [431226, '麻阳苗族自治县'], [431230, '通道侗族自治县'], [431227, '新晃侗族自治县'], [431224, '溆浦县'], [431222, '沅陵县'], [431228, '芷江侗族自治县'], [431221, '中方县']]], [432500, '娄底', [[432581, '冷水江市'], [432582, '涟源市'], [432502, '娄星区'], [432521, '双峰县'], [432522, '新化县']]], [430500, '邵阳', [[430511, '北塔区'], [430529, '城步苗族自治县'], [430503, '大祥区'], [430525, '洞口县'], [430524, '隆回县'], [430521, '邵东县'], [430523, '邵阳县'], [430502, '双清区'], [430527, '绥宁县'], [430581, '武冈市'], [430528, '新宁县'], [430522, '新邵县']]], [430300, '湘潭', [[430382, '韶山市'], [430321, '湘潭县'], [430381, '湘乡市'], [430304, '岳塘区'], [430302, '雨湖区']]], [433100, '湘西', [[433125, '保靖县'], [433123, '凤凰县'], [433126, '古丈县'], [433124, '花垣县'], [433101, '吉首市'], [433130, '龙山县'], [433122, '泸溪县'], [433127, '永顺县']]], [430900, '益阳', [[430923, '安化县'], [430903, '赫山区'], [430921, '南县'], [430922, '桃江县'], [430981, '沅江市'], [430902, '资阳区']]], [431100, '永州', [[431124, '道县'], [431122, '东安县'], [431129, '江华县'], [431125, '江永县'], [431127, '蓝山县'], [431103, '冷水滩区'], [431102, '零陵区'], [431126, '宁远县'], [431121, '祁阳县'], [431123, '双牌县'], [431128, '新田县']]], [430600, '岳阳', [[430623, '华容县'], [430611, '君山区'], [430682, '临湘市'], [430681, '汨罗市'], [430626, '平江县'], [430624, '湘阴县'], [430602, '岳阳楼区'], [430621, '岳阳县'], [430603, '云溪区']]], [430800, '张家界', [[430821, '慈利县'], [430822, '桑植县'], [430811, '武陵源区'], [430802, '永定区']]], [430200, '株洲', [[430224, '茶陵县'], [430202, '荷塘区'], [430281, '醴陵市'], [430203, '芦淞区'], [430204, '石峰区'], [430211, '天元区'], [430225, '炎陵县'], [430223, '攸县'], [430221, '株洲县']]]]], [320000, '江苏', [[320400, '常州', [[320482, '金坛区'], [320481, '溧阳市'], [320402, '天宁区'], [320412, '武进区'], [320411, '新北区'], [320404, '钟楼区']]], [320800, '淮安', [[320803, '淮安区'], [320829, '洪泽县'], [320804, '淮阴区'], [320831, '金湖县'], [320826, '涟水县'], [320802, '清河区'], [320811, '清浦区'], [320830, '盱眙县']]], [321500, '江阴', []], [321700, '靖江', []], [320700, '连云港', [[320722, '东海县'], [320721, '赣榆区'], [320724, '灌南县'], [320723, '灌云县'], [320706, '海州区'], [320703, '连云区']]], [320100, '南京', [[320125, '高淳区'], [320106, '鼓楼区'], [320115, '江宁区'], [320105, '建邺区'], [320124, '溧水区'], [320116, '六合区'], [320111, '浦口区'], [320104, '秦淮区'], [320113, '栖霞区'], [320102, '玄武区'], [320114, '雨花台区']]], [320600, '南通', [[320602, '崇川区'], [320611, '港闸区'], [320621, '海安县'], [320684, '海门市'], [320685, '通州区'], [320681, '启东市'], [320623, '如东县'], [320682, '如皋市']]], [321600, '沭阳', []], [321300, '宿迁', [[321322, '沭阳县'], [321324, '泗洪县'], [321323, '泗阳县'], [321302, '宿城区'], [321311, '宿豫区'], [321325, '洋河新区']]], [320500, '苏州', [[320502, '沧浪区'], [320581, '常熟'], [320586, '姑苏区'], [320505, '虎丘区'], [320583, '昆山'], [320587, '苏州高新区'], [320588, '苏州工业园区'], [320585, '太仓市'], [320584, '吴江区'], [320506, '吴中区'], [320507, '相城区'], [320582, '张家港市']]], [321200, '泰州', [[321203, '高港区'], [321202, '海陵区'], [321284, '姜堰区'], [321282, '靖江市'], [321283, '泰兴市'], [321281, '兴化市']]], [320200, '无锡', [[320204, '北塘区'], [320211, '滨湖区'], [320202, '崇安区'], [320286, '姑苏县'], [320206, '惠山区'], [320281, '江阴市'], [320203, '南长区'], [320205, '锡山区'], [320282, '宜兴市']]], [320300, '徐州', [[320321, '丰县'], [320302, '鼓楼区'], [320305, '贾汪区'], [320322, '沛县'], [320382, '邳州市'], [320311, '泉山区'], [320324, '睢宁县'], [320323, '铜山区'], [320381, '新沂市'], [320303, '云龙区']]], [320900, '盐城', [[320922, '滨海县'], [320982, '大丰区'], [320981, '东台市'], [320923, '阜宁县'], [320925, '建湖县'], [320924, '射阳县'], [320902, '亭湖区'], [320921, '响水县'], [320903, '盐都区']]], [321000, '扬州', [[321023, '宝应县'], [321084, '高邮市'], [321002, '广陵区'], [321088, '江都区'], [321081, '仪征市'], [321003, '邗江区']]], [321400, '张家港', []], [321100, '镇江', [[321112, '丹徒区'], [321181, '丹阳市'], [321102, '京口区'], [321183, '句容市'], [321111, '润州区'], [321182, '扬中市']]]]], [360000, '江西', [[362500, '抚州', [[362524, '崇仁县'], [362529, '东乡县'], [362530, '广昌县'], [362527, '金溪县'], [362525, '乐安县'], [362522, '黎川县'], [362502, '临川区'], [362521, '南城县'], [362523, '南丰县'], [362526, '宜黄县'], [362528, '资溪县']]], [360700, '赣州', [[360726, '安远县'], [360725, '崇义县'], [360723, '大余县'], [360728, '定南县'], [360721, '赣县'], [360783, '赣州开发区'], [360733, '会昌县'], [360727, '龙南县'], [360782, '南康区'], [360730, '宁都县'], [360729, '全南县'], [360781, '瑞金市'], [360724, '上犹县'], [360735, '石城县'], [360722, '信丰县'], [360732, '兴国县'], [360734, '寻乌县'], [360731, '于都县'], [360702, '章贡区']]], [362400, '吉安', [[362429, '安福县'], [362421, '吉安县'], [362481, '井冈山市'], [362422, '吉水县'], [362402, '吉州区'], [362403, '青原区'], [362427, '遂川县'], [362426, '泰和县'], [362428, '万安县'], [362423, '峡江县'], [362424, '新干县'], [362425, '永丰县'], [362430, '永新县']]], [360200, '景德镇', [[360202, '昌江区'], [360222, '浮梁县'], [360281, '乐平市'], [360203, '珠山区']]], [360400, '九江', [[360426, '德安县'], [360428, '都昌县'], [360429, '湖口县'], [360421, '九江县'], [360402, '庐山区'], [360430, '彭泽县'], [360481, '瑞昌市'], [360423, '武宁县'], [360427, '星子县'], [360424, '修水县'], [360403, '浔阳区'], [360425, '永修县']]], [360100, '南昌', [[360123, '安义县'], [360102, '东湖区'], [360125, '经济技术开发区'], [360124, '进贤县'], [360121, '南昌县'], [360111, '青山湖区'], [360104, '青云谱区'], [360105, '湾里区'], [360103, '西湖地区'], [360122, '新建区']]], [360300, '萍乡', [[360302, '安源区'], [360321, '莲花县'], [360323, '芦溪县'], [360322, '上栗县'], [360313, '湘东区']]], [362300, '上饶', [[362381, '德兴市'], [362322, '广丰区'], [362325, '横峰县'], [362328, '鄱阳县'], [362324, '铅山县'], [362321, '上饶县'], [362329, '万年县'], [362330, '婺源县'], [362302, '信州区'], [362326, '弋阳县'], [362327, '余干县'], [362323, '玉山县']]], [360500, '新余', [[360521, '分宜县'], [360502, '渝水区']]], [362200, '宜春', [[362281, '丰城市'], [362221, '奉新县'], [362283, '高安市'], [362225, '靖安县'], [362223, '上高县'], [362226, '铜鼓县'], [362222, '万载县'], [362224, '宜丰县'], [362202, '袁州区'], [362282, '樟树市']]], [360600, '鹰潭', [[360681, '贵溪市'], [360602, '月湖区'], [360622, '余江县']]]]], [220000, '吉林', [[220800, '白城', [[220882, '大安市'], [220802, '洮北区'], [220881, '洮南市'], [220822, '通榆县'], [220821, '镇赉县']]], [220600, '白山', [[220602, '浑江区'], [220623, '长白朝鲜族自治县'], [220621, '抚松县'], [220605, '江源区'], [220622, '靖宇县'], [220681, '临江市']]], [220100, '长春', [[220104, '朝阳区'], [220183, '德惠市'], [220105, '二道区'], [220181, '九台区'], [220103, '宽城区'], [220106, '绿园区'], [220102, '南关区'], [220122, '农安县'], [220112, '双阳区'], [220182, '榆树市']]], [222600, '吉林市', [[222601, '昌邑区'], [222602, '船营区'], [222605, '丰满区'], [222608, '桦甸市'], [222607, '蛟河市'], [222604, '龙潭区'], [222609, '磐石市'], [222603, '舒兰'], [222606, '永吉县']]], [220400, '辽源', [[220421, '东丰县'], [220422, '东辽县'], [220402, '龙山区'], [220403, '西安区']]], [220300, '四平', [[220381, '公主岭市'], [220322, '梨树县'], [220382, '双辽市'], [220303, '铁东区'], [220302, '铁西区'], [220323, '伊通满族自治县']]], [220700, '松原', [[220722, '长岭县'], [220724, '扶余市'], [220702, '宁江区'], [220723, '乾安县'], [220721, '前郭尔罗斯蒙古族自治县']]], [220500, '通化', [[220502, '东昌区'], [220503, '二道江区'], [220523, '辉南县'], [220582, '集安市'], [220524, '柳河县'], [220581, '梅河口市'], [220521, '通化县']]], [222400, '延边', [[222426, '安图县'], [222403, '敦化市'], [222406, '和龙市'], [222404, '珲春市'], [222405, '龙井市'], [222402, '图们市'], [222424, '汪清县'], [222401, '延吉市']]]]], [210000, '辽宁', [[210300, '鞍山', [[210381, '海城市'], [210304, '立山区'], [210311, '千山区'], [210321, '台安县'], [210302, '铁东区'], [210303, '铁西区'], [210323, '岫岩满族自治县']]], [210500, '本溪', [[210521, '本溪满族自治县'], [210522, '桓仁满族自治县'], [210504, '明山区'], [210505, '南芬区'], [210502, '平山区'], [210503, '溪湖区']]], [211300, '朝阳', [[211381, '北票市'], [211321, '朝阳县'], [211322, '建平县'], [211324, '喀喇沁左翼蒙古族自治县'], [211382, '凌源市'], [211303, '龙城区'], [211302, '双塔区']]], [210200, '大连', [[210224, '长海县'], [210211, '甘井子区'], [210213, '金州区'], [210212, '旅顺口区'], [210282, '普兰店区'], [210204, '沙河口区'], [210281, '瓦房店市'], [210203, '西岗区'], [210202, '中山区'], [210283, '庄河市']]], [210600, '丹东', [[210681, '东港市'], [210682, '凤城市'], [210624, '宽甸满族自治县'], [210602, '元宝区'], [210604, '振安区'], [210603, '振兴区']]], [210400, '抚顺', [[210403, '东洲区'], [210421, '抚顺县'], [210423, '清原满族自治县'], [210411, '顺城区'], [210404, '望花区'], [210422, '新宾满族自治县'], [210402, '新抚区']]], [210900, '阜新', [[210921, '阜新蒙古族自治县'], [210902, '海州区'], [210905, '清河门区'], [210904, '太平区'], [210911, '细河区'], [210903, '新邱区'], [210922, '彰武县']]], [211400, '葫芦岛', [[211422, '建昌县'], [211402, '连山区'], [211403, '龙港区'], [211404, '南票区'], [211421, '绥中县'], [211481, '兴城市']]], [210700, '锦州', [[210782, '北镇市'], [210702, '古塔区'], [210726, '黑山县'], [210781, '凌海市'], [210703, '凌河区'], [210711, '太和区'], [210727, '义县']]], [211000, '辽阳', [[211002, '白塔区'], [211081, '灯塔市'], [211005, '弓长岭区'], [211004, '宏伟区'], [211021, '辽阳县'], [211011, '太子河区'], [211003, '文圣区']]], [211100, '盘锦', [[211121, '大洼县'], [211122, '盘山县'], [211102, '双台子区'], [211103, '兴隆台区']]], [210100, '沈阳', [[210104, '大东区'], [210112, '浑南区'], [210124, '法库县'], [210102, '和平区'], [210105, '皇姑区'], [210123, '康平县'], [210122, '辽中县'], [210113, '沈北新区'], [210103, '沈河区'], [210111, '苏家屯区'], [210106, '铁西区'], [210181, '新民市'], [210114, '于洪区']]], [211200, '铁岭', [[211224, '昌图县'], [211281, '调兵山市'], [211282, '开原市'], [211204, '清河区'], [211221, '铁岭县'], [211223, '西丰县'], [211202, '银州区']]], [210800, '营口', [[210804, '鲅鱼圈区'], [210882, '大石桥市'], [210881, '盖州市'], [210811, '老边区'], [210803, '西市区'], [210802, '站前区']]]]], [150000, '内蒙古', [[152900, '阿拉善盟', [[152922, '阿拉善右旗'], [152921, '阿拉善左旗'], [152923, '额济纳旗']]], [150200, '包头', [[150206, '白云鄂博矿区'], [150223, '达尔罕茂明安联合旗'], [150202, '东河区'], [150222, '固阳县'], [150207, '九原区'], [150203, '昆都仑区'], [150204, '青山区'], [150205, '石拐区'], [150221, '土默特右旗']]], [152800, '巴彦淖尔市', [[152822, '磴口县'], [152826, '杭锦后旗'], [152802, '临河区'], [152825, '乌拉特后旗'], [152823, '乌拉特前旗'], [152824, '乌拉特中旗'], [152821, '五原县']]], [150400, '赤峰', [[150421, '阿鲁科尔沁旗'], [150430, '敖汉旗'], [150423, '巴林右旗'], [150422, '巴林左旗'], [150402, '红山区'], [150428, '喀喇沁旗'], [150425, '克什克腾旗'], [150424, '林西县'], [150429, '宁城县'], [150404, '松山区'], [150426, '翁牛特旗'], [150403, '元宝山区']]], [152700, '鄂尔多斯', [[152721, '达拉特旗'], [152702, '东胜区'], [152724, '鄂托克旗'], [152723, '鄂托克前旗'], [152725, '杭锦旗'], [152726, '乌审旗'], [152727, '伊金霍洛旗'], [152722, '准格尔旗']]], [150100, '呼和浩特', [[150123, '和林格尔县'], [150103, '回民区'], [150124, '清水河县'], [150105, '赛罕区'], [150121, '土默特左旗'], [150122, '托克托县'], [150125, '武川县'], [150102, '新城区'], [150104, '玉泉区']]], [152100, '呼伦贝尔市', [[152121, '阿荣旗'], [152125, '陈巴尔虎旗'], [152184, '额尔古纳市'], [152123, '鄂伦春自治旗'], [152124, '鄂温克族自治旗'], [152185, '根河市'], [152102, '海拉尔区'], [152181, '满洲里市'], [152122, '莫力达瓦达斡尔族自治旗'], [152127, '新巴尔虎右旗'], [152126, '新巴尔虎左旗'], [152182, '牙克石市'], [152183, '扎兰屯市'], [152186, '扎赉诺尔区']]], [153000, '通辽', [[153081, '霍林郭勒市'], [153023, '开鲁县'], [153002, '科尔沁区'], [153022, '科尔沁左翼后旗'], [153021, '科尔沁左翼中旗'], [153024, '库伦旗'], [153025, '奈曼旗'], [153026, '扎鲁特旗']]], [150300, '乌海', [[150302, '海勃湾区'], [150303, '海南区'], [150304, '乌达区']]], [152600, '乌兰察布市', [[152628, '察哈尔右翼后旗'], [152626, '察哈尔右翼前旗'], [152627, '察哈尔右翼中旗'], [152681, '丰镇市'], [152622, '化德县'], [152602, '集宁区'], [152625, '凉城县'], [152623, '商都县'], [152629, '四子王旗'], [152624, '兴和县'], [152621, '卓资县']]], [152500, '锡林郭勒盟', [[152522, '阿巴嘎旗'], [152525, '东乌珠穆沁旗'], [152531, '多伦县'], [152501, '二连浩特市'], [152524, '苏尼特右旗'], [152523, '苏尼特左旗'], [152527, '太仆寺旗'], [152528, '镶黄旗'], [152502, '锡林浩特市'], [152526, '西乌珠穆沁旗'], [152530, '正蓝旗'], [152529, '正镶白旗']]], [152200, '兴安盟', [[152202, '阿尔山市'], [152221, '科尔沁右翼前旗'], [152222, '科尔沁右翼中旗'], [152224, '突泉县'], [152201, '乌兰浩特市'], [152223, '扎赉特旗']]]]], [640000, '宁夏', [[642200, '固原', [[642224, '泾源县'], [642223, '隆德县'], [642225, '彭阳县'], [642222, '西吉县'], [642202, '原州区']]], [640200, '石嘴山', [[640202, '大武口区'], [640205, '惠农区'], [640221, '平罗县']]], [640300, '吴忠', [[640303, '红寺堡区'], [640302, '利通区'], [640381, '青铜峡市'], [640324, '同心县'], [640323, '盐池县']]], [640100, '银川', [[640122, '贺兰县'], [640106, '金凤区'], [640181, '灵武市'], [640104, '兴庆区'], [640105, '西夏区'], [640121, '永宁县']]], [640500, '中卫市', [[640522, '海原县'], [640502, '沙坡头区'], [640521, '中宁县']]]]], [630000, '青海', [[632600, '果洛', [[632622, '班玛县'], [632624, '达日县'], [632623, '甘德县'], [632625, '久治县'], [632626, '玛多县'], [632621, '玛沁县']]], [632200, '海北', [[632224, '刚察县'], [632223, '海晏县'], [632221, '门源回族自治县'], [632222, '祁连县']]], [632100, '海东市', [[632127, '化隆回族自治县'], [632126, '互助土族自治县'], [632123, '乐都区'], [632122, '民和回族土族自治县'], [632121, '平安区'], [632128, '循化撒拉族自治县']]], [632500, '海南州', [[632521, '共和县'], [632523, '贵德县'], [632525, '贵南县'], [632522, '同德县'], [632524, '兴海县']]], [632800, '海西', [[632802, '德令哈市'], [632822, '都兰县'], [632801, '格尔木市'], [632823, '天峻县'], [632821, '乌兰县']]], [632300, '黄南', [[632324, '河南蒙古族自治县'], [632322, '尖扎县'], [632321, '同仁县'], [632323, '泽库县']]], [630100, '西宁', [[630105, '城北区'], [630102, '城东区'], [630104, '城西区'], [630103, '城中区'], [630121, '大通回族土族自治县'], [630123, '湟源县'], [630122, '湟中县']]], [632700, '玉树', [[632723, '称多县'], [632725, '囊谦县'], [632726, '曲麻莱县'], [632721, '玉树市'], [632722, '杂多县'], [632724, '治多县']]]]], [370000, '山东', [[372300, '滨州', [[372302, '滨城区'], [372325, '博兴县'], [372321, '惠民县'], [372323, '无棣县'], [372322, '阳信县'], [372324, '沾化区'], [372326, '邹平县']]], [371400, '德州', [[371402, '德城区'], [371481, '乐陵市'], [371421, '陵城区'], [371424, '临邑县'], [371422, '宁津县'], [371426, '平原县'], [371425, '齐河县'], [371423, '庆云县'], [371428, '武城县'], [371427, '夏津县'], [371482, '禹城市']]], [370500, '东营', [[370502, '东营区'], [370523, '广饶县'], [370503, '河口区'], [370521, '垦利县'], [370522, '利津县']]], [372900, '菏泽', [[372921, '曹县'], [372923, '成武县'], [372922, '单县'], [372927, '定陶县'], [372928, '东明县'], [372926, '鄄城县'], [372924, '巨野县'], [372902, '牡丹区'], [372925, '郓城县']]], [373000, '即墨', []], [370100, '济南', [[370113, '长清区'], [370104, '槐荫区'], [370125, '济阳县'], [370112, '历城区'], [370102, '历下区'], [370124, '平阴县'], [370126, '商河县'], [370103, '市中区'], [370105, '天桥区'], [370181, '章丘市']]], [370800, '济宁', [[370829, '嘉祥县'], [370828, '金乡县'], [370832, '梁山县'], [370881, '曲阜市'], [370811, '任城区'], [370831, '泗水县'], [370826, '微山县'], [370830, '汶上县'], [370882, '兖州区'], [370827, '鱼台县'], [370883, '邹城市']]], [371200, '莱芜', [[371203, '钢城区'], [371202, '莱城区']]], [371500, '聊城', [[371523, '茌平县'], [371524, '东阿县'], [371502, '东昌府区'], [371526, '高唐县'], [371525, '冠县'], [371581, '临清市'], [371522, '莘县'], [371521, '阳谷县']]], [371300, '临沂', [[371324, '兰陵县'], [371325, '费县'], [371312, '河东区'], [371327, '莒南县'], [371302, '兰山区'], [371329, '临沭县'], [371311, '罗庄区'], [371328, '蒙阴县'], [371326, '平邑县'], [371322, '郯城县'], [371321, '沂南县'], [371323, '沂水县']]], [370200, '青岛', [[370214, '城阳区'], [370211, '黄岛区'], [370281, '胶州'], [370282, '即墨市'], [370285, '莱西市'], [370212, '崂山区'], [370213, '李沧区'], [370283, '平度市'], [370203, '市北区'], [370202, '市南区']]], [371100, '日照', [[371102, '东港区'], [371122, '莒县'], [371103, '岚山区'], [371121, '五莲县']]], [370900, '泰安', [[370911, '岱岳区'], [370923, '东平县'], [370983, '肥城市'], [370921, '宁阳县'], [370902, '泰山区'], [370982, '新泰市']]], [370700, '潍坊', [[370784, '安丘市'], [370725, '昌乐县'], [370786, '昌邑市'], [370704, '坊子区'], [370785, '高密市'], [370703, '寒亭区'], [370705, '奎文区'], [370724, '临朐县'], [370781, '青州市'], [370783, '寿光市'], [370702, '潍城区'], [370782, '诸城市']]], [371000, '威海', [[371002, '环翠区'], [371082, '荣成市'], [371083, '乳山市'], [371081, '文登区']]], [370600, '烟台', [[370634, '长岛县'], [370611, '福山区'], [370687, '海阳市'], [370613, '莱山区'], [370682, '莱阳市'], [370683, '莱州市'], [370681, '龙口市'], [370612, '牟平区'], [370684, '蓬莱市'], [370686, '栖霞市'], [370685, '招远市'], [370602, '芝罘区']]], [370400, '枣庄', [[370406, '山亭区'], [370402, '市中区'], [370405, '台儿庄区'], [370481, '滕州'], [370403, '薛城区'], [370404, '峄城区']]], [370300, '淄博', [[370304, '博山区'], [370322, '高青县'], [370321, '桓台县'], [370305, '临淄区'], [370323, '沂源县'], [370303, '张店区'], [370306, '周村区'], [370302, '淄川区']]]]], [310000, '上海', [[310113, '宝山区', []], [310105, '长宁区', []], [310230, '崇明县', []], [310226, '奉贤区', []], [310109, '虹口区', []], [310101, '黄浦区', []], [310114, '嘉定区', []], [310106, '静安区', []], [310116, '金山区', []], [310103, '卢湾区', []], [310112, '闵行区', []], [310225, '南汇区', []], [310115, '浦东新区', []], [310107, '普陀区', []], [310229, '青浦区', []], [310102, '市南区', []], [310117, '松江区', []], [310104, '徐汇区', []], [310110, '杨浦区', []], [310108, '闸北区', []]]], [140000, '山西', [[140400, '长治', [[140421, '长治县'], [140428, '长子县'], [140402, '城区'], [140427, '壶关县'], [140411, '郊区'], [140426, '黎城县'], [140481, '潞城市'], [140425, '平顺县'], [140430, '沁县'], [140431, '沁源县'], [140424, '屯留县'], [140429, '武乡县'], [140423, '襄垣县']]], [140200, '大同', [[140202, '城区'], [140227, '大同县'], [140223, '广灵县'], [140225, '浑源县'], [140203, '矿区'], [140224, '灵丘县'], [140211, '南郊区'], [140222, '天镇县'], [140212, '新荣区'], [140221, '阳高县'], [140226, '左云县']]], [140500, '晋城', [[140502, '城区'], [140581, '高平市'], [140524, '陵川县'], [140521, '沁水县'], [140522, '阳城县'], [140525, '泽州县']]], [142400, '晋中', [[142423, '和顺县'], [142481, '介休市'], [142429, '灵石县'], [142428, '平遥县'], [142427, '祁县'], [142425, '寿阳县'], [142426, '太谷县'], [142424, '昔阳县'], [142402, '榆次区'], [142421, '榆社县'], [142422, '左权县']]], [142600, '临汾', [[142626, '安泽县'], [142630, '大宁县'], [142634, '汾西县'], [142627, '浮山县'], [142625, '古县'], [142624, '洪洞县'], [142681, '侯马市'], [142682, '霍州市'], [142628, '吉县'], [142633, '蒲县'], [142621, '曲沃县'], [142623, '襄汾县'], [142629, '乡宁县'], [142631, '隰县'], [142602, '尧都区'], [142622, '翼城县'], [142632, '永和县']]], [142900, '吕梁', [[142928, '方山县'], [142982, '汾阳市'], [142922, '交城县'], [142930, '交口县'], [142927, '岚县'], [142924, '临县'], [142902, '离石区'], [142925, '柳林县'], [142926, '石楼县'], [142921, '文水县'], [142981, '孝义市'], [142923, '兴县'], [142929, '中阳县']]], [140600, '朔州', [[140624, '怀仁县'], [140603, '平鲁区'], [140621, '山阴县'], [140602, '朔城区'], [140622, '应县'], [140623, '右玉县']]], [140100, '太原', [[140181, '古交市'], [140108, '尖草坪区'], [140110, '晋源区'], [140123, '娄烦县'], [140121, '清徐县'], [140109, '万柏林区'], [140105, '小店区'], [140107, '杏花岭区'], [140122, '阳曲县'], [140106, '迎泽区']]], [142200, '忻州', [[142231, '保德县'], [142223, '代县'], [142221, '定襄县'], [142224, '繁峙县'], [142230, '河曲县'], [142226, '静乐县'], [142229, '岢岚县'], [142225, '宁武县'], [142232, '偏关县'], [142227, '神池县'], [142222, '五台县'], [142228, '五寨县'], [142202, '忻府区'], [142281, '原平市']]], [140300, '阳泉', [[140302, '城区'], [140311, '郊区'], [140303, '矿区'], [140321, '平定县'], [140322, '盂县']]], [142700, '运城', [[142782, '河津市'], [142726, '绛县'], [142724, '稷山县'], [142721, '临猗县'], [142729, '平陆县'], [142730, '芮城县'], [142722, '万荣县'], [142723, '闻喜县'], [142728, '夏县'], [142725, '新绛县'], [142702, '盐湖区'], [142781, '永济市'], [142727, '垣曲县']]]]], [610000, '陕西', [[612400, '安康', [[612429, '白河县'], [612402, '汉滨区'], [612421, '汉阴县'], [612425, '岚皋县'], [612423, '宁陕县'], [612426, '平利县'], [612422, '石泉县'], [612428, '旬阳县'], [612427, '镇坪县'], [612424, '紫阳县']]], [610300, '宝鸡', [[610304, '陈仓区'], [610330, '凤县'], [610322, '凤翔县'], [610324, '扶风县'], [610303, '金台区'], [610329, '麟游县'], [610327, '陇县'], [610326, '眉县'], [610328, '千阳县'], [610323, '岐山县'], [610331, '太白县'], [610302, '渭滨区']]], [610700, '汉中', [[610722, '城固县'], [610730, '佛坪县'], [610702, '汉台区'], [610729, '留坝县'], [610727, '略阳县'], [610725, '勉县'], [610721, '南郑县'], [610726, '宁强县'], [610724, '西乡县'], [610723, '洋县'], [610728, '镇巴县']]], [612500, '商洛', [[612522, '丹凤县'], [612521, '洛南县'], [612523, '商南县'], [612502, '商州区'], [612524, '山阳县'], [612526, '柞水县'], [612525, '镇安县']]], [610200, '铜川', [[610202, '王益区'], [610204, '耀州区'], [610222, '宜君县'], [610203, '印台区']]], [610500, '渭南', [[610527, '白水县'], [610525, '澄城县'], [610523, '大荔县'], [610528, '富平县'], [610581, '韩城市'], [610524, '合阳县'], [610521, '华州区'], [610582, '华阴市'], [610502, '临渭区'], [610526, '蒲城县'], [610522, '潼关县']]], [610100, '西安', [[610111, '灞桥区'], [610103, '碑林区'], [610116, '长安区'], [610126, '高陵区'], [610125, '户县'], [610122, '蓝田县'], [610104, '莲湖区'], [610115, '临潼区'], [610112, '未央区'], [610102, '新城区'], [610114, '阎良区'], [610113, '雁塔区'], [610124, '周至县']]], [610400, '咸阳', [[610427, '彬县'], [610428, '长武县'], [610430, '淳化县'], [610423, '泾阳县'], [610425, '礼泉县'], [610424, '乾县'], [610402, '秦都区'], [610422, '三原县'], [610404, '渭城区'], [610431, '武功县'], [610481, '兴平市'], [610429, '旬邑县'], [610403, '杨陵区'], [610426, '永寿县']]], [610600, '延安', [[610624, '安塞县'], [610602, '宝塔区'], [610628, '富县'], [610627, '甘泉县'], [610632, '黄陵县'], [610631, '黄龙县'], [610629, '洛川县'], [610626, '吴起县'], [610621, '延长县'], [610622, '延川县'], [610630, '宜川县'], [610625, '志丹县'], [610623, '子长县']]], [612700, '榆林', [[612725, '定边县'], [612722, '府谷县'], [612723, '横山区'], [612728, '佳县'], [612724, '靖边县'], [612727, '米脂县'], [612730, '清涧县'], [612721, '神木县'], [612726, '绥德县'], [612729, '吴堡县'], [612702, '榆阳区'], [612731, '子洲县']]]]], [510000, '四川', [[513200, '阿坝', [[513231, '阿坝县'], [513228, '黑水县'], [513233, '红原县'], [513226, '金川县'], [513225, '九寨沟县'], [513222, '理县'], [513229, '马尔康市'], [513223, '茂县'], [513230, '壤塘县'], [513232, '若尔盖县'], [513224, '松潘县'], [513221, '汶川县'], [513227, '小金县']]], [513700, '巴中', [[513702, '巴州区'], [513724, '恩阳区'], [513722, '南江县'], [513723, '平昌县'], [513721, '通江县']]], [510100, '成都', [[510108, '成华区'], [510184, '崇州市'], [510129, '大邑县'], [510181, '都江堰市'], [510185, '高新区'], [510104, '锦江区'], [510106, '金牛区'], [510121, '金堂县'], [510112, '龙泉驿区'], [510182, '彭州市'], [510124, '郫县'], [510131, '蒲江县'], [510113, '青白江区'], [510105, '青羊区'], [510183, '邛崃市'], [510122, '双流区'], [510115, '温江区'], [510107, '武侯区'], [510114, '新都区'], [510132, '新津县']]], [513000, '达州', [[513021, '达川区'], [513024, '大竹县'], [513023, '开江县'], [513025, '渠县'], [513002, '通川区'], [513081, '万源市'], [513022, '宣汉县']]], [510600, '德阳', [[510681, '广汉市'], [510603, '旌阳区'], [510626, '罗江县'], [510683, '绵竹市'], [510682, '什邡市'], [510623, '中江县']]], [513300, '甘孜', [[513331, '白玉县'], [513335, '巴塘县'], [513323, '丹巴县'], [513337, '稻城县'], [513326, '道孚县'], [513330, '德格县'], [513338, '得荣县'], [513328, '甘孜县'], [513324, '九龙县'], [513321, '康定市'], [513334, '理塘县'], [513322, '泸定县'], [513327, '炉霍县'], [513333, '色达县'], [513332, '石渠县'], [513336, '乡城县'], [513329, '新龙县'], [513325, '雅江县']]], [511600, '广安', [[511602, '广安区'], [511681, '华蓥市'], [511623, '邻水县'], [511682, '前锋区'], [511622, '武胜县'], [511621, '岳池县']]], [510800, '广元', [[510824, '苍溪县'], [510812, '朝天区'], [510823, '剑阁县'], [510802, '利州区'], [510822, '青川县'], [510821, '旺苍县'], [510811, '昭化区']]], [511100, '乐山', [[511132, '峨边彝族自治县'], [511181, '峨眉山市'], [511126, '夹江县'], [511124, '井研县'], [511113, '金口河区'], [511133, '马边彝族自治县'], [511129, '沐川县'], [511123, '犍为县'], [511111, '沙湾区'], [511102, '市中区'], [511112, '五通桥区']]], [513400, '凉山', [[513429, '布拖县'], [513424, '德昌县'], [513435, '甘洛县'], [513426, '会东县'], [513425, '会理县'], [513430, '金阳县'], [513437, '雷波县'], [513436, '美姑县'], [513433, '冕宁县'], [513422, '木里藏族自治县'], [513427, '宁南县'], [513428, '普格县'], [513401, '西昌市'], [513432, '喜德县'], [513423, '盐源县'], [513434, '越西县'], [513431, '昭觉县']]], [510500, '泸州', [[510525, '古蔺县'], [510522, '合江县'], [510502, '江阳区'], [510504, '龙马潭区'], [510521, '泸县'], [510503, '纳溪区'], [510524, '叙永县']]], [513800, '眉山', [[513806, '丹棱县'], [513801, '东坡区'], [513805, '洪雅县'], [513803, '彭山县'], [513807, '青神县'], [513802, '仁寿县']]], [510700, '绵阳', [[510724, '安县'], [510726, '北川羌族自治县'], [510703, '涪城区'], [510781, '江油市'], [510727, '平武县'], [510722, '三台县'], [510723, '盐亭县'], [510704, '游仙区'], [510725, '梓潼县']]], [511300, '南充', [[511303, '高坪区'], [511304, '嘉陵区'], [511381, '阆中市'], [511321, '南部县'], [511323, '蓬安县'], [511302, '顺庆区'], [511325, '西充县'], [511324, '仪陇县'], [511322, '营山县']]], [511000, '内江', [[511011, '东兴区'], [511028, '隆昌县'], [511002, '市中区'], [511024, '威远县'], [511025, '资中县']]], [510400, '攀枝花', [[510402, '东区'], [510421, '米易县'], [510411, '仁和区'], [510403, '西区'], [510422, '盐边县']]], [510900, '遂宁', [[510904, '安居区'], [510903, '船山区'], [510923, '大英县'], [510921, '蓬溪县'], [510922, '射洪县']]], [513100, '雅安', [[513127, '宝兴县'], [513123, '汉源县'], [513126, '芦山县'], [513121, '名山区'], [513124, '石棉县'], [513125, '天全县'], [513122, '荥经县'], [513102, '雨城区']]], [511500, '宜宾', [[511524, '长宁县'], [511502, '翠屏区'], [511525, '高县'], [511526, '珙县'], [511523, '江安县'], [511527, '筠连县'], [511522, '南溪区'], [511529, '屏山县'], [511528, '兴文县'], [511521, '宜宾县']]], [510300, '自贡', [[510304, '大安区'], [510322, '富顺县'], [510303, '贡井区'], [510321, '荣县'], [510311, '沿滩区'], [510302, '自流井区']]], [513900, '资阳', [[513921, '安岳县'], [513981, '简阳市'], [513922, '乐至县'], [513902, '雁江区']]]]], [830000, '台湾', [[830110, '高雄', []], [830100, '台北', []], [830140, '台南市', []], [830130, '台中市', []], [830120, '新北市', []]]], [120000, '天津', [[120224, '宝坻区', []], [120113, '北辰区', []], [120110, '东丽区', []], [120321, '滨海新区', []], [120105, '河北区', []], [120102, '河东区', []], [120101, '和平区', []], [120103, '河西区', []], [120106, '红桥区', []], [120223, '静海区', []], [120112, '津南区', []], [120225, '蓟县', []], [120104, '南开区', []], [120221, '宁河区', []], [120222, '武清区', []], [120111, '西青区', []]]], [840000, '香港', [[840110, '九龙', []], [840100, '香港岛', []], [840120, '新界', []]]], [540000, '西藏', [[542500, '阿里', [[542527, '措勤县'], [542523, '噶尔县'], [542526, '改则县'], [542525, '革吉县'], [542521, '普兰县'], [542524, '日土县'], [542522, '札达县']]], [542100, '昌都', [[542127, '八宿县'], [542133, '边坝县'], [542126, '察雅县'], [542125, '丁青县'], [542123, '贡觉县'], [542122, '江达县'], [542124, '类乌齐县'], [542132, '洛隆县'], [542129, '芒康县'], [542128, '左贡县']]], [540100, '拉萨', [[540102, '城关区'], [540122, '当雄县'], [540126, '达孜县'], [540125, '堆龙德庆区'], [540121, '林周县'], [540127, '墨竹工卡县'], [540123, '尼木县'], [540124, '曲水县']]], [542600, '林芝', [[542625, '波密县'], [542626, '察隅县'], [542622, '工布江达县'], [542627, '朗县'], [542621, '林芝县'], [542623, '米林县'], [542624, '墨脱县']]], [542400, '那曲', [[542425, '安多县'], [542428, '班戈县'], [542429, '巴青县'], [542423, '比如县'], [542422, '嘉黎县'], [542421, '那曲县'], [542424, '聂荣县'], [542430, '尼玛县'], [542426, '申扎县'], [542431, '双湖县'], [542427, '索县']]], [542300, '日喀则市', [[542327, '昂仁县'], [542329, '白朗县'], [542332, '定结县'], [542324, '定日县'], [542338, '岗巴县'], [542323, '江孜县'], [542335, '吉隆县'], [542331, '康马县'], [542326, '拉孜县'], [542322, '南木林县'], [542336, '聂拉木县'], [542330, '仁布县'], [542301, '桑珠孜区'], [542337, '萨嘎县'], [542325, '萨迦县'], [542328, '谢通门县'], [542334, '亚东县'], [542333, '仲巴县']]], [542200, '山南', [[542227, '措美县'], [542232, '错那县'], [542223, '贡嘎县'], [542229, '加查县'], [542233, '浪卡子县'], [542231, '隆子县'], [542228, '洛扎县'], [542221, '乃东县'], [542225, '琼结县'], [542226, '曲松县'], [542224, '桑日县'], [542222, '扎囊县']]]]], [650000, '新疆', [[652900, '阿克苏', [[652901, '阿克苏市'], [652928, '阿瓦提县'], [652926, '拜城县'], [652929, '柯坪县'], [652923, '库车县'], [652924, '沙雅县'], [652922, '温宿县'], [652927, '乌什县'], [652925, '新和县']]], [659401, '阿拉尔', []], [654300, '阿勒泰', [[654301, '阿勒泰市'], [654321, '布尔津县'], [654323, '福海县'], [654322, '富蕴县'], [654324, '哈巴河县'], [654326, '吉木乃县'], [654325, '青河县']]], [652800, '巴音郭楞', [[652829, '博湖县'], [652827, '和静县'], [652828, '和硕县'], [652801, '库尔勒市'], [652822, '轮台县'], [652825, '且末县'], [652824, '若羌县'], [652823, '尉犁县'], [652826, '焉耆回族自治县']]], [659101, '北屯', []], [652700, '博尔塔拉', [[652724, '阿拉山口市'], [652701, '博乐市'], [652722, '精河县'], [652723, '温泉县']]], [652300, '昌吉', [[652301, '昌吉市'], [652302, '阜康市'], [652323, '呼图壁县'], [652327, '吉木萨尔县'], [652324, '玛纳斯县'], [652328, '木垒哈萨克自治县'], [652325, '奇台县']]], [652200, '哈密', [[652222, '巴里坤哈萨克自治县'], [652201, '哈密市'], [652223, '伊吾县']]], [653200, '和田', [[653225, '策勒县'], [653228, '和田市'], [653221, '和田县'], [653224, '洛浦县'], [653227, '民丰县'], [653222, '墨玉县'], [653223, '皮山县'], [653226, '于田县']]], [653100, '喀什', [[653130, '巴楚县'], [653101, '喀什市'], [653127, '麦盖提县'], [653129, '伽师县'], [653125, '莎车县'], [653121, '疏附县'], [653122, '疏勒县'], [653131, '塔什库尔干塔吉克自治县'], [653126, '叶城县'], [653123, '英吉沙县'], [653128, '岳普湖县'], [653124, '泽普县']]], [650200, '克拉玛依', [[650204, '白碱滩区'], [650202, '独山子区'], [650203, '克拉玛依区'], [650205, '乌尔禾区']]], [653000, '克孜勒苏柯尔克孜', [[653023, '阿合奇县'], [653022, '阿克陶县'], [653001, '阿图什市'], [653024, '乌恰县']]], [659001, '石河子', []], [659301, '双河', []], [654200, '塔城', [[654221, '额敏县'], [654226, '和布克赛尔蒙古自治县'], [654223, '沙湾县'], [654201, '塔城市'], [654224, '托里县'], [654202, '乌苏市'], [654225, '裕民县']]], [659201, '铁门关', []], [652100, '吐鲁番', [[652122, '鄯善县'], [652101, '吐鲁番市'], [652123, '托克逊县']]], [659501, '图木舒克', []], [659601, '五家渠', []], [650100, '乌鲁木齐', [[650107, '达坂城区'], [650109, '米东区'], [650103, '沙依巴克区'], [650105, '水磨沟区'], [650102, '天山区'], [650106, '头屯河区'], [650104, '新市区']]], [654000, '伊犁', [[654022, '察布查尔锡伯自治县'], [654024, '巩留县'], [654023, '霍城县'], [654029, '霍尔果斯市'], [654003, '奎屯市'], [654028, '尼勒克县'], [654027, '特克斯县'], [654025, '新源县'], [654002, '伊宁市'], [654021, '伊宁县'], [654026, '昭苏县']]]]], [530000, '云南', [[533000, '保山', [[533024, '昌宁县'], [533023, '龙陵县'], [533002, '隆阳区'], [533021, '施甸县'], [533022, '腾冲市']]], [532300, '楚雄', [[532301, '楚雄市'], [532326, '大姚县'], [532331, '禄丰县'], [532323, '牟定县'], [532324, '南华县'], [532322, '双柏县'], [532329, '武定县'], [532325, '姚安县'], [532327, '永仁县'], [532328, '元谋县']]], [532900, '大理', [[532924, '宾川县'], [532901, '大理市'], [532930, '洱源县'], [532932, '鹤庆县'], [532931, '剑川县'], [532925, '弥渡县'], [532926, '南涧彝族自治县'], [532927, '巍山彝族回族自治县'], [532923, '祥云县'], [532922, '漾濞彝族自治县'], [532928, '永平县'], [532929, '云龙县']]], [533100, '德宏', [[533122, '梁河县'], [533124, '陇川县'], [533103, '芒市'], [533102, '瑞丽市'], [533123, '盈江县']]], [533400, '迪庆', [[533422, '德钦县'], [533423, '维西傈僳族自治县'], [533421, '香格里拉县']]], [532500, '红河', [[532501, '个旧市'], [532532, '河口瑶族自治县'], [532529, '红河县'], [532524, '建水县'], [532530, '金平苗族瑶族傣族自治县'], [532502, '开远市'], [532527, '泸西县'], [532531, '绿春县'], [532522, '蒙自市'], [532526, '弥勒市'], [532523, '屏边苗族自治县'], [532525, '石屏县'], [532528, '元阳县']]], [530100, '昆明', [[530181, '安宁市'], [530121, '呈贡区'], [530113, '东川区'], [530124, '富民县'], [530111, '官渡区'], [530122, '晋宁县'], [530128, '禄劝彝族苗族自治县'], [530103, '盘龙区'], [530126, '石林彝族自治县'], [530127, '嵩明县'], [530102, '五华区'], [530112, '西山区'], [530129, '寻甸回族彝族自治县'], [530125, '宜良县']]], [533200, '丽江', [[533202, '古城区'], [533223, '华坪县'], [533224, '宁蒗县'], [533222, '永胜县'], [533221, '玉龙县']]], [533500, '临沧', [[533527, '沧源佤族自治县'], [533521, '凤庆县'], [533526, '耿马傣族佤族自治县'], [533502, '临翔区'], [533525, '双江拉祜族佤族布朗族傣族自治县'], [533523, '永德县'], [533522, '云县'], [533524, '镇康县']]], [533300, '怒江', [[533323, '福贡县'], [533324, '贡山独龙族怒族自治县'], [533325, '兰坪白族普米族自治县'], [533321, '泸水县']]], [532700, '普洱', [[532726, '江城哈尼族彝族自治县'], [532723, '景东彝族自治县'], [532724, '景谷傣族彝族自治县'], [532728, '澜沧拉祜族自治县'], [532727, '孟连傣族拉祜族佤族自治县'], [532722, '墨江哈尼族自治县'], [532721, '宁洱哈尼族彝族自治县'], [532702, '思茅区'], [532729, '西盟佤族自治县'], [532725, '镇沅彝族哈尼族拉祜族自治县']]], [530300, '曲靖', [[530325, '富源县'], [530326, '会泽县'], [530322, '陆良县'], [530324, '罗平县'], [530321, '马龙县'], [530302, '麒麟区'], [530323, '师宗县'], [530381, '宣威市'], [530328, '沾益县']]], [532600, '文山', [[532628, '富宁县'], [532627, '广南县'], [532625, '马关县'], [532624, '麻栗坡县'], [532626, '丘北县'], [532621, '文山市'], [532623, '西畴县'], [532622, '砚山县']]], [532800, '西双版纳', [[532801, '景洪市'], [532822, '勐海县'], [532823, '勐腊县']]], [530400, '玉溪', [[530422, '澄江县'], [530426, '峨山彝族自治县'], [530402, '红塔区'], [530424, '华宁县'], [530421, '江川区'], [530423, '通海县'], [530427, '新平彝族傣族自治县'], [530425, '易门县'], [530428, '元江哈尼族彝族傣族自治县']]], [532100, '昭通', [[532124, '大关县'], [532121, '鲁甸县'], [532122, '巧家县'], [532130, '水富县'], [532126, '绥江县'], [532129, '威信县'], [532123, '盐津县'], [532128, '彝良县'], [532125, '永善县'], [532102, '昭阳区'], [532127, '镇雄县']]]]], [330000, '浙江', [[330100, '杭州', [[330108, '滨江区'], [330127, '淳安县'], [330183, '富阳区'], [330105, '拱墅区'], [330182, '建德市'], [330104, '江干区'], [330185, '临安市'], [330102, '上城区'], [330122, '桐庐县'], [330103, '下城区'], [330109, '萧山'], [330106, '西湖区'], [330110, '余杭区']]], [330500, '湖州', [[330523, '安吉县'], [330522, '长兴县'], [330521, '德清县'], [330503, '南浔区'], [330502, '吴兴区']]], [330400, '嘉兴', [[330481, '海宁市'], [330424, '海盐县'], [330421, '嘉善县'], [330402, '南湖区'], [330482, '平湖市'], [330483, '桐乡市'], [330411, '秀洲区']]], [330700, '金华', [[330783, '东阳市'], [330703, '金东区'], [330781, '兰溪市'], [330727, '磐安县'], [330726, '浦江县'], [330702, '婺城区'], [330723, '武义县'], [330782, '义乌市'], [330784, '永康市']]], [332500, '丽水', [[332527, '景宁畲族自治县'], [332522, '缙云县'], [332502, '莲都区'], [332581, '龙泉市'], [332521, '青田县'], [332526, '庆元县'], [332524, '松阳县'], [332523, '遂昌县'], [332525, '云和县']]], [330200, '宁波', [[330206, '北仑区'], [330282, '慈溪'], [330283, '奉化市'], [330203, '海曙区'], [330205, '江北区'], [330204, '江东区'], [330226, '宁海县'], [330225, '象山县'], [330212, '鄞州区'], [330281, '余姚'], [330211, '镇海区']]], [330800, '衢州', [[330822, '常山县'], [330881, '江山市'], [330824, '开化县'], [330802, '柯城区'], [330825, '龙游县'], [330803, '衢江区']]], [332600, '上虞', []], [330600, '绍兴', [[330682, '上虞区'], [330621, '柯桥区'], [330683, '嵊州市'], [330624, '新昌县'], [330602, '越城区'], [330681, '诸暨市']]], [331000, '台州', [[331003, '黄岩区'], [331002, '椒江区'], [331082, '临海市'], [331004, '路桥区'], [331022, '三门县'], [331023, '天台县'], [331081, '温岭市'], [331024, '仙居县'], [331021, '玉环县']]], [330300, '温州', [[330327, '苍南县'], [330322, '洞头区'], [330382, '乐清市'], [330303, '龙湾区'], [330302, '鹿城区'], [330304, '瓯海区'], [330326, '平阳县'], [330381, '瑞安市'], [330329, '泰顺县'], [330328, '文成县'], [330324, '永嘉县']]], [330900, '舟山', [[330921, '岱山县'], [330902, '定海区'], [330903, '普陀区'], [330922, '嵊泗县']]]]]);



cateinfo = new Array([1, '民事类', [['债权债务', 'zwzt', 2], ['合同纠纷', 'htjf', 5], ['婚姻家庭', 'hyjt', 11], ['医疗纠纷', 'yljf', 3], ['交通事故', 'jtsg', 4], ['拆迁安置', 'cqaz', 1], ['工伤赔偿', 'shpc', 7], ['人身损害', 'rssh', 8], ['劳动纠纷', 'ldjf', 6], ['保险理赔', 'bxlp', 9], ['新闻侵权', 'xwqq', 10], ['遗产继承', 'ycjc', 12], ['旅游', 'lvyou', 13], ['农村承包', 'nccb', 14], ['消费权益', 'xfqy', 15], ['抵押担保', 'dydb', 16], ['邮政储蓄', 'yzcx', 17], ['侵权', 'qinquan', 72], ['离婚', 'divorce', 73]]], [2, '经济类', [['房产纠纷', 'fcjf', 19], ['知识产权', 'zscq', 24], ['工程建筑', 'gcjz', 18], ['招标投标', 'zbtb', 20], ['水利电力', 'sldl', 21], ['电信通讯', 'dxtx', 22], ['高新技术', 'gxjs', 23], ['合伙联营', 'hhly', 25], ['连锁加盟', 'lsjm', 26], ['个人独资', 'grdz', 27], ['期货交易', 'qhjy', 28], ['金融证券', 'jrzq', 29], ['银行保险', 'yhbx', 30], ['广告宣传', 'ggxc', 31], ['经销代理', 'jxdl', 32], ['不当竞争', 'bdjz', 33], ['经济仲裁', 'jjzc', 34], ['网络法律', 'wlfl', 69], ['污染损害', 'wrsh', 70], ['矿产资源', 'kuangchan', 74]]], [3, '刑事类', [['刑事辩护', 'xsbh', 36], ['刑事自诉', 'xszs', 37], ['行政复议', 'xsfy', 38], ['行政诉讼', 'xzss', 39], ['国家赔偿', 'gjpc', 40], ['求学教育', 'qxjy', 41], ['环境污染', 'hjwr', 42], ['工商税务', 'gssw', 43], ['海关商检', 'hgsj', 44], ['公安国安', 'gaga', 45], ['公司犯罪', 'gsfz', 68], ['取保候审', 'qshb', 35]]], [4, '涉外类', [['海事海商', 'hsss', 46], ['国际贸易', 'gjmy', 47], ['招商引资', 'zsyz', 48], ['外商投资', 'wstz', 49], ['合资合作', 'hzhz', 50], ['WTO事务', 'wto', 51], ['倾销补贴', 'cxbt', 52], ['涉外仲裁', 'swzc', 53]]], [5, '公司类', [['法律顾问', 'cngw', 64], ['公司法', 'gsf', 71], ['公司收购', 'gssg', 54], ['股权转让', 'gfzr', 55], ['企业改制', 'qygz', 56], ['公司清算', 'gsqs', 57], ['破产解散', 'pcjs', 58], ['资产拍卖', 'zcpm', 59]]], [6, '其他类', [['工商查询', 'gscx', 60], ['资信调查', 'zxdc', 61], ['合同审查', 'htsc', 62], ['调解谈判', 'tjtp', 63], ['私人律师', 'srls', 65], ['文书代理', 'wsdl', 66], ['移民留学', 'ymlx', 67]]]);

var category = [
            ["债务债权", "zhaiwuzhuitao", 2],
            ["医疗纠纷", "yiliaojiufen", 3],
            ["交通事故", "jiaotongshigu", 4],
            ["合同纠纷", "hetongjiufen", 5],
            ["劳动纠纷", "laodongjiufen", 6],
            ["房产纠纷", "fangchanjiufen", 19],
            ["知识产权", "zhishichanquan", 24],
            ["婚姻家庭", "hunyinjiating", 11],
            ["保险理赔", "baoxianlipei", 9],
            ["消费权益", "xiaofeiquanyi", 15],
            ["工程建筑", "gongchengjianzhu", 18],
            ["海事海商", "haishihaishang", 46],
            ["公司事务", "gongsifa", 71],
            ["反不正当竞争", "budangjingzheng", 33],
            ["征地拆迁", "chaiqiananzhi", 1],
            ["侵权责任", "qinquan", 72],
            ["刑事诉讼", "xingshibianhu", 36],
            ["环境保护", "huanjingwuran", 42],
            ["涉外法律", "shewaizhongcai", 53],
            ["行政", "xingzhengfuyi", 38],
            ["票据", "piaoju", ""],
            ["其他", "field", ""]
];

sSpecialArry = new Array([9, '保险理赔'], [33, '不当竞争'], [1, '拆迁安置'], [64, '法律顾问'], [22, '电信通讯'], [63, '调解谈判'], [16, '抵押担保'], [19, '房产纠纷'], [23, '高新技术'], [27, '个人独资'], [45, '公安国安'], [18, '工程建筑'], [60, '工商查询'], [7, '工伤赔偿'], [43, '工商税务'], [71, '公司法'], [68, '公司犯罪'], [57, '公司清算'], [54, '公司收购'], [31, '广告宣传'], [40, '国家赔偿'], [47, '国际贸易'], [55, '股权转让'], [44, '海关商检'], [46, '海事海商'], [25, '合伙联营'], [5, '合同纠纷'], [62, '合同审查'], [50, '合资合作'], [42, '环境污染'], [11, '婚姻家庭'], [4, '交通事故'], [34, '经济仲裁'], [32, '经销代理'], [29, '金融证券'], [74, '矿产资源'], [6, '劳动纠纷'], [26, '连锁加盟'], [73, '离婚'], [13, '旅游'], [14, '农村承包'], [58, '破产解散'], [28, '期货交易'], [52, '倾销补贴'], [72, '侵权'], [41, '求学教育'], [56, '企业改制'], [35, '取保候审'], [8, '人身损害'], [53, '涉外仲裁'], [21, '水利电力'], [65, '私人律师'], [49, '外商投资'], [69, '网络法律'], [66, '文书代理'], [51, 'WTO事务'], [70, '污染损害'], [15, '消费权益'], [36, '刑事辩护'], [37, '刑事自诉'], [38, '行政复议'], [39, '行政诉讼'], [10, '新闻侵权'], [12, '遗产继承'], [3, '医疗纠纷'], [67, '移民留学'], [30, '银行保险'], [17, '邮政储蓄'], [2, '债权债务'], [20, '招标投标'], [48, '招商引资'], [24, '知识产权'], [59, '资产拍卖'], [61, '资信调查']);
/*
* header.js  - 头部与尾部
*
* Copyright (c) 2014 华律网 (www.66law.cn)
*
* Author:秦昊杰
*
* Date:2015年6月8日10:41:14
*/

(function ($) {

    //默认配置
    var config = {
        'activeClass': 'pn-click',
        'hoverClass': 'pn-hover',
        'disableClass': 'u-pn-disable',
        'textHolder': '.pn-on i',
        'toggle': '.pn-on',
        'item': '.pn-more p',
        'itemHolder': '.pn-more',
        'disabled': false,
        'visibleNumber': 6,
        'itemTemplate': '<p data-value="{{value}}">{{text}}</p>',
        'warpTemplate': '<div class=\"u-pn fl u-pn-sl\">' +
        '<span class=\"pn-on\">' +
        '<i></i><em class="ico-login i-pn-jt"></em></span>' +
        '<div class=\"pn-more\" style="display: none;"></div></div>'
    };

    var Combobox = function (element, options) {

        //jquery元素 dom为<select>
        this.el = $(element);

        this.options = $.extend({}, config, options);

        //生成的代替下拉框的dom结构
        this.target = null;

        //是否禁用下拉框
        this.disabled = false;

        this.init();
    };

    Combobox.prototype.init = function () {


        this.target = $(this.options.warpTemplate);

        this.el.after(this.target);


        var css = this.el.attr('class') || '';

        this.target.addClass(css);

        //ie6 如果隐藏原始下拉框会报错
        if (!!window.ActiveXObject && !window.XMLHttpRequest) {
            this.target.hide();
        } else {
            this.el.hide();
        }
        //下拉框选项
        var initData = [];
        //初始选中文字
        var initText = $("option:selected", this.el).text();
        this.setText(initText);

        //获取最初元素的选项信息
        $("option", this.el).each(function () {
            initData.push({
                'value': $(this).val(),
                'text': $(this).text()
            });
        });
        this.setItems(initData);

        this.initEvent();

        //设置初始禁用状态
        this.disable(this.options.disabled);


    };


    /**
     * 初始化事件
     */
    Combobox.prototype.initEvent = function () {

        //触发元素上绑定的初始化事件
        this.el.trigger('init.combobox', [this.target, this]);

        //给生成的dom绑定事件
        this.target
            .on('click', this.options.item,
            $.proxy(this.itemClick, this))
            .on('click', this.options.toggle,
            $.proxy(this.toggle, this));

        //绑定元素的change事件，使之改变的时候将下拉框的信息改变
        this.el.on('change', $.proxy(function (e) {
            var text = $('option:selected', this.el).text();
            this.setText(text);
            this.target.data('value', this.el.val());
        }, this));
        //点击页面关闭当前处于展开状态的下拉框
        $(document).on('click', function () {
            var combobox = $('body').data('combobox-opened');
            if (combobox) {
                combobox.close();
            }
        });
    };

    /**
     * 切换显示状态
     * @returns {boolean}
     */
    Combobox.prototype.toggle = function () {

        //如果处于禁用状态则返回
        if (this.disabled) {
            return false;
        }

        if ($(this.options.itemHolder, this.target).is(':visible')) {
            this.close();
        } else {
            this.show();
        }
        return false;
    };

    /**
     * 关闭下拉框
     * @returns {boolean}
     */
    Combobox.prototype.close = function () {
        if (this.disabled) {
            return false;
        }

        var opts = this.options;
        var itemHolder = $(opts.itemHolder, this.target);

        $('body').data('combobox-opened', null);
        this.target.removeClass(opts.activeClass);
        itemHolder.hide();
        this.el.trigger('close.combobox', [this.target, this]);
        return true;
    };

    /**
     * 显示下拉框
     * @returns {boolean}
     */
    Combobox.prototype.show = function () {
        if (this.disabled) {
            return false;
        }
        var opts = this.options;
        var itemHolder = $(opts.itemHolder, this.target);

        // 先尝试关闭已展开的下拉框
        var current = $('body').data('combobox-opened');
        if (current) {
            current.close();
        }
        $('body').data('combobox-opened', this);
        this.target.addClass(opts.activeClass);
        itemHolder.show();
        this.el.trigger('show.combobox', [this.target, this]);
        return true;
    };

    /**
     * 下拉框选项点击事件
     * @param event
     * @returns {boolean}
     */
    Combobox.prototype.itemClick = function (event) {
        var item = $(event.target);
        var text = item.text();
        var value = item.data('value');
        var opts = this.options;
        var that = this;

        that.el
            .val(value)
            .trigger('change', [that.target, that]);



        this.close();
        return false;

    };

    /**
     * 根据data渲染选项
     * @param data e.g. [{value:1,text:1},{value:2,text:2}]
     */
    Combobox.prototype.setItems = function (data) {
        var items = '';
        var options = '';

        var len = data.length;
        var i = 0;
        var itemTemplate = this.options.itemTemplate;

        while (i < len) {

            items += itemTemplate.replace('{{value}}', data[i]['value']).replace('{{text}}', data[i]['text']);

            options += '<option value="' + data[i]['value'] + '">' + data[i]['text'] + '</option>';
            i++;
        }
        this.target.find(this.options.itemHolder).html(items);
        this.el
            .html(options)
            .trigger('set.combobox', [this.target, this]);

        //重新渲染选项后设置下拉框显示文字
        var text = this.el.find('option:selected').html();
        this.setText(text);
        //重新设置下拉框value
        this.target.data('value', this.el.val());

        this.updateHeight();
    };

    /**
     * 根据配置的可见选项数量改变下拉内容的高度，在重新渲染选项后调用
     */
    Combobox.prototype.updateHeight = function () {
        var itemHolder = $(this.options.itemHolder, this.target);
        var item = $(this.options.item, this.target);

        var num = this.options.visibleNumber;
        var perHeight = item.height();

        if (num <= item.length) {
            itemHolder.height(num * perHeight);
        } else {
            itemHolder.height(item.length * perHeight);
        }

    };

    /*
     * 设置值
     * 
     * @param value
     * 
     */
    Combobox.prototype.setValue = function (value) {
        this.el.val(value).trigger('change');
        //var items = $(this.options.itemHolder, this.target).children();
        //$(items).each(function () {
        //    $(this).data('value') == value && $(this).trigger('click');
        //});
    };

    /**
     * 设置下拉框显示文字
     * @param text
     */
    Combobox.prototype.setText = function (text) {
        $(this.options.textHolder, this.target).text(text);
    };

    /**
     * 是否禁用下拉框
     * @param disabled
     */
    Combobox.prototype.disable = function (disabled) {
        this.disabled = disabled;
        if (disabled) {
            this.target.addClass(this.options.disableClass);
        } else {
            this.target.removeClass(this.options.disableClass);
        }
    };

    $.fn.combobox = function (options) {

        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function (index, el) {
            var $this = $(this);
            var instance = $(this).data('combobox');
            if (!instance) {
                $this.data('combobox', new Combobox(this, options || {}));
            } else {

                instance[options].apply(instance, args);
            }
        });
    }
})(jQuery);



(function ($) {

    /**
     * 根据上级id生成下级城市数据
     * @param pid 一级id
     * @param cid 二级id
     * @returns {Array}
     */
    function getChild(pid, cid) {

        function convert(arr) {

            var len = arr.length;
            arr.reverse();
            var result = [];
            for (var k = len - 1; k >= 0; k--) {
                result.push({ 'text': arr[k][1], 'value': arr[k][0] });
            }
            result.unshift({ value: 0, text: "请选择" });
            return result;
        }

        if (pid > 0) {
            var len = sPCLocation.length;
            for (var i = len - 1; i >= 0; i--) {
                var province = sPCLocation[i];

                if (province[0] == pid) {

                    if (!cid) {
                        return convert(province[2]);
                    } else {
                        len = province[2].length;
                        for (var j = len - 1; j >= 0; j--) {
                            var city = province[2][j];
                            if (city[0] == cid) {
                                return convert(city[2]);
                            }
                        }
                    }
                    break;
                }
            }
        } else {
            return convert(sPCLocation);
        }
        return [];
    }


    $.fn.areaSelector = function (options) {
        return this.each(function () {
            var initOption = { value: 0, text: "请选择" };
            var btns = $('select', this);
            btns.eq(0).combobox(options || {});
            var opt = $.extend({}, options || {}, { disabled: true });
            btns.eq(1).combobox(opt);
            btns.eq(2).combobox(opt);
            btns.eq(0)
                .on('change.combobox', function (el, combobox) {
                    var value = $(this).val();
                    if (value == 0) {
                        //选择了请选择选项 应禁用2、3级下拉框
                        btns.eq(1).combobox('disable', true);
                        btns.eq(2).combobox('disable', true);
                        btns.eq(1).combobox('setItems', [initOption]);
                        btns.eq(2).combobox('setItems', [initOption]);
                        return false;
                    }
                    var data = getChild(value);
                    btns.eq(1).combobox('setItems', data);
                    btns.eq(1).combobox('disable', false);
                    btns.eq(2).combobox('setItems', [initOption]);
                    btns.eq(2).combobox('disable', true);
                })
                .on('set.combobox', function () {
                    btns.eq(1).combobox('setItems', [initOption]);
                    btns.eq(2).combobox('setItems', [initOption]);
                })
                .combobox('setItems', getChild());

            btns.eq(1)
                .on('change.combobox', function (el, combobox) {
                    var value = $(this).val();
                    if (value == 0) {
                        //选择了请选择选项 应禁用3级下拉框
                        btns.eq(2).combobox('disable', true);
                        btns.eq(2).combobox('setItems', [initOption]);
                        return false;
                    }
                    var data = getChild(btns.eq(0).val(), value);
                    if (data.length > 1) {
                        btns.eq(2).combobox('disable', false);
                        btns.eq(2).combobox('setItems', data);
                    } else {
                        btns.eq(2).combobox('disable', true);
                        btns.eq(2).combobox('setItems', [{ value: -1, text: "" }]);
                    }


                });

        });
    };
})(jQuery);

(function ($) {

    function getChild(pid) {

        function convert(arr) {
            arr.reverse();
            var result = [];
            for (var k = arr.length - 1; k >= 0; k--) {
                var row = arr[k];
                if (typeof row[0] == 'string') {
                    result.push({ 'text': row[0], 'value': row[2] });
                } else {
                    result.push({ 'text': row[1], 'value': row[0] });
                }
            }
            result.unshift({ value: 0, text: "请选择" });
            return result;
        }

        if (pid > 0) {
            var len = cateinfo.length;
            for (var i = len - 1; i >= 0; i--) {
                var bigCate = cateinfo[i];
                if (bigCate[0] == pid) {
                    return convert(bigCate[2]);
                }
            }
        } else {
            return convert(cateinfo);
        }
        return [];
    }

    function getParentId(id) {
        //[1, '民事类', [['债务追讨', 'zwzt', 2], 
        var len = cateinfo.length;
        for (var i = len - 1; i >= 0; i--) {
            var bigCate = cateinfo[i];
            var sCate = bigCate[2];
            var slen = sCate.length;
            for (var j = slen - 1; j >= 0; j--) {
                if (sCate[j][2] == id) {
                    return bigCate[0];
                }
            }
        }
        return 0;
    }


    $.fn.categorySelector = function (options, val) {

        var initOption = { value: 0, text: "请选择" };
        var btns = $('select', this);
        btns.eq(0).combobox(options || {});
        options = $.extend({}, options || {}, { disabled: true });
        btns.eq(1).combobox(options);
        var pid = 0;
        if (val) {
            pid = getParentId(val);
        }
        btns.eq(0)
            .on('change.combobox', function (el, combobox) {
                var value = $(this).val();
                if (value == 0) {
                    //选择了请选择选项 应禁用2、3级下拉框
                    btns.eq(1).combobox('disable', true);
                    btns.eq(1).combobox('setItems', [initOption]);
                    return false;
                }
                var data = getChild(value);
                btns.eq(1)
                    .combobox('setItems', data)
                    .combobox('setValue', val)
                    .combobox('disable', false);
            })
            .on('set.combobox', function () {
                btns.eq(1).combobox('setItems', [initOption]);
            })
            .combobox('setItems', getChild())
            .combobox('setValue', pid);

    };

})(jQuery);

(function ($) {
    var thisYear, $year, $mon, $day, $slc, opts, date;
    $.fn.DateSelector = function (options, val) {
        return this.each(function () {
            var $holder = $(this), year = 0, month = 0, day = 0;
            opts = $.extend({}, $.fn.DateSelector.defaults, options || {});
            date = new Date();
            thisYear = date.getFullYear();
            $slc = $('select', $holder);
            $year = $slc.eq(0).combobox();
            $mon = $slc.eq(1).combobox({ disabled: true });
            $day = $slc.eq(2).combobox({ disabled: true });
            if (/\d{4}-\d{1,2}-\d{1,2}/.test(val)) {
                var arr = val.split('-');
                year = arr[0] - 0;
                month = arr[1] - 0;
                day = arr[2] - 0;
            }
            var initOption = { value: 0, text: "请选择" };

            var inited = false;

            var years = [];
            var months = [];
            for (var i = thisYear + opts['yearRange'][0]; i > thisYear + opts['yearRange'][1]; i--) years.push({ value: i, text: i + '年' });
            for (i = 1; i < 13; i++) {
                months.push({ value: i, text: (i < 10 ? "0" + i : i) + '月' });
            }
            $mon
                .on('change.combobox', function (el, combobox) {
                    var value = $(this).val();
                    if (value == 0) {
                        //选择了请选择选项 应禁用3级下拉框
                        $day.combobox('disable', true).combobox('setItems', [initOption]);
                    } else {
                        $day.combobox('disable', false).combobox('setItems', getDays($year.val() - 0, value - 0));
                        !inited && $day.combobox('setValue', day) && (inited = true);
                    }
                });

            $year
                .on('change.combobox', function (el, combobox) {
                    var value = $(this).val();
                    $day.combobox('setItems', [initOption]).combobox('disable', true);
                    if (value == 0) {
                        //选择了请选择选项 应禁用2、3级下拉框
                        $mon.combobox('setItems', [initOption]).combobox('disable', true);
                    } else {
                        $mon.combobox('setItems', months).combobox('disable', false);
                        !inited && $mon.combobox('setValue', month) && !day && (inited = true);
                    }
                })
                .on('set.combobox', function () {
                    $mon.combobox('setItems', [initOption]);
                    $day.combobox('setItems', [initOption]);
                })
                .combobox('setItems', years)
                .combobox('setValue', year);
        });

    };
    //月份点击事件
    var getDays = function (y, m) {
        var days = [],
            i;
        for (i = 1; i < 29; i++) {
            days.push({ value: i, text: (i < 10 ? "0" + i : i) + '日' });
        }
        if (m == 2 && !(0 == y % 4 && ((y % 100 != 0) || (y % 400 == 0)))) {
            return days;
        }
        days.push({ value: 29, text: 29 + '日' });
        if (m == 2 && (0 == y % 4 && ((y % 100 != 0) || (y % 400 == 0)))) {
            return days;
        }
        days.push({ value: 30, text: 30 + '日' });
        if (m == 4 || m == 6 || m == 9 || m == 1) {
            return days;
        }
        days.push({ value: 31, text: 31 + '日' });
        return days;
    };

    $.fn.DateSelector.defaults = {
        yearRange: [0, -100]
    };
})(jQuery);


(function ($) {
    var $hour, $minite, $second, $slc;
    $.fn.TimeSelector = function (val) {
        return this.each(function () {
            var $holder = $(this), hour = 0, minite = 0, second = 0;
            $slc = $('select', $holder);
            $hour = $slc.eq(0).combobox();
            $minite = $slc.eq(1).combobox({ disabled: true });
            $second = $slc.eq(2).combobox({ disabled: true });
            if (/\d{1,2}:\d{1,2}:\d{1,2}/.test(val)) {
                var arr = val.split('-');
                hour = arr[0] - 0;
                minite = arr[1] - 0;
                second = arr[2] - 0;
            }
            //初始化显示的值
            var initOption = { value: 0, text: "请选择" };

            var inited = false;

            var hours = [];
            var minites = [];

            for (var i = 0; i < 24; i++) {
                hours.push({ value: i, text: i < 10 ? "0" + i : i });
            }
            for (i = 0; i < 60; i++) {
                minites.push({ value: i, text: i < 10 ? "0" + i : i });
            }
            var seconds = minites;
            $minite
                .on('change.combobox', function (el, combobox) {
                    var value = $(this).val();
                    if (value == 0) {
                        //选择了请选择选项 应禁用3级下拉框
                        $second.combobox('disable', true).combobox('setItems', [initOption]);
                    } else {
                        $second.combobox('disable', false).combobox('setItems', seconds);
                        !inited && $second.combobox('setValue', second);
                    }
                });

            $hour
                .on('change.combobox', function (el, combobox) {
                    var value = $(this).val();
                    $second.combobox('setItems', [initOption]).combobox('disable', true);
                    if (value == 0) {
                        //选择了请选择选项 应禁用2、3级下拉框
                        $minite.combobox('setItems', [initOption]).combobox('disable', true);
                    } else {
                        $minite.combobox('setItems', months).combobox('disable', false);
                        !inited && $minite.combobox('setValue', minite);
                    }
                })
                .on('set.combobox', function () {
                    $minite.combobox('setItems', [initOption]);
                    $second.combobox('setItems', [initOption]);
                })
                .combobox('setItems', hours)
                .combobox('setValue', hour);
            inited = true;
        });

    };
})(jQuery);



$(function () {
    if ($('.areaSelect').length) {
        $('.areaSelect').areaSelector();
    }
    if ($('.categorySelect').length) {
        $('.categorySelect').categorySelector();
    }
    JPlaceHolder.init();
});


/**
 * jquery.validation
 * author : qinhaojie
 * email : qinhaojie1992@163.com
 * https://github.com/qinhaojie/jquery-validation
 */

(function ($) {

    "use strict";

    var verifyStrategies = {
        //汉字
        chinese: function (value) {
            var state = /^[\u4e00-\u9fa5]+$/.test(value);
            return {
                state: state,
                message: state ? '验证成功' : '只能输入中文'
            };
        },
        //中国手机号码
        mobilephone: function (value) {
            var state = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/.test(value);
            return {
                state: state,
                message: state ? '验证成功' : '请输入正确的手机号码'
            };
        },
        //最小长度
        minLength: function (lenth) {
            return function(value) {
                var state = lenth <= value.length;
                return {
                    state: state,
                    message: state ? '验证成功' : '长度不能小于' + lenth
                };
            };
        },
        //最大长度
        maxLength: function (lenth) {
            return function(value) {
                var state = lenth >= value.length;
                return {
                    state: state,
                    message: state ? '验证成功' : '长度不能大于' + lenth
                };
            };
        },
        //与某一文本框输入相同
        sameAs: function (target) {
            target = $(target);
            return function(value) {
                var prevVlaue = $.trim(target.val());
                var state = value === prevVlaue;
                return {
                    state: state,
                    message: state ? '验证成功' : '两次输入不一致'
                };
            };
        },
        //字母数字下划线
        letter: function (value) {
            var state = /^\w+$/.test(value);
            return {
                state: state,
                message: state ? '验证成功' : '只能包含字符，数字，下划线组成'
            };
        },
        //邮箱
        email: function (value) {
            var state = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value);
            return {
                state: state,
                message: state ? '验证成功' : '请输入正确的邮箱地址'
            };
        },
        title: function (value) {
            var state = /^[\w\u4e00-\u9fa5]*$/.test(value);
            return {
                state: state,
                message: state ? '验证成功' : '不能包含符号'
            };
        },
        number: function (value) {
            var state = /^\d*$/.test(value);
            return {
                state: state,
                message: state ? '验证成功' : '只能包含数字'
            };
        },
        
        licenseformat: function(value) {
            var state = /^([1|2]\d{4}[1|2][8|9|0|1]\d{2}[1-9][0-1][\d]{6}|0)$/.test(value) || value.length==14;
            return {
                state: state,
                message: state ? '验证成功' : "请输入正确的执业证号"
            };
        },
        reg: function (reg) {
            var regexp = new RegExp(reg);
            return function (value) {
                var state = regexp.test(value);
                return {
                    state: state,
                    message: state ? '验证成功' : '失败'
                };
            };
        }


    };
    var Validation = function (el, strategy) {
        this.el = $(el);


        this.validations = [];
        if (strategy) this.add(strategy);
    };
    /**
     * 批量添加验证规则，多条规则之间以分号;隔开
     * @param strategy e.g. 'chinese;minLength:2;maxLength:10'
     * @returns {Validation}
     */
    Validation.prototype.add = function (strategy) {
        if (isFunction(strategy)) {
            return this.addOne(strategy);
        }
        var strategies = strategy.split(';');
        var len = strategies.length;
        while (len--)
            this.addOne(strategies[len]);
        return this;

    };
    /**
     * 添加验证规则，如果是字符串则通过verifyStrategies中对应方法添加
     * @param strategy [string|function]
     * @returns {Validation}
     */
    Validation.prototype.addOne = function (strategy) {
        if (isString(strategy)) {
            var arg = strategy.split(':');
            strategy = arg.shift();
            if (arg.length) {
                strategy = verifyStrategies[strategy].apply(this, arg);
            } else {
                strategy = verifyStrategies[strategy];
            }
        }

        this.validations.push(strategy);

        return this;
    };
    /**
     * 开始验证
     * @returns object
     *      state : 是否通过验证
     *      message:验证情况数组
     */
    Validation.prototype.validate = function () {
        var len = this.validations.length;
        var isSuccess = true;
        var value = $.trim(this.el.val());
        var result = [];
        this.el.trigger('before.validation');
        while (len--) {

            var cache = this.validations[len](value);
            if (!cache.state) {
                isSuccess = false;
                this.el.trigger('failed.validation', [cache]);

            }
            result.push(cache);

        }
        if (isSuccess) this.el.trigger('success.validation', [result]);
        return {
            state: isSuccess,
            message: result
        };
    };

    function isFunction(value) {

        return typeof value == 'function' || false;
    }
    function isString(value) {
        return typeof value == 'string' || false;
    }


    $.fn.validation = function (strategy) {


        var validation = this.data('validation');
        var args, ret;
        if (!validation) {
            //如果实例不存在则是初始化
            this.data('validation', new Validation(this, strategy));
        } else {
            //如果存在则是调用方法
            args = Array.prototype.slice.call(arguments, 1);
            ret = validation[strategy].apply(validation, args);
        }
        //如果调用方法的返回值不是实例，则返回ret否则返回this以便链式调用
        return (ret && ret !== validation) ? ret : this;
    };

    $.fn.validation.strategies = verifyStrategies;
    //data api 进行初始化
    $(function () {
        $('[data-validate]').each(function () {
            var strategy = $(this).data('validate');
            $(this).validation(strategy);
        })
    });

})(jQuery);

var validateForm = function (options) {
    this.options = $.extend(
    {},
    {
        'form': '.form',
        'sendBtn': '.fm-btn',
        'ajax': {},
        'autoValidate': true,
        'beforeSend': function (data) {
        },
        'success': function (res) {

        },
        'error': function (res) {

        }


    }, options);

    this.init();
};
validateForm.prototype.init = function () {
    this.form = $(this.options.form);
    this.sendBtn = $(this.options.sendBtn, this.form);
    this.render();
    this.initEvent();
};
validateForm.prototype.initEvent = function () {
    if (this.options.autoValidate) {
        this.form.find('[data-validate]')
        .on('failed.validation', function (e, info) {
            $(this).parent().find('.u-hint').remove();
            $(this).addClass('u-fm-error');
            var tip = $(this).data('error');
            tip = tip ? tip : info.message;
            $(this).parent().append(
                '<span class="fl u-hint u-hint-error">' +
                '	<i class="ico-login i-error16 mr5"></i>' +
                tip +
                '</span>'
            );
        })
        .on('blur', function () {
            $(this).removeClass('u-fm-focus').validation('validate');
        })
        .on('success.validation', function () {
            $(this).parent().find('.u-hint').remove();

            $(this).parent().append(
                '<span class="fl u-hint">' +
                '	<i class="ico-login i-right16 mr5"></i>' +
                '</span>'
            );
        })
        .on('focus', function () {
            $(this).parent().find('.u-hint').remove();
            $(this).removeClass('u-fm-error').addClass('u-fm-focus');
            var tip = $(this).data('tip');
            if (!tip) return false;
            $(this).parent().append(
                '<span class="fl u-hint">' +
                '	<i class="ico-login i-hint16 mr5"></i>' +
                tip +
                '</span>'
            );
        });
        this.form.find('input').not('[data-validate]')
            .on('focus', function () {
                $(this).addClass('u-fm-focus');
            })
            .on('blur', function () {
                $(this).removeClass('u-fm-focus');
            });
    }

    var that = this;
    this.form.find('input:visible').last().on('keyup', function (e) {
        if (e.keyCode == 13) {
            that.sendBtn.trigger('click');
        }
    });

    this.sendBtn.on('click', (function () {

        var ajax = ajaxGenerator();
        return function () {

            //验证
            var pass = true;
            that.form.find('[data-validate]').each(function () {
                var validation = $(this).data('validation');
                var result = validation.validate();
                if (!result.state) {
                    pass = false;
                }
            });
            if (!pass) return false;


            var btn = $(this);

            var data = that.prepareData();



            that.options.beforeSend(data);

            if (data.ispass === false) return false;
            $(this).addClass('fm-btn-disa');
            var option = $.extend({}, that.options.ajax);
            option.data = data;
            ajax(option).then(function (res) {
                that.options.success(res);
            }, function (res) {
                that.options.error(res);

            }).always(function () {
                btn.removeClass('fm-btn-disa');
            });
            return false;
        }
    }()));

};
validateForm.prototype.prepareData = function () {
    var data = {};
    this.form.find('input[name]').each(function () {
        data[$(this).attr('name')] = $(this).val();
    });
    return data;

};
validateForm.prototype.render = function () {
    this.form.find('[data-validate]').each(function () {
        var tips = $(this).parent().find('.u-hint');
        if (tips) tips.remove();
    });
};

; (function ($, undefined) {
    var ui = {
        slideSwitch: function (action, value) {
            return this.each(function () {
                var $self = $(this);
                if (!$self.is(':checkbox')) {
                    return this;
                }
                var css = $self.attr('class') || '';
                var checked = $(this).attr('checked');
                switch (action) {
                    case 'getValue':
                        return checked;
                    case 'setValue':
                        var $btn = $self.data('ui-holder');
                        if ($btn) {
                            if (!!value) {
                                $self.attr('checked', 'checked');
                                $btn.addClass("m-slide-switch-click");
                            } else {
                                $self.removeAttr('checked');
                                $btn.removeClass("m-slide-switch-click");
                            }
                        }
                        return this;
                    case 'show':
                        var $btn = $self.data('ui-holder');
                        if ($btn) {
                            $btn.show();
                        }
                        return this;
                    case 'hide':
                        var $btn = $self.data('ui-holder');
                        if ($btn) {
                            $btn.hide();
                        }
                        return this;
                    default:
                        $self.data('ui-type', action);
                }
                var $button = $('<div class="m-slide-switch fl"></div>');
                $self
                    .data('ui-holder', $button).hide().after($button)
                    .click(function () {
                        if (!$self.attr('checked')) {
                            $self.attr('checked', true);
                            $button.addClass("m-slide-switch-click");
                        } else {
                            $button.removeClass("m-slide-switch-click");
                            $self.attr('checked', false);
                        }
                        $self.trigger('change');
                        return false;
                    });

                $('<div class="u-sh-k"><span class="u-sh-off"></span><span class="u-sh-on"></span></div>').appendTo($button);
                $button
                    .hover(function () {
                        $button.addClass("m-slide-switch-foucs");
                    }, function () {
                        $button.removeClass("m-slide-switch-foucs");
                    })
                    .click(function () {
                        $self.trigger('click');
                    })
                    .addClass(css);
                if (checked) {
                    $button.addClass("m-slide-switch-click");
                }
                return this;
            });
        },
        radio: function (action, value) {
            return this.each(function () {
                var $self = $(this);
                var css = $self.attr('class') || '';
                var name = $self.attr('name') || '';
                if (!$self.is(':radio')) {
                    return undefined;
                }
                var id = $self.attr('id');
                var text = '选项';

                if (id) {
                    var $label = $('label[for="' + id + '"]');
                    text = $label.text();
                    $label.remove();
                }
                var checked = $self.is(':checked');
                switch (action) {
                    case 'getValue':
                        return checked;
                    case 'setValue':
                        var $btn = $self.data('ui-holder');
                        if ($btn) {
                            if (!!value) {
                                $self.attr('checked', true);
                                $btn.addClass("u-radio-click");
                            } else {
                                $self.attr('checked', false);
                                $btn.removeClass("u-radio-click");
                            }
                        }
                        return this;
                    case 'show':
                        var $btn = $self.data('ui-holder');
                        if ($btn) {
                            $btn.show();
                        }
                        return this;
                    case 'hide':
                        var $btn = $self.data('ui-holder');
                        if ($btn) {
                            $btn.hide();
                        }
                        return this;
                    default:
                        $self.data('ui-type', action);
                }

                var $button = $('<span class="u-radio"></span>');
                $self
                    .data('ui-holder', $button).hide().after($button)
                    .click(function () {
                        $('.u-radio[name="' + name + '"]').removeClass("u-radio-click");
                        $('input:radio[name="' + name + '"]').removeAttr("checked");
                        $button.addClass("u-radio-click");
                        $(this).attr('checked', true).trigger('change');
                    });
                $('<i class="ico-login i-radio"></i>').appendTo($button);

                $button
                    .hover(function () {
                        $button.addClass("u-radio-hover");
                    }, function () {
                        $button.removeClass("u-radio-hover");
                    })
                    .click(function () {
                        $self.trigger('click');
                    })
                    .append(text)
                    .addClass(css)
                    .attr('name', name);
                if (checked) {
                    $button.addClass("u-radio-click");
                }
                return this;
            });
        },
        checkbox: function (action, value) {
            return this.each(function () {
                var $self = $(this);
                var css = $self.attr('class') || '';
                var name = $self.attr('name') || '';
                if (!$self.is(':checkbox')) {
                    return undefined;
                }
                var id = $self.attr('id');
                var text = '选项';

                if (id) {
                    var $label = $('label[for="' + id + '"]');
                    text = $label.text();
                    $label.remove();
                }
                var checked = $self.is(':checked');
                switch (action) {
                    case 'getValue':
                        return checked;
                    case 'setValue':
                        var $btn = $self.data('ui-holder');
                        if ($btn) {
                            if (!!value) {
                                $self.attr('checked', true);
                                $btn.addClass("u-check-click");
                            } else {
                                $self.attr('checked', false);
                                $btn.removeClass("u-check-click");
                            }
                        }
                        return this;
                    case 'show':
                        var $btn = $self.data('ui-holder');
                        if ($btn) {
                            $btn.show();
                        }
                        return this;
                    case 'hide':
                        var $btn = $self.data('ui-holder');
                        if ($btn) {
                            $btn.hide();
                        }
                        return this;

                    default:
                        $self.data('ui-type', action);
                }

                var $button = $('<span class="u-check"></span>');
                $self
                    .data('ui-holder', $button).hide().after($button)
                    .click(function () {
                        if (!$self.attr('checked')) {
                            $self.attr('checked', true);
                            $button.addClass("u-check-click");
                        } else {
                            $button.removeClass("u-check-click");
                            $self.attr('checked', false);
                        }
                        $self.trigger('change');
                        return false;
                    });
                $('<i class="ico-login i-check"></i>').appendTo($button);

                $button
                    .hover(function () {
                        $button.addClass("u-check-hover");
                    }, function () {
                        $button.removeClass("u-check-hover");
                    })
                    .click(function () {
                        $self.trigger('click');
                    })
                    .append(text)
                    .addClass(css)
                    .attr('name', name);
                if (checked) {
                    $button.addClass("u-check-click");
                }
                return this;
            });
        }
    };
    $.fn.UI = function (typeName, val) {
        var widget;
        var widgetName = this.data('ui-type');
        switch (typeName) {
            case 'show':
            case 'hide':
            case 'getValue':
            case 'setValue':
                if (ui.hasOwnProperty(widgetName)) {
                    widget = ui[widgetName];
                    return widget.call(this, typeName, val);
                }
                break;
            default:
                if (ui.hasOwnProperty(typeName)) {
                    widget = ui[typeName];
                    return widget.call(this, typeName);
                }
                break;
        }
        return this;
    };
})(jQuery);