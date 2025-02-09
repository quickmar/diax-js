# `@diax-js/state`

The `state` package is base implementation of reactive state primitive.
Base abstraction are `signals` witch allows for glitch free state propagation.
This mechanism is widely adopted by frontend framework, because of the convenience of usage.

In diax-js signals are implemented by following primitives:

- `signal` its represents value that can be changed over the time
- `computed` it is `signal` which value, depends on other `signal`'s value
- `attribute` it's value depends on observed attribute in custom element definition
- `effect` it is a consumer of the value change in `signal`

In diax-js state change propagation has defined order. Firstly the state of the `signal` is updated. Then this updated is propagated to it dependencies like `computed`, `effect` or `rendering-element`. First all `computed` values are calculated synchronously and propagated as well. In this phase `effects` and `renders` are queued.
After `computation` phase happen `effects` are invoked. It may happen that invocation of `effect` will update any `signal` causing `computation` and scheduling of `effects` and `renders` again. This process will be repeated until all the state is propagated.
As a final step `rendering` happen. Where all queued invocation of `render` take place. This step must not cause other rendering.

This is process is called state derivation and can be visualized as fallow:

```
    signal -> computed

    or

    signal -> effect

    or

    signal -> render

    or

    signal -> computed -> effect -> computed -> render

    or

    signal -> computed -> effect -> computed -> effect -> render

    ...and so on
```

# How to use

Type in your console:

`npm i @diax-js/state`

```
    import { RenderingElement } from '@diax-js/rendering-element'
    import { html } from '@diax/rendering-element/uhtml';
    import { signal, attribute, effect, computed } from '@diax/state';
    import { attachListener } from '@diax/context/host';

    @RenderingElement('my-element')
    class MyRenderingElement {
        static get observedAttributes() {
            return ['data-nick'];
        }

        private name = signal('My Rendering Element');
        private nick = attribute('data-nick');
        private nameAndNick = computed(() => `Name is @{this.name.value} and nick is #{this.nick.value}`)

        constructor() {
            effect(() => console.log(this.nick.value));
            attachEventLister('dblclick', () => this.nick.setValue('Attribute signal'));
        }

        render() {
            return html`${this.nameAndNick.value}`
        }
    }
```
