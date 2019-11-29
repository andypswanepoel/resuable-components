// Possible extensions with data-attributes: 
// - collapse on scroll
// - collapse after initial expand

const tabbedContent = (function(el_root) {
    const init = function() {
        const tabbedContent = el_root.querySelectorAll("[data-component=tabbed-content]");
        [].forEach.call(tabbedContent, function(el_component, i) {initializeTab(el_component, i)})
    }

    const initializeTab = function(el_component, i) {
        const config = _getConfig(el_component);
        if (config.autoinit === "false") {
            return
        }

        // Add a unique id for each component 
        el_component.setAttribute("id", "tabbed-content-" + i)
        
        //create the list that will store the buttons for each component
        const list = el_root.createElement("ul");
        list.setAttribute("role", "tablist");
        el_component.prepend(list)

        // Initialize panels
        // Finds the panels corresponding to each component
        // Adds the appropriate accessibility labels and unique id for each panel
        // It based on the index of the panel in the component, and the index of the component itself

        const el_tabpanels = el_component.querySelectorAll("[id^=tabbed-content-" + i + "] > [data-tab-panel]");
        [].forEach.call(el_tabpanels, function(el_tabpanel, j) {
            el_tabpanel.setAttribute("id", "tabpanel-" + i + "-" + j)
            el_tabpanel.setAttribute("role", "tabpanel")
            el_tabpanel.setAttribute("aria-labelledby", "tab-" + i + "-" + j)
            el_tabpanel.setAttribute("hidden", "")
            _removeClasses(el_tabpanel, config.class_selected);
            if (j === parseInt(config.initial_tab)){
              el_tabpanel.removeAttribute("hidden")
              el_tabpanel.setAttribute("tabindex", "0");
              _addClasses(el_tabpanel, config.class_selected)
            } 

            // Create the list item and the button corresponding to each tab
            // Adds the appropriate accessibility labels and unique id for each tab
            // Again, it is based on the index of the panel and the component
            const listitem = el_root.createElement("li");
            const el_tab = el_root.createElement("button");
            el_tab.setAttribute("id", "tab-" + i + "-" + j);
            el_tab.setAttribute("data-tab", "");
            el_tab.setAttribute("data-tab-group", i);
            el_tab.setAttribute("role", "tab");
            el_tab.setAttribute("aria-controls", "tabpanel-" + i + "-" + j);
            el_tab.setAttribute("aria-selected", "false");

            
            // Name the buttons based on data-attribute from tab content 
            // If no name is provided, it will default to the element id
            // Determine which tab is open
            // Appends the tabs to the list, and the list to the component
            // To do: see if this can be stored in a config at the tab level
            el_tab.innerHTML = el_tabpanel.getAttribute("data-tab-name") != "" || undefined || null ? el_tabpanel.getAttribute("data-tab-name") : "tab-" + i + "-" + j
            el_tab.setAttribute("tabindex", "-1");
            _removeClasses(el_tab, config.class_selected);
            if (j === parseInt(config.initial_tab)){
                el_tab.setAttribute("aria-selected", "true");
                el_tab.removeAttribute("tabindex");
                _addClasses(el_tab, config.class_selected)
            }
            listitem.appendChild(el_tab);
            list.appendChild(listitem);
        })
    }

    
    const clickHandler = function(ev) {
        const el_tab = ev.target.closest("[data-tab]");
        if(!el_tab) {
          return
        }
        const config = _getButtonConfig(el_tab)
        // if a button was clicked, then change the tab
        changeTab(el_tab, config)
    }

    const keyHandler = function(ev) {
        const el_tab = ev.target.closest("[data-tab]")
        if(!el_tab) {
            return
        }
        // Gets list of tabs in each module
        // Finds the index of the current button
        
        const el_tabs = el_tab.closest("[role=tablist]").querySelectorAll("[data-tab]")
        const index = [].slice.call(el_tabs).indexOf(el_tab);
        const config = _getButtonConfig(el_tab);

        const key = ev.keyCode === 37 ? "left" : ev.keyCode === 39 ? "right" :  ev.keyCode === 38 ? "up" : ev.keyCode === 40 ? "down" : null;
        const deviceWidth = window.innerWidth >= 768 ? "desktop" : "mobile"
        let el_new_tab

        // If the device is <768px wide and mobile stack is on, controls are with up and down keys
        if (config.mobile_stack === "true" && deviceWidth === "mobile") {
            el_new_tab = key === "up" ? el_tabs[index - 1] : key === "down" ? el_tabs[index + 1] : null
        } else {
            el_new_tab = key === "left" ? el_tabs[index - 1] : key === "right" ? el_tabs[index + 1] : null
        }

        if (el_new_tab != undefined || null) {
          el_new_tab.focus();
          changeTab(el_new_tab, config)
        }
        
        // Not sure if this is a good idea. Need to talk to Kelly. On desktop will allow pressing the down key to focus
        if ((config.mobile_stack === "true" && deviceWidth !== "mobile"
            || config.mobile_stack !== "true")
            && key === "down" ){
            focusPanel(el_tab)
        }
    }

    const changeTab = function(el, config) {
        const el_tabs = el.closest("[role=tablist]").querySelectorAll("[data-tab]");
        // Deselect all tabs
        [].forEach.call(el_tabs, function(tab) {
          _removeClasses(tab, config.class_selected)
          tab.setAttribute("aria-selected", "false");
          tab.setAttribute("tabindex", "-1");
        })
        // Select the new tab
        el.setAttribute("aria-selected", "true");
        el.removeAttribute("tabindex");
        _addClasses(el, config.class_selected)
        changePanel(el, config);
    }

    const changePanel = function(el, config) {
        // From the new tab, find the panel it controls through the aria controls attribute
        const el_tabpanel_id = el.getAttribute("aria-controls");
        const el_tabpanel = el_root.getElementById(el_tabpanel_id)
        const el_tabpanels = childrenMatches(el_tabpanel.parentElement, "[data-tab-panel]");
        [].forEach.call(el_tabpanels, function(tabpanel) {
            _removeClasses(tabpanel, config.class_selected)
            tabpanel.setAttribute("hidden", "");
            tabpanel.removeAttribute("tabindex");
        })
        el_tabpanel.removeAttribute("hidden");
        el_tabpanel.setAttribute("tabindex", "0");
        _addClasses(el_tabpanel, config.class_selected)

    }

    const focusPanel = function(el) {
        // Focus on the panel
        const el_tabpanel_id = el.getAttribute("aria-controls");
        const el_tabpanel = el_root.getElementById(el_tabpanel_id);
        el_tabpanel.focus();
    }

    const _addClasses = function(element, classes) {
      classes.split(" ").forEach(function(classname) {
        element.classList.add(classname);
      });
    };

    const _removeClasses = function(element, classes) {
      classes.split(" ").forEach(function(classname) {
        element.classList.remove(classname);
      });
    };

    /**
   * Helper function to get an element attribute, validated against a list of
   * allowable values, and a default value for when the attribute is empty or
   * an invalid value was found.
   */
    var _getAttribute = function(element, attr, options) {
      var value = element.getAttribute(attr);
      if (value === null || value === undefined) {
        if (typeof options.default !== "undefined") {
          return options.default.toLowerCase();
        }
      }
      if (typeof options.valid !== "undefined") {
        if (options.valid.includes(value)) {
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


    /**
     * Get defined configuration for the given component.
     */

    const _getConfig = function(el_component) {
        return {
          initial_tab: _getAttribute(el_component, "data-initial-tab", {
            default: "0"
          }),
          autoinit: _getAttribute(el_component, "data-autoinit", {
            default: "true",
            valid: ["true", "false"]
          }),
          mobile_stack: _getAttribute(el_component, "data-mobile-stack", {
            default: "false",
            valid: ["true", "false"]
          }),
          class_selected: _getAttribute(el_component, "data-classnames-selected", {
            default: "selected"
          }),
          class_not_selected: _getAttribute(el_component, "data-classnames-collapsed", {
              default: "not-selected"
            }
          )
        };
      };

    const _getButtonConfig = function(element) {
      var component_group = element.getAttribute("data-tab-group");
      console.log(component_group)
      var el_component = el_root.querySelector(
        "[data-component=tabbed-content][id=tabbed-content-" +
          component_group +
          "]"
      );
      return _getConfig(el_component);
    };

    
    // Helper functions
    const childrenMatches = function (elem, selector) {
        return Array.prototype.filter.call(elem.children, function (child) {
            return child.matches(selector);
        });
    };

    window.tab = {
        changeTab: changeTab
    }

    el_root.addEventListener("click", clickHandler, false);
    el_root.addEventListener("keydown", keyHandler, false);

    init()
})(document)
   

