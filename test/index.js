import {expect} from 'chai';
import InjectString from '../lib/';

describe('InjectString', () => {
  describe('constructor()', () => {
    it('should exists:', () => {
      const inject = new InjectString('Hello world');
      expect(inject.toString()).to.equal('Hello world');
    });
  });

  describe('toString()', () => {
    it('should use the updated string after inject:', () => {
      const inject = new InjectString('a <!-- snippet --> b');
      const result = inject.append('foo');
      expect(inject.toString()).to.equal(result);
    });
  });

  describe('errors', () => {
    it('should throw an error when invalid arguments are passed:', () => {
      expect(() => {
        InjectString.inject();
      }).to.throw(/expected a string as the first argument./);

      expect(() => {
        // eslint-disable-next-line no-new
        new InjectString();
      }).to.throw(/expected a string as the first argument./);
    });
  });

  describe('inject()', () => {
    it('should inject a snippet into a string with one placeholder:', () => {
      const inject = new InjectString('a <!-- snippet --> b');
      const result = inject.append('foo');

      expect(result).to.equal('a <!-- snippet -->foo<!-- endsnippet --> b');
    });

    it('should inject a snippet into a string with before/after placeholders:', () => {
      const inject = new InjectString('a <!-- snippet -->\nfoo\n<!-- endsnippet --> b');
      const result = inject.append('bar\n');
      expect(result).to.equal('a <!-- snippet -->\nfoo\nbar\n<!-- endsnippet --> b');
    });

    it('should inject snippets into a string with one placeholder:', () => {
      const inject = new InjectString('a <!-- snippet --> b');
      const result = inject.append('foo');

      expect(result).to.equal('a <!-- snippet -->foo<!-- endsnippet --> b');

      const result2 = inject.append('bar');
      expect(result2).to.equal('a <!-- snippet -->foobar<!-- endsnippet --> b');

      const result3 = inject.append('qux');
      expect(result3).to.equal('a <!-- snippet -->foobarqux<!-- endsnippet --> b');
    });

    it('should inject snippets into a string with different placeholders:', () => {
      const inject = new InjectString('a <!-- a --> b <!-- b --> c');
      const result = inject.append('foo', 'a');

      expect(result).to.equal('a <!-- a -->foo<!-- enda --> b <!-- b --> c');

      const result2 = inject.append('bar', 'b');
      expect(result2).to.equal('a <!-- a -->foo<!-- enda --> b <!-- b -->bar<!-- endb --> c');
    });
  });

  describe('actions', () => {
    it('should append a snippet into a string:', () => {
      const inject = new InjectString('a <!-- snippet -->foo<!-- endsnippet --> b');
      const result = inject.append('bar');
      expect(result).to.equal('a <!-- snippet -->foobar<!-- endsnippet --> b');
    });

    it('should prepend a snippet into a string:', () => {
      const inject = new InjectString('a <!-- snippet -->foo<!-- endsnippet --> b');
      const result = inject.prepend('bar');
      expect(result).to.equal('a <!-- snippet -->barfoo<!-- endsnippet --> b');
    });

    it('should replace a snippet into a string:', () => {
      const inject = new InjectString('a <!-- snippet -->foo<!-- endsnippet --> b');
      const result = inject.replace('bar');
      expect(result).to.equal('a <!-- snippet -->bar<!-- endsnippet --> b');
    });
  });

  describe('strip()', () => {
    it('should strips with one placeholder:', () => {
      const inject = new InjectString('a <!-- snippet --> b');
      expect(inject.strip()).to.equal('a  b');
    });

    it('should strips with empty before/after placeholders:', () => {
      const inject = new InjectString('a <!-- snippet --><!-- endsnippet --> b');
      expect(inject.strip()).to.equal('a  b');
    });

    it('should strips with filled before/after placeholders:', () => {
      const inject = new InjectString('a <!-- snippet -->foo<!-- endsnippet --> b');
      expect(inject.strip()).to.equal('a foo b');
    });

    it('should strips with custom before/after placeholders:', () => {
      const inject = new InjectString('a <!-- custom -->foo<!-- endcustom --> b');
      expect(inject.strip('custom')).to.equal('a foo b');
    });
  });

  describe('stripAll()', () => {
    it('should strips all with one placeholder:', () => {
      const inject = new InjectString('a <!-- snippet --> b');
      expect(inject.stripAll()).to.equal('a  b');
    });

    it('should strips all with empty before/after placeholders:', () => {
      const inject = new InjectString('a <!-- snippet --><!-- endsnippet --> b');
      expect(inject.stripAll()).to.equal('a  b');
    });

    it('should strips all with filled before/after placeholders:', () => {
      const inject = new InjectString('a <!-- snippet -->foo<!-- endsnippet --> b');
      expect(inject.stripAll()).to.equal('a foo b');
    });

    it('should strips all with custom before/after placeholders:', () => {
      const inject = new InjectString('a <!-- custom -->foo<!-- endcustom --> b');
      expect(inject.stripAll()).to.equal('a foo b');
    });

    it('should strips all with different placeholders:', () => {
      const inject = new InjectString('a <!-- custom -->foo<!-- endcustom --> <!-- snippet -->bar<!-- endsnippet --> b');
      expect(inject.stripAll()).to.equal('a foo bar b');
    });
  });

  describe('options', () => {
    it('should inject a snippet into a string without placeholders:', () => {
      const inject = new InjectString('a <!-- snippet --> b', {stripTags: true});
      const result = inject.append('foo');
      expect(result).to.equal('a foo b');
    });

    it('should add normalized newlines around snippets:', () => {
      const inject = new InjectString('a <!-- snippet --> b', {newlines: true});
      const result = inject.append('foo');
      expect(result).to.equal('a\n<!-- snippet -->\nfoo\n<!-- endsnippet -->\nb');
    });

    it('should use custom delimiters:', () => {
      const inject = new InjectString('a {{!snippet}} b', {delimiters: ['{{!', '}}']});
      const result = inject.append('foo');
      expect(result).to.equal('a {{! snippet }}foo{{! endsnippet }} b');
    });
  });


  describe('static methods', () => {
    it('should inject snippet into a string with placeholder:', () => {
      const result = InjectString.inject('a <!-- snippet --> b', 'foo');

      expect(result).to.equal('a <!-- snippet -->foo<!-- endsnippet --> b');

      const result2 = InjectString.inject('a <!-- snippet --> b', 'foo', {stripTags: true});

      expect(result2).to.equal('a foo b');
    });

    it('should strips with placeholder:', () => {
      const result = InjectString.strip('a <!-- snippet --><!-- custom --> b', {
        tag: 'custom',
      });
      expect(result).to.equal('a <!-- snippet --> b');
    });

    it('should strips all with placeholder:', () => {
      const result = InjectString.stripAll('a <!-- snippet --><!-- custom --> b');
      expect(result).to.equal('a  b');
    });
  });
});
