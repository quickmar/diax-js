# `@diax-js/state`

Base implementation of state primitive. In diax-js base state primitive are expressed as signals. Signals are base reactive primitives, which are use for modeling of state changes in frontend systems.

In diax-js signals are implemented by:

- `signal` its value that can be changed over the time
- `computed` it is `signal` which value depends on other `signal`'s value
- `attribute` it's value depends on observed attribute in component definition
- `effect` it is a consumer of the value change in `signal`

In diax-js state change propagation has defined order. Firstly the state of the signal is updated. Then all computed values are calculated. After all values are calculated, all effects are invoked. Effect could update state of some signals, so calculation may happen again. After all computed signals and effect run. All Rendering Elements are scheduled to render.
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

        name = signal('My Rendering Element');
        nick = attribute('data-nick');
        nameAndNick = computed(() => `Name is @{this.name.value} and nick is #{this.nick.value}`)

        constructor() {
            effect(() => console.log(this.nick.value));

            attachEventLister('dblclick', () => {
                this.nick.setValue('Attribute signal');
            })
        }

        render() {
            return html`${this.nameAndNick.value}`
        }
    }
```
