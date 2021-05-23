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
        this.events.forEach(event => {
            this.app.container.querySelectorAll(event.selector).forEach(element => {
                element.addEventListener(event.type, e => event.handler(e, this), true);
            });
        });
    }

    onMount() {

    }

    onDestroy() {
    }
}