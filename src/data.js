/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Data {
  constructor(data) {
    if (data == null) {
      data = [];
    }

    this.data = data;
    this.pos  = 0;
    this.length = this.data.length;
  }

  readByte() {
    return this.data[this.pos++];
  }

  writeByte(byte) {
    return this.data[this.pos++] = byte;
  }

  byteAt(index) {
    return this.data[index];
  }

  readBool() {
    return !!this.readByte();
  }

  writeBool(val) {
    return this.writeByte(val ? 1 : 0);
  }

  readUInt32() {
    const b1 = this.readByte() * 0x1000000;
    const b2 = this.readByte() << 16;
    const b3 = this.readByte() << 8;
    const b4 = this.readByte();

    return b1 + b2 + b3 + b4;
  }

  writeUInt32(val) {
    this.writeByte((val >>> 24) & 0xff);
    this.writeByte((val >> 16)  & 0xff);
    this.writeByte((val >> 8)   & 0xff);

    return this.writeByte(val & 0xff);
  }

  readInt32() {
    const int = this.readUInt32();

    if (int >= 0x80000000) {
      return int - 0x100000000;
    } else {
      return int;
    }
  }

  writeInt32(val) {
    if (val < 0) {
      val += 0x100000000;
    }

    return this.writeUInt32(val);
  }

  readUInt16() {
    const b1 = this.readByte() << 8;
    const b2 = this.readByte();
    return b1 | b2;
  }

  writeUInt16(val) {
    this.writeByte((val >> 8) & 0xff);

    return this.writeByte(val & 0xff);
  }

  readInt16() {
    const int = this.readUInt16();

    if (int >= 0x8000) { return int - 0x10000; } else { return int; }
  }

  writeInt16(val) {
    if (val < 0) {
      val += 0x10000;
    }

    return this.writeUInt16(val);
  }

  readString(length) {
    const ret = [];
    for (let i = 0, end = length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      ret[i] = String.fromCharCode(this.readByte());
    }

    return ret.join('');
  }

  writeString(val) {
    return __range__(0, val.length, false).map((i) =>
      this.writeByte(val.charCodeAt(i)));
  }

  stringAt(pos, length) {
    this.pos = pos;
    return this.readString(length);
  }

  readShort() {
    return this.readInt16();
  }

  writeShort(val) {
    return this.writeInt16(val);
  }

  readLongLong() {
    const b1 = this.readByte();
    const b2 = this.readByte();
    const b3 = this.readByte();
    const b4 = this.readByte();
    const b5 = this.readByte();
    const b6 = this.readByte();
    const b7 = this.readByte();
    const b8 = this.readByte();

    if (b1 & 0x80) { // sign -> avoid overflow
      return (((b1 ^ 0xff) * 0x100000000000000) +
              ((b2 ^ 0xff) *   0x1000000000000) +
              ((b3 ^ 0xff) *   0x10000000000) +
              ((b4 ^ 0xff) *     0x100000000) +
              ((b5 ^ 0xff) *     0x1000000) +
              ((b6 ^ 0xff) *       0x10000) +
              ((b7 ^ 0xff) *       0x100) +
               (b8 ^ 0xff) + 1) * -1;
    }

    return (b1 * 0x100000000000000) +
           (b2 *   0x1000000000000) +
           (b3 *   0x10000000000) +
           (b4 *     0x100000000) +
           (b5 *     0x1000000) +
           (b6 *       0x10000) +
           (b7 *       0x100) +
            b8;
  }

  writeLongLong(val) {
    const high = Math.floor(val / 0x100000000);
    const low = val & 0xffffffff;
    this.writeByte((high >> 24) & 0xff);
    this.writeByte((high >> 16) & 0xff);
    this.writeByte((high >> 8) & 0xff);
    this.writeByte(high & 0xff);
    this.writeByte((low >> 24) & 0xff);
    this.writeByte((low >> 16) & 0xff);
    this.writeByte((low >> 8) & 0xff);
    return this.writeByte(low & 0xff);
  }

  readInt() {
    return this.readInt32();
  }

  writeInt(val) {
    return this.writeInt32(val);
  }

  slice(start, end) {
    return this.data.slice(start, end);
  }

  read(bytes) {
    const buf = [];
    for (let i = 0, end = bytes, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      buf.push(this.readByte());
    }

    return buf;
  }

  write(bytes) {
    return Array.from(bytes).map((byte) =>
      this.writeByte(byte));
  }
}

export default Data;

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
