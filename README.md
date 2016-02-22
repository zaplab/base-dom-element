# zap-base-dom-element

just translating (and testing) some old code to ES6,
nothing to see here ;-)

## Install
```
$ npm install zap-base-dom-element
```

## Usage
```js
import {
    create as zapElementCreate,
    replace as zapElementReplace,
    remove as zapElementRemove,
    destroy as zapElementDestroy,
    prepend as zapElementPrepend,
    append as zapElementAppend,
    before as zapElementBefore,
    after as zapElementAfter,
    addEvent as zapElementAddEvent,
    addEvents as zapElementAddEvents,
    removeEvent as zapElementRemoveEvent,
    fireEvent as zapElementFireEvent,
    setStyles as zapElementSetStyles,
    getStyle as zapElementGetStyle,
    getSize as zapElementGetSize,
    getPosition as zapElementGetPosition,
    getScroll as zapElementGetScroll,
    setVendorStyle,
    getSupportedVendorProperty,
    cssTransitionSupported,
    cssTransformSupported,
} from 'zap-base-dom-element';
```

### create
```js
zapElementCreate('button', {
    text: 'create',
    id: 'create',
    classes: [
        'class1',
        'class2',
    ],
    attributes: {
        type: 'cancel',
        name: 'create',
    },
    styles: {
        position: 'absolute',
        top: '10px',
        left: '10px',
    },
    events: {
        click: event => {},
    },
});
```

### replace
```js
replace(newElement, elementToReplace);
```

### clear

removes all inner elements

```js
clear(element);
```
