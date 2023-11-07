# `@diax/rendering-element`

Base implementation of custom element that can render content.

# How to use

Type in your console:

`npm i @diax/rendering-element`

Component definition:

### 1. Using Decorators:

```
    import {RenderingElement, Attributes, RenderState} from '@diax/rendering-element'

    @RenderingElement('my-element')
    class MyRenderingElement {
        // may use lifecycle of custom element

        host = useHost();

        name = '';

        constructor() {
            attachEventLister('dbclick', () => {
               this.name = 'My Rendering Element';
               this.host.setAttribute(Attributes.RENDER_STATE , RenderState.PENDING);
            })
        }

        render() {
            this.host.innerHtml = this.name;
        }
    }
```

### 2. Plain JS:

```
    import {getRenderingElementClass} from '@diax/rendering-element';

    class MyRenderingElement {
        ... as above
    }

    const HTMLCtor = getRenderingElementClass(MyRenderingElement);

    customElements.define('my-element', HTMLCtor);
```

### Later in HTML:

```
    <my-element></my-element> // double click

...later

    <my-element>
        My Rendering Element
    </my-element>

```
