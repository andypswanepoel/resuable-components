// Possible extensions with data-attributes: 
// - collapse on scroll
// - collapse after initial expand

var modal = (function (el_root) {

  var hooks = {};
  var activeTriggers = [];
  var activeModals = [];

  var init = function () {

    hooks.beforeInit()

    // Set aria-describedby attribute by for the modal content
    var descBy = el_root.createElement("p");
    descBy.id = "modal-desc";
    descBy.innerText = "Tab through the modal to access the content. Press the escape key to exit the modal. Clicking outside of the modal may close the modal.";
    descBy.setAttribute("hidden", "");
    el_root.body.appendChild(descBy)

    hooks.afterInit()
  }

  var _bindEvents = function () {
    el_root.addEventListener("click", clickHandler, false);
    el_root.addEventListener("keydown", keyHandler, false);
    el_root.addEventListener("keydown", modalTabHandler, false);
  }

  var clickHandler = function (ev) {
    var trigAttrs = ["data-target", "data-target-content", "data-close-modal"]

    trigAttrs.forEach(function (attr) {
      if (ev.target.hasAttribute(attr)) {
        toggleModal(ev.target);
        ev.preventDefault()
      }
    })
  }

  var keyHandler = function (ev) {
    if (ev.keyCode === 27 && activeModals.length > 0) {
      var el_modal = activeModals[activeModals.length - 1];
      var config = _getConfig(activeTriggers[activeTriggers.length - 1]);
      close(el_modal, config);
    }
  }

  var modalTabHandler = function (ev) {
    var el_modal = activeModals[activeModals.length - 1];
    if (!el_modal) {
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
      if (focusables.length === 0) {
        el_modal.focus;
      } else {
        focusables[0].focus();
      }
    }
  }

  var toggleModal = function (el) {
    if (el.getAttribute("data-component") === "modal") {
      activeTriggers.push(el);
      var config = _getConfig(el)
      if (el.hasAttribute("data-target")) {
        var el_modal = el_root.getElementById(el.getAttribute("data-target"));
        open(el_modal, config);
      } else {
        createModal(el)
      }
    }

    if (el.hasAttribute("data-close-modal")) {
      var el_modal = activeModals[activeModals.length - 1];
      var config = _getConfig(activeTriggers[activeTriggers.length - 1]);
      close(el_modal, config);
      activeTriggers.pop();
    }
  }

  var open = function (el, config) {
    config = config !== undefined ? config : _getModalConfig(el);

    hooks.beforeOpen(el, config);

    const container = el.closest("[data-modal-container]");
    el_root.querySelectorAll("body > *:not(script)").forEach(function (el_hide) {
      if (el_hide !== container) {
        el_hide.setAttribute("aria-hidden", "true");
      }
    })
    activeModals.push(el)

    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("tabindex", "0");
    el.setAttribute("data-modal", "")
    el.removeAttribute("hidden");

    if (config.close_btn === "true") {
      var btn = el_root.createElement("button")
      btn.setAttribute("data-close-modal", "");
      btn.setAttribute("aria-label", "Close modal");
      btn.innerText = config.close_btn_text;
      el.insertBefore(btn, el.childNodes[0]);
    }

    
    // Adding an id to the label element within the modal;
    el.querySelector("[data-label]").setAttribute("id", el.id + "-label");

    
    // Set the aria-labelledby and aria-describedby attribute
    el.setAttribute("aria-labelledby", el.id + "-label")
    el.setAttribute("aria-describedby", "modal-desc")
    
    // Create the modal wrapper to add classes
    var wrapper = el_root.createElement("div");
    wrapper.id = el.id + "-wrapper"
    wrapper.setAttribute("data-modal-wrapper", "")
    
    // Insert the element in the wrapper.
    // Then insert wrapper in the container.
    wrap(wrap(el, wrapper), container);
    
    _addClasses(wrapper, config.class_open);

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
    
    const container = el.closest("[data-modal-container]");
    el_root.querySelectorAll("body > *:not(script)").forEach(function (el_show) {
      if (el_show !== container) {
        el_show.removeAttribute("aria-hidden");
      }
    })
    activeModals.pop()
    el.removeAttribute("role");
    el.removeAttribute("aria-modal");
    el.removeAttribute("tabindex");
    el.removeAttribute("data-modal");
    el.setAttribute("hidden", "");
    el.style.zIndex = "";

    if (config.close_btn === "true") {
      el.querySelector("button[data-close-modal]").remove();
    }
    
    
    // Remove the aria-labelledby and aria-describedby attribure
    el.removeAttribute("aria-labelledby");
    el.removeAttribute("aria-describedby");
    
    _removeClasses(el.closest("[data-modal-wrapper]"), config.class_open);
    unwrap(el.closest("[data-modal-wrapper]"));

    removeBackground(el);

    if (activeTriggers[activeTriggers.length - 1].hasAttribute("data-target-content")) {
      el.parentNode.remove();
    }

    activeTriggers[activeTriggers.length - 1].focus();

    hooks.afterClose(el, config);

    emitEvent("modalClose", {
      modal: el,
      component_config: config
    });
  }

  var createModal = function (el) {
    activeTriggers.push(el);
    var config = _getConfig(el)

    // Create container
    var container = el_root.createElement("div")
    container.setAttribute("data-modal-container", "");

    // Create modal
    var el_content = el_root.getElementById(el.getAttribute("data-target-content"));
    var el_modal = el_content.cloneNode(true);
    el_modal.id = el_content.id + "-modal";
    
    // Append to body
    container.appendChild(el_modal);
    el_root.body.appendChild(container);
    open(el_modal, config);
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

  var addBackground = function (el, config) {
    var bg = el_root.createElement("div");
    var bg_text = el_root.createElement("span");
    bg_text.innerText = "Close modal"
    bg_text.classList.add("sr-only");
    wrap(bg_text, bg);
    var currentZ;
    if (activeModals.length === 1) {
      currentZ = parseInt(config.z_index)
    } else {
      currentZ = parseInt(activeModals[0].style.zIndex);
    }
    bg.style.zIndex = currentZ + activeModals.indexOf(el);
    bg.setAttribute("data-active-bg", "")
    el.style.zIndex = currentZ + activeModals.indexOf(el);

    // These lines make sure that only one background opacity is shown and they don't compound
    el_root.querySelectorAll("[data-active-bg]").forEach(function (overlay) {
      overlay.style.opacity = "0";
    })

    if (config.bg_close === "true") {
      bg.setAttribute("data-close-modal", "")
    }
    el.closest("[data-modal-wrapper]").insertBefore(bg, el);

  }

  var removeBackground = function (element) {
    element.previousElementSibling.remove();

    // These lines make sure that when a background is removed, the next background gets it's opacity back
    if (activeModals.length > 0) {
      activeModals[activeModals.length - 1].previousElementSibling.style.opacity = "";
    }
  }

  var wrap = function (inner, outer) {
    outer.appendChild(inner);
    return outer;
  }

  // To do: try write this with a while loop
  var unwrap = function (outer) {
    while (outer.firstChild) {
      outer.parentNode.insertBefore(outer.firstChild, outer)
    }
    outer.remove();
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
      close_btn: _getAttribute(el_component, "data-close-btn", {
        default: "true",
        valid: ["true", "false"]
      }),
      close_btn_text: _getAttribute(el_component, "data-close-btn-text", {
        default: "Close"
      }),
      bg_close: _getAttribute(el_component, "data-bg-close", {
        default: "true",
        valid: ["true", "false"]
      }),
      class_open: _getAttribute(el_component, "data-classnames", {
        default: "modal-open"
      }),
      z_index: _getAttribute(el_component, "data-z-index", {
        default: "100"
      })
    };
  };

  var _getModalConfig = function (element) {
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
    trigger: toggleModal,
    close: close
  }

  defineHooks({});
  _bindEvents();
  init();
})(document)

