# `@diax-js/state`

Base implementation of state primitive. In diax-js base state primitive are signals. 
Signals are current state of the art in modeling of state changes in frontend systems.
In diax-js signals consist of following primitives:
- `signal` its value that can be changed over the time
- `computed` it is `signal` which value chang depends on other `signal`
- `effect` it is a consumer of the value change in `signal`

# How to use

Type in your console:

`npm i @diax-js/state`

```
    import {RenderingElement} from '@diax-js/rendering-element'
    import { html } from '@diax/rendering-element/uhtml';
    import { signal, attribute, useEffect, computed } from '@diax/state';

    @RenderingElement('my-element')
    class MyRenderingElement {
        static get observedAttributes() {
            return ['data-nick'];
        } 

        name = signal('');
        nick = attribute('data-nick');
        nameAndNick = computed(() => `Name is @{this.name.value} and nick is #{this.nick.value}`)

        constructor() {
            useEffect(() => console.log(this.nick.value));

            attachEventLister('dblclick', () => {
               this.name.value = 'My Rendering Element';
            })
        }

        render() {
            return html`${this.nameAndNick.value}`
        }
    }
```

