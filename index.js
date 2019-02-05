const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const blockchain = require('./blockchain')
const chain = new blockchain.Blockchain()
const StarValidation = require('./star-validate')

verifyAddressParameter = async (req, res, next) => {
  try {
    const starValidation = new StarValidation(req)
    starValidation.verifyAddressParameter()
    next()
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
}

verifySignatureParameter = async (req, res, next) => {
  try {
    const starValidation = new StarValidation(req)
    starValidation.verifySignatureParameter()
    next()
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
}

verifyNewStarRequest = async (req, res, next) => {
  try {
    const starValidation = new StarValidation(req)
    starValidation.verifyNewStarRequest()
    next()
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
}

app.listen(8000, () => console.log('API Service Port Configuration listening on port 8000'))
app.use(bodyParser.json())
app.get('/', (req, res) => res.status(404).json({
  "status": 404,
  "message": "Accepted endpoints: POST: validates request, validates message signature, star registration, GET: star block by hash, star block by wallet address, star block by star block height"
}))

/**	
| ================================================================================= |
| ================================================================================= |
| @description Criteria: Web API POST endpoint validates request with JSON response.|
|                   URL:  http://localhost:8000/requestValidation                   |
| ================================================================================= |
*/
app.post('/requestValidation', [verifyAddressParameter], async (req, res) => {
  const starValidation = new StarValidation(req)
  const address = req.body.address

  try {
    data = await starValidation.getPendingAddressRequest(address)
  } catch (error) {
    data = await starValidation.saveNewRequestValidation(address)
  }

  res.json(data)
})
  
/**
| ============================================================================================= |
| ============================================================================================= | 	
| @description Criteria:  Web API post endpoint validates message signature with JSON response. |
| URL:  http://localhost:8000/message-signature/validate                                        |
| ============================================================================================= |
*/
app.post('/message-signature/validate', [verifyAddressParameter, verifySignatureParameter], async (req, res) => {
  const starValidation = new StarValidation(req)

  try {
    const { address, signature } = req.body
    const response = await starValidation.verifyMessageSignature(address, signature)

    if (response.registerStar) {
      res.json(response)
    } else {
      res.status(401).json(response)
    }
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: error.message
    })
  }
})

/**
| =============================================================================================== |
| =============================================================================================== |
| @description Criteria: Star registration Endpoint.  Web API Post Endpoint with JSON response.   |
|                   URL:  http://localhost:8000/block                                             |
| =============================================================================================== |
*/
app.post('/block', [verifyNewStarRequest], async (req, res) => {
  const starValidation = new StarValidation(req)

  try {
    const isValid = await starValidation.isValid()

    if (!isValid) {
      throw new Error('Signature is not valid')
    }
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: error.message
    })

    return
  }

  const body = { address, star } = req.body
  const story = star.story

  body.star = {
    dec: star.dec,
    ra: star.ra,
    story: new Buffer(story).toString('hex'),
    mag: star.mag,
    con: star.con
  }
  
  var newKidsOnTheBlock = new blockchain.Block(body)
  await chain.addBlock(newKidsOnTheBlock)
  const height = await chain.getBlockHeight()
  const response = await chain.getBlock(height)

  starValidation.invalidate(address)

  res.status(201).send(response)
})

/**
| ====================================================================== |
| ====================================================================== |
| @description Criteria: Get star block by hash with JSON response.      |
|                   URL:  http://localhost:8000/stars/hash:[HASH]        |
| ====================================================================== |
*/
app.get('/stars/hash:hash', async (req, res) => {
  try {
    const hash = req.params.hash.slice(1)
    const response = await chain.getLevelDBBlockByHash(hash)

    res.send(response)
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: 'Block not found'
    })
  }
})

/**
| =================================================================================================== |
| =================================================================================================== |
| @description Criteria: Get star block by wallet address (blockchain identity) with JSON response.   |
|                   URL:  http://localhost:8000/stars/address:[ADDRESS]
| =================================================================================================== |
 */
app.get('/stars/address:address', async (req, res) => {
  try {
    const address = req.params.address.slice(1)
    const response = await chain.getLevelDBBlocksByAddress(address)

    res.send(response)
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: 'Block not found'
    })
  }
})

/**
| ================================================================================= |
| ================================================================================= |
| @description Criteria: Get star block by star block height with JSON response.    |
|                   URL: http://localhost:8000/block/[HEIGHT]                       |
| ================================================================================= |
 */
app.get('/block/:height', async (req, res) => {
  try {
    const response = await chain.getLevelDBBlockByHeight(req.params.height)

    res.send(response)
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: 'Block not found'
    })
  }
})