# `@diax/custom-element`

Base implementation of custom element.

# How to use

Type in your console:

`npm i @diax/custom-element`

Component definition:

### 1. Using Decorators:
```
    import {Element} from '@diax/custom-element'

    @Element('my-element')
    class MyElement {
        // may use lifecycle of custom element
        
        name = 'My Element'

        constructor() {
            attachEventLister('dbclick', () => {
                this.alert();
            })
        }

        alert() {
            alert(this.name);
        }
    }
```
### 2. Plain JS:

```
    import {getElementClass} from '@diax/custom-element';

    class MyElement {
        ... as above
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