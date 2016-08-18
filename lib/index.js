const cache = {};

/**
 * Snippet utils
 */
function update(str, snippet, action, newlines) {
  if (snippet) {
    switch (action) {
      case 'prepend':
        if (newlines) {
          str = trimLeft(str);
        }

        return snippet + str;
      case 'replace':
        return snippet;
      case 'append':
      default:
        if (newlines) {
          str = trimRight(str);
        }

        return str + snippet;
    }
  }

  return str;
}

/**
 * Delimiter-related utils
 */
function memoize(key, val) {
  if ({}.hasOwnProperty.call(cache, key)) {
    return cache[key];
  }
  cache[key] = val;
  return val;
}

function toRegex(tag, delims) {
  const key = tag + delims.join('_');
  return memoize(key, new RegExp(toMarker(tag, delims), 'g'));
}

function escape(str) {
  return str.replace(/(\W)/g, '\\$1');
}

function toMarker(tag, delims) {
  return `(?:${escape(delims[0])}\\s*(?:end)?${tag}\\s*${escape(delims[1])})`;
}

function stripTags(str, re) {
  return str.split(re).join('');
}

function openDelim(tag, delims) {
  return `${delims[0]} ${tag} ${delims[1]}`;
}

function closeDelim(tag, delims) {
  return `${delims[0]} end${tag} ${delims[1]}`;
}

/**
 * utils
 */
function trimLeft(str) {
  return str.replace(/^\s+/, '');
}

function trimRight(str) {
  return str.replace(/\s+$/, '');
}

function newlines(length) {
  var str = '';
  for (var i = 0; i < length; i++) {
    str += '\n';
  }
  return str;
}

function isNumber(num) {
  const type = typeof num;
  if (type !== 'number' && type !== 'string') {
    return false;
  }
  var n = Number(num);
  return (n - n + 1) >= 0 && num !== '';
}

class InjectString {
  constructor(src, opts = {}) {
    if (typeof src !== 'string') {
      throw new TypeError('expected a string as the first argument.');
    }

    this.src = src;
    this.opts = Object.assign({}, InjectString.defaults, opts);
  }

  toString() {
    return this.src;
  }

  static get defaults() {
    return {
      delimiters: ['<!--', '-->'],
      tag: 'snippet',
      newlines: false,
      stripTags: false
    };
  }

  inject(snippet, tag, opts = {}) {
    opts = Object.assign({}, this.opts, opts);

    if (tag) {
      opts.tag = tag;
    }

    this.src = InjectString.inject(this.src, snippet, opts);
    return this.src;
  }

  append(snippet, tag, opts = {}) {
    Object.assign(opts, {
      action: 'append'
    });

    return this.inject(snippet, tag, opts);
  }

  prepend(snippet, tag, opts = {}) {
    Object.assign(opts, {
      action: 'prepend'
    });

    return this.inject(snippet, tag, opts);
  }

  replace(snippet, tag, opts = {}) {
    Object.assign(opts, {
      action: 'replace'
    });

    return this.inject(snippet, tag, opts);
  }

  strip(tag) {
    let opts = Object.assign({}, this.opts);

    if (tag) {
      opts.tag = tag;
    }

    return InjectString.strip(this.src, opts);
  }

  stripAll() {
    return InjectString.stripAll(this.src, this.opts);
  }

  static strip(src, opts = {}) {
    if (typeof src !== 'string') {
      throw new TypeError('expected a string as the first argument.');
    }

    opts = Object.assign({}, InjectString.defaults, opts);

    const delims = opts.delimiters;
    const regex = opts.regex || toRegex(opts.tag, delims);

    return stripTags(src, regex);
  }

  static stripAll(src, opts = {}) {
    if (typeof src !== 'string') {
      throw new TypeError('expected a string as the first argument.');
    }

    opts = Object.assign({}, InjectString.defaults, opts);

    const tag = '(?:[\\w\\d\\.\\-\\_\\:]+)';
    const delims = opts.delimiters;
    const regex = opts.regex || toRegex(tag, delims);

    return stripTags(src, regex);
  }

  /**
   * @param  {String} `src`
   * @param  {Object} `options`
   * @return {String} Get the same string back with a snippet inserted
   */
  static inject(src, snippet, opts = {}) {
    if (typeof src !== 'string') {
      throw new TypeError('expected a string as the first argument.');
    }

    opts = Object.assign({}, InjectString.defaults, opts);
    const delims = opts.delimiters;
    const tag = opts.tag;
    const regex = opts.regex || toRegex(tag, delims);
    const open = openDelim(tag, delims);
    const close = closeDelim(tag, delims);
    const trailing = /(\n+)$/.exec(src);

    // get any existing sections
    const sections = src.split(regex);
    let contents = stripTags(snippet, regex);

    // no snippet delimiters found, so just append the string
    if (sections.length === 1 && opts.append !== false) {
      return src;
    }

    const start = sections.shift();
    const end = sections.pop();
    const len = sections.length;

    let inner;

    if (opts.newlines) {
      let before = '\n';
      let after = '\n';

      if (isNumber(opts.newlines)) {
        before = newlines(opts.newlines);
        after = newlines(opts.newlines);
      } else if (typeof opts.newlines === 'string' && opts.newlines.indexOf(',') !== -1) {
        let newlinesArr = opts.newlines.split(',');
        before = newlines(newlinesArr[0]);
        after = newlines(newlinesArr[1]);
      }

      contents = `${before}${contents.trim()}${after}`;
    }

    if (len > 1 && opts.multiple !== false) {
      inner = sections.join(contents);
    } else if (len > 1) {
      inner = sections.shift();
      inner += contents;
      inner += sections.join('\n');
    } else if (len === 1) {
      inner = update(sections[0], contents, opts.action, opts.newlines);
    } else if (!len) {
      inner = contents;
    }

    let middle = open + inner + close;
    if (opts.stripTags === true) {
      middle = inner;
    }

    const res = start + middle + end;
    return trimRight(res) + (trailing ? trailing[0] : '');
  }
}

export default InjectString;
