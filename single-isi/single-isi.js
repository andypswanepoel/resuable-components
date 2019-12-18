//To do:
// Set default values, which can be edited
// Name space, all should include data-isi

var isiDrawer = (function (el_root) {

  var hooks = {},
    config,
    isiFixedHt, // define height first. Needs to be global as when it is hidden, we need to have access to the old height
    initPos,
    isiHidden;


  var init = function () {
    // Beforeinit forces the ISI to display as the drawer
    // Height is saved
    // After init then removes the drawer display
    config = _getConfig(el_root.querySelector("[data-component=isi]"));
    hooks.beforeInit()
    setTimeout(function () {
      initPos = window.pageYOffset;
    }, 500);
    createDrawer(el_root.querySelector("[data-component=isi]"));
    isiFixed = el_root.querySelector("[data-component=isi][data-isi-fixed]");isiFixedHt = isiFixed.offsetHeight;
    hide(isiFixed, config);
    
    hooks.afterInit();
  }

  var _getAttribute = function (element, attr, options) {
    var value = element.getAttribute(attr);
    if (value === null || value === undefined) {
      if (typeof options.default !== "undefined") {
        return options.default.toLowerCase();
      }
    }
    if (typeof options.valid !== "undefined") {
      if (options.valid.indexOf(value) > -1) {
        return value.toLowerCase();
      } else if (typeof options.default !== "undefined") {
        // We provided a list of valid options. The option specified in the
        // markup wasn't in that list. So return the default value.
        return options.default.toLowerCase();
      }
    }

    // Value was specified, but no default or list of valid options was given.
    // So just return whatever was in the markup.
    return value;
  };

  var _getConfig = function (element) {
    return {
      collapse_scroll: _getAttribute(element, "data-isi-scroll-collapse", { // This config determines whether the ISI should collapse to just the header on scroll
        default: "false",
        valid: ["true", "false"]
      }),
      collapse_full: _getAttribute(element, "data-isi-full-collapse", { // This config determines whether the ISI should collapse to just the header
        default: "false",
        valid: ["true", "false"]
      }),
      full_screen: _getAttribute(element, "data-isi-full-screen", { // This config determines whether the ISI should expand the full height of the window
        default: "true",
        valid: ["true", "false"]
      }),
      expand_max: _getAttribute(element, "data-isi-expand-max", { // This config will be used in combination with the data-isi-full-screen attribute to set the max height.
        default: "50%"
      }),
      class_expanded: _getAttribute(element, "data-classnames-expanded", {
        default: "expanded"
      }),
      class_collapsed: _getAttribute(element, "data-classnames-collapsed", {
        default: "collapsed"
      }),
    };
  };

  var _bindEvents = function () {
    el_root.addEventListener("click", clickHandler, false);
    el_root.addEventListener("scroll", isiScrollHandler, false);
    el_root.addEventListener("keydown", tabHandler, false);
    ["scroll", "resize", "load"].forEach(function (ev) { window.addEventListener(ev, isiVisHandler, false) })

  };

  // Determines the position of the static ISI and hides the drawer when it reaches the top of it
  var isiVisHandler = function (ev) {
    var isiFixed = el_root.querySelector("[data-component=isi][data-isi-fixed]");
    isiVisible(isiFixedHt) === true ? hide(isiFixed, config) : show(isiFixed, config);
    if (ev.type === "load") {
      isiFixed.setAttribute("data-initialized", "")
    } 
  }

  // Scroll handler to collapse ISI when scrolled the pixel limit
  var isiScrollHandler = function (ev) {
    var isiFixed = el_root.querySelector("[data-component=isi][data-isi-fixed]"),
      limit = 50,
      currentPos = window.pageYOffset;
    if (currentPos - initPos >= limit) {
      scrollCollapse(isiFixed, config);
    }
  }

  var clickHandler = function (ev) {
    // Check if we clicked an element for this component.
    var el_click = ev.target.closest("[data-isi-btn]");
    if (!el_click) {
      // We didn't click on the ISI toggle button.
      return;
    }
    var el_component = el_click.closest("[data-component=isi][data-isi-fixed]");
    toggle(el_component);
  };

  var tabHandler = function (ev) {
    var isiOpen = ev.target.closest("[data-component=isi][data-isi-fixed][aria-expanded=true]");
    if (!isiOpen) {
      // We didn't click on the ISI toggle button.
      return;
    }

    var focusables = [].slice.call(isiOpen.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));

    if (ev.keyCode === 9 && ev.target === focusables[focusables.length - 1]) {
      ev.preventDefault();
      focusables[0].focus();
    }
    if ((ev.keyCode === 9 && ev.shiftKey === true) &&
      ev.target === focusables[0]) {
      ev.preventDefault();
      focusables[focusables.length - 1].focus();
    }
  }

  var toggle = function (element) {
    hooks.beforeToggle();
    element.getAttribute("aria-expanded") === "false" ? expand(element, config) : collapse(element, config);
    hooks.afterToggle();
  }

  var expand = function (element, config) {
    hooks.beforeExpand();
    if (el_root.querySelector("[data-component=header]")) {
      element.style.maxHeight = window.innerHeight - el_root.querySelector("[data-component=header]").getBoundingClientRect().bottom + "px";
    } else {
      element.style.maxHeight = window.innerHeight + "px";
    }
    if (config.full_screen === "false") {
      element.style.maxHeight = config.expand_max;
    }

    element.querySelector("[data-isi-btn]").setAttribute("aria-expanded", "true");
    element.setAttribute("aria-expanded", "true");
    element.querySelector("[data-isi-content]").removeAttribute("aria-hidden");
    el_root.querySelectorAll("body > *:not(script)").forEach(function (el_hide) {
      if (el_hide !== element) {
        el_hide.setAttribute("aria-hidden", "true")
      }
    })
    addTabbing(element.querySelectorAll("[data-isi-content] a"))
    _removeClasses(element, config.class_collapsed);
    _addClasses(element, config.class_expanded);

    emitEvent("isiExpand", {
      component_config: config
    });

    hooks.afterExpand()

  }

  var collapse = function (element, config) {
    hooks.beforeCollapse();
    if (config.collapse_full === "true" || element.hasAttribute("data-scrolled")) {
      element.style.maxHeight = element.querySelector("[data-isi-header]").offsetHeight + "px";
    } else {
      element.style.maxHeight = "";
    }

    element.querySelector("[data-isi-btn]").setAttribute("aria-expanded", "false");
    element.setAttribute("aria-expanded", "false");
    element.querySelector("[data-isi-content]").setAttribute("aria-hidden", "true");
    isiFixedHt = element.offsetHeight != 0 ? element.offsetHeight : isiFixedHt;
    el_root.querySelectorAll("body > *:not(script)").forEach(function (el_hide) {
      el_hide.removeAttribute("aria-hidden")
    })
    removeTabbing(element.querySelectorAll("[data-isi-content] a"));
    _removeClasses(element, config.class_expanded);
    _addClasses(element, config.class_collapsed);

    emitEvent("isiCollapse", {
      component_config: config
    });

    hooks.afterCollapse();
  }

  // Used to add and remove classes based on what is in the data attribute
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

  // The add and remove tabbing functions are used to remove the tabbing from ISI links when the content is not visible
  var addTabbing = function (links) {
    links.forEach(function (link) {
      link.removeAttribute("tabindex")
    })
  }

  var removeTabbing = function (links) {
    links.forEach(function (link) {
      link.setAttribute("tabindex", "-1")
    })
  }

  // ISI will only collapse if:
  // - config is set to collapse on scroll
  // - the element is currently not hidden  
  var scrollCollapse = function (element, config) {

    if (config.collapse_scroll === "true" &&
      !element.hasAttribute("hidden") &&
      !element.hasAttribute("data-scrolled")) {
      element.setAttribute("data-scrolled", ""); //sets attribute to show it has collapsed from scroll
      collapse(element, config);
    }
  }

  var show = function (element, config) {
    hooks.beforeShow();
    element.removeAttribute("hidden");
    removeTabbing(element.querySelectorAll("[data-isi-content] a"));

    
    if (element.hasAttribute("data-initialized") && isiHidden === true) {
      emitEvent("isiShow", {
        component_config: config
      });
    }
    isiHidden = false;
    hooks.afterShow();
  }
  
  var hide = function (element, config) {
    hooks.beforeHide();
    element.setAttribute("hidden", "");
    addTabbing(element.querySelectorAll("[data-isi-content] a"));
    
    
    if (element.hasAttribute("data-initialized") && isiHidden === false) {
      emitEvent("isiHide", {
        component_config: config
      });
    }
    
    isiHidden = true;
    hooks.afterHide();
  }

  var isiVisible = function (isiFixedHt) {
    return window.pageYOffset + window.innerHeight >= el_root.querySelector("[data-component=isi]:not([data-isi-fixed])").offsetTop + isiFixedHt;
  }

  var createDrawer = function (el) {
    config = _getConfig(el);
    var isiFixed = el.cloneNode(true);
    isiFixed.setAttribute("data-isi-fixed", "");
    isiFixed.setAttribute("aria-expanded", "false");
    isiFixed.removeAttribute("id");
    isiFixed.querySelector("button").setAttribute("aria-expanded", "false")
    isiFixed.querySelector("button").setAttribute("aria-label", "Important Safety Information Toggle")
    isiFixed.querySelector("button").setAttribute("aria-controls", "isi-content")
    isiFixed.querySelector("[data-isi-content]").setAttribute("id", "isi-content");
    isiFixed.querySelector("[data-isi-content]").setAttribute("aria-hidden", "true");
    _addClasses(isiFixed, config.class_collapsed);

    el.parentNode.insertBefore(isiFixed, el)
  }

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
    el_root.dispatchEvent(event);
  };


  var defineHooks = function (custom_hooks) {
    [
      "beforeInit",
      "afterInit",
      "beforeToggle",
      "afterToggle",
      "beforeCollapse",
      "afterCollapse",
      "beforeExpand",
      "afterExpand",
      "beforeShow",
      "afterShow",
      "beforeHide",
      "afterHide"
    ].forEach(function (key) {
      if (typeof custom_hooks[key] === "undefined") {
        custom_hooks[key] = function () { };
      }
    });

    hooks = custom_hooks;
  };

  window.isi = {
    collapse: collapse,
    expand: expand,
    show: show,
    hide: hide,
    defineHooks: defineHooks
  };

  defineHooks({})
  _bindEvents();
  init();

  //closest polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;

      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  el_root.addEventListener("isiExpand", function (ev) {
    console.log(ev)
  })
  el_root.addEventListener("isiCollapse", function (ev) {
    console.log(ev)
  })
  el_root.addEventListener("isiHide", function (ev) {
    console.log(ev)
  })
  el_root.addEventListener("isiShow", function (ev) {
    console.log(ev)
  })

})(document)


