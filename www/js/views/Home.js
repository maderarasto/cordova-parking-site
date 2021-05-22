import AbstractView from './AbstractView.js';

export default class Home extends AbstractView {
    constructor(app, params) {
        super(app, params);
    }

    template() {
        return `
            <div class="d-flex w-100 h-100 flex-column align-items-center justify-content-around">
                <h1 class="app-title text-primary">Cordova Parking Site</h1>
                <div class="grid-buttons">
                    <button type="button" id="btn-sectors" class="btn btn-primary rounded btn-main">
                        <i class="fas fa-th-large"></i>
                        <span class="d-block mt-2 fw-bold">Watch Sectors</span>
                    </button>
                    <button type="button" id="btn-measure" class="btn btn-primary rounded btn-main">
                        <i class="fas fa-stopwatch"></i>
                        <span class="d-block mt-2 fw-bold">Measure Queue Time</span>
                    </button>
                    <button type="button" id="btn-sectors-data" class="btn btn-primary rounded btn-main">
                        <i class="fas fa-list"></i>
                        <span class="d-block mt-2 fw-bold">Sectors Data</span>
                    </button>
                    <button type="button" id="btn-measure-data" class="btn btn-primary rounded btn-main">
                        <i class="fas fa-list"></i>
                        <span class="d-block mt-2 fw-bold">Queue Time Data</span>
                    </button>
                </div>
            </div>
        `;
    }
}