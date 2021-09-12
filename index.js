const seedrandom = require('seedrandom');
const base64Url = require('base64url');
const { cencode } = require('cencode');

function step(lastValue, value, key, prng) {
  const rng = prng(lastValue + value);

  for (let i = key.length; i-- >= 1;) {
    key[i] ^= rng.int32() & 255;
  }
  return rng.int32();
}

const isoBuffer = process.browser ? require('buffer/').Buffer : Buffer;

module.exports = function kissmyhas(data, {length = 1024, prng = seedrandom, serializer = cencode} = {}) {
  data = isoBuffer.from(serializer(data));

  const key = new Uint8Array(length);

  let lastValue = step(length, data.length, key, prng);

  for (let i = data.length; i-- >= 1;) {
    lastValue = step(lastValue, data[i], key, prng);
  }

  return base64Url.encode(key)
}
