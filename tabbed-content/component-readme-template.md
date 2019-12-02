# Component Design Template
Fill out the following sections before you begin writing code.
- Component States
- Component HTML w/ Input HTML, and Output HTML if relevant
- Emitted Events
- Initialization Hooks
- Javascript API

Include Component Description Here

# Quick Start
Include quickstart instructions here.
- What HTML do I need?
- What JS do I need?
- What CSS do I need?

## Component States
In this section, you list all the states a component can be in.
eg:
- TabSelected --> [aria-select="true"]
- TabNotSelected --> [aria-select="false"]

## Component HTML

What HTML should I add to the page


**Input HTML**

Minimum HTML needed for two tabs

```
<div data-component="tabbed-content">

  <div data-tab-panel data-tab-name="Tab 1">
    <h2>Content Header 1</h2>
    <p>Content text 1.</p>
  </div>

  <div data-tab-panel data-tab-name="Tab 2">
    <h2>Content Header 2</h2>
    <p>Content text 2.</p>
  </div>

</div>
```

**Output HTML**

If JS is not enabled, the content will display as it is in the Input HTML.
If JS is enabled, the tabs will be initialized by adding various accessibility attributes and button elements to control the tabs.

```
<div data-component="tabbed-content" id="tabbed-content-0">
  <ul role="tablist">
    <li>
      <button id="tab-0-0" data-tab role="tab" aria-controls="tabpanel-0-0" aria-selected="false" tabindex="-1">Tab 1</button></li><li><button id="tab-0-1" data-tab="" role="tab" aria-controls="tabpanel-0-1" aria-selected="true">Tab 2</button>
    </li>
    </ul>
    <div data-tab-panel data-tab-name="Tab 1" id="tabpanel-0-0" role="tabpanel" aria-labelledby="tab-0-0" hidden>
        <h2>Content Header 1</h2>
        <p>Content text 1.</p>
      </div>
      <div data-tab-panel data-tab-name="Tab 2" id="tabpanel-0-1" role="tabpanel" aria-labelledby="tab-0-1">
        <h2>Content Header 2</h2>
        <p>Content text 2.</p>
      </div>
  </div>
  ```

## CSS

There is no required CSS for the tabs to work. However, for the controls to accurately reflect the layout, the tab buttons should be in a horizontal row.
If they are to be stacked on Mobile devices, this will need to be controlled by CSS.

## Keyboard Controls 

The tabs can be fully controlled with keyboard. 

The default controls are:
- Left to change to the next tab
- Right to change to the previous tab
- Down or Tab to focus on the panel content 

If the tabs stack on mobile widths, the controls are:
- Down to change to the next tab
- Up to change to the previous tab
- Tab to focus on the panel content


## Possible Configurations

**Component Configs**
The following configurations can be added as data attributes at the component level:
- data-autoinit: if set to "false", the tabbed content will not initialize. If nothing is provided, the tabbed content will initialize.
- data-tab-mobile-stack: if set to "true", the tabs will be controlled by up and down keys vs left and right on smaller screens (<768px). If nothing is provided, the tabs will always be controlled with left and right keys. The actual visual stacking will be controlled by CSS.
- data-tab-mobile-width: set a value at which your mobile breakpoint will occur. This should be used combination with the [data-tab-mobile-stack] attribute. Default will be 768px
- data-classnames-selected: class names to be added when the tab is selected. If nothing is added, default will be "selected".
- data-classnames-unselected: class names to be added when the tab is not selected. If nothing is added, default will be "unselected".

**Tab Configs**
The following data-attributes can be added at the panel level:
- data-tab-name: String value which is provided to the tab. If nothing is provided, the tab will be named "Tab X"
- data-default-state:  set to "selected" on the tab which should be initially selected. If none or more than one have this set to selected, it will default to set the first tab as initially selected.


## Emitted Events

The tabbed content will emit the following custom events:

  - `tabSelected` is emitted when a user selects a tab

The `event.detail` object includes the DOM element for the trigger (`event.detail.button`) and the configuration of the parent component (`event.detail.component_config`).


## Initialization Hooks

The following hooks are available to use on the tabs. 

**beforeInit(el_component, config)**
Runs before each component is initiallized.

**afterInit(el_component, config)**
Runs after each component is initiallized.

**beforeSelect(el_tab, config)**
Runs before a new tab is selected.

**afterInit(el_tab, config)**
Runs after a new tab is selected


## Javascript API


**tab.select(el_tab)**
This will change the selected tab.

**tab.initAll(el_tab)**
This will initialize the tab provided through the function.

**tab.initAll()**
This will initialize all the tabs that are not initialized. The use case would be when a tab section does not need to be initialized on load and we want to delay 

**tab.defineHooks({custom_hooks})**
This can be used to pass the custom hooks to the tab component.



...