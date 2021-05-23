export default class AbstractView {
    constructor(app, params) {
        this.app = app;
        this.params = params;
        this.events = [];
    }

    template() {
        return ``;
    }

    attachEvents() {
        const view = this;

        this.events.forEach(event => {
            this.app.container.querySelectorAll(event.selector).forEach(element => {
                element.addEventListener(event.type, this.eventHandler = e => event.handler(e, view), true);
            });
        });
    }

    onCreate() {
    }

    onDestroy() {
    }
}