# `@diax-js/custom-element`

This package provides implementation of custom element.

# How to use

Type in your terminal:

`npm i @diax-js/custom-element`

Component definition:

### 1. Using Decorators:

```
    import { CustomElement } from '@diax-js/custom-element'
    import { attachListener } from '@diax/context/host';

    @CustomElement('my-element')
    class MyElement {

        private name = 'My Element'

        constructor() {
            attachEventLister('dblclick', () => this.alert());
        }

        private alert() {
            alert(this.name);
        }
    }
```

### 2. Plain JS:

```
    import {getElementClass} from '@diax-js/custom-element';

    class MyElement {
        ... definition of the class as above
    }

    const HTMLCtor = getElementClass(MyElement);

    customElements.define('my-element', HTMLCtor);
```

### Later in HTML:

```
    <my-element>
        Double click me
    </my-element>
```
