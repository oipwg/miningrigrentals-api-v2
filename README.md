[![Build Status](https://travis-ci.org/oipwg/miningrigrentals-api-v2.svg?branch=master)](https://travis-ci.org/oipwg/miningrigrentals-api-v2)
[![](https://img.shields.io/npm/v/miningrigrentals-api-v2.svg)](https://www.npmjs.com/package/miningrigrentals-api-v2)

# Mining Rig Rentals API V2
miningrigrentals-api-v2 is a JavaScript wrapper library over the MiningRigRentals (MRR) API, 
using es6/7 async functionality. First create a MRR and generate an API key and secret.
Then simply download and import the library to 
start using it. Initialize the MRR class with your api key and secret, and 
call any method defined in the documentation! 

## Installation

To install `miningrigrentals-api-v2` for use in an application, install the latest version
from NPM and save it to your `package.json`. For this example
we're using `npm`

```bash
$ npm install miningrigrentals-api-v2
```

## Getting Started
To get started using the library, first import the `MiningRigRentals` class
from the `miningrigrentals-api-v2` module.

```javascript
import MiningRigRentals from 'miningrigrentals-api-v2'
```
After you have imported the api, you can go ahead and spawn a new 
`MiningRigRentals` Object. You must pass it your MRR api key and secret or else 
the class will not be able to make the API calls.
```javascript
const apiKey = {
	key: api_key,
	secret: api_secret
};
let MRR = new MiningRigRentals(api_key)
```

## Using your first method
To make sure the class was initiliazed correctly, we can test authorization by 
calling:
```javascript
let test = await MRR.whoami()
```

This library wraps every function in a es7 async/await wrapper. If instead you
wish to deal with promises in a different way, feel free to do:
```javascript
MRR.whoami().then(success => success).catch(err => err)
```
We recommend using `async/await` as it makes the code more terse. `await` will
resolve the promise in a synchronous manner that allows one to expect deterministic
behavior.

If `test.success === true` than you are good to go!

Check out the rest of the documentation to see what else you can do!

## Documentation
https://oipwg.github.io/miningrigrentals-api-v2/
