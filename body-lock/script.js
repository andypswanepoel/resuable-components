const bodyLock = (function(el_root) {

    var hooks = {};
    let w;
    
    const init = function() {
      // This determines the width of the scroll bar
      // a and b are divs used to determine the scrollbar width
      // this works because the 100% width of the child element will not include the scroll bar
      // width of parent is 100, including the scrollbar
      const a = el_root.createElement("div");
      a.style.visibility = "hidden";
      a.style.width = "100%";
      a.style.overflowY = "scroll";
      el_root.querySelector('body').appendChild(a);
      const b = el_root.createElement("div");
      b.style.width = "100%";
      a.appendChild(b)
      w = a.offsetWidth - b.offsetWidth
      
      a.parentNode.removeChild(a);
    }

    const lock = function() {
        el_root.querySelector('html').style.paddingRight = w + "px";
        el_root.querySelector("[data-component=isi]").style.paddingRight = w + "px";
        el_root.querySelector('html').style.overflow = "hidden"
      }
      
      const unlock = function() {
        el_root.querySelector('html').style.paddingRight = ""
        el_root.querySelector("[data-component=isi]").style.paddingRight = "";
        el_root.querySelector('html').style.overflow = ""
    }

    const defineHooks = function(custom_hooks) {
        [
          "beforeInit",
          "afterInit",
          "beforeLock",
          "afterLock",
          "beforeUnlock",
          "afterUnlock"
        ].forEach(function(key) {
            if (typeof custom_hooks[key] === "undefined") {
                custom_hooks[key] = function() {};
          }
        });
    
        hooks = custom_hooks;
      };
      
    window.bodyLock = {
        lock: lock,
        unlock: unlock
      };
      
    defineHooks({})
        
    init();

    return {
      lock: lock,
      unlock: unlock
    }
        
})(document)
   

