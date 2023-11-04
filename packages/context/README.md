# `@diax/context`

This package is core for all functionality implemented by `@diax`. The main idea of this package is to provide implementation of `interface Context` and helper functions to work with it.

# How to use

Type in your console:

`npm i @diax/context`

### `Context` concept

Context is an entity that could be pass as free variable to synchronous functions stack.
It means that while executing some function `f()` it can build a example call stack:

```
    f -> g -> h -> ... -> n
```

Passing data below stack may be inconvenient due to amount of it. So idea of `Context` is
to create object that could be shared between differed functions and let pass data between in more scalable manner.

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

### `@diax` usage of context

`@diax` is designed to build web components so `Context` is base concept for dependency sharing system or dependency injection system. But could be used to build more features in the future.
