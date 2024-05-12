# `@diax-js/rendering-element`

Base implementation of custom element that can render content.

# How to use

Type in your console:

`npm i @diax-js/rendering-element`

Component definition:

### 1. Using Decorators:

```
    import {RenderingElement} from '@diax-js/rendering-element'
    import { html } from '@diax/rendering-element/uhtml';
    import { signal } from '@diax/state';
    import { attachListener, useHost } from '@diax/context/host';

    @RenderingElement('my-element')
    class MyRenderingElement {
        static get observedAttributes() {
            return ['data-nick'];
        }

        host = useHost();

        name = signal('');
        nick = attribute('data-nick');

        constructor() {

            attachEventLister('dblclick', () => {
               this.name.value = 'My Rendering Element';
            })
        }

        render() {
            return html`${this.name.value} has nick ${this.nick.value}`
        }
    }
```

### Later in HTML:

```
    <my-element data-nick="Signal"></my-element> // double click

...later

    <my-element>
        My Rendering Element has nick Signal
    </my-element>

```
