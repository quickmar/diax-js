# `@diax-js/form-element`

This package provides implementation of custom element that is designed to be associated with forms.

# How to use

Type in your terminal:

`npm i @diax-js/form-element`

Component definition:

### 1. Using Decorators:

```
    import { FormElement } from '@diax-js/form-element';
    import { useHost } from '@diax/context/host';
    

    @FormElement('my-element')
    class MyFormElement {
        // may use lifecycle of custom element
        // may use lifecycle of form associated element

        constructor() {
            attachEventLister('dbclick', () => {
                useHost().attachInternals().setFormValue('My Form Element');
            })
        }
    }
```

### 2. Plain JS:

```
    import {getFormElementClass} from '@diax-js/form-element';

    class MyFormElement {
        ... as above
    }

    const HTMLCtor = getFormElementClass(MyFormElement);

    customElements.define('my-element', HTMLCtor);
```

### Later in HTML:

```
<form id="myForm">
    <my-element name="myElement">
        Double click me
    </my-element>
</form>

...

const formDta = new FormData(myForm);

console.log(Object.fromEntries(formData.entries())) // will log {myElement: "My Form Element"}

```
