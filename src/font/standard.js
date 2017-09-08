/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import fs from 'fs';

import AFMFont from './afm';
import PDFFont from './base';

const STANDARD_FONTS = {
  "Courier"() { return fs.readFileSync(__dirname + "/data/Courier.afm", 'utf8'); },
  "Courier-Bold"() { return fs.readFileSync(__dirname + "/data/Courier-Bold.afm", 'utf8'); },
  "Courier-Oblique"() { return fs.readFileSync(__dirname + "/data/Courier-Oblique.afm", 'utf8'); },
  "Courier-BoldOblique"() { return fs.readFileSync(__dirname + "/data/Courier-BoldOblique.afm", 'utf8'); },
  "Helvetica"() { return fs.readFileSync(__dirname + "/data/Helvetica.afm", 'utf8'); },
  "Helvetica-Bold"() { return fs.readFileSync(__dirname + "/data/Helvetica-Bold.afm", 'utf8'); },
  "Helvetica-Oblique"() { return fs.readFileSync(__dirname + "/data/Helvetica-Oblique.afm", 'utf8'); },
  "Helvetica-BoldOblique"() { return fs.readFileSync(__dirname + "/data/Helvetica-BoldOblique.afm", 'utf8'); },
  "Times-Roman"() { return fs.readFileSync(__dirname + "/data/Times-Roman.afm", 'utf8'); },
  "Times-Bold"() { return fs.readFileSync(__dirname + "/data/Times-Bold.afm", 'utf8'); },
  "Times-Italic"() { return fs.readFileSync(__dirname + "/data/Times-Italic.afm", 'utf8'); },
  "Times-BoldItalic"() { return fs.readFileSync(__dirname + "/data/Times-BoldItalic.afm", 'utf8'); },
  "Symbol"() { return fs.readFileSync(__dirname + "/data/Symbol.afm", 'utf8'); },
  "ZapfDingbats"() { return fs.readFileSync(__dirname + "/data/ZapfDingbats.afm", 'utf8'); }
};

class StandardFont extends PDFFont {

  constructor(document, name, id) {
    super();
    // {
    //   // Hack: trick Babel/TypeScript into allowing this before super.
    //   if (false) { super(); }
    //   let thisFn = (() => { this; }).toString();
    //   let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
    //   eval(`${thisName} = this;`);
    // }
    this.document = document;
    this.name = name;
    this.id = id;
    this.font = new AFMFont(STANDARD_FONTS[this.name]());
    ({ascender: this.ascender,descender: this.descender,bbox: this.bbox,lineGap: this.lineGap} = this.font);
  }

  embed() {
    this.dictionary.data = {
      Type: 'Font',
      BaseFont: this.name,
      Subtype: 'Type1',
      Encoding: 'WinAnsiEncoding'
    };

    return this.dictionary.end();
  }

  encode(text) {
    const encoded = this.font.encodeText(text);
    const glyphs = this.font.glyphsForString(`${text}`);
    const advances = this.font.advancesForGlyphs(glyphs);
    const positions = [];
    for (let i = 0; i < glyphs.length; i++) {
      const glyph = glyphs[i];
      positions.push({
        xAdvance: advances[i],
        yAdvance: 0,
        xOffset: 0,
        yOffset: 0,
        advanceWidth: this.font.widthOfGlyph(glyph)
      });
    }

    return [encoded, positions];
  }

  widthOfString(string, size) {
    const glyphs = this.font.glyphsForString(`${string}`);
    const advances = this.font.advancesForGlyphs(glyphs);

    let width = 0;
    for (let advance of Array.from(advances)) {
      width += advance;
    }

    const scale = size / 1000;
    return width * scale;
  }

  static isStandardFont(name) {
    return name in STANDARD_FONTS;
  }
}

export default StandardFont;
