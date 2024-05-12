# `@diax-js/state`

Base implementation of state primitive. In diax-js base state primitive are signals.
Signals are current state of the art in modeling of state changes in frontend systems.
In diax-js signals consist of following primitives:

- `signal` its value that can be changed over the time
- `computed` it is `signal` which value chang depends on other `signal`
- `effect` it is a consumer of the value change in `signal`

In diax-js state change propagation has defined order. Firstly the state of the signal is update. Then all computed values are calculate. After all values are calculated, all effects are invoked. Effect could update state of some signals, so calculation may happen again. After all computed signals and effect run. All @RenderingElements are scheduled to render its contes to the owning HTML node.
This is process is called state derivation and can be visualized as fallow:

```
    signal -> computed

    or

    signal -> effect

    or

    signal -> computed -> effect -> render

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
    import {RenderingElement} from '@diax-js/rendering-element'
    import { html } from '@diax/rendering-element/uhtml';
    import { signal, attribute, useEffect, computed } from '@diax/state';
    import { attachListener, useHost } from '@diax/context/host';

    @RenderingElement('my-element')
    class MyRenderingElement {
        static get observedAttributes() {
            return ['data-nick'];
        }

        host = useHost();
        name = signal('My Rendering Element');
        nick = attribute('data-nick');
        nameAndNick = computed(() => `Name is @{this.name.value} and nick is #{this.nick.value}`)

        constructor() {
            useEffect(() => console.log(this.nick.value));

            attachEventLister('dblclick', () => {
                this.host.setAttribute('data-nick', 'Attribute signal')
            })
        }

        render() {
            return html`${this.nameAndNick.value}`
        }
    }
```
