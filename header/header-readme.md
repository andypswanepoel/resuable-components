# Header

## Component States
The modal component will have the following states: <br>
- **HeaderHide:** This will be shown by the modal having the attribute `[data-header-hidden]` set to `true`.
- **HeaderShow:** This will be shown by the modal having the attribute `[data-header-hidden]` set to `false`.

## Component HTML
```
<header data-component="header">
  // Header contents
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

@media screen and (prefers-reduced-motion: reduce) {
    [data-header-hidden="true"] {
        transform: none;
    }
}
```

## Element Behaviour 

If the header is configured to hide/show on scroll based on the autohide configuration: 
- Scrolling down will hide the header.
- Scrolling up will show the header.
- Tabbing focus to any element in the header will show the header.


## Component Configs

**Component Configs** 

The following configurations can be added as data attributes at the component level: <br>

| Configuration        | Options       | Default    | Description  |
| -------------------- | ------------- | ---------- | ------------ |
| `data-autohide`      | true<br>false | false  |  If set to "true", the header will hide when the user scrolls down the page. If set to "true", the header will persist on the page. |
| `data-autohide-amount` | Any number | 10 	    |   The value provided determines how much the user needs to scroll before the header will hide/show.|
| `data-autohide-target`| Any string | Close	    |   In the case of a partial collapse, this setting will contain the ID of the element which you'd like to collapse to. |
| `data-classnames-hidden`    | Any string    | modal-open |   The class name(s) will be added when the header is hidden.|
| `data-classnames-target` |html<br>body<br>html body| `[data-component=header]`|  This value will determine which element will get the hidden classnames. Options are body, html, or both. By default, the classnames will be added to the header element.|


**Device Settings** 
If the user has the `prefers-reduced-motion` set to `true`, the header will not collapse on scroll.


## Emitted Events

The header element will emit the following custom events:

  - `headerHide` is emitted when the header is hidden.
  - `headerShow` is emitted when the header is shown.

Since there will only be one header on the page, the `event.detail` object will include the configuration of the component (`event.detail.component_config`).


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