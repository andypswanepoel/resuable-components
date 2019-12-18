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
- HeaderShown 

## Component HTML

What HTML should I add to the page:


**HTML**

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
```

## Possible Configurations

**Component Configs** 

The following configurations can be added as data attributes at the component level:
- data-autohide: If set to "true", the header will hide when the user scrolls down the page. If set to "true", the header will persist on the page. 
- data-autohide-amount: The value provided determines how much the user needs to scroll before the header will hide/show.
- data-autohide-id: set the id of the element you want to collapse to. 
- data-classnames-hidden: class names to be added to the header when it is hidden. Default: "is-hidden"
- data-classnames-on-body: If set to true, the hidden class names will be added to the body element. Default is false.

User settings:
- prefers-reduced-motion: if the user has this set to true on their device, the header will not collapse.


## Emitted Events

The header element will emit the following custom events:

  - `headerHide` is emitted when the header is hidden.
  - `headerShow` is emitted when the header is shown.

The `event.detail` object includes the DOM element for the trigger (`event.detail.button`) and the configuration of the parent component (`event.detail.component_config`).


## Initialization Hooks

The following hooks are available to use on the header. 

**beforeInit(el_component, config)**
Runs before the component is initiallized.

**afterInit(el_component, config)**
Runs after the component is initiallized.

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
This can be used to pass the custom hooks to the header component.



...