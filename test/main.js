var add = require('../');
var should = require('should');
var path = require('path');
var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;
var fs = require('fs');
require('mocha');


describe('gulp-add', function() {
    describe('add()', function() {
        testAdd(
            add({
                'newfile1.txt': 'hello world1',
                'newfile2.txt': 'ololo piu piu'
            }),
            [
                'test/oldfile1.txt',
                'test/oldfile2.txt'
            ],
            [
                'test/oldfile1.txt', 'oldfile1',
                'test/oldfile2.txt', 'oldfile2',
                'newfile1.txt', 'hello world1',
                'newfile2.txt', 'ololo piu piu'
            ]
        );

        testAdd(
            add('newfile1.txt', 'hello world2'),
            [
                'test/oldfile1.txt',
                'test/oldfile2.txt'
            ],
            [
                'test/oldfile1.txt', 'oldfile1',
                'test/oldfile2.txt', 'oldfile2',
                'newfile1.txt', 'hello world2'
            ]
        );

        testAdd(
            add('newfile1.txt', 'hello world3'),
            [],
            ['newfile1.txt', 'hello world3']
        );


        testAdd(
            add({
                'newfile1.txt': 'hello world1',
                'newfile2.txt': 'ololo piu piu'
            }, true),
            [
                'test/oldfile1.txt',
                'test/oldfile2.txt'
            ],
            [
                'newfile1.txt', 'hello world1',
                'newfile2.txt', 'ololo piu piu',
                'test/oldfile1.txt', 'oldfile1',
                'test/oldfile2.txt', 'oldfile2'
            ]
        );

        testAdd(
            add('newfile1.txt', 'hello world2', true),
            [
                'test/oldfile1.txt',
                'test/oldfile2.txt'
            ],
            [
                'newfile1.txt', 'hello world2',
                'test/oldfile1.txt', 'oldfile1',
                'test/oldfile2.txt', 'oldfile2'
            ]
        );

        testAdd(
            add('newfile1.txt', 'hello world3', true),
            [],
            ['newfile1.txt', 'hello world3']
        );


        function testAdd(stream, files, results) {
            it('should add files', function(done) {
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
                    stream.write(new File({
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
