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
- AccordionExpanded
- AccordionCollapsed

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

If the JS transforms the HTML on the page, perhaps to automatically add things to meet accessibility requirements or add things like custom scrollbars, include the transformed state here.

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


## Emitted Events

Work in Progress

No events in the code at present time.

The tabbed content will emit the following custom events:

  - `tabSelected` is emitted when a user selects a tab

The `event.detail` object includes the DOM element for the trigger (`event.detail.button`) and the configuration of the parent component (`event.detail.component_config`).

Event names should use the pattern `[component type][action]`.


## Initialization Hooks

Work in Progress

You can provide custom code to run at various times during the tabbed contents's lifecycle.

No hooks at present time.


## Javascript API

Work in Progress


**tab.changeTab(el_tab)**
This will change the selected tab

...