import LocalDatabase from './LocalDatabase.js';
import Home from './views/Home.js';
import WatchSectors from './views/WatchSectors.js';
import MeasureQueueTime from './views/MeasureQueueTime.js';
import SectorsData from './views/SectorsData.js';
import QueueTimesData from './views/QueueTimesData.js';

export default class App {
    constructor() {
        this.container = document.getElementById('app');
        this.db = new LocalDatabase('parking_site_db');
        this.history = [];
        this.routes = [
            { name: 'home', params: {}, class: Home, view: null },
            { name: 'watch-sectors', params: {}, class: WatchSectors, view: null },
            { name: 'measure-time', params: {}, class: MeasureQueueTime, view: null },
            { name: 'sectors-data', params: {}, class: SectorsData, view: null },
            { name: 'queue-times-data', params: {}, class: QueueTimesData, view: null }
        ];

        screen.orientation.lock('portrait');
        this.next('home');
    }

    getCurrentRoute() {
        return this.history[this.history.length - 1];
    }

    next(routeName) {
        const route = this.routes.find(r => r.name === routeName);

        if (!route)
            throw `There is no route with name '${routeName}'`;

        route.view = new route.class(this, route.params);

        this.container.innerHTML = route.view.template();
        route.view.onMount();
        route.view.attachEvents();

        this.history.push(route);
    }

    back() {
        this.history.pop().view.onDestroy();

        // if (cordova.platformId === 'browser')
        //     return;

        if (this.history.length === 0)
            navigator.app.exitApp();

        const lastRoute = this.history[this.history.length - 1];
        lastRoute.view = new lastRoute.class(this, lastRoute.params);

        this.container.innerHTML = lastRoute.view.template();
        lastRoute.view.onMount();
        lastRoute.view.attachEvents();
    }
};