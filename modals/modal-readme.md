# Modals

## Component States
The modal component will have the following states: <br>
- **ModalOpen:** This will be shown by the modal having the attribute ```[hidden]``` removed.
- **ModalClosed:** This will be shown by the modal having the attribute ```[hidden]``` added.

## Component HTML

### Input HTML

At minimum, you will need a modal trigger and a modal, within a modal container .

The trigger(s) should be contained within the main section of the body, while the modal should be a non-child section. 

The trigger will need a `data-trigger` and a `data-target` attribute. The value of the `data-target` attribute associates the trigger with the matching modal ID. 

The modal will need a `data-modal` attribute and the `data-label` attribute should be added to the header of the modal content. This will ensure that it is associated to the modal for accessibility.

```
<main>
  <button data-trigger data-target="modal-id">Modal Trigger</button>
</main>

<aside data-component="modal">
  <div id="modal-id" data-modal hidden>
    <h2 data-label>Content Header 1</h2> 
    <p>Content text 1.</p>
  </div>
</aside>
```


### Output HTML

If JS is not enabled, the content will display as it is in the input HTML and the modals will all remain hidden.
If JS is enabled, the modal will be initialized by adding various attributes for control and accessibility.


#### Modal Inactive
```
<main>
  <button data-trigger-modal data-target-modal="modal-id" aria-controls="modal-id">Modal Trigger</button>
</main>

<aside data-component="modal">
  <div id="modal-id" data-modal hidden>
    <button data-close-modal>X</button>
    <h2 data-label id="modal-id-label">Content Header 1</h2>
    <p>Content text 1.</p>
  </div>
</aside>
```

#### Modal Active
```
<main aria-hidden="true">
  <button id="modal-id-trigger" data-trigger-modal aria-controls="modal-id">Modal Trigger</button>
</main>

<aside data-component="modal" data-active-modal>

  <div data-active-bg class="modal-open" data-close-modal style="z-index: 100;"></div> //z-index value will be dynamically set depending on how many are open and the initial value set
  <div id="modal-id" data-modal role="dialog" aria-modal="true" hidden tabindex="0" aria-labelledby="modal-id-label" style="z-index: 100"> //z-index value will be dynamically set depending on how many are open and the initial value set
    <button data-close-modal>X</button>
    <h2 data-label id="modal-id-label">Content Header 1</h2>
    <p>Content text 1.</p>
  </div>
</aside>
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

Since modal triggers can be found anywhere within the content, we will have to set configurations at the trigger level or modal container level.<br>

The following configurations can be set at the trigger level:

| Configuration        | Options       | Default    | Description  |
| -------------------- | ------------- | ---------- | ------------ |
| `data-bg-close`      | true<br>false | true 	    |   This setting determines whether the user can click outside of the modal to close it. |
| `data-classnames`    | Any string    | modal-open |   The class name(s) will be added to the modal container when a modal is open. If more than one modal is opened, both modals class name(s) will be added.  |
| `data-external-link` | true<br>false | false      |  This should be used for an exit modal. When set to true, the link URL from the trigger will be populated in the exit link of the exit modal. The exit link within the modal will be labelled with the `data-external-link` attribute. |

<br>
The following configurations can be set at the modal container level:

| Configuration | Options     | Default | Description  |
| ------------- | ----------- | ------- | ------------ |
| `data-z-index`| Any number  | 100 	| This value will act as the base value for the modal z-index. If more than one modal is opened at once, the z-index value will be incremented for each.    |


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

#### modal.open(el_modal)
This will open the selected modal.

#### modal.close(el_modal)
This will close the selected modal.

#### modal.defineHooks({custom_hooks})
This can be used to pass the custom hooks to the modal component.
