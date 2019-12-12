# Modals

## Component States
The modal component will have the following states: <br>
- **ModalOpen:** This will be shown by the modal having the attribute ```[hidden]``` removed.
- **ModalClosed:** This will be shown by the modal having the attribute ```[hidden]``` added.

## Component HTML

### From Existing Modal

#### Inactive State

At minimum, you will need a modal trigger and a modal, within a modal container.

The trigger(s) should be contained within the main section of the body, while the modal should be a non-child section. 

The trigger will need a `data-component="modal"` attribute and a `data-target` attribute. The value of the `data-target` attribute associates the trigger with the matching modal ID. 

The `data-label` attribute should be added to the header of the modal content. This will ensure that it is associated to the modal for accessibility.


```
<main>
  <button data-component="modal" data-target="modal-id">Modal Trigger</button>
</main>

<div data-modal-container>
  <div id="modal-id" hidden>
      <h2 data-label>Content Header 1</h2>
      <p>Content text 2</p>
  </div>
</div>
```

#### Active State

```
<main aria-hidden="true">
  <button data-component="modal" data-target="modal-id">Modal Trigger</button>
</main>

<div data-modal-container>
  <div id="modal-id-wrapper" data-modal-wrapper class="modal-open">
    <div data-active-bg data-close-modal style="z-index: 100;">
      <span class="sr-only">Close modal</span>
    </div>
    <div id="modal-id" role="dialog" aria-modal="true" tabindex="0" data-modal="" aria-labelledby="modal-id1-label" aria-describedby="modal-desc" style="z-index: 100;">
      <button data-close-modal aria-label="Close modal">Close</button>
      <h2 data-label id="modal-id-label">Content Header 1</h2>
      <p>Content text 2</p>
    </div>
  </div>
</div>

<p id="modal-desc" hidden= aria-hidden="true">Tab through the modal to access the content. Press the escape key to exit the modal. Clicking outside of the modal may close the modal.</p>
```

### From Existing Content

#### Inactive State
At minimum, you will need a modal trigger and content to be added to the modal.

The trigger(s) and content can both be contained within the main section of the body. 

The trigger will need a `data-component="modal"` attribute and a `data-target-content` attribute. The value of the `data-target-content` attribute associates the trigger with the matching modal ID. 

The `data-label` attribute should be added to the header of the modal content. This will ensure that it is associated to the modal for accessibility.


```
<main>
  <button data-component="modal" data-target-content="modal-id">Modal Trigger</button>

  // More code

  <div id="modal-id" hidden>
    <h2 data-label>Content Header 1</h2>
    <p>Content text 2</p>
  </div>
</main>
```

#### Active State

```
<main aria-hidden="true">
  <button data-component="modal" data-target-content="modal-id">Modal Trigger</button>

  <div id="modal-id" hidden>
    <h2 data-label>Content Header 1</h2>
    <p>Content text 2</p>
  </div>
</main>

// More code

<p id="modal-desc" hidden aria-hidden="true">Tab through the modal to access the content. Press the escape key to exit the modal. Clicking outside of the modal may close the modal.</p>

<div data-modal-container>
  <div id="modal-id-wrapper" data-modal-wrapper class="modal-open">
    <div data-active-bg data-close-modal style="z-index: 100;">
      <span class="sr-only">Close modal</span>
    </div>
    <div id="modal-id-modal" role="dialog" aria-modal="true" tabindex="0" data-modal aria-labelledby="modal-id-modal-label" aria-describedby="modal-desc" style="z-index: 100;">
      <button data-close-modal="" aria-label="Close modal">Close</button>
      <h2 data-label id="my-id-modal-label">Content Header 1</h2>
      <p>Content text 2</p>
    </div>
  </div>
</div>
```


## CSS

The CSS that is required will add display the modal container when a modal is active, add styling for the background.

```
[data-active-bg] {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  [data-modal][hidden] {
    display: none;
  }

  .sr-only {
    border: 0;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    clip: rect(0,0,0,0);
    display: block;
    font-size: 1px;
    height: 1px;
    line-height: 1px;
    margin: -1px 0 0 -1px;
    padding: 0;
    position: absolute;
    overflow: hidden;
    outline: 0;
    white-space: nowrap;
    width: 1px;
  }
```

## Element Behaviour 

Clicking on a modal trigger will activate the related modal and focus on the modal.

When the modal is open, the user should only be able to tab and navigate within the modal.

If configured, the user should be able to click outside of the modal to close it.

When the modal closes, the trigger that activated the modal will receive focus.

### Multiple Modals <br>
If multiple modals are open at once, the same logic will apply:
- Tabbing will only occur in the top most modal
- Closing the top most modal will focus you to the trigger that activated it.


## Keyboard Controls 

The modal can be controlled with the following keyboard controls. 

Escape key closes the modal. <br>
Tabbing will move to focusable elements within the modal.


## Component Configs

Since modal triggers can be found anywhere within the content, configurations will be set at the trigger level.<br>


| Configuration        | Options       | Default    | Description  |
| -------------------- | ------------- | ---------- | ------------ |
| `data-bg-close`      | true<br>false | true 	    |   This setting determines whether the user can click outside of the modal to close it. |
| `data-close-btn`     | true<br>false | true 	    |   This setting determines whether a close button will be added to the modal. |
| `data-close-btn-text`| Any string | Close	    |   This setting determines the text content of the close button. It will accept an empty string if you wish to style it with a CSS background image.|
| `data-classnames`    | Any string    | modal-open |   The class name(s) will be added to the modal wrapper when a modal is open. If more than one modal is opened, each modal will have its own wrapper containing it's own class name(s).|
| `data-z-index` | Any number | 100      |  This value will act as the base value for the modal z-index. If more than one modal is opened at once, the z-index value will be incremented for each based on the value provided by the first triggered modal.|


## Emitted Events

The modals will emit the following custom events:

  - **modalOpen:** emitted when a modal is opened
  - **modalClose:** emitted when a modal is closed

The `event.detail` object includes the DOM element for the modal (`event.detail.modal`) and the configuration of the trigger component (`event.detail.component_config`).


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
