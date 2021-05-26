import AbstractView from './AbstractView.js';
import File from '../File.js';

export default class QueueTimesData extends AbstractView {
    constructor(app, params) {
        super(app, params);

        this.events.push({ selector: '#btn-export', type: 'click', handler: this.onExportButtonClick});
        this.events.push({ selector: '#btn-clear', type: 'click', handler: this.onClearButtonClick});
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
                <div class="view-toolbar justify-content-end">
                    <div class="buttons">
                        <button id="btn-export" class="btn btn-success btn-export"><i class="fas fa-file-excel"></i></button>
                        <button id="btn-clear" class="btn btn-danger"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="d-flex flex-grow-1 position-relative">
                    <ul class="list-group list-group-flush w-100"></ul>
                    <span class="default-message text-muted">There are no queue time records saved.</span>
                </div>
            </div>
        `;
    }

    updateSectorList() {
        this.app.db.selectRecords('queue_times', ['duration', 'created_at'])
            .then(resultSet => {
                const list = this.app.container.querySelector('ul.list-group');
                const message = this.app.container.querySelector('span.default-message');

                list.innerHTML = '';
                message.style.display = resultSet.rows.length > 0 ? 'none' : 'block';

                for (let i = 0; i < resultSet.rows.length; i++) {
                    const queueTimeItem = resultSet.rows.item(i);
                    const listItem = `
                        <li class="list-group-item d-flex justify-content-between">
                            <div class="left-side">
                                <i class="fas fa-stopwatch text-primary"></i>
                                <span>${queueTimeItem.duration} seconds</span>
                            </div>
                            <div class="right-side">
                                <span>${queueTimeItem.created_at}</span>
                            </div>
                        </li>
                    `;

                    list.innerHTML += listItem;
                }
            });
    }

    onExportButtonClick(event, view) {
        view.app.db.selectRecords('queue_times', ['duration', 'created_at'])
            .then(resultSet => {
                const file = new File('export_queue_times.csv');

                for (let i = 0; i < resultSet.rows.length; i++) {
                    const queueTimeItem = resultSet.rows.item(i);
                    file.putLine(`${queueTimeItem.duration};${queueTimeItem.created_at}`);
                }

                file.flush();
                window.plugins.toast.showLongBottom('Queue times records has been exported to app directory.');
            });
    }

    onClearButtonClick(event, view) {
        view.app.db.deleteRecords('queue_times').then(_ => {
            window.plugins.toast.showLongBottom('Queue time records has been cleared.');
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