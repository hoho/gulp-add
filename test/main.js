var add = require('../');
var should = require('should');
var path = require('path');
var Vinyl = require('vinyl');
var Buffer = require('buffer').Buffer;
var fs = require('fs');

describe('gulp-add', function() {
    describe('add()', function() {
        testAdd(
            'append two files',
            add({
                'newfile1.txt': 'hello world1',
                'newfile2.txt': 'ololo piu piu'
            }),
            [
                path.join('test', 'oldfile1.txt'),
                path.join('test', 'oldfile2.txt')
            ],
            [
                 path.join('test', 'oldfile1.txt'), 'oldfile1',
                 path.join('test', 'oldfile2.txt'), 'oldfile2',
                'newfile1.txt', 'hello world1',
                'newfile2.txt', 'ololo piu piu'
            ]
        );

        testAdd(
            'append one file',
            add('newfile1.txt', 'hello world2'),
            [
                path.join('test', 'oldfile1.txt'),
                path.join('test', 'oldfile2.txt')
            ],
            [
                path.join('test', 'oldfile1.txt'), 'oldfile1',
                path.join('test', 'oldfile2.txt'), 'oldfile2',
                'newfile1.txt', 'hello world2'
            ]
        );

        testAdd(
            'one file as a source stream (before false)',
            add('newfile1.txt', 'hello world3'),
            [],
            ['newfile1.txt', 'hello world3']
        );


        testAdd(
            'prepend two files',
            add({
                'newfile1.txt': 'hello world1',
                'newfile2.txt': 'ololo piu piu'
            }, true),
            [
                path.join('test', 'oldfile1.txt'),
                path.join('test', 'oldfile2.txt')
            ],
            [
                'newfile1.txt', 'hello world1',
                'newfile2.txt', 'ololo piu piu',
                path.join('test', 'oldfile1.txt'), 'oldfile1',
                path.join('test', 'oldfile2.txt'), 'oldfile2'
            ]
        );

        testAdd(
            'prepend one file',
            add('newfile1.txt', 'hello world2', true),
            [
                path.join('test', 'oldfile1.txt'),
                path.join('test', 'oldfile2.txt')
            ],
            [
                'newfile1.txt', 'hello world2',
                path.join('test', 'oldfile1.txt'), 'oldfile1',
                path.join('test', 'oldfile2.txt'), 'oldfile2'
            ]
        );

        testAdd(
            'one file as a source stream (before true)',
            add('newfile1.txt', 'hello world3', true),
            [],
            ['newfile1.txt', 'hello world3']
        );


        function testAdd(title, stream, files, results) {
            it(title, function(done) {
                stream.on('data', function (file) {
                    var expectedFilename = results.shift(),
                        expectedHead = results.shift();

                    should.exist(file);
                    should.exist(file.relative);
                    should.exist(file.contents);
                    should.exist(expectedFilename);
                    should.exist(expectedHead);

                    var retFilename = path.resolve(file.path);
                    retFilename.should.equal(path.resolve(expectedFilename));
                    file.relative.should.equal(expectedFilename);

                    Buffer.isBuffer(file.contents).should.equal(true);
                    file.contents.toString().substring(0, expectedHead.length).should.equal(expectedHead);

                    if (results && !results.length) {
                        results = null;
                        done();
                    }
                });

                files.forEach(function (filename) {
                    filename = path.resolve(filename);
                    stream.write(new Vinyl({
                        path: filename,
                        contents: fs.readFileSync(filename)
                    }));
                });

                stream.end();

                if (results && !results.length) {
                    results = null;
                    done();
                }
            });
        }
    });
});
