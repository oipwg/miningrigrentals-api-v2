"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.to-string");

var _axios = _interopRequireDefault(require("axios"));

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 An importable Javascript class to make REST requests to the MiningRigRentals API
 */
const v1 = 'v1';
const v2 = 'v2';

class MiningRigRentals {
  /**
   * Create a new MiningRigRentals class from the constructor using your MRR api key and secret
   * @param {Object} apiSettings
   * @param {string} apiSettings.key - mining rig rentals api key
   * @param {string} apiSettings.secret - mining rig rentals api secret
   */
  constructor(apiSettings) {
    _defineProperty(this, "createError", (url, type, error) => {
      var extraErrorText = "";

      if (error && error.response) {
        if (error.response.status) extraErrorText += error.response.status + " ";
        if (error.response.statusText) extraErrorText += error.response.statusText + " | ";
        if (error.response.data) extraErrorText += JSON.stringify(error.response.data);
      } else {
        extraErrorText = error.toString();
      }

      return new Error("Unable to " + type + " " + url + ": " + extraErrorText);
    });

    this.baseURL = 'https://www.miningrigrentals.com/api/';

    if (apiSettings && apiSettings.key && apiSettings.secret) {
      this.key = apiSettings.key;
      this.secret = apiSettings.secret;
      this.prevNonce = new Date().getTime();
    }
  }
  /* ------------ Information API ----------- */

  /**
   * Test connectivity and return information about you
   * @returns {Promise<Object>}
   */


  async whoami() {
    let endpoint = '/whoami';
    let api = this.initAPI(endpoint);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }

  /**
   * Get a list of MRR rig servers
   * @returns {Promise<Object>}
   */
  async getServers() {
    let endpoint = '/info/servers';
    let api = this.initAPI(endpoint);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }

  /**
   * Get all algos and statistics for them (suggested price, unit information, current rented hash/etc)
   * @param {string} [currency='BTC'] - Currency to use for price info *Ticker. Options: BTC, ETH, LTC, DASH
   * @returns {Promise<Object>}
   */
  async getAlgos(currency) {
    let endpoint = `/info/algos`,
        params;

    if (currency) {
      params = {
        currency: currency
      };
    }

    let api = this.initAPI(endpoint, params);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }

  /**
   *
   * @param {string} algo - the name of the algorithm you wish to search by. Ex: 'scrypt'
   * @param {string} [currency='BTC'] - Currency to use for price info. Options: BTC, ETH, LTC, DASH
   * @returns {Promise<*>}
   */
  async getAlgo(algo, currency) {
    let endpoint = `/info/algos/${algo}`,
        params;

    if (currency) {
      params = {
        currency: currency
      };
    }

    let api = this.initAPI(endpoint, params);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }

  /* ------------ Account API ----------- */
  //@ToDO: add v1 account API methods

  /* ------------ Rig API ----------- */

  /**
   *
   * @param  {object} options - input fields/query parameters
   * @param {string} options.type - Rig type, eg: sha256, scrypt, x11, etc
   * @param {Object} [options.minhours] - Filter the minimum hours of the rig *broken
   * @param {number} [options.minhours.min]
   * @param {number} [options.minhours.max]
   * @param {Object} [options.maxhours] - Filter the maximum hours of the rig *broken
   * @param {number} [options.maxhours.min]
   * @param {number} [options.maxhours.max]
   * @param {Object} [options.rpi] - 	Filter the RPI score
   * @param {number} [options.rpi.min]
   * @param {number} [options.rpi.max]
   * @param {Object} [options.hash] - Filter the hashrate
   * @param {number} [options.hash.min]
   * @param {number} [options.hash.max]
   * @param {string} [options.hash.type] - The hash type of min/max. defaults to "mh", possible values: [hash,kh,mh,gh,th]
   * @param {Object} [options.price] - Filter the price
   * @param {number} [options.price.min]
   * @param {number} [options.price.max]
   * @param {boolean} [options.offline=false] - To show or not to show offline rigs
   * @param {boolean} [options.rented=false} - to show or not to show rented rigs
   * @param {Object} [options.region] - Filter the region
   * @param {string} [options.region.type] - Determines if this filter is an inclusive or exclusive filter.. possible options are [include,exclude]
   * @param {boolean} [options.region.<REGION>] - A region to include/exclude
   * @param {number} [options.count=100] - Number of results to return, max is 100
   * @param {number} [options.offset=0] - What result number to start with, returning COUNT results
   * @param {string} [options.order="score"] - Field to order the results by. Default is "score", Possible values: [rpi,hash,price,minhrs,maxhrs,score]
   * @param {string} [options.orderdir="asc"] - Order direction
   * @returns {Promise<Object>}
   */
  async getRig(options) {
    let endpoint = '/rig';
    let params = {};

    if (options) {
      for (let opt in options) {
        params[opt] = options[opt];
      }
    }

    let api = this.initAPI(endpoint, params);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }
  /**
   * List my rigs
   * @param {Object} [options]
   * @param {string} [options.type] - Filter on algo -- see /info/algos
   * @param {boolean} [options.hashrate=false] - Calculate and display hashrates
   * @returns {Promise<Object>}
   */


  async getMyRigs(options) {
    let endpoint = '/rig/mine';
    let params = {};

    if (options) {
      for (let opt in options) {
        params[opt] = options[opt];
      }
    }

    let api = this.initAPI(endpoint, params);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }
  /* ------------ Rental API ----------- */

  /**
   * Lists rentals
   * @param {Object} [options] - input fields/query parameters
   * @param {string} [options.type=renter] - Type is one of [owner,renter] -- owner means rentals on your rigs, renter means rentals you purchased
   * @param {string} [options.algo] - Filter by algo, see /info/algos
   * @param {boolean} [options.history=false] - true = Show completed rentals, false = Active rentals
   * @param {number} [options.rig] - Show rentals related to a specific rig ID
   * @param {number} [options.start=0] - Start number (for pagination)
   * @param {number} [options.limit=25] - Limit number (for pagination)
   * @returns {Promise<*>}
   */


  async getRental(options) {
    let endpoint = '/rental';
    let params = {};

    if (options) {
      for (let opt in options) {
        params[opt] = options[opt];
      }
    }

    let api = this.initAPI(endpoint, params);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }
  /* ------------ AXIOS INITIATION ----------- */

  /**
   * Initialize a new instance of axios with desired endpoint
   * @param {string} endpoint - the endpoint you wish to hit WITHOUT THE TRAILING SLASH; ex: /rig/14
   * @param {Object} [params] - extra parameters to be passed along to the API
   * @param {string} [version='v2'] - specify the mining rig rental api version you want to hit; defaults v2
   * @returns {AxiosInstance}
   */


  initAPI(endpoint, params, version = v2) {
    let nonce = this.generateNonce();
    let hmac_digest = this.createHMACSignature(endpoint, nonce);
    return new _axios.default.create({
      baseURL: `${this.baseURL}${version}/`,
      headers: {
        'x-api-key': this.key,
        'x-api-sign': hmac_digest,
        'x-api-nonce': nonce,
        'Access-Control-Allow-Origin': '*'
      },
      data: params
    });
  }

  /**
   * Create a SHA1 HMAC signature required for every mrr api call (see more at 'https://www.miningrigrentals.com/apidocv2')
   * @param {string} endpoint - the endpoint your wish to hit without the trailing slash
   * @param {number} nonce - a nonce that increments with each call
   * @returns {string} hmacSig - the HMAC signature in hex
   */
  createHMACSignature(endpoint, nonce) {
    const concatString = `${this.key}${nonce}${endpoint}`;
    return _crypto.default.createHmac('sha1', this.secret).update(concatString).digest('hex');
  }

  /**
   * Generate a nonce needed to build the HMAC signature
   * @returns {number} - the current UNIX time + the previous Nonce
   */
  generateNonce() {
    this.prevNonce += new Date().getTime();
    return this.prevNonce;
  }

}

var _default = MiningRigRentals;
exports.default = _default;