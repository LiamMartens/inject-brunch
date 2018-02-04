const fs = require('fs');
const path = require('path');
const escape_quotes = require('escape-quotes');

class BrunchInjectPlugin {
    constructor(config) {
        this.config = config.plugins.inject || {};
        if(!this.config.fn) this.config.fn = 'inject';
        if(!this.config.parse) this.config.parse = (data, filename, extension) => data;
    }

    compile(file) {
        // don't compile empty files or data
        if(!file || !file.data) return Promise.resolve(file);

        // resolve data to string
        file.data = file.data.toString();

        // find file injections
        const rx = new RegExp('([^a-zA-Z0-9_])'+this.config.fn+'\\((.+?)\\)', 'm');
        let matches;
        while((matches=rx.exec(file.data)) != undefined) {
            if(matches && matches.length > 1) {
                const inject_file = matches[2].replace(/^'+/, '').replace(/'+$/, '');
                const extension = path.extname(inject_file).replace(/^\.+/, '');
                const fullpath = inject_file.startsWith('/') ? inject_file : path.join(path.dirname(file.path), inject_file);
                const inject_data = this.config.parse(escape_quotes(fs.readFileSync(fullpath).toString()).split(/\r|\n/).join('\\n'), inject_file, extension);
                file.data = file.data.replace(rx, matches[1]+'\''+inject_data+'\'');
            }
        }

        // resolve new data
        return Promise.resolve(file);
    }
}

BrunchInjectPlugin.prototype.brunchPlugin = true;
BrunchInjectPlugin.prototype.type = 'javascript';
BrunchInjectPlugin.prototype.extension = 'js';

module.exports = BrunchInjectPlugin;