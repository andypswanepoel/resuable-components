/**
 * Accessible, progressive-enhancement header.
 * 
 * data-autohide = true/false
 */

(function (window, document) {

    /**
     * Lifecycle hooks.
     */
    var hooks = {};
    var previousOffsetTop = window.pageYOffset || 0;
    var motionPref = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    /**
     * Initialize component on DOM load.
     */
    var init = function () {
        var el_component = document.querySelector('[data-component="header"]'); // there should be only one header
        var config = _getConfig(el_component);
        el_component.setAttribute("data-header-hidden", "false")
        document.body.style.paddingTop = el_component.offsetHeight + "px";


        hooks.beforeInit();
        if (config.autohide === "true" && motionPref.matches === false) {
            addSmartHeaderListener(el_component, config);
            addKeyboardShow(el_component, config);
        }

        hooks.afterInit();
    };

    /**
     * Add listener to smart header component.
     */
    var addSmartHeaderListener = function (el_component, config) {
        window.addEventListener("scroll", function () { toggle(el_component, config); });
    };

    /**
     * Add show component on keyboard focus.
     */
    var addKeyboardShow = function (el_component, config) {

        var focusableElements = el_component.querySelectorAll('a, button, input');

        Array.prototype.forEach.call(focusableElements, function (element) {
            element.addEventListener('focus', function () {
                show(el_component, config);
            });
        });
    };


    /**
     * Toggle component. Call show or hide depending on scroll direction.
     */
    var toggle = function (el_component, config) {

        var currentOffsetTop = window.pageYOffset;
        var state = _getAttribute(el_component, "data-header-hidden", {
            default: "false",
            valid: ["true", "false"]
        })
        var dir = previousOffsetTop > currentOffsetTop ? "up" : "down"

        if (Math.abs(currentOffsetTop - previousOffsetTop) > config.autohide_amount) {
            if (dir === "up" && state === "true") {
                show(el_component, config);
            }
            
            if (dir === "down" && state === "false") {
                hide(el_component, config);
            } 
            previousOffsetTop = currentOffsetTop;
        }
    };

    /**
     * Show component.
     */
    var show = function (el_component, config) {
        config = config !== undefined ? config : _getConfig(el_component) //for instances when it is called via the API

        hooks.beforeShow();

        if(config.autohide_partial !== "") {
            el_component.style.transform = "";
        }
        el_component.setAttribute("data-header-hidden", "false")

        config.class_hidden_target.split(" ").forEach(function(target)  {
            _removeClasses(document.querySelector(target), config.class_hidden);
        })
        _removeClasses(el_component, config.class_hidden)
        emitEvent("headerShow", {
            header: el_component,
            component_config: config
        })

        hooks.afterShow();
    };

    /**
     * Hide component.
     */
    var hide = function (el_component, config) {
        config = config !== undefined ? config : _getConfig(el_component) //for instances when it is called via the API

        hooks.beforeHide();

        if(config.autohide_partial_id !== "") {
            var partialCollapse = (document.getElementById(config.autohide_partial_id).getBoundingClientRect().top);
            el_component.style.transform = "translateY(-" + partialCollapse + "px)";
        }
        el_component.setAttribute("data-header-hidden", "true");

        
        config.class_hidden_target.split(" ").forEach(function(target)  {
            _addClasses(document.querySelector(target), config.class_hidden);
        })

        _addClasses(el_component, config.class_hidden);
        emitEvent("headerHide", {
            header: el_component,
            component_config: config
        })

        hooks.afterHide();
    };

    /**
    * Helper function to get an element attribute, validated against a list of
    * allowable values, and a default value for when the attribute is empty or
    * an invalid value was found.
    */
    var _getAttribute = function (element, attr, options) {
        var value = element.getAttribute(attr);
        if (value === null || value === undefined) {
            if (typeof options.default !== "undefined") {
                return options.default;
            }
        }
        if (typeof options.valid !== "undefined") {
            if (options.valid.indexOf(value) > -1) {
                return value.toLowerCase();
            } else if (typeof options.default !== "undefined") {
                // We provided a list of valid options. The option specified in the
                // markup wasn't in that list. So return the default value.
                return options.default;
            }
        }

        // Value was specified, but no default or list of valid options was given.
        // So just return whatever was in the markup.
        return value;
    };


    /**
     * Get defined configuration for the given component.
     */

    var _getConfig = function (el_component) {
        return {
            autohide: _getAttribute(el_component, "data-autohide", {
                default: "false",
                valid: ["true", "false"]
            }),
            autohide_amount: _getAttribute(el_component, "data-autohide-amount", {
                default: "10",
            }),
            autohide_partial_id: _getAttribute(el_component, "data-autohide-id", {
                default: ""
            }),
            class_hidden: _getAttribute(el_component, "data-classnames-hidden", {
                default: "is-hidden"
            }),
            class_hidden_target: _getAttribute(el_component, "data-classnames-target", {
                default: "[data-component=header]",
                valid: ["html", "body", "html body", "body html"]
            }),
        };
    };

    var _addClasses = function (element, classes) {
        classes.split(" ").forEach(function (classname) {
            element.classList.add(classname);
        });
    };

    var _removeClasses = function (element, classes) {
        classes.split(" ").forEach(function (classname) {
            element.classList.remove(classname);
        });
    };


    /**
   * Emit a custom event.
   */
    var emitEvent = function (type, details) {
        if (typeof window.CustomEvent !== "function") {
            return;
        }

        var event = new CustomEvent(type, {
            bubbles: true,
            detail: details
        });
        document.dispatchEvent(event);
    };

    /**
     * Define custom functions for each available hooks.
     */
    var defineHooks = function (customHooks) {
        [
            "beforeInit",
            "afterInit",
            "beforeHide",
            "afterHide",
            "beforeShow",
            "afterShow"
        ].forEach(function (hook) {
            if (typeof customHooks[hook] === 'undefined') {
                customHooks[hook] = function () { };
            }
        });

        hooks = customHooks;
    };

    window.header = {
        show: show,
        hide: hide,
        defineHooks: defineHooks
    }

    // set custom hooks here
    defineHooks({});
    init();


})(window, document);
