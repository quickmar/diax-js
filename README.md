# diax.js

The `diax.js` is a library for creating Web Components with extended capabilities and with clean API.

# How to use

Type in your console:

`npm i @diax/custom-element`

and then create your first element simply by creating decorated class:

```
@Element('first-element')
class FirstElement {}
```

This is all you need to do to define your first web component with `diax.js`.

# Features of custom elements by `diax.js`

### Comparing to native solution provide simpler API surface

```
// Native element
class MyElement extends HTMLElement{
    constructor() {
        // check autocomplete - lot of noise from HTMLElement
    }
}


// diax.js
@Element('my-element')
class MyElement {
    constructor() {
        // check autocomplete - empty result, as nothing has been defined
    }
}
```

### Dependency Injection like system

```
// service
class Service {}

...

@Element('my-element')
class MyElement {
    service = useSelf(Service); // instantiate service and dependencies
}

```

### Specialized element implementations

```
// act as basic Custom Element
@Element('base-element')
class BaseElement {}

<base-element>
 // content
</base-element>

...

// act as Form Associated Custom Element
@FormElement('form-element')
class FormElement {}

<form>
    <label for="element">
    <form-element name="element"></form-element>
</form>

...

// can render content
@RenderingElement('rendering-element')
class RenderingElement {
    render() {
        this.innerHtml = 'Hello';
    }
}

<rendering-element>
    Hello
</rendering-element>
```

### Powerful extendibility

Extending your code can be by inheritance or by composition. It is up to you how to maintain and extend your code.

- inheritance

```
@Element('base-element')
class BaseElement {
    // some base logic
}

@Element('base-element-child')
class BaseElementChild extends BaseElement{}
```

- composition

```
@Element('base-element')
class BaseElement {
    // some base logic
}

@Element('base-element-child')
class BaseElementChild {
    baseElement = useSelf(BaseElement);
}
```

### Same lifecycle as native Web Component

```
@Element('base-element')
class BaseElement {
  constructor() {}

  connectedCallback() {}

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {}

  adoptedCallback() {}
}
```
