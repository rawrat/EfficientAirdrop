# func.js - Zero class and proud of it.

  A better JavaScript constructor pattern. Abstracts away the bad parts of `new`, but maintains a distinction between instance and static members, unlike the illustrious `Object.create`.

## Installation

  Server-side ([Node.js](http://nodejs.org)):

    $ npm install func

  Client-side ([component(1)](https://github.com/component)):

    $ component install shannonmoeller/func.js

## API

### `Func([...args])`

  `...args` Zero or more arguments to pass to `init`.

  Returns an instance of `Func`. Calls `this.init` with provided arguments.

``` js
var Func = require('func');

Func.prototype.init = function (foo, bar) {
    this.yell(foo, bar);
};

Func.prototype.yell = function (baz, bat) {
    console.log(baz, bat);
};

Func('hello', 'world'); // logs 'hello world'
```

### `new Func([...args])`

  Same as `Func([...args])`. Rest in peace `new`.

``` js
new Func('hello', 'world'); // logs 'hello world'
```

### `Func.call(ctx, [...args])`

  Nice try. Same as `Func([...args])`.

``` js
Func.call({}, 'hello', 'world'); // logs 'hello world'
```

### `Func.apply(ctx, args)`

  Guess. Yep, same as `Func([...args])`.

``` js
Func.apply({}, ['hello', 'world']); // logs 'hello world'
```

### `Func.extend([prot], [stat])`

  `prot` An object containing instance members.

  `stat` An object containing static members.

  Returns a function whose `prototype` object is an instance of `Func`—a subclass if you must. Conveniently copies given instance and static members to the appropriate objects. The new function is also blessed with its own `.extend()`, you know, for kids.

``` js
var Func = require('func');

var Kid = Func.extend();

var Grandkid = Kid.extend({
    bar: 'world',
    init: function (foo) {
        console.log(foo, this.bar);
    }
}, {
    yell: function (foo, bar) {
        alert(foo + ' ' + bar);
    }
});

Grandkid('hello'); // logs 'hello world'
Grandkid.yell('hello', 'world'); // alerts 'hello world'
```

## Shout-outs

- Douglas Crockford ([Prototypal Inheritance](http://javascript.crockford.com/prototypal.html), or, the birth of `Object.create`.)
- John Resig ([Simple JavaScript Inheritance](http://ejohn.org/blog/simple-javascript-inheritance/))

## License

  MIT
