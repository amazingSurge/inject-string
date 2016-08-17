# inject-string [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> Inject a snippet of code or content into a string.

## Installation

Install with [npm](https://www.npmjs.com/)

```sh
$ npm install --save inject-string
```

## Usage

```js
var InjectString = require('inject-string');

var inject = new InjectString('before <!-- snippet --> after');
inject.append('foo');
//=> 'before <!-- snippet -->\nfoo\n<!-- endsnippet --> after'
```

## Actions
###append

```js
var inject = new InjectString('before <!-- snippet -->foo<!-- endsnippet --> after');
inject.append('bar');
//=> 'before <!-- snippet -->\nfoobar\n<!-- endsnippet --> after'
```

### prepend

```js
var inject = new InjectString('before <!-- snippet -->foo<!-- endsnippet --> after');
inject.prepend('bar');
//=> 'before <!-- snippet -->\nbarfoo\n<!-- endsnippet --> after'
```

### replace

```js
var inject = new InjectString('before <!-- snippet -->foo<!-- endsnippet --> after');
inject.replace('bar');
//=> 'before <!-- snippet -->\nbar\n<!-- endsnippet --> after'
```

### strip

```js
var inject = new InjectString('before <!-- snippet -->foo<!-- endsnippet --> <!-- custom -->bar<!-- endcustom --> after');
inject.strip('custom');
//=> 'before <!-- snippet -->foo<!-- endsnippet --> bar after'
```

### stripAll

```js
var inject = new InjectString('before <!-- snippet -->foo<!-- endsnippet --> <!-- custom -->bar<!-- endcustom --> after');
inject.stripAll();
//=> 'before foo bar after'
```

## Static call

### inject

```js
InjectString.inject('a <!-- snippet --> b', 'foo', {stripTags: true});
//=> 'a foo b'
```

### strip

```js
InjectString.strip('before <!-- snippet -->foo<!-- endsnippet --> <!-- custom -->bar<!-- endcustom --> after', {tag:'custom'});
//=> 'before <!-- snippet -->foo<!-- endsnippet --> bar after'
```

### stripAll

```js
InjectString.stripAll('before <!-- snippet -->foo<!-- endsnippet --> <!-- custom -->bar<!-- endcustom --> after');
//=> 'before foo bar after'
```

## Options
### Keep placeholders

Inject a snippet into a string with placeholders (used for subsequent insertions):

```js
var inject = new InjectString('before <!-- snippet --> after');
inject.append('foo', {
  stripTags: false
});
//=> 'before <!-- snippet -->\nfoo\n<!-- endsnippet --> after'
```

### Strip placeholders

Inject a snippet into a string without placeholders:

```js
var inject = new InjectString('before <!-- snippet --> after');
inject.append('foo', {
  stripTags: true
});
//=> 'before foo after'
```

### Use a custom tag name

Customize the placeholder name:

```js
var inject = new InjectString('before <!-- xyz --> after');
inject.append(str, 'foo', {tag: 'xyz'})
//=> 'before foo after'
```


### Use custom delimiters

Customize the placeholder delimiters:

```js
var str = new InjectString('a {{!snippet}} b', {delimiters: ['{{!', '}}']});
var result = inject.append('foo');
//=> 'a {{! snippet }}foo{{! endsnippet }} b'
```

### Add newlines

```js
var inject = new InjectString('a <!-- snippet --> b', {newlines: true});
var result = inject.append('foo');
//=> 'a <!-- snippet -->\nfoo\n<!-- endsnippet --> b'
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/amazingSurge/inject-string/issues/new)

## Credits
This library is based on [inject-snippet](https://github.com/jonschlinkert/inject-snippet).

## License

MIT © [amazingSurge](amazingSurge.com)

[npm-image]: https://badge.fury.io/js/inject-string.svg
[npm-url]: https://npmjs.org/package/inject-string
[travis-image]: https://travis-ci.org/amazingSurge/inject-string.svg?branch=master
[travis-url]: https://travis-ci.org/amazingSurge/inject-string
[daviddm-image]: https://david-dm.org/amazingSurge/inject-string.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/amazingSurge/inject-string
[coveralls-image]: https://coveralls.io/repos/amazingSurge/inject-string/badge.svg
[coveralls-url]: https://coveralls.io/r/amazingSurge/inject-string
