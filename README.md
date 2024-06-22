# diax.js

`Diax` a library for creating Web Components with extended capabilities and clean API.

# Problem diax aim to solve
Developing modern web page often require of shearing data between parts of the page and updates of UI based on user interaction. To meet these requirements there is a need to deliver more JavaSpript to the page, but nature of software is that it is growing over time. These phenomena require encapsulation as it allows dividing softer in to smaller pieces that are better manageable, extendable and composable. 

Web Components are solution for that. They let attach custom JavaScript to its definition, so it creates encapsulation and increase manageability. They are HTML Nodes, so they are composable. Last but not least they are pure JavaScript classes, so they are extendable.

Even all positive aspect that Web Components brings to the Web there are improvements which can be addressed. 
- Passing data between elements 
- Reacting on user actions
- Code extensibility

<br>

# How to use

Type in your console:

`npm i @diax-js/custom-element`

and then create your first element simply by creating decorated class:

```
@CustomElement('first-element')
class FirstElement {

    init() {
        console.log("Hello");
    }
}
```

This is all you need to do to define your first web component with `diax.js`.

# Features of custom elements by `diax.js`

### Signal based client rendering
```
    @RenderingElement('my-element')
    class MyRenderingElement {
        name = signal('');

        constructor() {
            attachEventLister('dblclick', () => {
               this.name.setValue('My Rendering Element');
            })
        }

        render() {
            return html`${this.name.value}`
        }
    }
```

### Dependency Injection like system

```
// service
class Service {}

...

@CustomElement('my-element')
class MyElement {
    service = useSelf(Service); // instantiate service and dependencies
}

```

### Comparing to native solution provide simpler API surface

```
// Native element
class MyElement extends HTMLElement{
    constructor() {
        // all properties from HTMLElement are visible in autocomplete
    }
}


// diax.js
@CustomElement('my-element')
class MyElement {
    constructor() {
        // check autocomplete - empty result, as MyElement is pure JS class
    }
}
```

### Specialized element implementations

```
// act as basic Custom Element
@CustomElement('base-element')
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

### Powerful extensibility

Extending your code can be by inheritance or by composition. It is up to you how to maintain and extend your code.

- Inheritance

```
@CustomElement('base-element')
class BaseElement {
    // some base logic
}

@CustomElement('base-element-child')
class BaseElementChild extends BaseElement{}
```

- Composition

```
@CustomElement('base-element')
class BaseElement {
    // some base logic
}

@CustomElement('base-element-child')
class BaseElementChild {
    baseElement = useSelf(BaseElement);
}
```