/*!
 * gulp-add, https://github.com/hoho/gulp-add
 * (c) 2014 Marat Abdullin, MIT license
 */

'use strict';

var through = require('through2');
var Vinyl = require('vinyl');
var PluginError = require('plugin-error');

var PLUGIN_NAME = 'gulp-add';

function createFile(path, content) {
    return new Vinyl({
        path: path,
        contents: Buffer.isBuffer(content) ? content : Buffer.from(content)
    });
}

module.exports = function(files, content, before) {
    var addFiles = [];

    if(typeof files === 'object') {
        for(var file in files) {
            if(files.hasOwnProperty(file)) {
                addFiles.push(createFile(file, files[file]));
            }
        }
        before = content;
    }
    else if(typeof files === 'string') {
        if(typeof content === 'string' || Buffer.isBuffer(content)) {
            addFiles.push(createFile(files, content));
        }
        else {
            throw new PluginError(PLUGIN_NAME, 'Unknown argument type.');
        }
    }
    else {
        throw new PluginError(PLUGIN_NAME, 'Unknown argument type.');
    }

    if(before !== undefined && before !== true && before !== false) {
        throw new PluginError(PLUGIN_NAME, '`before` argument should be a boolean.');
    }

    return through.obj(
        function(file, encoding, callback) {
            if(before) {
                pushAll(this, addFiles);
                before = null;
            }

            if(file.isStream()) {
                return callback(new PluginError(PLUGIN_NAME, 'Streaming is not supported.'));
            }

            return callback(null, file);
        },
        function(callback) {
            pushAll(this, addFiles);
            callback(null);
        }
    );
};

function pushAll(stream, files) {
    while (files && files.length) {
        stream.push(files.shift());
    }
}
