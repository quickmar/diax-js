# diax.js

`Diax` a library for creating Web Components with extended capabilities and clean API.

# Problem it is addressed

### Context based behavior

While developing HTML page often we would like to configure some behavior of component based on it parents. This means that parents are creating some context in witch our component exists and can derive behavior. <br>

Visual representation of context depended behavior:

```
<body>
    <enabling-parent>
        <my-form>
            ... content is editable
        </my-form>
    </enabling-parent>

    <disabling-parent>
        <my-form>
            ... content is not editable
        </my-form>
    </disabling-parent>
</body>
```

# How to use

Type in your console:

`npm i @diax-js/custom-element`

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
        return html`Hello`;
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

### Signal based client rendering

    @RenderingElement('my-element')
    class MyRenderingElement {
        name = signal('');

        constructor() {
            attachEventLister('dblclick', () => {
               this.name.value = 'My Rendering Element';
            })
        }

        render() {
            return html`${this.name.value}`
        }
    }
