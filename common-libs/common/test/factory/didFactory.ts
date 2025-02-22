const cryptoRandomString = require('crypto-random-string')

import { CommonNetworkMember } from '@affinidi/wallet-core-sdk'
import { KeysService, DidDocumentService } from '../../'
import base64url from 'base64url'

interface TestDid {
  seed: string
  encryptedSeed: string
  seedHex: string
  did: string
  didDocument: { id: string }
  publicKey: string
  publicRSAKey?: string
}

interface TestJoloDid extends TestDid {
  publicEthereumKey: string
}

export const generateTestDIDs = async (): Promise<{
  password: string
  jolo: TestJoloDid
  elem: TestDid
  elemWithRSA: TestDid
}> => {
  let keysService
  let didDocumentService
  const password = cryptoRandomString({ length: 32, type: 'ascii-printable' })

  const joloSeed = await CommonNetworkMember.generateSeed('jolo')
  const joloSeedHex = joloSeed.toString('hex')
  const joloSeedWithMethod = `${joloSeedHex}++${'jolo'}`

  const { encryptedSeed: joloEncryptedSeed } = await CommonNetworkMember.fromSeed(joloSeedWithMethod, {}, password)

  keysService = new KeysService(joloEncryptedSeed, password)

  didDocumentService = new DidDocumentService(keysService)
  const joloDidDocument = await didDocumentService.buildDidDocument()
  const joloDid = joloDidDocument.id

  const joloPublicKey = KeysService.getPublicKey(joloSeedHex, 'jolo').toString('hex')
  const joloEthereumPublicKey = KeysService.getAnchorTransactionPublicKey(joloSeedHex, 'jolo').toString('hex')

  const elemSeed = await CommonNetworkMember.generateSeed('elem')
  const elemSeedHex = elemSeed.toString('hex')
  const elemSeedWithMethod = `${elemSeedHex}++${'elem'}`

  const { encryptedSeed: elemEncryptedSeed } = await CommonNetworkMember.fromSeed(elemSeedWithMethod, {}, password)

  keysService = new KeysService(elemEncryptedSeed, password)

  didDocumentService = new DidDocumentService(keysService)
  const elemDidDocument = await didDocumentService.buildDidDocument()
  const elemDid = await didDocumentService.getMyDid()

  const elemPublicKey = KeysService.getPublicKey(elemSeedHex, 'elem').toString('hex')

  const keys = [
    {
      type: 'rsa',
      permissions: ['authentication', 'assertionMethod'],
      private:
        '-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIIEowIBAAKCAQEAj+uWAsdsMZhH+DE9d0JekeJ6GVlb8C0tnvT+wW9vNJhg/Zb3\n' +
        'qsT0ENli7GLFvm8wSEt61Ng8Xt8M+ytCnqQP+SqKGx5fdrCeEwR0G2tzsUo2B4/H\n' +
        '3DEp45656hBKtu0ZeTl8ZgfCKlYdDttoDWmqCH3SHrqcmzlVcX3pnE0ARkP2trHO\n' +
        'DQDpX1gFF7Ct/uRyEppplK2c/SkElVuAD5c3JX2wx81dv7Ujhse7ZKX9UEJ1FmrS\n' +
        'a/O3JjdOSa5/hK0/oRHmBDK46RMdr94S7/GUz1I2akGMkSxzBMJEw9wXd01GJXw+\n' +
        'Xv8TkFF5ae+iQ0I7hkrww8x+G9EQCRKylV8wcwIDAQABAoIBAFBNy65RR/WEWuQJ\n' +
        '1Zot1kbgb/ClA7/H9aS0X1Hfs9VNERFuo1MOAoFESwZLNrtDn1U3iJoq7cSiAMRF\n' +
        'Jy8NrDwDmHv5PpsjgZBq8744/pz2I5+kgohChnUTo/kOjiHzujsB8H+d5KFq21vm\n' +
        '4PBa/R0v14Z96dRS8XIaJ7em33hUradmuYQYNn9IgP5Y334DebTaTE4+yeFkR0z5\n' +
        'KLm78o/3uoH7+a2C2u2ERimaLO4mpqQXHtmzhulbW2aBIQsR8wGzrBH/AnIej+h/\n' +
        'FJ2CF1XrChq6a2k+Nu9mLRDKxHYN4uQq9qSB7js6p8ZSUC7HkOT6tge69uNn1jZZ\n' +
        'lpKLNQECgYEAwNtNRphFMA6oYLS5FaUY8l/Th66ToDMzVGK3DWXnoHA3vBU/1LW2\n' +
        'VPwV/PJVdTY5mXoERAI75QHCrLcdH07ppHusc6pFdzdVvO8Q5XnwUTfb6dcG7Ips\n' +
        'vniDd3AMWUFgbK2qNOOOeM7Qe0OPXNWzHHcmtL2uLOno8Y4J32cBwqMCgYEAvwqT\n' +
        'ECUjQmtoWHOWcO5M0SCv6YMBrigBY3Y8zFztDWltFhCKUT9WLAMOIHh5CKGnfLgG\n' +
        '4PV9kjTLEefxtUCqBm00SifkfRujfUQyZjfZIV9UBhSDceiM9phAK8JsTAKbop/h\n' +
        'FTDkknyqzsM7biLZjflGNWXvuwASKu0ssJjRh/ECgYBvsNJhNyCiw2pqj1+9lF8N\n' +
        'R8gXBVkD54MrtPv0q3bo6PSuXdQY2aAeOdx2INazSlMzeoHr7StI5qsbIfWgwy/3\n' +
        'DZUDa7JNZ+OkxwOPEv7F2sbm95xP858k9GCXFHJiYsV4S1+Ov9csSgJd0PO/PRg9\n' +
        'PRhShqPP6Sv6cVtwYZSYZwKBgHMa7Pb6WV9IletNYaSTgEc02ajpnVaQlh2WfRVp\n' +
        'HA9LqUV1G9HORp5oDNf1nn9b3y1fOA3M/Cbelkgop1LdLlSG8c2IcbwLrhrovzEl\n' +
        'jzbzWA39yCEWy/A8VdXH5DZ8D8gRaq248s9sPAIuUZ2Pc+N+ARZlX+cdKNUiaB3T\n' +
        'RdQRAoGBAIc/UaN3A8ya1+dZ5orrQkjuPQXB7+UzR128vzsKb3F8nt4F92bRMu3D\n' +
        'vBHZCT4QDhv4CCyYlu//LqVBQDdUo4BNayZmjK8J0XUQ/YY77CE35YRRqQAphvvz\n' +
        'fCwRbNd/EW88Pg8ioO1WWcIgmA0296qEBv079qOWqPQq/BbUjH/3\n' +
        '-----END RSA PRIVATE KEY-----',
      public:
        '-----BEGIN PUBLIC KEY-----\n' +
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAj+uWAsdsMZhH+DE9d0Je\n' +
        'keJ6GVlb8C0tnvT+wW9vNJhg/Zb3qsT0ENli7GLFvm8wSEt61Ng8Xt8M+ytCnqQP\n' +
        '+SqKGx5fdrCeEwR0G2tzsUo2B4/H3DEp45656hBKtu0ZeTl8ZgfCKlYdDttoDWmq\n' +
        'CH3SHrqcmzlVcX3pnE0ARkP2trHODQDpX1gFF7Ct/uRyEppplK2c/SkElVuAD5c3\n' +
        'JX2wx81dv7Ujhse7ZKX9UEJ1FmrSa/O3JjdOSa5/hK0/oRHmBDK46RMdr94S7/GU\n' +
        'z1I2akGMkSxzBMJEw9wXd01GJXw+Xv8TkFF5ae+iQ0I7hkrww8x+G9EQCRKylV8w\n' +
        'cwIDAQAB\n' +
        '-----END PUBLIC KEY-----',
    },
  ]

  const keysBase64 = base64url.encode(JSON.stringify(keys))
  const elemRSASeed = await CommonNetworkMember.generateSeed('elem')
  const elemRSASeedHex = elemRSASeed.toString('hex')
  const elemRSASeedWithMethod = `${elemRSASeedHex}++${'elem'}++${keysBase64}`

  const { encryptedSeed: elemRSAEncryptedSeed } = await CommonNetworkMember.fromSeed(
    elemRSASeedWithMethod,
    {},
    password,
  )

  keysService = new KeysService(elemRSAEncryptedSeed, password)
  const elemRSAPublicKeyRSA = keysService.getExternalPublicKey('rsa').toString()

  didDocumentService = new DidDocumentService(keysService)
  const elemRSADidDocument = await didDocumentService.buildDidDocument()
  const elemRSADid = await didDocumentService.getMyDid()

  const elemRSAPublicKey = KeysService.getPublicKey(elemRSASeedHex, 'elem').toString('hex')

  return {
    password,
    jolo: {
      seed: joloSeed,
      encryptedSeed: joloEncryptedSeed,
      seedHex: joloSeedHex,
      did: joloDid,
      didDocument: joloDidDocument,
      publicKey: joloPublicKey,
      publicEthereumKey: joloEthereumPublicKey,
    },
    elem: {
      seed: elemSeed,
      encryptedSeed: elemEncryptedSeed,
      seedHex: elemSeedHex,
      did: elemDid,
      didDocument: elemDidDocument,
      publicKey: elemPublicKey,
    },
    elemWithRSA: {
      seed: elemRSASeed,
      encryptedSeed: elemRSAEncryptedSeed,
      seedHex: elemRSASeedHex,
      did: elemRSADid,
      didDocument: elemRSADidDocument,
      publicKey: elemRSAPublicKey,
      publicRSAKey: elemRSAPublicKeyRSA,
    },
  }
}
