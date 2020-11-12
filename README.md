# kissmyhash

Hashes as long and strong as you need.

It defaults to 1024 bytes, but you can set higher or lower.

It based on PRNG and xor operations, and its code is short and clean,  without anything obscure or hanrd to understand.

## Why?

You might have some scenario where you want to use longer thus stronger hashes, maybe so they can age better.

You also might want to use some hash algorithm and code that you can follow and understand, because you might not trust the NSA and you can think the have hidden some vulnerability inside all the mess and confusion of the rotations magic numbers and obscure stuff.

So the simpler the better.

Last thing, you could use your own PRNG if you don't trust the one used by default.

## Examples

```javascript
const kissmyhash = require('kissmyhash')

// hash a string using defaults (1024 bytes 8192 bits)
kissmyhash('hello word')
// -> '0PM8h3tqKPuO6kENSTyBM4GtGRGs95frvCm2LxmaTH2lHNJU3gt-xotCjstS3nLAn6a4QDiZtXyZ1UPMe5wmEn6aEtNsi-L02awmkka5A0C5xmPILASM70TNSiti3awE-kpNqkY7TQoezeEoY-AdgNzxxIKp3FQApWIuhj7QEgX4F5knnhJ_3RCSrDHugqYTtda72FNLGYUZlvkC2enN7rmKIkWVoRn2P_aPaJq-P9AuiqCD2SN1ePl7AdaqV8hikdNspCFELOwI8Woe4_ntstCDJdl1Otzyb3SgpYnN8nQgAdokWrNzr2ZNWaXmtzMc4jgRIg3KwX6pgfGjBqFA4GG1i5MrPwAOOBm4mcMg5dQxLKh7_vf0vy5lJi4OfV-upo2Oxc1wvHcfwq6crtpeedCcrBEnZzr2XDUPZjr7scwtLyLvWVkfnFFyMpugc4Jc-5bg8be8fo5-DDk_OSd6QHzWarg-o0F0CXnu6EDnL7EgclHD94gJClwDhh6O125hu1s6O_9jnIJl7L64OAygPfOqscJj690-b1zbtRUo_r34SUJr9k5WS3BkjutCesQbJLaRWgcwZSCHfIbRhs3Iz5uavNsKJxtXTRFDvFlcM8RI5WwAkgHyjmgj7yIOCDK_lNai8eUTHH8EzVY4LOCM3Wf_m0vzqKa670Rl9NklmY5YUgnWDLdfbtA0j4tATOqe5kGkScAYDohlHocXYKMgfcTJcb0K7nqMT2dc-j-zm28ipvYAblurh_O2b8i3xUwpU3chslbeqtsX0DSci8sIfSjuPG3xX5FQ0peBlfZOhIcjh7kOFM98yvKLu50iv_TEkVWXgVhG7t2Uizjw7fU70lEomOSYq7CJmYEtLQaBRMh3oHn5EfktGZun2qaulFdCHG9TKMxpihAlw7pnEmd0EQUezkJ0Bd1IVpMGp4iLl9m38J6d42vVvhK7U9up47WsMqsbTqhpF61y5DKGd_5En9Sg8mtoE_SBTnUL6R1MhXM-HReQ5rY9MXIQyyRbTF1Zs-3MIAB4EowCWOWYQrWdM66L1LICt0eR4d4z_qgXt0127LxSkLzpfDb7DfWsnUfOUHUvcOl64n27ssU6Cq1USBwP7UDkgW3xLFHnUiB5I1EXDVHoEPKouCr5-OJrKhMP0zqqZJi8grxpHTiSx_AxkGxWmFQce2lSnQlP-R-uG0mvVEiFb8rR0c36r_R5g6aiZE10UTdsMpS1NzPvUaq2uCRD6C6Nb8DVe3IWmjPA624UcF9NcdiwEwBq7jF4sMKPM6Vwk-B_RO0F37vaQvRWvQLFD5kMe7p0aOdnDzsejly16RI8dhTUXYU0j7WDKdlCOL0IGMq8nwIrhX4mIMANfA'

// hash a string with a smaller byte length 64 bytes (512 bites) like SHA512
kissmyhash('hello word', { length: 64 } )
// -> 'ynLuL90jaDNOLjm7MtA1nCyjTkqZNFHEKyrjb8CvjS67EDwl3lJeLqNVf61bBLJ02TURNKybxw4fgLY1hKuwUQ'

// hash an object with a medium size byte length
kissmyhash({message: 'hello word'})

// hash using a different PRNG
const alea = require('seedrandom/lib/alea')
kissmyhash({message: 'hello word'}, { prng: alea })

// hash using a custom serializer
const serializer = (ob) => JSON.stringify(ob).split('').map(c => c.charCodeAt(0))
kissmyhash({message: 'hello word'}, { serializer })

```

## Reference

### `kissmyhash(data, [options])`

#### data
it must be anything serializable by the serializer.

#### options
it is an object with three optional fields:
* length: The amount of bytes the hash will have. It defaults to 1024
* prng: You can set a different pseudorandom number generator. It should be a function that accepts a (numeric) seed, and it should return an object with the method int32 that returns the pseudo random numbers. It defaults to seedrandom
* serializer: You can set a different serializer. It should be a function that returns an array of numbers, or Uint8Array. It defaults to bencode.encode

## Warnings about hashing objects with default serializer `bencode.encode`.

### Circular references

The serializer does not support circular references. If you try to hash an object with circular references it will throw `Uncaught RangeError: Maximum call stack size exceeded`

### Booleans and floats

The objects are being serialized to bytes by bencode, and it has no support for booleans and floats, so that `true` becomes `1`, `false` becomes `0`, and floats are truncated.

That can lead to hash collisions.

If you plan to hash objects with floats and booleans you might preffer to hash the JSON serialization of the object instead, or to use a different serializer.

## Warnings about customizations.

If you intend to share your hashes with other people, in signatures for instance, you need to make them know what length, prng and serializer are you using, so they can check your hashes.
