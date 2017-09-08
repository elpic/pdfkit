import WinAnsiMap from '../../../src/constants/fonts/winAnsiMap';

describe('WinAnsiMap', () => {

  it('contains all available ansi mapping', () => {
    expect(WinAnsiMap).toEqual({
      402:  131,
      8211: 150,
      8212: 151,
      8216: 145,
      8217: 146,
      8218: 130,
      8220: 147,
      8221: 148,
      8222: 132,
      8224: 134,
      8225: 135,
      8226: 149,
      8230: 133,
      8364: 128,
      8240: 137,
      8249: 139,
      8250: 155,
      710:  136,
      8482: 153,
      338:  140,
      339:  156,
      732:  152,
      352:  138,
      353:  154,
      376:  159,
      381:  142,
      382:  158,
    });
  });

});
