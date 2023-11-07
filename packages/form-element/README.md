# `@diax/form-element`

Base implementation of custom element that can be associated with forms.

# How to use

Type in your console:

`npm i @diax/form-element`

Component definition:

### 1. Using Decorators:

```
    import {FormElement} from '@diax/form-element'

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
    import {getFormElementClass} from '@diax/form-element';

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
