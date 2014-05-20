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
        .pipe(add('filename1.txt', 'This is first file content'))
        .pipe(add({
            'filename2.txt': 'This is second file content',
            'filename3.txt': 'This is third file content'
        }))
        .pipe(gulp.dest('./build'));
});
```
