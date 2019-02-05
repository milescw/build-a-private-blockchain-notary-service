const level = require('level');
const starDB = './data/star';
const db = level(starDB);
const bitcoinMessage = require('bitcoinjs-message')

class StarValidate {
  constructor (req) {
    this.req = req
  }

  verifyAddressParameter() {
    if (!this.req.body.address) {
      throw new Error('Address parameter must be filled in')
    }

    return true
  }

  verifySignatureParameter() {
    if (!this.req.body.signature) {
      throw new Error('Signature parameter must be filled in')
    }
  }

  verifyNewStarRequest() {
    const MAX_STORY_SIZE_BYTES = 500
    const { star } = this.req.body
    const { dec, ra, story} = star

    if (!this.verifyAddressParameter() || !this.req.body.star) {
      throw new Error('Address and star parameters should be filled in')
    }

    if (typeof dec !== 'string' || typeof ra !== 'string' || typeof story !== 'string' || !dec.length || !ra.length || !story.length) {
      throw new Error("Star information must include non-empty string properties 'dec', 'ra' and 'story'")
    }

    if (new Buffer(story).length > MAX_STORY_SIZE_BYTES) {
      throw new Error('The star story is too long. Maximum size is 250 words (500 bytes)')
    }

    const isASCII = ((str) => /^[\x00-\x7F]*$/.test(str))

    if (!isASCII(story)) {
      throw new Error('The star story contains non-ASCII symbols')
    }
  }

  isValid() {
    return db.get(this.req.body.address)
      .then((value) => {
        value = JSON.parse(value)
        return value.messageSignature === 'valid'
      })
      .catch(() => {throw new Error('Not authorized')})
  }

  invalidate(address) {
    db.del(address)
  }

  async verifyMessageSignature(address, signature) {
    return new Promise((resolve, reject) => {
      db.get(address, (error, value) => {
        if (value === undefined) {
          return reject(new Error('Not found'))
        } else if (error) {
          return reject(error)
        }

        value = JSON.parse(value)

        if (value.messageSignature === 'valid') {
          return resolve({
            registerStar: true,
            status: value
        }) 
        } else {
          const timeWindowFiveMin = Date.now() - (5 * 60 * 1000)
          const isExpired = value.requestTimeStamp < timeWindowFiveMin
          let isValid = false
  
          if (isExpired) {
              value.validationWindow = 0
              value.messageSignature = 'Validation window was expired'
          } else {
              value.validationWindow = Math.floor((value.requestTimeStamp - timeWindowFiveMin) / 1000) 
  
              try {
                isValid = bitcoinMessage.verify(value.message, address, signature)
              } catch (error) {
                isValid = false
              }
            
              value.messageSignature = isValid ? 'valid' : 'invalid'
          }
  
          db.put(address, JSON.stringify(value))
  
          return resolve({
              registerStar: !isExpired && isValid,
              status: value
          }) 
        }
      })
    })
  }

  saveNewRequestValidation (address) {
    const timestamp = Date.now()
    const message = `${address}:${timestamp}:starRegistry`
    const validationWindow = 300
  
    const data = {
      address: address,
      message: message,
      requestTimeStamp: timestamp,
      validationWindow: validationWindow
    }
  
    db.put(data.address, JSON.stringify(data))

    return data
  }

  async getPendingAddressRequest(address) {
    return new Promise((resolve, reject) => {
      db.get(address, (error, value) => {
        if (value === undefined) {
          return reject(new Error('Not found'))
        } else if (error) {
          return reject(error)
        }

        value = JSON.parse(value)

        const timeWindowFiveMin = Date.now() - (5 * 60 * 1000)
        const isExpired = value.requestTimeStamp < timeWindowFiveMin

        if (isExpired) {
            resolve(this.saveNewRequestValidation(address))
        } else {
          const data = {
            address: address,
            message: value.message,
            requestTimeStamp: value.requestTimeStamp,
            validationWindow: Math.floor((value.requestTimeStamp - timeWindowFiveMin) / 1000)
          }

          resolve(data)
        }
      })
    })
  }
}
  
module.exports = StarValidate