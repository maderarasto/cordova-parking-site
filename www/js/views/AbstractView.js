export default class AbstractView {
    constructor(app, params) {
        this.app = app;
        this.params = params;
    }

    template() {
        return ``;
    }
}