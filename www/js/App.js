import Home from './views/Home.js';

export default class App {
    constructor() {
        this.container = document.getElementById('app');
        this.history = [];
        this.routes = [
            { name: 'home', params: {}, view: Home }
        ];

        this.next('home');
    }

    getCurrentRoute() {
        return this.history[this.history.length - 1];
    }

    next(routeName) {
        const route = this.routes.find(r => r.name === routeName);

        if (!route)
            throw `There is no route with name '${routeName}'`;

        const view = new route.view(this, route.params);

        this.container.innerHTML = view.template();
        this.history.push(route);
    }

    back() {
        this.history.pop();

        if (cordova.platformId === 'browser')
            return;

        if (this.history.length === 0)
            navigator.app.exitApp();

        const lastRoute = this.history[this.history.length - 1];
        const view = new lastRoute.view(this, lastRoute.params);

        this.container.innerHTML = view.template();
    }
};