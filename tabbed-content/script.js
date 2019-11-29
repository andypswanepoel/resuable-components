// Possible extensions with data-attributes: 
// - collapse on scroll
// - collapse after initial expand

const tabbedContent = (function(el_root) {
    const init = function() {
        const tabbedContent = el_root.querySelectorAll("[data-component=tabbed-content]");
        [].forEach.call(tabbedContent, function(el_component, i) {initializeTabs(el_component, i)})
    }

    const initializeTabs = function(el_component, i) {
        // To do: the autoinit variable can be put in a config
        if (el_component.getAttribute("autoinit") === "false") {
            return
        }

        // To do: the openTab vaiable can be put in a config
        const openTab = el_component.getAttribute("data-initial-tab") ? parseInt(el_component.getAttribute("data-initial-tab")) : 0;

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
            if (j === openTab){
                el_tabpanel.removeAttribute("hidden")
                el_tabpanel.setAttribute("tabindex", "0");
            } 

            // Create the list item and the button corresponding to each tab
            // Adds the appropriate accessibility labels and unique id for each tab
            // Again, it is based on the index of the panel and the component
            const listitem = el_root.createElement("li");
            const el_tab = el_root.createElement("button");
            el_tab.setAttribute("id", "tab-" + i + "-" + j);
            el_tab.setAttribute("data-tab", "");
            el_tab.setAttribute("role", "tab");
            el_tab.setAttribute("aria-controls", "tabpanel-" + i + "-" + j);
            el_tab.setAttribute("aria-selected", "false");

            
            // Name the buttons based on data-attribute from tab content 
            // If no name is provided, it will default to the element id
            // Determine which tab is open
            // Appends the tabs to the list, and the list to the component
            // To do: see if this can be stored in a config at the tab level
            el_tab.innerHTML = el_tabpanel.getAttribute("data-tab-name") != "" || undefined || null ? el_tabpanel.getAttribute("data-tab-name") : "tab-" + i + "-" + j
            if (j === openTab){
                el_tab.setAttribute("aria-selected", "true");
            }
            el_tab.setAttribute("tabindex", "-1");
            if (j === openTab){
                el_tab.removeAttribute("tabindex");
            }
            listitem.appendChild(el_tab);
            list.appendChild(listitem);
        })
    }

    
    const clickHandler = function(ev) {
        const el_tab = ev.target.closest("[data-tab]")
        if(!el_tab) {
            return
        }
        // if a button was clicked, then change the tab
        changeTab(el_tab)
    }

    const keyHandler = function(ev) {
        const el_tab = ev.target.closest("[data-tab]")
        if(!el_tab) {
            return
        }
        // Gets list of tabs in each module
        // Finds the index of the current button
        const el_component = el_tab.closest("[data-component=tabbed-content]");
        const el_tabs = el_tab.closest("[role=tablist]").querySelectorAll("[data-tab]")
        const index = [].slice.call(el_tabs).indexOf(el_tab);

        const key = ev.keyCode === 37 ? "left" : ev.keyCode === 39 ? "right" :  ev.keyCode === 38 ? "up" : ev.keyCode === 40 ? "down" : null;
        const deviceWidth = window.innerWidth >= 768 ? "desktop" : "mobile"
        let el_new_tab

        // If the device is <768px wide and mobile stack is on, controls are with up and down keys
        if (el_component.getAttribute("data-mobile-stack") === "true" && deviceWidth === "mobile") {
            el_new_tab = key === "up" ? el_tabs[index - 1] : key === "down" ? el_tabs[index + 1] : null
        } else {
            el_new_tab = key === "left" ? el_tabs[index - 1] : key === "right" ? el_tabs[index + 1] : null
        }

        if (el_new_tab != undefined || null) {
            el_new_tab.focus();
            changeTab(el_new_tab)
        }
        
        // Not sure if this is a good idea. Need to talk to Kelly. On desktop will allow pressing the down key to focus
        if ((el_component.getAttribute("data-mobile-stack") === "true" && deviceWidth !== "mobile"
            || el_component.getAttribute("data-mobile-stack") !== "true")
            && key === "down" ){
            focusPanel(el_tab)
        }
    }

    const changeTab = function(el) {
        const el_component = el.closest("[data-component=tabbed-content]")
        const el_tabs = el.closest("[role=tablist]").querySelectorAll("[data-tab]");
        // Deselect all tabs
        [].forEach.call(el_tabs, function(tab) {
            tab.setAttribute("aria-selected", "false");
            tab.setAttribute("tabindex", "-1");
        })
        // Select the new tab
        el.setAttribute("aria-selected", "true");
        el.removeAttribute("tabindex");
        changePanel(el)
    }

    const changePanel = function(el) {
        // From the new tab, find the panel it controls through the aria controls attribute
        const el_tabpanel_id = el.getAttribute("aria-controls");
        const el_tabpanel = el_root.getElementById(el_tabpanel_id)
        const el_tabpanels = childrenMatches(el_tabpanel.parentElement, "[data-tab-panel]");
        [].forEach.call(el_tabpanels, function(tabpanel) {
            tabpanel.setAttribute("hidden", "");
            tabpanel.removeAttribute("tabindex");
        })
        el_tabpanel.removeAttribute("hidden");
        el_tabpanel.setAttribute("tabindex", "0");
    }

    const focusPanel = function(el) {
        // Focus on the panel
        const el_tabpanel_id = el.getAttribute("aria-controls");
        const el_tabpanel = el_root.getElementById(el_tabpanel_id);
        el_tabpanel.focus();
        
    }

    
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
   

