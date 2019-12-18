# Single-Drawer ISI

## Component States
The modal component will have the following states: <br>
- **ISIExpanded:** This will be shown by the modal having the attribute ```[hidden]``` removed.
- **ISICollapsed:** This will be shown by the modal having the attribute ```[hidden]``` added.
- **ISIShown:** This will be shown by the modal having the attribute ```[hidden]``` added.
- **ISIHidden:** This will be shown by the modal having the attribute ```[hidden]``` added.

## Component HTML

### Input HTML
At minimum, you will need a static ISI with a `div` containing the header and a `div` for the content;

```
<section data-component="isi">
  <div data-isi-header>
      <h2>Important Safety Information</h2>
      <button data-isi-btn></button>
  </div>
  <div data-isi-content>
      // ISI Content
  </div>
</section>
```

### Output HTML
```
<section data-component="isi" data-isi-fixed aria-expanded="false" class="collapsed">
  <div data-isi-header>
    <h2>Important Safety Information</h2>
    <button data-isi-btn aria-expanded="false" aria-label="Important Safety Information Toggle" aria-controls="isi-content"></button>
  </div>
  <div data-isi-content id="isi-content" aria-hidden="true">
      // ISI Content
  </div>
</section>
```

#### Expanded ISI
```
<section data-component="isi" data-isi-fixed aria-expanded="true" class="collapsed">
  <div data-isi-header>
    <h2>Important Safety Information</h2>
    <button data-isi-btn aria-expanded="true" aria-label="Important Safety Information Toggle" aria-controls="isi-content"></button>
  </div>
  <div data-isi-content id="isi-content">
      // ISI Content
  </div>
</section>
```

## CSS

```
[data-isi-fixed] {
    position: fixed;
    bottom: 0;
    left: 0;
    max-height: 150px; // Set initial ISI height here 
}

[data-isi-fixed][aria-expanded="true"] {
    overflow: auto;
}

[data-isi-btn] {
    display: none;
}

[data-isi-fixed] [data-isi-btn] {
    display: block;
}

[data-component="isi"] [data-isi-btn]::after {
    content: "+"
}
[data-component="isi"][aria-expanded="true"] [data-isi-btn]::after {
    content: "-"
}
```

## Element Behaviour 

By default, the ISI will expand to fill the screen stopping short of the header.

When the ISI drawer is expanded, the user will be locked to tab within the ISI drawer.

When the ISI drawer collapse, it will either return to its initial height or collapse to the height of the ISI header.

If enabled, the ISI drawer can be collapsed to the heigh of the ISI header by scrolling.

## Keyboard Controls 

The ISI can be controlled by tabbing. 
When the ISI drawer is expanded, tabbing will be contained within the ISI drawer.
Tabbing will move to focusable elements within the modal.


## Component Configs

Since modal triggers can be found anywhere within the content, configurations will be set at the trigger level.<br>


| Configuration        | Options       | Default    | Description  |
| -------------------- | ------------- | ---------- | ------------ |
| `data-isi-scroll-collapse`| true<br>false | false  |   This setting determines whether the user can scroll to collapse component to just the ISI header height. |
| `data-isi-full-collapse` | true<br>false | false |   This setting determines whether the component will collapse to just the ISI header height. |
| `data-isi-full-screen`| true<br>false | true | This setting determines whether the ISI should expand to take over the whole screen, minus the header component.|
| `data-isi-expand-max`| Any % or px value | 50% | This setting will be used in combination with the data-isi-full-screen attribute to set the max height on expand.|
| `data-classnames-expanded`    | Any string    | expanded |   The class name(s) will be added to the ISI drawer when expanded. |
| `data-classnames-collapsed`    | Any string    | collapsed | The class name(s) will be added to the ISI drawer when collapsed.|


## Emitted Events

The modals will emit the following custom events:

  - **isiExpand:** emitted when the ISI is expanded
  - **isiCollapse:** emitted when the ISI is collapsed
  - **isiHide:** emitted when the floating ISI is hidden
  - **isiShow:** emitted when the floating ISI is shown

Since there is only one ISI module, the `event.detail` object will only include the configuration of the ISI module (`event.detail.component_config`).


## Initialization Hooks

The following hooks are available to use on the modal component. 

#### beforeInit()
Runs before the modals are initiallized.

#### afterInit()
Runs after the modals are initiallized.

#### beforeOpen(el_modal, config)
Runs before modal is opened.

#### afterOpen(el_modal, config)
Runs after modal is opened.

#### beforeClose(el_modal, config)
Runs before modal is closed.

#### afterClose(el_modal, config)
Runs after modal is closed.



## Javascript API

The following calls are available from the modal component.

#### modals.toggle(el_trigger)
This will open the selected modal that the provided trigger points to.

#### modals.close(el_modal)
This will close the selected modal.

#### modals.defineHooks({custom_hooks})
This can be used to pass the custom hooks to the modal component.
