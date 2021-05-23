import AbstractView from './AbstractView.js';

export default class MeasureQueueTime extends AbstractView {
    constructor(app, params) {
        super(app, params);

        this.carsQueue = [];

        this.events.push({ selector: '.btn-departure', type: 'click', handler: this.onDepartureButtonClick });
        this.events.push({ selector: '#btn-start-queue-time', type: 'click', handler: this.onStartMeasureTimeClick });
        this.events.push({ selector: '#btn-stop-queue-time', type: 'click', handler: this.onStopMeasureTimeClick });
        this.events.push({ selector: '.toolbar-btn', type: 'click', handler: this.onBackButtonClick });
    }

    template() {
        return `
            <div class="view measure-time">
                <div class="toolbar bg-primary">
                    <div class="toolbar-title">
                        <button class="btn toolbar-btn"><i class="fas fa-arrow-left fa-lg"></i></button>
                        <h2>Cordova Parking Site</h2>
                    </div>
                    <div class="toolbar-options"></div>
                </div>
                <div class="section">
                    <div class="section-row">
                        <h3>Cars Departure</h3>
                    </div>
                    <div class="section-row buttons">
                        <button id="btn-turn-away" class="btn btn-primary btn-departure">
                            <i class="fas fa-redo-alt fa-2x"></i>
                            <span>Turn Away</span>
                        </button>
                        <button id="btn-leave-parking-lot" class="btn btn-primary btn-departure">
                            <i class="fas fa-arrow-left fa-2x"></i>
                            <span>Leave Parking</span>
                        </button>
                    </div>
                </div>
                <div class="section">
                    <div class="section-row">
                        <h3>Measure Queue Time</h3>
                    </div>
                    <div class="section-row buttons">
                        <button id="btn-start-queue-time" class="btn btn-primary">
                            <i class="fas fa-play fa-2x"></i>
                        </button>
                        <button id="btn-stop-queue-time" class="btn btn-primary">
                            <i class="fas fa-stop fa-2x"></i>
                        </button>
                    </div>
                    <div class="section-row justify-content-center">
                        <span>Last waiting time: <span class="waiting-time">0 seconds</span></span>
                    </div>
                </div>
                <div class="section">
                    <div class="section-row">
                        <h3>Cars Queue</h3>
                    </div>
                    <div class="section-row">
                        <ul class="list-group list-group-flush w-100">
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    updateQueueList() {
        const list = this.app.container.querySelector('ul.list-group');
        list.innerHTML = '';

        this.carsQueue.forEach(car => {
            list.innerHTML += `
                <li class="list-group-item d-flex align-items-center justify-content-between">
                    <i class="fas fa-car-side text-primary"></i>
                    <span>${car.localeDate} ${car.localeTime}</span>
                </li>
             `;
        });
    }

    onDepartureButtonClick(event, view) {
        const button = event.target.classList.contains('btn-sector') ? event.target : event.target.parentNode;
        const buttonDepType = button.id.replace('btn-', '');

        if (buttonDepType === 'turn-away')
            window.plugins.toast.showLongBottom('The car has turned away before parking.');
        else if (buttonDepType === 'leave-parking-lot')
            window.plugins.toast.showLongBottom('The car has left the parking lot.');
    }

    onStartMeasureTimeClick(event, view) {
        const timestamp = Date.now();
        const date = new Date(timestamp);

        view.carsQueue.push({ start: timestamp, localeDate: date.toLocaleDateString(), localeTime: date.toLocaleTimeString()});
        view.updateQueueList();
    }

    onStopMeasureTimeClick(event, view) {
        const timestamp = Date.now();
        const date = new Date(timestamp);

        const passedCar = view.carsQueue.shift();
        const duration = ((Date.now() - passedCar.start) / 1000).toFixed(2);

        view.updateQueueList()
        view.app.container.querySelector('.waiting-time').innerText = `${duration} seconds.`;
    }

    onBackButtonClick(event, view) {
        view.app.back();
    }
};