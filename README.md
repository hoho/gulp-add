# gulp-add

[![NPM version][npm-version-image]][npm-url]
[![Build Status][build-status-image]][build-status-url]
[![Downloads][npm-downloads-image]][npm-url]

Add files by contents at any point in the pipeline.

Install:

```sh
npm install gulp-add --save-dev
```


Example:

```js
var add = require('gulp-add');

gulp.task('some-task', function() {
    return gulp.src(['some files'])
        .pipe(add('filename1.txt', 'First file contents'))
        .pipe(add({
            'filename2.txt': 'Second file contents',
            'filename3.txt': 'Third file contents'
        }))
        .pipe(gulp.dest('./build'));
});
```

By default, new files are being added to the end of the stream. You can insert
new files in the beginning of the stream:

```js
.pipe(add('filename1.txt', 'First file contents', true))
```

or

```js
.pipe(add({
    'filename2.txt': 'Second file contents',
    'filename3.txt': 'Third file contents'
}, true))
```

[npm-url]: https://www.npmjs.com/package/gulp-add
[npm-version-image]: https://img.shields.io/npm/v/gulp-add.svg
[npm-downloads-image]: http://img.shields.io/npm/dm/gulp-add.svg

[build-status-url]: https://travis-ci.org/hoho/gulp-add
[build-status-image]: https://travis-ci.org/hoho/gulp-add.svg?branch=master
