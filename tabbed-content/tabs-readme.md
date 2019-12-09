# Tabs

## Component States
The tab component will have the following states: <br>
- **TabSelected:** This will be shown by the tab having the attribute ```[aria-select="true"]```.
- **TabUnselected:** This will be shown by the tab having the attribute ```[aria-select="false"]```.

## Component HTML

### Input HTML

At minimum, you will need two tab panels in the markup.

The tab panels will need a `data-panel` and `data-tab-name` attribute. The value of the `data-tab-name` attribute will be the name given to the tab controlling that panel. 

```
<div data-component="tab">

  <div data-panel data-tab-name="Tab 1">
    <h2>Content Header 1</h2>
    <p>Content text 1.</p>
  </div>

  <div data-panel data-tab-name="Tab 2">
    <h2>Content Header 2</h2>
    <p>Content text 2.</p>
  </div>

</div>
```


### Output HTML

If JS is not enabled, the content will display as it is in the Input HTML.
If JS is enabled, the tabs will be initialized by adding various accessibility attributes and button elements to control the tabs.

```
<div data-component="tab" id="tab-content-0" data-initialized="true" aria-describedby="tab-desc-0">
  <ul role="tablist">
    <li>
      <button id="tab-0-0" data-tab data-tab-group="0" role="tab" aria-controls="tabpanel-0-0" aria-selected="true" class="selected">
        Tab 1
      </button>
    </li>
    <li>
      <button id="tab-0-1" data-tab data-tab-group="0" role="tab" aria-controls="tabpanel-0-1" aria-selected="false" tabindex="-1">
        Tab 2
      </button>
    </li>
    </ul>
    <div data-tab-panel data-tab-name="Tab 1" id="tabpanel-0-0" role="tabpanel" aria-labelledby="tab-0-0">
        <h2>Content Header 1</h2>
        <p>Content text 1.</p>
      </div>
      <div data-tab-panel data-tab-name="Tab 2" id="tabpanel-0-1" role="tabpanel" aria-labelledby="tab-0-1" hidden>
        <h2>Content Header 2</h2>
        <p>Content text 2.</p>
      </div>
      <p id="tab-desc-0" hidden>Use the left and right arrow keys to switch between tabs. Use the down arrow or tab key to move to the active tab's content.</p>
  </div>
  ```

## CSS

There is no required CSS for the tabs to work. However, for the controls to accurately reflect the layout, the tab buttons should be in a horizontal row. If they need to be stacked on mobile devices, this will need to be controlled by CSS.

## Element Behaviour 

When a tab is active, it will show the content that is associated with that tab.

Tabs can be select by clicking on the tab, or via the keyboard controls shown below.

When a tab is selected, the other tabs are not focusable.


## Keyboard Controls 

The tabs can be fully controlled with keyboard. 

The default controls are:
- Left and right arrows to change tabs
- Down or Tab to focus on the panel content 

If the tabs stack on mobile widths, the controls are:
- Up and down arrows to change tabs
- Tab to focus on the panel content


## Component Configs

Component configurations can be added at the component level or at the tab panel level.

The following configurations can be added as data attributes at the component level:

| Configuration        	       | Options       | Default      | Description  |
| ---------------------------- | ------------- | ------------ | ------------ |
| `data-autoinit`              | true<br>false | true 	      | This setting determines whether tabs will automatically initialize on load.|
| `data-tab-mobile-stack`      | true<br>false | false | This setting determines whether tabs will stack on mobile devices. It will change the controls to up and down arrows. Visual stacking must be done by CSS. |
| `data-tab-mobile-width`      | Any number    | 768          | Should be used in combination with the `data-tab-mobile-stack` configuration. This setting will determine the width at which the tabs would stack.|
| `data-classnames-selected`   | Any string    | selected     | The class name(s) will be added to the tab and tab panel when selected. |
| `data-classnames-unselected` | Any string    | not-selected | The class name(s) will be added to the tab and tab panel when unselected. |

<br>
The following data-attributes can be added at the panel level:
| Configuration   | Options   			    	| Default    | Description  |
| --------------- | --------------------------- | ---------- | ------------ |
| `data-tab-name` | Any string  				| tab X	  	 | The value of this attribute will be the name given to the tab controlling the panel.|
| `data-default-state` | selected<br>unselected | unselected | This should be set to selected on the tab that should initially be selected. If none, or more than one tab in a group, are set to selected, it will default to the first tab being selected.|


## Emitted Events

The tabs will emit the following custom events:

  - **tabSelected:** emitted when a tab is select

The `event.detail` object includes the DOM element for the tab (`event.detail.button`) and the configuration of the trigger component (`event.detail.component_config`).


## Initialization Hooks

The following hooks are available to use on the tab component. 

#### beforeInit(el_component, config)
Runs before each component is initiallized.

#### afterInit(el_component, config)
Runs after each component is initiallized.

#### beforeSelect(el_tab, config)
Runs before a new tab is selected.

#### afterSelect(el_tab, config)
Runs after a new tab is selected


## Javascript API

The following calls are available from the tab component.

#### tab.select(el_tab)
This will change to the selected tab.

#### tab.initTab(el_tab)
This will initialize the tab provided.

#### tab.initAll()
This will initialize all the tabs that are not initialized. The use case would be when a tab section does not need to be initialized on load and we want to delay initialization. 

#### tab.defineHooks({custom_hooks})
This can be used to pass the custom hooks to the tab component.
