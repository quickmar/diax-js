# `@diax-js/rendering-element`

Base implementation of element that can render content.

# How to use

Type in your console:

`npm i @diax-js/rendering-element`

Component definition:

### 1. Using Decorators:

```
    import { RenderingElement } from '@diax-js/rendering-element'
    import { html } from '@diax/rendering-element/uhtml';
    import { signal, attribute } from '@diax/state';
    import { attachListener } from '@diax/context/host';

    @RenderingElement('my-element')
    class MyRenderingElement {
        static get observedAttributes() {
            return ['data-nick'];
        }

        private name = signal('');
        private nick = attribute('data-nick');

        constructor() {
            attachEventLister('dblclick', () => this.name.setValue('My Rendering Element'));
        }

        render() {
            return html`${this.name.value} has nick ${this.nick.value}`
        }
    }
```

### 2. Plain JS:

```
    import {getRenderingElementClass} from '@diax-js/rendering-element';

    class MyFormElement {
        ... as above
    }

    const HTMLCtor = getRenderingElementClass(MyFormElement);

    customElements.define('my-element', HTMLCtor);
```

### Later in HTML:

```
    <my-element data-nick="Signal"></my-element> // double click

...later

    <my-element data-nick="Signal">
        My Rendering Element has nick Signal
    </my-element>

```
