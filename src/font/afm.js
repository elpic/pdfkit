/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import fs from 'fs';
import Constants from '../constants';

const { WinAnsiMap, Characters } = Constants;

var AFMFont = (function() {
  AFMFont = class AFMFont {
    static open(filename) {
      return new AFMFont(fs.readFileSync(filename, 'utf8'));
    }

    constructor(contents) {
      this.contents = contents;
      this.attributes = {};
      this.glyphWidths = {};
      this.boundingBoxes = {};
      this.kernPairs = {};

      this.parse();
      this.charWidths = (__range__(0, 255, true).map((i) => this.glyphWidths[Characters[i]]));
      this.bbox = (Array.from(this.attributes['FontBBox'].split(/\s+/)).map((e) => +e));
      this.ascender = +(this.attributes['Ascender'] || 0);
      this.descender = +(this.attributes['Descender'] || 0);
      this.lineGap = (this.bbox[3] - this.bbox[1]) - (this.ascender - this.descender);
    }

    parse() {
      let section = '';
      for (let line of Array.from(this.contents.split('\n'))) {
        var match;
        var a;
        if (match = line.match(/^Start(\w+)/)) {
          section = match[1];
          continue;

        } else if (match = line.match(/^End(\w+)/)) {
          section = '';
          continue;
        }

        switch (section) {
          case 'FontMetrics':
            match = line.match(/(^\w+)\s+(.*)/);
            var key = match[1];
            var value = match[2];

            if (a = this.attributes[key]) {
              if (!Array.isArray(a)) { a = (this.attributes[key] = [a]); }
              a.push(value);
            } else {
              this.attributes[key] = value;
            }
            break;

          case 'CharMetrics':
            if (!/^CH?\s/.test(line)) { continue; }
            var name = line.match(/\bN\s+(\.?\w+)\s*;/)[1];
            this.glyphWidths[name] = +line.match(/\bWX\s+(\d+)\s*;/)[1];
            break;

          case 'KernPairs':
            match = line.match(/^KPX\s+(\.?\w+)\s+(\.?\w+)\s+(-?\d+)/);
            if (match) {
              this.kernPairs[match[1] + '\0' + match[2]] = parseInt(match[3]);
            }
            break;
        }
      }

    }

    encodeText(text) {
      const res = [];
      for (let i = 0, end = text.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        let char = text.charCodeAt(i);
        char = WinAnsiMap[char] || char;
        res.push(char.toString(16));
      }

      return res;
    }

    glyphsForString(string) {
      const glyphs = [];

      for (let i = 0, end = string.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        const charCode = string.charCodeAt(i);
        glyphs.push(this.characterToGlyph(charCode));
      }

      return glyphs;
    }

    characterToGlyph(character) {
      return Characters[WinAnsiMap[character] || character] || '.notdef';
    }

    widthOfGlyph(glyph) {
      return this.glyphWidths[glyph] || 0;
    }

    getKernPair(left, right) {
      return this.kernPairs[left + '\0' + right] || 0;
    }

    advancesForGlyphs(glyphs) {
      const advances = [];

      for (let index = 0; index < glyphs.length; index++) {
        const left = glyphs[index];
        const right = glyphs[index + 1];
        advances.push(this.widthOfGlyph(left) + this.getKernPair(left, right));
      }

      return advances;
    }
  };

  return AFMFont;
})();

export default AFMFont;

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
