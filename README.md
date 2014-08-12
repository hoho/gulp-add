# gulp-add [![Build Status](https://travis-ci.org/hoho/gulp-add.svg?branch=master)](https://travis-ci.org/hoho/gulp-add)

Add files by content at any point in the pipeline

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
