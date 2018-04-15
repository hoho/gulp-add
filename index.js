/*!
 * gulp-add, https://github.com/hoho/gulp-add
 * (c) 2014 Marat Abdullin, MIT license
 */

'use strict';

var through = require('through2');
var Vinyl = require('vinyl');
var PluginError = require('plugin-error');
var Buffer = require('buffer').Buffer;

var PLUGIN_NAME = 'gulp-add';

function createFile(path, content) {
    return new Vinyl({
        path: path,
        contents: content
    });
}

module.exports = function(files, content, before) {
    var oldFiles = [];
    var newFiles = [];

    if(typeof files === 'object') {
        for(var file in files) {
            if(files.hasOwnProperty(file)) {
                newFiles.push(createFile(file, new Buffer(files[file])));
            }
        }
        before = content;
    }
    else if(typeof files === 'string') {
        if(typeof content === 'string') {
            newFiles.push(createFile(files, new Buffer(content)));
        }
        else if(typeof content === 'object' && content instanceof Buffer) {
            newFiles.push(createFile(files, content));
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
            if(file.isNull()) {
                return callback(null, file);
            }

            if(file.isStream()) {
                return callback(new PluginError(PLUGIN_NAME, 'Streaming is not supported.'));
            }

            oldFiles.push(file);

            return callback(null);
        },
        function(callback) {
            try {
                var startFiles = before ? newFiles : oldFiles;
                var endFiles = before ? oldFiles : newFiles;

                for(var i = 0; i < startFiles.length; i++) {
                    this.push(startFiles[i]);
                }

                for(var i = 0; i < endFiles.length; i++) {
                    this.push(endFiles[i]);
                }

                return callback();
            }
            catch(error) {
                return callback(new PluginError(PLUGIN_NAME, error.message));
            }
        }
    );
};
