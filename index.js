/*!
 * gulp-add, https://github.com/hoho/gulp-add
 * (c) 2014 Marat Abdullin, MIT license
 */

'use strict';

var through = require('through');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var Buffer = require('buffer').Buffer;
var fs = require('fs');
var path = require('path');


function createFile(path, content) {
    return new File({
        path: path,
        contents: new Buffer(content)
    });
}


module.exports = function(files, content) {
    var oldFiles = [],
        newFiles = [];

    if (typeof files === 'object') {
        for (var file in files) {
            if (files.hasOwnProperty(file)) {
                newFiles.push(createFile(file, files[file]));
            }
        }
    } else if (typeof files === 'string') {
        switch (typeof content) {
            case 'string':
                newFiles.push(createFile(files, content));
                break;

            default:
                throw new PluginError('gulp-add', 'Unknown argument type');
        }
    } else {
        throw new PluginError('gulp-add', 'Unknown argument type');
    }

    function bufferContents(file) {
        if (file.isNull()) { return; }
        if (file.isStream()) { return this.emit('error', new PluginError('gulp-add',  'Streaming not supported')); }

        oldFiles.push(file);
    }

    function endStream() {
        try {
            var i;

            for (i = 0; i < oldFiles.length; i++) {
                this.emit('data', oldFiles[i]);
            }

            for (i = 0; i < newFiles.length; i++) {
                this.emit('data', newFiles[i]);
            }
        } catch(e) {
            return this.emit('error', new PluginError('gulp-add', e.message));
        }

        this.emit('end');
    }

    return through(bufferContents, endStream);
};
