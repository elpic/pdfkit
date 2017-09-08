import StandardFont from './standard';
import EmbeddedFont from './embedded';

// const fontkit = require('fontkit');

export default {
  open: (document, src, family, id) => {
    let font;

    // if (typeof src === 'string') {
    //   if (StandardFont.isStandardFont(src)) {
    //     return new StandardFont(document, src, id);
    //   }
    //
    //   // font = fontkit.openSync(src, family);
    //
    // } else if (Buffer.isBuffer(src)) {
    //   // font = fontkit.create(src, family);
    //
    // } else if (src instanceof Uint8Array) {
    //   font = fontkit.create(new Buffer(src), family);
    //
    // } else if (src instanceof ArrayBuffer) {
    //   font = fontkit.create(new Buffer(new Uint8Array(src)), family);
    // }

    if ((font == null)) {
      throw new Error('Not a supported font format or standard PDF font.');
    }

    return new EmbeddedFont(document, font, id);
  }
}
