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


## Component Controls
Scrolling down will hide the header.
Scrolling up will show the header.

Tabbing focus to any element in the header will show the header.


## Component States
The header can be in the following states:

- HeaderHidden 
- HeaderShow 

## Component HTML

What HTML should I add to the page:


**Input HTML**

Minimum HTML needed for the header

```
<header data-component="header">
  // Header content
</header>
```

## CSS

```
[data-component="header"] {
    display: block;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    transition: transform 0.5s ease-in;
}

[data-header-hidden="true"] {
    transform: translateY(-100%);
}

body {
    padding-top: 165px; // We could set this with JS, but if a user has it disabled, some content may be hidden. Value will depend on the header height
    position: relative;
}
```

## Possible Configurations

**Component Configs**
The following configurations can be added as data attributes at the component level:
- data-autohide: If set to "true", the header will hide when the user scrolls down the page. If set to "true", the header will persist on the page. 
- data-autohide-amount: The value provided determines how much the user needs to scroll before the header will hide/show.
- data-classnames-hidden: class names to be added to the header when it is hidden. Default: "is-hidden"


## Emitted Events

The tabbed content will emit the following custom events:

  - `headerToggle` is emitted whebn the header's display state is toggled.
  - `headerHide` is emitted when the header is hidden.
  - `headerShow` is emitted when the header is shown.

The `event.detail` object includes the DOM element for the trigger (`event.detail.button`) and the configuration of the parent component (`event.detail.component_config`).


## Initialization Hooks

The following hooks are available to use on the tabs. 

**beforeInit(el_component, config)**
Runs before the component is initiallized.

**afterInit(el_component, config)**
Runs after the component is initiallized.

**beforeToggle(el_component, config)**
Runs before the header's display state is toggled.

**afterToggle(el_component, config)**
Runs after the header's display state is toggled.

**beforeHide(el_component, config)**
Runs before the header is hidden.

**afterHide(el_component, config)**
Runs after the header is hidden.

**beforeShow(el_component, config)**
Runs before the header is shown.

**afterShow(el_component, config)**
Runs after the header is shown.


## Javascript API

**header.show(el_component)**
This will show the header component.

**header.hide(el_component)**
This will hide the header component.

**header.defineHooks({custom_hooks})**
This can be used to pass the custom hooks to the tab component.



...