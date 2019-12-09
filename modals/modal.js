// Possible extensions with data-attributes: 
// - collapse on scroll
// - collapse after initial expand

var modal = (function (el_root) {

  var hooks = {};
  var activeTriggers = [];
  var activeModals = [];
  
  var init = function () {
    var el_component = el_root.querySelector("[data-component=modal]"); // Assumption: We should only have one area to hold the modals
    
    hooks.beforeInit()

    // Set aria-describedby attribute by for the modal content
    var descBy = el_root.createElement("p");
    descBy.id = "modal-desc"
    descBy.innerText =  "Tab through the modal to access the content. Press the escape key to exit the modal. Clicking outside of the modal may close the modal."; 
    descBy.setAttribute("hidden", "");
    el_component.appendChild(descBy)

    
    // Using the list of modals on the page, search the page for any triggers that will activate that modal
    var el_modals = el_component.querySelectorAll("[data-modal]");
    el_modals.forEach(function (el_modal) {
      
      // Set the labels id to be used for the aria-labelledby
      el_modal.querySelector("[data-label]").setAttribute("id", el_modal.id + "-label");
      el_modal.querySelector("[data-close-modal]").setAttribute("aria-label", "Close");
      
      // Set trigger attributes for accessibility and functionality
      var el_triggers = el_root.querySelectorAll("[data-target=" + el_modal.id + "]")
      el_triggers.forEach(function (el_trigger) {
        el_trigger.setAttribute("data-trigger-modal", "");
        el_trigger.setAttribute("data-target-modal", el_modal.id);
        el_trigger.setAttribute("aria-controls", el_modal.id);
        el_trigger.removeAttribute("data-target");
        el_trigger.removeAttribute("data-trigger");
      })
    })
    hooks.afterInit()
  }
  
  var _bindEvents = function () {
    el_root.addEventListener("click", clickHandler, false);
    el_root.addEventListener("keydown", keyHandler, false);
    el_root.addEventListener("keydown", modalTabHandler, false);
  }
  
  var clickHandler = function (ev) {
    
    if (ev.target.hasAttribute("data-trigger-modal") || ev.target.hasAttribute("data-close-modal")) {
      toggleModal(ev.target);
      ev.preventDefault()
    }
  }
  
  var keyHandler = function (ev) {
    if (ev.keyCode === 27 && activeModals.length > 0) {
      var el_modal = activeModals[activeModals.length - 1];
      var config = _getConfig(el_root.querySelector("[data-target-modal=" + el_modal.id + "]"))
      close(el_modal, config);
    }
  }
  
  var modalTabHandler = function (ev) {
    var el_modal = activeModals[activeModals.length - 1];
    if(!el_modal) {
      return;
    }
    var focusables = [].slice.call(el_modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
    
    if (ev.keyCode === 9 && focusables.indexOf(ev.target) >= 0) {
      
      // Shift tab on the first element focusable => focus on last
      if (ev.shiftKey) {
        if (ev.target === focusables[0]) {
          ev.preventDefault();
          focusables[focusables.length - 1].focus();
        }
      } else {
        // Tab on last element focusable => focus on first
        if (ev.target === focusables[focusables.length - 1]) {
          ev.preventDefault();
          focusables[0].focus();
        }
      }
    }
    
    // Tab outside modal => put it in focus
    if (ev.keyCode === 9 && focusables.indexOf(ev.target) === -1) {
      ev.preventDefault();
      focusables[0].focus();
      }
    }

  var toggleModal = function(el) {
    if (el.hasAttribute("data-trigger-modal")) {
      activeTriggers.push(el);
      var config = _getConfig(el)
      var el_modal = el_root.getElementById(el.getAttribute("data-target-modal"));
      show(el_modal, config, el);
    }
    
    if (el.hasAttribute("data-close-modal")) {
      var el_modal = activeModals[activeModals.length - 1];
      var config = _getConfig(el_root.querySelector("[data-target-modal=" + el_modal.id + "]"))
      close(el_modal, config);
      activeTriggers.pop();      
    }
  }

  var show = function (el, config) {
    config = config !== undefined ? config : _getModalConfig(el);

    hooks.beforeOpen(el, config);
    
    el_root.querySelectorAll("body > *:not([data-component=modal]):not(script)").forEach(function(el_non_modal) {
      el_non_modal.setAttribute("aria-hidden", "true");
    })
    activeModals.push(el)

    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("tabindex", "0");
    el.removeAttribute("hidden");
    
    _addClasses(el.closest("[data-component=modal]"), config.class_open);
    
    // Set the aria-labelledby and aria-describedby attribute
    el.setAttribute("aria-labelledby", el.id + "-label")
    el.setAttribute("aria-describedby", "modal-desc")
    
    if (config.external_link === "true") {
      var el_external_link = el.querySelector("[data-external-link]");
      var el_link_dest = activeTriggers[activeTriggers.length - 1] ? activeTriggers[activeTriggers.length - 1].getAttribute("href") : ""; // Need to allow a fallback value for the API call 
      el_external_link.setAttribute("href", el_link_dest)
    }
    addBackground(el, config)
    el.focus();

    hooks.afterOpen(el, config);

    emitEvent("modalOpen", {
      modal: el,
      component_config: config
    });
  }
  
  
  var close = function (el, config) {
    config = config !== undefined ? config : _getModalConfig(el);

    hooks.beforeClose(el, config);

    el_root.querySelectorAll("body > *:not([data-component=modal]):not(script)").forEach(function(el_non_modal) {
      el_non_modal.removeAttribute("aria-hidden");
    })
    activeModals.pop()
    el.removeAttribute("role");
    el.removeAttribute("aria-modal");
    el.removeAttribute("tabindex");
    el.setAttribute("hidden", "");
    el.style.zIndex = "";
    
    _removeClasses(el.closest("[data-component=modal]"), config.class_open);
    
    // Remove the aria-labelledby and aria-describedby attribure
    el.removeAttribute("aria-labelledby");
    el.removeAttribute("aria-describedby");
    
    removeBackground(el)
    activeTriggers[activeTriggers.length - 1].focus();

    hooks.afterClose(el, config);

    emitEvent("modalClose", {
      modal: el,
      component_config: config
    });
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

  var addBackground = function(element, config) {
    var bg = document.createElement("div");
    var zIndex_base = parseInt(_getAttribute(el_root.querySelector("[data-component=modal]"), "data-z-index", {"default": "100"}));
    bg.style.zIndex = zIndex_base + activeModals.indexOf(element);
    bg.setAttribute("data-active-bg", "")
    element.style.zIndex = zIndex_base + activeModals.indexOf(element);
    
    // These lines make sure that only one background opacity is shown and they don't compound
    el_root.querySelectorAll("[data-active-bg]").forEach(function(overlay) {
      overlay.style.opacity = "0";
    })
    
    if (config.bg_close === "true") {
      bg.setAttribute("data-close-modal", "")
    }
    el_root.querySelector("[data-component=modal]").insertBefore(bg, element);

  }
  
  var removeBackground = function(element) {
    element.previousElementSibling.remove();
    
    // These lines make sure that when a background is removed, the next background gets it's opacity back
    if (activeModals.length > 0) {
      activeModals[activeModals.length - 1].previousElementSibling.style.opacity = "";
    }
  }

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
      bg_close: _getAttribute(el_component, "data-bg-close", {
        default: "true",
        valid: ["true", "false"]
      }),
      class_open: _getAttribute(el_component, "data-classnames", {
        default: "modal-open"
      }),
      external_link: _getAttribute(el_component, "data-external-link", {
        default: "false",
        valid: ["true", "false"]
      })
    };
  };

  var _getModalConfig = function(element) {
    var trigger = el_root.querySelector("[data-target-modal=" + element.id + "]");
    return _getConfig(trigger);
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
      "beforeOpen",
      "afterOpen",
      "beforeClose",
      "afterClose"
    ].forEach(function (key) {
      if (typeof custom_hooks[key] === "undefined") {
        custom_hooks[key] = function () { };
      }
    });
    hooks = custom_hooks;
  };

  window.modals = {
    show: show,
    close: close
  }

  defineHooks({});
  _bindEvents();
  init();
})(document)

