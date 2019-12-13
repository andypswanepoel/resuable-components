// Possible extensions with data-attributes: 
// - collapse on scroll
// - collapse after initial expand

var modal = (function (el_root) {

  var hooks = {};
  var activeTriggers = [];
  var activeModals = [];

  var init = function () {

    hooks.beforeInit();

    // Set aria-describedby attribute by for the modal content
    var descBy = el_root.createElement("p");
    descBy.id = "modal-desc";
    descBy.innerText = "Tab through the modal to access the content. Press the escape key to exit the modal. Clicking outside of the modal may close the modal.";
    descBy.setAttribute("hidden", "");
    el_root.body.appendChild(descBy);

    hooks.afterInit();
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

  var toggleModal = function (el_click) {
    if (el_click.getAttribute("data-component") === "modal") {
      activeTriggers.push(el_click);
      var config = _getConfig(activeTriggers[activeTriggers.length - 1]);
      if (el_click.hasAttribute("data-target")) {
        var el_modal = el_root.getElementById(el_click.getAttribute("data-target"));
        open(el_modal, config);
      } else {
        createModal(el_click, config)
      }
    }

    if (el_click.hasAttribute("data-close-modal")) {
      var el_modal = activeModals[activeModals.length - 1];
      var config = _getConfig(activeTriggers[activeTriggers.length - 1]);
      close(el_modal, config);
      activeTriggers.pop();
    }
  }


  var createModal = function (el_trigger, config) {
    activeTriggers.push(el_trigger);

    // Create modal
    var el_content = el_root.getElementById(el_trigger.getAttribute("data-target-content"));
    var el_modal = el_content.cloneNode(true);
    el_modal.id = el_content.id + "-modal";

    // Append modal to body
    el_root.body.appendChild(el_modal);
    open(el_modal, config);
  }

  var open = function (el_modal, config) {

    hooks.beforeOpen(el_modal, config);

    // Add modal to the activeModals array
    activeModals.push(el_modal)

    // Add accessibility attributes
    el_modal.setAttribute("role", "dialog");
    el_modal.setAttribute("aria-modal", "true");
    el_modal.setAttribute("tabindex", "0");
    el_modal.setAttribute("data-modal", "")
    el_modal.removeAttribute("hidden");

    // If modal had been previously set to aria-hidden, remove that attribute
    el_modal.removeAttribute("aria-hidden");

    if (config.close_btn === "true") {
      var btn = el_root.createElement("button")
      btn.setAttribute("data-close-modal", "");
      btn.setAttribute("aria-label", "Close modal");
      btn.innerText = config.close_btn_text;
      el_modal.insertBefore(btn, el_modal.childNodes[0]);
    }

    // Adding an id to the label element within the modal;
    // If the id exists, use that 
    // If not, create o
    var modalLabel = el_modal.querySelector("[data-label]")
    if (!modalLabel.id) {
      modalLabel.setAttribute("id", el_modal.id + "-label");
    }

    // Set the aria-labelledby and aria-describedby attribute
    el_modal.setAttribute("aria-labelledby", modalLabel.id)
    el_modal.setAttribute("aria-describedby", "modal-desc")

    // Create the modal wrapper
    // Add it before the modal
    var wrapper = el_root.createElement("div");
    wrapper.id = el_modal.id + "-wrapper"
    wrapper.setAttribute("data-modal-wrapper", "")
    el_modal.parentNode.insertBefore(wrapper, el_modal)

    // Insert the element in the wrapper.
    // Add classes to the wrapper
    // Add the background to the element
    // Focus the modal
    wrap(el_modal, wrapper);
    _addClasses(wrapper, config.class_open);
    addBackground(el_modal, config)
    el_modal.focus();

    currentModalSR();

    hooks.afterOpen(el_modal, config);

    emitEvent("modalOpen", {
      modal: el_modal,
      component_config: config
    });
  }


  var close = function (el_modal, config) {

    config = config !== undefined ? config : _getConfig(activeTriggers[activeTriggers.length - 1]);

    hooks.beforeClose(el_modal, config);

    // Remove modal from the activeModals array
    activeModals.pop()

    // Removing accessibility attributes from the modal element
    el_modal.removeAttribute("role");
    el_modal.removeAttribute("aria-modal");
    el_modal.removeAttribute("tabindex");
    el_modal.removeAttribute("data-modal");
    el_modal.setAttribute("hidden", "");
    el_modal.style.zIndex = "";

    // If it had a close button added, we remove it
    if (config.close_btn === "true") {
      el_modal.querySelector("button[data-close-modal]").remove();
    }

    // Remove the aria-labelledby and aria-describedby attribure
    el_modal.removeAttribute("aria-labelledby");
    el_modal.removeAttribute("aria-describedby");

    // Remove the classes from the wrapper, then remove the modal from the wrapper
    _removeClasses(el_modal.closest("[data-modal-wrapper]"), config.class_open);
    unwrap(el_modal.closest("[data-modal-wrapper]"));

    removeBackground(el_modal);

    // If the modal was triggered by a [data-target-content], remove the modal that was duplicated
    if (activeTriggers[activeTriggers.length - 1].hasAttribute("data-target-content")) {
      el_modal.remove();
    }

    // If the modal was triggered by a hidden trigger, we need to determine where to send focus
    // Check the DOM for each of the main, role=main, or body. Whichever exists, send the focus there.
    if (activeTriggers[activeTriggers.length - 1].hasAttribute("hidden")) {
      var els_focus = ["main", "[role=main]", "body"].filter(function (el_focus) {
        return el_root.querySelector(el_focus)
      }).map(function(el_focus) {
        return el_root.querySelector(el_focus)
      })

      // Need to add tabindex to allow it to be focusable
      els_focus[0].setAttribute("tabindex", "0")
      els_focus[0].focus()
      els_focus[0].removeAttribute("tabindex")

      // If the modal was triggered by a trigger on the page, send focus to the trigger
    } else {
      activeTriggers[activeTriggers.length - 1].focus();
    }

    // If there are more than one modal open, run the function to search throught body element children
    // If it is the last modal, then remove aria hidden from all body element children
    if (activeModals.length > 0) {
      currentModalSR();
    } else {
      el_root.querySelectorAll("body > *:not(script)").forEach(function (el_body_child) {
        el_body_child.removeAttribute("aria-hidden")
      })
    }

    hooks.afterClose(el_modal, config);

    emitEvent("modalClose", {
      modal: el_modal,
      component_config: config
    });
  }

  /**
   * This function will search through the children of the body element
   * If the child does not contain the active modal, hide it from screenreaders
   * If it the child contains the active modal, then enable it to screenreaders.
   */
  var currentModalSR = function () {
    el_root.querySelectorAll("body > *:not(script)").forEach(function (el_hide) {
      if (!isDescendant(el_hide, activeModals[activeModals.length - 1])) {
        el_hide.setAttribute("aria-hidden", "true");
      } else {
        el_hide.removeAttribute("aria-hidden");
      }
    })
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
   * Adds a background to the provided element.
   * Uses the provided configs to determine whether the background should act as a close button.
   */
  var addBackground = function (element, config) {
    var bg = el_root.createElement("div");
    var currentZ;
    if (activeModals.length === 1) {
      currentZ = parseInt(config.z_index)
    } else {
      currentZ = parseInt(activeModals[0].style.zIndex);
    }
    bg.style.zIndex = currentZ + activeModals.indexOf(element);
    bg.setAttribute("data-active-bg", "")
    element.style.zIndex = currentZ + activeModals.indexOf(element);

    // These lines make sure that only one background opacity is shown and they don't compound.
    el_root.querySelectorAll("[data-active-bg]").forEach(function (overlay) {
      overlay.style.opacity = "0";
    })

    if (config.bg_close === "true") {
      bg.setAttribute("data-close-modal", "");
      var bg_text = el_root.createElement("button");
      bg_text.setAttribute("data-close-modal", "");
      bg_text.innerText = "Close modal";
      bg_text.classList.add("sr-only");
      wrap(bg_text, bg);
    }
    element.closest("[data-modal-wrapper]").insertBefore(bg, element);

  }

  /**
   * Removes a background from the provided element.
   */
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

  var unwrap = function (outer) {
    while (outer.firstChild) {
      outer.parentNode.insertBefore(outer.firstChild, outer)
    }
    outer.remove();
  }

  /**
   * Helper function to check if an child element is contained within a parent element
   */

  var isDescendant = function (parent, child) {
    var node = child.parentNode;
    while (node != null) {
      if (node == parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
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

  
  defineHooks({});
  _bindEvents();
  init();

  return {
    open: toggleModal,
    close: close
  }

})(document)

