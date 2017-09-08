/*
PDFImage - embeds images in PDF documents
By Devon Govett
*/

import fs from 'fs';

import Data from './data';
import Images from './images/index';

const { Jpeg, Png } = Images;

class PDFImage {
  static open(src, label) {
    let data;
    if (Buffer.isBuffer(src)) {
      data = src;
    } else if (src instanceof ArrayBuffer) {
      data = new Buffer(new Uint8Array(src));
    } else {
      let match;
      if (match = /^data:.+;base64,(.*)$/.exec(src)) {
        data = new Buffer(match[1], 'base64');

      } else {
        data = fs.readFileSync(src);
        if (!data) { return; }
      }
    }

    if ((data[0] === 0xff) && (data[1] === 0xd8)) {
      return new Jpeg(data);
    } else if ((data[0] === 0x89) && (data.toString('ascii', 1, 4) === 'PNG')) {
      return new Png(data);

    } else {
      throw new Error('Unknown image format.');
    }
  }
}

export default PDFImage;
