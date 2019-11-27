//To do:
// Set default values, which can be edited
// Name space, all should include data-isi

const isiDrawer = (function(el_root) {

    var hooks = {},
        isiDrawerHt, //define height first. Needs to be global as when it is hidden, we need to have access to the old height
        initPos = window.scrollY; //To do: collapse the ISI depending on configs

    
    const init = function() {
        // Beforeinit forces the ISI to display as the drawer
        // Height is saved
        // Afterinit then removes the drawer display
        hooks.beforeInit(el_root.querySelector("[data-component=isi]"));
        isiDrawerHt = el_root.querySelector("[data-component=isi][data-isi-fixed]").offsetHeight;
        hooks.afterInit(el_root.querySelector("[data-component=isi]"));
    }

    const _getAttribute = function(element, attr, options) {
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

      const _getConfig = function(element) {
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
          class_expanded: _getAttribute(element, "data-classnames-expanded", {
            default: "expanded"
          }),
          class_collapsed: _getAttribute(element, "data-classnames-collapsed", {
						default: "collapsed"
        	}),
        };
      };

    const _bindEvents = function() {
        el_root.addEventListener("click", clickHandler, false);
        el_root.addEventListener("scroll", isiScrollHandler, false); 
        ["scroll", "resize", "DOMContentLoaded"].forEach(function(ev) {window.addEventListener(ev, isiVisHandler, false)}) // This event listener determines when the ISI should act as a drawer

    };

    // Determines the position of the previous element and removes the drawer functionality when it reaches the bottom of it
    const isiVisHandler = function(event) {
        const isiDrawer = el_root.querySelector("[data-component=isi][data-isi-fixed]");
        const isi = el_root.querySelector("[data-component=isi]");
        const prevEl = el_root.querySelector("[data-component=isi]").previousElementSibling;
        isiVisible(isiDrawer, prevEl, isiDrawerHt) === true ? hide(isi) : show(isi)
    }


    // Scroll handler to collapse ISI when scrolled the pixel limit
    const isiScrollHandler = function(event) {
        const element = el_root.querySelector("[data-component=isi]");
        const config = _getConfig(element);
        const limit = 50;
        
        curPos = window.scrollY;
        if (curPos - initPos >= limit) {
            scrollCollapse(element, config);
        }
    }
    
    const clickHandler = function(event) {
        // Check if we clicked an element for this component.
        const el_click = event.target.closest("[data-isi-btn]");
        if (!el_click) {
            // We didn't click on the ISI toggle button.
            return;
        }
        const el_component = el_click.closest("[data-component=isi]");
        toggle(el_component);
    };

    const toggle = function(element) {
			hooks.beforeToggle();
			const config = _getConfig(element);
      element.getAttribute("aria-expanded") === "false" ? expand(element, config) : collapse(element, config);
			hooks.afterToggle();
    }

    const expand = function(element, config) {
        hooks.beforeExpand();
        if (config.collapse_full === "true" || element.hasAttribute("data-scrolled")) {
          element.style.maxHeight = "";
        }
        if (config.full_screen === "false") {
            element.style.maxHeight = "50%";
        }
        element.querySelector("[data-isi-btn]").innerHTML = "-"
        element.querySelector("[data-isi-btn]").setAttribute("aria-expanded", "true");
        element.setAttribute("aria-expanded", "true");
				element.querySelector("[data-isi-content]").removeAttribute("aria-hidden");
				_removeClasses(element, config.class_collapsed);
        _addClasses(element, config.class_expanded);
        hooks.afterExpand(el_root.querySelectorAll("[data-isi-content] a"))

    }
    
    const collapse = function(element, config) {
        hooks.beforeCollapse();
        if (config.collapse_full === "true" || element.hasAttribute("data-scrolled")) {
            element.style.maxHeight = element.querySelector("[data-isi-header]").offsetHeight + "px";
        }
        if (config.full_screen === "false") {
            element.style.maxHeight = "";
        }
        element.querySelector("[data-isi-btn]").innerHTML = "+"
        element.querySelector("[data-isi-btn]").setAttribute("aria-expanded", "false");
        element.setAttribute("aria-expanded", "false");
				element.querySelector("[data-isi-content]").setAttribute("aria-hidden", "true");
				_removeClasses(element, config.class_expanded);
        _addClasses(element, config.class_collapsed);
        isiDrawerHt = element.offsetHeight != 0 ? element.offsetHeight : isiDrawerHt;
        hooks.afterCollapse(el_root.querySelectorAll("[data-isi-content] a"));
		}
		
		//Used to add and remove classes based on what is in the data attribute
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
    

    const applyShow = function(element) {
      element.setAttribute("data-isi-fixed", "")
      element.setAttribute("aria-expanded", isiExpanded(element.querySelector("[data-isi-btn]"))); // I have left this in for cases were we don't want to lock the page on expand; allows us to retain the state
      element.querySelector("[data-isi-content]").setAttribute("aria-hidden", !isiExpanded(element.querySelector("[data-isi-btn]"))); // I have left this in for cases were we don't want to lock the page on expand; allows us to retain the state
      element.querySelector("[data-isi-btn]").removeAttribute("hidden");
      element.style.maxHeight = isiDrawerHt + "px";
    }

    const applyHide = function(element) {
      element.removeAttribute("data-isi-fixed")
        element.removeAttribute("aria-expanded");
        element.querySelector("[data-isi-content]").removeAttribute("aria-hidden");
        element.querySelector("[data-isi-btn]").setAttribute("hidden", "");
        element.style.maxHeight = "";
    }

    // The add and remove tabbing functions are used to remove the tabbing from ISI links when the content is not visible
    const addTabbing = function(links) { 
      [].forEach.call(links, function(link) {
        link.removeAttribute("tabindex")
      })
    }

    const removeTabbing = function(links) {
      [].forEach.call(links, function(link) {
        link.setAttribute("tabindex", "-1")
      })
    }

    // ISI will only collapse if:
    // - config is set to collapse on scroll
    // - the element is currently in the drawer state
    const scrollCollapse = function(element, config) {
        if (config.collapse_scroll === "true" && element.hasAttribute("data-isi-fixed")) {
            element.setAttribute("data-scrolled", ""); //sets attribute to show it has collapsed from scroll
            collapse(element, config);
        } 
    }

    const show = function(element) {
        hooks.beforeShow();
        applyShow(element)
        hooks.afterShow(el_root.querySelectorAll("[data-isi-content] a"));
      }
      
      const hide = function(element) {
        hooks.beforeHide();
        applyHide(element);
        hooks.afterHide(el_root.querySelectorAll("[data-isi-content] a"));
    }

    const isiVisible = function(isiDrawer, prevEl, isiDrawerHt) {
      return window.pageYOffset + window.innerHeight - isiDrawerHt > prevEl.offsetTop + prevEl.offsetHeight
    }

    const isiExpanded = function(el) {
      return el.getAttribute("aria-expanded");
    }

    /**
	 * Emit a custom event.
	 */
	// var emitEvent = function (type, details) {
	// 	if (typeof window.CustomEvent !== "function") {
    //         return;
    //     }

	// 	var event = new CustomEvent(type, {
	// 		bubbles: true,
	// 		detail: details
	// 	});
    //     el_root.dispatchEvent(event);
	// };


    const defineHooks = function(custom_hooks) {
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
        ].forEach(function(key) {
            if (typeof custom_hooks[key] === "undefined") {
                custom_hooks[key] = function() {};
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
      
    defineHooks({
        "beforeInit" : show,
        "afterInit" : hide,
        "afterShow" : removeTabbing,
        "afterHide" : addTabbing,
        "beforeExpand" : bodyLock.lock,
        "afterExpand" : addTabbing,
        "beforeCollapse" : bodyLock.unlock,
        "afterCollapse" : removeTabbing
    })
    
    _bindEvents();
    init();

     //closest polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                  Element.prototype.webkitMatchesSelector;
    }
    
    if (!Element.prototype.closest) {
      Element.prototype.closest = function(s) {
        var el = this;
    
        do {
          if (el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    }
        
})(document)
   

