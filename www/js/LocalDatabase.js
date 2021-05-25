export default class LocalDatabase {
    constructor(dbName) {
        this.database = window.sqlitePlugin.openDatabase(
            { name: dbName, location: 'default' },
            this.onSuccessOpenDatabase,
            err => console.error(err)
        );
    }

    selectRecords(tableName, columns, whereSql='', parameters=[]) {
        const formattedColumns = columns.join(', ');
        const sql = `SELECT ${formattedColumns} FROM ${tableName} ${whereSql !== '' ? 'WHERE ' : ''}${whereSql}`;

        return new Promise((resolve, reject) => {
            this.database.executeSql(sql, parameters, resultSet => resolve(resultSet), err => reject(err));
        });
    }

    insertRecord(tableName, columns, object) {
        const formattedColumns = columns.join(', ');
        const placeholders = columns.reduce((result, column) => result + '?,', '').slice(0, -1);
        const sql = `INSERT INTO ${tableName} (${formattedColumns}) VALUES(${placeholders})`;
        const values = columns.map(column => object[column]);

        return new Promise((resolve, reject) => {
            this.database.executeSql(sql, values, resultSet => resolve(resultSet), err => reject(err));
        });
    }

    deleteRecords(tableName, whereSql='', parameters=[]) {
        const sql = `DELETE FROM ${tableName} ${whereSql !== '' ? 'WHERE ' : ''}${whereSql}`;

        return new Promise((resolve, reject) => {
            this.database.executeSql(sql, parameters, resultSet => resolve(resultSet), err => reject(err));
        });
    }


    onSuccessOpenDatabase(db) {
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS sectors (id INTEGER PRIMARY KEY, sector TEXT, type TEXT, created_at TEXT)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS departures (id INTEGER PRIMARY KEY, type TEXT, created_at TEXT)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS queue_times (id INTEGER PRIMARY KEY, duration REAL, created_at TEXT)');
        }, (tx, error) => console.log(error));
    }
}