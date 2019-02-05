# Blockchain Developer Nanodegree
# RESTful Web API with Node.js Framework

This project introduces the fundamentals of web APIs with Node.js frameworks.  By using your own private blockchain to create a web API is a first step toward developing your own web applications that are consumable by a variety of web clients.  These fundamentals will be utilized later in the program where students will be programming blockchain technologies utilizing similar features applied towards smart contracts.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

The modules crypto-js and level should already be installed based on the previous projects.  If not you may want to install them as per the below instructions in the Configuring your project section.
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
Testing the RESTful Web API will require the installaion of Postman or Curl.  These tools will assist in testing the API endpoints.  Follow the install instructions provided by each website.  Also, take a minute to view the documentation if necessary.
Postman website:  [https://www.getpostman.com/]
Curl website:  [https://curl.haxx.se/]
### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.  Use the "--save" flag to save the dependency to the package.json file.
```
npm init
```
- Install express with:
```
npm install express --save
```
- Install bitcoinjs-lib with:
```
npm install bitcoinjs-lib --save
```
- Install bitcoinjs-message with:
```
npm install bitcoinjs-message --save
```
- Install body-parser with:
```
npm install body-parser --save
```
- Install hex2ascii with:
```
npm install hex2ascii --save
```

If not installed already install crypto-js and level.
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
## Testing

To test code:
### Configure localhost for GET and POST requests
#### 1:  Open a command prompt or shell terminal after install node.js.  Enter a node session, also known as REPL (Read-Evaluate-Print-Loop) and run index.js.
```
node index.js
```
- Your local host and port should now be configured for GET and POST requests.
```
API Service Port Configuration listening on port 8000
```
### Blockchain ID validation routine
#### 2. Web API post endpoint validates request with JSON response

**HTTP Operation**

POST
```
POST
```
**Endpoint**
- Using Postman, select POST from dropdown and paste URL:
http://localhost:8000/requestValidation
```
http://localhost:8000/requestValidation
```
**Parameters**
address - the hash from the previous step

- In Postman select Body; select raw; select JSON(application/json); enter the Electrum address from project 1
- In the Body section type the data:
{
    "address": "project 1 Electrum address"
}
```
{
    "address": "15tGS1KzyJqDxLw9AtAhMxjU8NjUL9mtSL"
}
```
- Verify the response returned:
```
{
    "registerStar": true,
    "status": {
        "address": "15tGS1KzyJqDxLw9AtAhMxjU8NjUL9mtSL",
        "message": "15tGS1KzyJqDxLw9AtAhMxjU8NjUL9mtSL:1544049427809:starRegistry",
        "requestTimeStamp": 1544049427809,
        "validationWindow": 171,
        "messageSignature": "valid"
    }
}
```
#### 3. Web API post endpoint validates message signature with JSON response

**HTTP Operation**
POST
```
POST
```
**Endpoint**
- Using Postman, select POST from dropdown and paste URL:
http://localhost:8000/message-signature/validate
```
http://localhost:8000/message-signature/validate
```
**Parameters**
address - the hash from the previous step
signature - copy from Electrum

- In Postman select Body; select raw; select JSON(application/json); enter the Electrum address from project 1
- In the Body section type the data:
{
    "address": "address from previous step",
    "signature": "Copy from Electrum"
}
```
{
    "address": "15tGS1KzyJqDxLw9AtAhMxjU8NjUL9mtSL",
    "signature": "ICA+ElPFrwwyF5hMOyMK1lXuEg+aS4ewTZM5yqthPTJFSeZ90G2EEtuJIzcupH4gYq1nETdHo/PPlX0uwrPyUI0="
}
```
- Verify the response returned:
```
{
    "registerStar": true,
    "status": {
        "address": "15tGS1KzyJqDxLw9AtAhMxjU8NjUL9mtSL",
        "message": "15tGS1KzyJqDxLw9AtAhMxjU8NjUL9mtSL:1544049427809:starRegistry",
        "requestTimeStamp": "1544049427809",
        "validationWindow": 171,
        "messageSignature": "valid"
    }
}
```
### Star registration Endpoint
#### 4. Web API Post Endpoint with JSON response

**HTTP Operation**
POST
```
POST
```
**Endpoint**
- Using Postman, select POST from dropdown and paste URL:
http://localhost:8000/block
```
http://localhost:8000/block
```
**Parameters**
address - the hash from the previous step
star {dec - value from Google Sky
      ra - value from Google Sky
      story - Maximun 250 words or 500 bytes
      }

- In Postman select Body; select raw; select JSON(application/json); enter the Electrum address from project 1
- In the Body section type the data:
{
    "address": "The addres that you used in last step",
        "star": {
            "dec": "",
            "ra": "",
            "story": "Maximun 250 words or 500 bytes"
        }
}
```
{
"address": "15tGS1KzyJqDxLw9AtAhMxjU8NjUL9mtSL",
    "star": {
        "dec": "-1° 33' 30.1",
        "ra": "13h 15m 44.0s",
        "story": "Star found using Google Sky https://www.google.com/sky/"
    }
}
```
- Verify the response returned:
```
{
    "hash": "530a7b9021f105dc0b15e30b05329161de7166f9d92f79f22254b79dee2d977f",
    "height": 1,
    "body": {
        "address": "15tGS1KzyJqDxLw9AtAhMxjU8NjUL9mtSL",
        "star": {
            "dec": "-1° 28' 13.9",
            "ra": "13h 16m 47.0s",
            "story": "5374617220666f756e64207573696e6720476f6f676c6520536b792068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
        }
    },
    "time": "1544049744",
    "previousBlockHash": "8f3b018e8c97a44feebf24aaf44cf31e314bc2feb9f6722cb0fb8a68cf3f3291"
}
```
### Star Lookup
#### 5. Get star block by hash with JSON response

**HTTP Operation**

GET
```
GET
```
**Endpoint**
http://localhost:8000/stars/hash:[HASH]
```
http://localhost:8000/stars/hash:530a7b9021f105dc0b15e30b05329161de7166f9d92f79f22254b79dee2d977f
```
**Parameters**
hash - the hash from the previous step
```
530a7b9021f105dc0b15e30b05329161de7166f9d92f79f22254b79dee2d977f
```
- Verify the response returned:
```
{
    "hash": "530a7b9021f105dc0b15e30b05329161de7166f9d92f79f22254b79dee2d977f",
    "height": 1,
    "body": {
        "address": "15tGS1KzyJqDxLw9AtAhMxjU8NjUL9mtSL",
        "star": {
            "dec": "-1° 28' 13.9",
            "ra": "13h 16m 47.0s",
            "story": "5374617220666f756e64207573696e6720476f6f676c6520536b792068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Star found using Google Sky https://www.google.com/sky/"
        }
    },
    "time": "1544049744",
    "previousBlockHash": "8f3b018e8c97a44feebf24aaf44cf31e314bc2feb9f6722cb0fb8a68cf3f3291"
}
```

#### 6. Get star block by wallet address (blockchain identity) with JSON response
**HTTP Operation**
GET
```
GET
```
**Endpoint**
http://localhost:8000/stars/address:[ADDRESS]
```
http://localhost:8000/stars/address:15tGS1KzyJqDxLw9AtAhMxjU8NjUL9mtSL
```
**Parameters**
address - the address used in the previous steps
```
15tGS1KzyJqDxLw9AtAhMxjU8NjUL9mtSL
```
- Verify the response returned:
```
[
    {
        "hash": "530a7b9021f105dc0b15e30b05329161de7166f9d92f79f22254b79dee2d977f",
        "height": 1,
        "body": {
            "address": "15tGS1KzyJqDxLw9AtAhMxjU8NjUL9mtSL",
            "star": {
                "dec": "-1° 28' 13.9",
                "ra": "13h 16m 47.0s",
                "story": "5374617220666f756e64207573696e6720476f6f676c6520536b792068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
                "storyDecoded": "Star found using Google Sky https://www.google.com/sky/"
            }
        },
        "time": "1544049744",
        "previousBlockHash": "8f3b018e8c97a44feebf24aaf44cf31e314bc2feb9f6722cb0fb8a68cf3f3291"
    }
]
```
#### 7. Get star block by star block height with JSON response

**HTTP Operation**

GET
```
GET
```
**Endpoint**
http://localhost:8000/block/[HEIGHT] 
```
http://localhost:8000/block/1
```
**Parameters**
height - the height of the block
```
1
```
- Verify the response returned:
```
{
    "hash": "530a7b9021f105dc0b15e30b05329161de7166f9d92f79f22254b79dee2d977f",
    "height": 1,
    "body": {
        "address": "15tGS1KzyJqDxLw9AtAhMxjU8NjUL9mtSL",
        "star": {
            "dec": "-1° 28' 13.9",
            "ra": "13h 16m 47.0s",
            "story": "5374617220666f756e64207573696e6720476f6f676c6520536b792068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Star found using Google Sky https://www.google.com/sky/"
        }
    },
    "time": "1544049744",
    "previousBlockHash": "8f3b018e8c97a44feebf24aaf44cf31e314bc2feb9f6722cb0fb8a68cf3f3291"
}
```