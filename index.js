const seedrandom = require('seedrandom');
const base64Url = require('base64url');
const bencode = require('bencode');

// next line prevent benconde from warning with booleans etc.
bencode.encode._floatConversionDetected = true;

function step(lastValue, value, key, PRNG) {
  const rng = PRNG(lastValue + value);

  for (let i = key.length; i-- >= 1;) {
    key[i] ^= rng.int32() & 255;
  }
  return rng.int32();
}

module.exports = function kissmyhas(target, length = 1024, PRNG = seedrandom) {
  target = bencode.encode(target);

  const key = new Uint8Array(length);

  let lastValue = step(length, target.length, key, PRNG);

  for (let i = target.length; i-- >= 1;) {
    lastValue = step(lastValue, target[i], key, PRNG);
  }

  return base64Url.encode(key)
}

const alea = require('seedrandom/lib/alea')
