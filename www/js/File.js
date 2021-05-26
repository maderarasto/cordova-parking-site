export default class File {
    constructor(fileName) {
        this._fileName = fileName;
        this._content = '';
    }

    putLine(line) {
        this._content += `${line}\n`;
    }

    flush() {
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, dir => {
            dir.getFile(this._fileName, { create: true }, file => {
                file.createWriter(writer => {
                    const blob = new Blob([this._content], { type: 'text/plain' });

                    writer.seek(writer.length);
                    writer.write(blob);
                })
            }, err => console.error(err));
        }, err => console.error(err));
    }
}