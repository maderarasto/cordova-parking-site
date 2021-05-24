import AbstractView from './AbstractView.js';

export default class WatchSectors extends AbstractView {
    constructor(app, params) {
        super(app, params);

        this.sectors = [
            { selector: '.sector-cars.sector-a', cars: 0 },
            { selector: '.sector-cars.sector-b', cars: 0 },
            { selector: '.sector-cars.sector-c', cars: 0 },
            { selector: '.sector-cars.sector-d', cars: 0 },
        ]

        this.events.push({ selector: '.toolbar-btn', type: 'click', handler: this.onBackButtonClick });
        this.events.push({ selector: '.btn-sector', type: 'click', handler: this.onSectorButtonClick });
    }

    template() {
        return `
            <div class="view watch-sectors">
                <div class="toolbar bg-primary">
                    <div class="toolbar-title">
                        <button class="btn toolbar-btn"><i class="fas fa-arrow-left fa-lg"></i></button>
                        <h2>Cordova Parking Site</h2>
                    </div>
                    <div class="toolbar-options"></div>
                </div>
                <div class="section">
                    <div class="section-row">
                        <h3>Sector A</h3>
                        <span class="sector-cars sector-a">0 cars</span>
                    </div>
                    <div class="section-row buttons">
                        <button id="sector-a-minus" class="btn btn-primary btn-sector"><i class="fas fa-minus fa-2x"></i></button>
                        <button id="sector-a-plus" class="btn btn-primary btn-sector"><i class="fas fa-plus fa-2x"></i></button>
                    </div>
                </div>
                <div class="section">
                    <div class="section-row">
                        <h3>Sector B</h3>
                        <span class="sector-cars sector-b">0 cars</span>
                    </div>
                    <div class="section-row buttons">
                        <button id="sector-b-minus" class="btn btn-primary btn-sector"><i class="fas fa-minus fa-2x"></i></button>
                        <button id="sector-b-plus" class="btn btn-primary btn-sector"><i class="fas fa-plus fa-2x"></i></button>
                    </div>
                </div>
                <div class="section">
                    <div class="section-row">
                        <h3>Sector C</h3>
                        <span class="sector-cars sector-c">0 cars</span>
                    </div>
                    <div class="section-row buttons">
                        <button id="sector-c-minus" class="btn btn-primary btn-sector"><i class="fas fa-minus fa-2x"></i></button>
                        <button id="sector-c-plus" class="btn btn-primary btn-sector"><i class="fas fa-plus fa-2x"></i></button>
                    </div>
                </div>
                <div class="section">
                    <div class="section-row">
                        <h3>Sector D</h3>
                        <span class="sector-cars sector-d">0 cars</span>
                    </div>
                    <div class="section-row buttons">
                        <button id="sector-d-minus" class="btn btn-primary btn-sector"><i class="fas fa-minus fa-2x"></i></button>
                        <button id="sector-d-plus" class="btn btn-primary btn-sector"><i class="fas fa-plus fa-2x"></i></button>
                    </div>
                </div>
            </div>
        `;
    }

    checkButtonsAvailability() {
        this.sectors.forEach(sector => {
            const sectorKey = sector.selector.replace('.sector-cars.', '');

            if (sector.cars === 0)
                this.app.container.querySelector(`#${sectorKey}-minus`).classList.add('disabled');
            else
                this.app.container.querySelector(`#${sectorKey}-minus`).classList.remove('disabled');
        });
    }

    onBackButtonClick(event, view) {
        view.app.back();
    }

    onSectorButtonClick(event, view) {
        const button = event.target.classList.contains('btn-sector') ? event.target : event.target.parentNode;
        const splitButtonId = [...button.id.matchAll(/(sector-[a-d])-(.*)/g)][0];
        const sector = view.sectors.find(sector => sector.selector.replace('.sector-cars', '').includes(splitButtonId[1]));
        const date = new Date(Date.now());

        if (sector) {
            view.app.db.insertRecord('sectors', ['sector', 'type', 'created_at'], {
                sector: splitButtonId[1].replace('sector-', ''),
                type: splitButtonId[2] === 'minus' ? 'departure' : 'arrival',
                created_at: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
            }).then(resultSet => {
                sector.cars += (splitButtonId[2] === 'minus' ? -1 : splitButtonId[2] === 'plus' ? 1 : 0);

                if (sector.cars === 0)
                    view.app.container.querySelector(`#${splitButtonId[1]}-minus`).classList.add('disabled');
                else
                    view.app.container.querySelector(`#${splitButtonId[1]}-minus`).classList.remove('disabled');

                view.app.container.querySelector(sector.selector).innerText = `${sector.cars} cars`;
                window.plugins.toast.showLongBottom(`Record with section ${splitButtonId[1].replace('sector-', '').toUpperCase()} was saved.`);
            })
        }
    }

    onMount() {
        this.checkButtonsAvailability();
    }
}