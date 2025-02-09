# `@diax-js/context`

This package is core for all functionalities implemented by `@diax-js`. The main idea of this package is to provide implementation of `Context` and helper functions to work with it.

# How to use

Type in your terminal:

`npm i @diax-js/context`

Basic usage of context:

```
const context = ...;

useContext(context, () => {...});
```

But for `diax-js` better is use functions like useDocument, useElement.
These functions are using context attached to diax-js elements.

```
useDocument(() => {...});

useElement(element, () => {...});
```

# `Context` concept

Context is an entity that shall be pass as free variable trough synchronous functions call stack.
For instance, when function `f()` is invoked, it builds a call stack:

```
    f -> g -> h -> ... -> n
```

Natural method for passing data from outermost function `f` to the bottom function `n` is trough function arguments.
Sometimes data relevant for function `n` are irrelevant for function `g`, `h` and so on.
Therefore, idea of the `Context` is to create object that is accessible for all functions from `f` to `n`.
The visualization of this concept is code below.

```
    function f() {
        const context = getCurrentContext();
        context.hello = "Hello";
        g();
    }

    function g() {
        const context = getCurrentContext();
        console.log(context.hello);
    }

    useContext(context, () => {
        f(); // will log "Hello" in the console.
    })
```

### `@diax-js` usage of context

The `@diax-js` is designed to build web components. To support base concepts such as dependency injection system or signal data processing, `diax` is using `Context`.
