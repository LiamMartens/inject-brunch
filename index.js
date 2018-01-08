const fs = require('fs');
const path = require('path');

class BrunchInjectPlugin {
    constructor(config) {
        this.config = config.plugins.inject || {};
        if(!this.config.fn) this.config.fn = 'inject';
        if(!this.config.parse) this.config.parse = (data, filename, extension) => data;
    }

    compile({data, path: file}) {
        const rx = new RegExp('\\s+'+this.config.fn+'\\((.+?)\\)', 'm');
        let matches;
        while((matches=rx.exec(data))!=undefined) {
            if(matches && matches.length>1) {
                const inject_file = matches[1].replace(/^'/, '').replace(/'$/, '');
                const extension = path.extname(inject_file).replace(/^\.+/, '');
                const fullpath = path.join(path.dirname(file), inject_file);
                const inject_data = this.config.parse(fs.readFileSync(fullpath).toString().replace(/'/, '\\\'').split(/\r|\n/).join('\'+\''), inject_file, extension);
                data = data.replace(rx, '\''+inject_data+'\'');
            }
        }
        return Promise.resolve({
            data: data
        });
    }
}

BrunchInjectPlugin.prototype.brunchPlugin = true;
BrunchInjectPlugin.prototype.type = 'javascript';
BrunchInjectPlugin.prototype.extension = 'js';

module.exports = BrunchInjectPlugin;