import AbstractView from './AbstractView.js';
import File from './../File.js';

export default class SectorsData extends AbstractView {
    constructor(app, params) {
        super(app, params);

        this.events.push({ selector: '#btn-clear', type: 'click', handler: this.onClearButtonClick});
        this.events.push({ selector: '#btn-export', type: 'click', handler: this.onExportButtonClick});
        this.events.push({ selector: '.btn-filter', type: 'click', handler: this.onFilterButtonClick});
        this.events.push({ selector: '.toolbar-btn', type: 'click', handler: this.onBackButtonClick });
    }

    template() {
        return `
            <div class="view sectors-data">
                <div class="toolbar bg-primary">
                    <div class="toolbar-title">
                        <button class="btn toolbar-btn"><i class="fas fa-arrow-left fa-lg"></i></button>
                        <h2>Cordova Parking Site</h2>
                    </div>
                    <div class="toolbar-options"></div>
                </div>
                <div class="view-toolbar filter">
                    <span>Filter: </span>
                    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" class="btn-check btn-filter" name="btnradio" id="btn-sector-all" autocomplete="off" checked>
                        <label class="btn btn-outline-primary" for="btn-sector-all">All</label>
                    
                        <input type="radio" class="btn-check btn-filter" name="btnradio" id="btn-sector-a" autocomplete="off">
                        <label class="btn btn-outline-primary" for="btn-sector-a">A</label>
                    
                        <input type="radio" class="btn-check btn-filter" name="btnradio" id="btn-sector-b" autocomplete="off">
                        <label class="btn btn-outline-primary" for="btn-sector-b">B</label>
                        
                        <input type="radio" class="btn-check btn-filter" name="btnradio" id="btn-sector-c" autocomplete="off">
                        <label class="btn btn-outline-primary" for="btn-sector-c">C</label>
                        
                        <input type="radio" class="btn-check btn-filter" name="btnradio" id="btn-sector-d" autocomplete="off">
                        <label class="btn btn-outline-primary" for="btn-sector-d">D</label>
                    </div>
                    <div class="buttons">
                        <button id="btn-export" class="btn btn-success btn-export"><i class="fas fa-file-excel"></i></button>
                        <button id="btn-clear" class="btn btn-danger"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="d-flex flex-grow-1 position-relative">
                    <ul class="list-group list-group-flush w-100"></ul>
                    <span class="default-message text-muted">There are no sector records saved.</span>
                </div>
            </div>
        `;
    }

    updateSectorList(filterBy='all') {
        const whereClause = filterBy !== 'all' ? 'sector = (?)' : '';
        const parameters = filterBy !== 'all' ? [ filterBy ] : [];

        this.app.db.selectRecords('sectors', ['sector', 'type', 'created_at'], whereClause, parameters)
            .then(resultSet => {
                const list = this.app.container.querySelector('ul.list-group');
                const message = this.app.container.querySelector('span.default-message');

                list.innerHTML = '';
                message.style.display = resultSet.rows.length > 0 ? 'none' : 'block';

                for (let i = 0; i < resultSet.rows.length; i++) {
                    const sectorItem = resultSet.rows.item(i);
                    const listItem = `
                        <li class="list-group-item d-flex justify-content-between">
                            <div class="left-side">
                                <i class="fas fa-arrow-${sectorItem.type === 'departure' ? 'left text-danger' : 'right text-success'} sector-type"></i>
                                <span>Sector ${sectorItem.sector.toUpperCase()}</span>
                            </div>
                            <div class="right-side">
                                <span>${sectorItem.created_at}</span>
                            </div>
                        </li>
                    `;

                    list.innerHTML += listItem;
                }
            });
    }

    onFilterButtonClick(event, view) {
        const filterBy = event.target.id.replace('btn-sector-', '');

        view.updateSectorList(filterBy);
    }

    onExportButtonClick(event, view) {
        view.app.db.selectRecords('sectors', ['sector', 'type', 'created_at'])
            .then(resultSet => {
                const file = new File('export_sectors.csv');

                for (let i = 0; i < resultSet.rows.length; i++) {
                    const sectorItem = resultSet.rows.item(i);
                    file.putLine(`${sectorItem.sector};${sectorItem.type};${sectorItem.created_at}`);
                }

                file.flush();
                window.plugins.toast.showLongBottom('Sectors records has been exported to app directory.');
            });
    }

    onClearButtonClick(event, view) {
        view.app.db.deleteRecords('sectors').then(_ => {
            window.plugins.toast.showLongBottom('Sector records has been cleared.');
            view.updateSectorList();
        });
    }

    onBackButtonClick(event, view) {
        view.app.back();
    }

    onMount() {
        this.updateSectorList();
    }
}