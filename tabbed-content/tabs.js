// Possible extensions with data-attributes: 
// - collapse on scroll
// - collapse after initial expand

var tabbedContent = (function (el_root) {

  var hooks = {};

  var init = function () {

    var el_components = el_root.querySelectorAll("[data-component=tab]");
    initComponents("[data-component]");
    el_components.forEach(function (el_component, i) {
      var autoinit = _getAttribute(el_component, "data-autoinit", {
        default: "true",
        valid: ["true", "false"]
      });

      if (autoinit === "true") {
        initTab(el_component, i)
      }
    })
  }


  const countParents = function(el, depth) {
    if (el.parentNode === null) {
      return depth;
    } else {
      depth++;
      return countParents(el.parentNode, depth);
    }
  };

  // Find all my panel elements and initialize with new attributes.
  // Anything that looks like a child component element will be ignored.
  var initComponents = function (selector) {
    document.querySelectorAll(selector).forEach(function(el_component) {
      var type = el_component.getAttribute("data-component");

      ["panel"].forEach(function(attr) {
        var els = el_component.querySelectorAll("[data-" + attr + "]");
        if (els.length === 0) {
          return
        }
        var depth = countParents(els[0], 0);
        els.forEach(function(el) {
          if (countParents(el, 0) === depth) {
            el.removeAttribute(["data", attr].join("-"));
            el.setAttribute(["data", attr, type].join("-"), "");
          }
        });
      });
    });
  };

  var initAll = function () {
    initComponents("[data-component]");
    var el_components = el_root.querySelectorAll("[data-component=tab]");
    el_components.forEach(function (el_component, i) {
      var initialized = _getAttribute(el_component, "data-initialized", {
        default: "false",
        valid: ["true", "false"]
      });
      if (initialized === "false") {
        initTab(el_component, i);
      }
    });
  };

  var initTab = function (el_component, i) {
    var config = _getConfig(el_component);
    i = i !== undefined ? i : [].indexOf.call(el_root.querySelectorAll("[data-component=tab]"), el_component);
    hooks.beforeInit(el_component, config)

    // Add a unique id for each component 
    el_component.setAttribute("id", "tab-content-" + i)
    el_component.setAttribute("data-initialized", "true");

    //create the list that will store the buttons for each component
    var list = el_root.createElement("ul");
    list.setAttribute("role", "tablist");
    el_component.prepend(list)

    // Initialize panels
    // Finds the panels corresponding to each component
    // Adds the appropriate accessibility labels and unique id for each panel
    // It based on the index of the panel in the component, and the index of the component itself

    var el_tabpanels = el_component.querySelectorAll("[id^=tab-content-" + i + "] > [data-panel-tab]");
    var numSelected = [].filter.call(el_tabpanels, function (el_tabpanel) {
      return el_tabpanel.getAttribute("data-default-state") === "selected"
    }).length;
    el_tabpanels.forEach(function (el_tabpanel, j) {
      el_tabpanel.setAttribute("id", "tabpanel-" + i + "-" + j)
      el_tabpanel.setAttribute("role", "tabpanel")
      el_tabpanel.setAttribute("aria-labelledby", "tab-" + i + "-" + j)
      el_tabpanel.setAttribute("hidden", "")
      _removeClasses(el_tabpanel, config.class_selected);

      var selected = _getAttribute(el_tabpanel, "data-default-state", {
        default: "unselected",
        valid: ["selected", "unselected"]
      });

      // Only one tab can be selected to be open
      // Check if
      if (numSelected !== 1 && j === 0) {
        selectPanel(el_tabpanel, config)
      }

      if (numSelected === 1 && selected === "selected") {
        selectPanel(el_tabpanel, config)
      }

      // Create the list item and the button corresponding to each tab
      // Adds the appropriate accessibility labels and unique id for each tab
      // Again, it is based on the index of the panel and the component
      var listitem = el_root.createElement("li"),
        el_tab = el_root.createElement("button");
      el_tab.setAttribute("id", "tab-" + i + "-" + j);
      el_tab.setAttribute("data-trigger-tab", "");
      el_tab.setAttribute("data-tab-group", i);
      el_tab.setAttribute("role", "tab");
      el_tab.setAttribute("aria-controls", "tabpanel-" + i + "-" + j);

      deselectTabs(el_tab, config)

      // Name the buttons based on data-attribute from tab content 
      // If no name is provided, it will default to the element id
      // Determine which tab is open
      // Appends the tabs to the list, and the list to the component
      // To do: see if this can be stored in a config at the tab level

      var tabName = _getAttribute(el_tabpanel, "data-tab-name", {
        default: "Tab " + (j + 1)
      });

      el_tab.innerHTML = tabName;

      if (numSelected !== 1 && j === 0) {
        selectTab(el_tab, config)
      }
      if (numSelected === 1 && selected === "selected") {
        selectTab(el_tab, config)
      }

      listitem.appendChild(el_tab);
      list.appendChild(listitem);
    })
    hooks.afterInit(el_component, config)
  }

  var _bindEvents = function () {
    el_root.addEventListener("click", clickHandler, false);
    el_root.addEventListener("keydown", keyHandler, false);
  }

  var clickHandler = function (ev) {
    var el_tab = ev.target.closest("[data-trigger-tab]");
    if (!el_tab) {
      return
    }
    var config = _getButtonConfig(el_tab)
    // if a button was clicked, then change the tab
    changeTab(el_tab, config)
  }

  var keyHandler = function (ev) {
    var el_tab = ev.target.closest("[data-trigger-tab]")
    if (!el_tab) {
      return
    }

    // Gets list of tabs in each module
    // Finds the index of the current button
    var el_tabs = el_tab.closest("[role=tablist]").querySelectorAll("[data-trigger-tab]"),
      index = [].slice.call(el_tabs).indexOf(el_tab),
      config = _getButtonConfig(el_tab),
      key = ev.keyCode === 37 ? "left" : ev.keyCode === 39 ? "right" : ev.keyCode === 38 ? "up" : ev.keyCode === 40 ? "down" : null,
      el_new_tab;

    // If the device is <768px wide and mobile stack is on, controls are with up and down keys
    if (config.mobile_stack === "true" && window.innerWidth < config.mobile_break) {
      el_new_tab = key === "up" ? el_tabs[index - 1] : key === "down" ? el_tabs[index + 1] : null
    } else {
      el_new_tab = key === "left" ? el_tabs[index - 1] : key === "right" ? el_tabs[index + 1] : null
    }

    if (el_new_tab != undefined || null) {
      el_new_tab.focus();
      changeTab(el_new_tab, config)
    }

    // Not sure if this is a good idea. Need to talk to Kelly. On desktop will allow pressing the down key to focus
    if ((config.mobile_stack === "true" && window.innerWidth >= config.mobile_break
      || config.mobile_stack !== "true")
      && key === "down") {
      focusPanel(el_tab)
    }
  }

  var selectPanel = function (el, config) {
    el.removeAttribute("hidden")
    el.setAttribute("tabindex", "0");
    _addClasses(el, config.class_selected)
  }

  var deselectTabs = function (el, config) {
    el.setAttribute("aria-selected", "false");
    el.setAttribute("tabindex", "-1");
    _removeClasses(el, config.class_selected)
  }

  var selectTab = function (el, config) {
    el.setAttribute("aria-selected", "true");
    el.removeAttribute("tabindex");
    _addClasses(el, config.class_selected)
  }


  var changeTab = function (el, config) {
    var el_tabs = el.closest("[role=tablist]").querySelectorAll("[data-trigger-tab]");
    config = config !== undefined ? config : _getButtonConfig(el);
    hooks.beforeSelect(el, config);
    // Deselect all tabs
    el_tabs.forEach(function (tab) {
      deselectTabs(tab, config)
    })
    // Select the new tab
    selectTab(el, config);
    changePanel(el, config);

    emitEvent("tabSelected", {
      tab: el,
      component_config: config
    });
    hooks.afterSelect(el, config)
  }

  var changePanel = function (el, config) {
    // From the new tab, find the panel it controls through the aria controls attribute
    var el_tabpanel_id = el.getAttribute("aria-controls"),
      el_tabpanel = el_root.getElementById(el_tabpanel_id),
      el_tabpanels = childrenMatches(el_tabpanel.parentElement, "[data-panel-tab]");
      el_tabpanels.forEach(function (tabpanel) {
      _removeClasses(tabpanel, config.class_selected)
      tabpanel.setAttribute("hidden", "");
      tabpanel.removeAttribute("tabindex");
    })
    selectPanel(el_tabpanel, config);
  }

  var focusPanel = function (el) {
    // Focus on the panel
    var el_tabpanel_id = el.getAttribute("aria-controls");
    var el_tabpanel = el_root.getElementById(el_tabpanel_id);
    el_tabpanel.focus();
  }


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
      if (options.valid.includes(value)) {
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
      autoinit: _getAttribute(el_component, "data-autoinit", {
        default: "true",
        valid: ["true", "false"]
      }),
      mobile_stack: _getAttribute(el_component, "data-tab-mobile-stack", {
        default: "false",
        valid: ["true", "false"]
      }),
      mobile_break: _getAttribute(el_component, "data-tab-mobile-width", {
        default: "768"
      }),
      class_selected: _getAttribute(el_component, "data-classnames-selected", {
        default: "selected"
      }),
      class_unselected: _getAttribute(el_component, "data-classnames-unselected", {
        default: "not-selected"
      }
      )
    };
  };

  var _getButtonConfig = function (element) {
    var component_group = element.getAttribute("data-tab-group");
    var el_component = el_root.querySelector(
      "[data-component=tab][id=tab-content-" +
      component_group +
      "]"
    );
    return _getConfig(el_component);
  };


  // Helper function to get the direct children of an element which match a selector

  var childrenMatches = function (elem, selector) {
    return [].filter.call(elem.children, function (child) {
      return child.matches(selector);
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
    el_root.dispatchEvent(event);
  };

  var defineHooks = function (custom_hooks) {
    [
      "beforeInit",
      "afterInit",
      "beforeSelect",
      "afterSelect"
    ].forEach(function (key) {
      if (typeof custom_hooks[key] === "undefined") {
        custom_hooks[key] = function () { };
      }
    });
    hooks = custom_hooks;
  };

  window.tab = {
    changeTab: changeTab,
    init: initTab,
    initAll: initAll,
    defineHooks: defineHooks
  }

  defineHooks({});
  _bindEvents();
  init();
})(document)


