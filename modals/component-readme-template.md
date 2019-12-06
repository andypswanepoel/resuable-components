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
- ModalOpen --> [hidden="false"]
- ModalClosed --> [hidden="true"]

## Component HTML

What HTML should I add to the page


**Input HTML**

At minimum, you will need a modal trigger and a modal, within a modal container .
The trigger(s) should be contained within the main section of the body, while the modal should be a non-child section.

```
<main>
  <button data-trigger data-target="modal-id">Modal Trigger</button>
</main>

<aside data-component="modal" data-z-index="100">
  <div id="modal-id" data-modal hidden>
    <h2 data-label>Content Header 1</h2>
    <p>Content text 1.</p>
  </div>
</aside>
```


**Output HTML**

If JS is not enabled, the content will display as it is in the input HTML and the modals will all remain hidden.
If JS is enabled, the modal will be initialized by adding various attributes for control and accessibility.


<b>Modal Inactive</b>
<br>
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

<b>Modal Active</b>
<br>
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

The CSS that is required will add display the modal container when a modal is active, add styling for the background, .

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

**Multiple Modals**<br>
If multiple modals are open at once, the same logic will apply:
- Tabbing will only occur in the top most modal
- Closing the top most modal will focus you to the trigger that activated it.


## Keyboard Controls 

The modal can be controlled with the following keyboard controls. 

Escape key closes the modal.
Tabbing will move to focusable elements within the modal.


## Possible Configurations

Since modal triggers can be found anywhere within the content, we will have to set configurations at the trigger level or modal container level.

**Component Configs**

The following configurations can be set at the trigger level:
- data-bg-close: If set to "false", the user can click outside of the modal to close it.
- data-classnames: class names to be added to the modal container on open.
- data-external-link: Use case for this will be an exit modal, where the link out will need to have a dynamic href. If set to "true", the href from the trigger will be populated into the link within the modal that contains the same data-external-link attribute.

The following configurations can be set at the modal container level:
- data-z-index: the value of this will act as the base value for modal z-index. It will need to be set for each modal and background that is rendered. 


## Emitted Events

The modals will emit the following custom events:

  - `modalOpen` is emitted when a modal is opened
  - `modalClose` is emitted when a closed

The `event.detail` object includes the DOM element for the modal (`event.detail.modal`) and the configuration of the trigger component (`event.detail.component_config`).


## Initialization Hooks

The following hooks are available to use on the modal component. 

**beforeInit(el_component)**
Runs before each component is initiallized.

**afterInit(el_component)**
Runs after each component is initiallized.

**beforeOpen(el_modal, config)**
Runs before modal is opened.

**afterOpen(el_modal, config)**
Runs after modal is opened.

**beforeClose(el_modal, config)**
Runs before modal is closed.

**afterClose(el_modal, config)**
Runs after modal is closed.



## Javascript API


**modal.open(el_modal)**<br>
This will open the selected modal.

**modal.close(el_modal)**<br>
This will close the selected modal.

**modal.defineHooks({custom_hooks})**
This can be used to pass the custom hooks to the modal component.



...