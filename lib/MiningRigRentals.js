"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.to-string");

var _axios = _interopRequireDefault(require("axios"));

var _crypto = _interopRequireDefault(require("crypto"));

var _qs = _interopRequireDefault(require("qs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

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
   * Get statistics for an algo (suggested price, unit information, current rented hash/etc)
   * @param {string} algo - the name of the algorithm you wish to search by. Ex: 'scrypt'
   * @param {string} [currency='BTC'] - Currency to use for price info. Options: BTC, ETH, LTC, DASH
   * @returns {Promise<Object>}
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

  /**
   * Get account balance
   * @returns {Promise<Object>}
   */
  async getBalance() {
    let endpoint = `/account`;
    let params = {
      method: 'balance'
    };
    let api = this.initAPI(endpoint, params, v1);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }
  /**
   * List favorited pools (account specific)
   * @returns {Promise<Object>}
   */


  async getFavoritePools() {
    let endpoint = `/account`;
    let params = {
      method: 'pools'
    };
    let api = this.initAPI(endpoint, params, v1);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }
  /**
   * List profiles
   * @returns {Promise<Object>}
   */


  async getProfiles() {
    let endpoint = `/account`;
    let params = {
      method: 'profiles'
    };
    let api = this.initAPI(endpoint, params, v1);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }
  /* ------------ Rig API ----------- */

  /**
   * Search for rigs on a specified algo. This is identical to the main rig list pages.
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


  async getRigs(options) {
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


  async listMyRigs(options) {
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
  /**
   * Get 1 or more rigs by ID
   * @param {(number|Array<number>)} rigIDs - Rig IDs
   * @returns {Promise<Object>}
   */


  async getRigsByID(rigIDs) {
    let queryString = '';

    if (Array.isArray(rigIDs)) {
      queryString = rigIDs.join(';');
    } else {
      if (typeof rigIDs === 'string' || typeof rigIDs === 'number') {
        queryString = rigIDs;
      }
    }

    let endpoint = `/rig/${queryString}`;
    let api = this.initAPI(endpoint);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }
  /**
   * Create a Rig
   * @param {Object} [options]
   * @param {string} options.name - Name of rig
   * @param {string} options.type - Type of rig (scrypt, sha256, x11, etc)
   * @param {string} [options.status] - "enabled","disabled"
   * @param {string} options.server - Server name -- see /info/servers
   * @param {Object} [options.price]
   * @param {string} [options.price.btc.price] - Price of the rig per price.type per day (BTC)
   * @param {boolean} [options.price.btc.autoprice] - Enable BTC autopricing
   * @param {(string|number)} [options.price.btc.minimum] - Minimum price for the autopricer -- 0 to disable
   * @param {string} [options.price.btc.modified] - Percent +/- to modify the autopricing (eg: +10 or -5.13 is 10% over or 5.13% under market rates, respectively), 0 to disable
   * @param {boolean} [options.price.ltc.enabled=true]
   * @param {(string|number)} [options.price.ltc.price] - Price of the rig per price.type per day (LTC)
   * @param {boolean} [options.price.ltc.autoprice] - Enable LTC autopricing -- adjusts the LTC rate based on your BTC price and the GDAX market rate
   * @param {string} [options.price.eth.enabled=true]
   * @param {(string|number)} [options.price.eth.price] - Price of the rig per price.type per day (ETH)
   * @param {boolean} [options.price.eth.autoprice] - Enable ETH autopricing -- adjusts the ETH rate based on your BTC price and the GDAX market rate
   * @param {string} [options.price.dash.enabled=true]
   * @param {string} [options.price.dash.price] - Price of the rig per price.type per day (DASH)
   * @param {boolean} [options.price.dash.autoprice] - Enable DASH autopricing -- adjusts the DASH rate based on your BTC price and the GDAX market rate
   * @param {string} [options.price.type='mh'] - The hash type of hash.. defaults to "mh" possible values: [hash,kh,mh,gh,th]
   * @param {number} [options.minhours] - 	Minimum number of hours available
   * @param {number} [options.maxhours] - Maximum number of hours available
   * @param {Object} [options.hash]
   * @param {(string|number)} options.hash.hash - Amount of hash to advertise
   * @param {string} options.hash.type='mh' - The hash type of hash.. defaults to "mh" possible values: [hash,kh,mh,gh,th]
   * @returns {Promise<Object>}
   */


  async createRig(options) {
    let endpoint = `/rig`;
    let params = {};

    if (options) {
      for (let opt in options) {
        params[opt] = options[opt];
      }
    }

    let api = this.initAPI(endpoint, params);

    try {
      return (await api.put(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'PUT', err);
    }
  }
  /**
   * Update 1 or more rigs by ID
   * @param {(number|Array<number>)} rigIDs - Rig ID(s)
   * @param {Object} [options]
   * @param {string} [options.name] - Name of rig
   * @param {string} [options.status] - "enabled","disabled"
   * @param {string} [options.server] - Server name -- see /info/servers
   * @param {Object} [options.price]
   * @param {string} [options.price.btc.price] - Price of the rig per price.type per day (BTC)
   * @param {boolean} [options.price.btc.autoprice] - Enable BTC autopricing
   * @param {(string|number)} [options.price.btc.minimum] - Minimum price for the autopricer -- 0 to disable
   * @param {string} [options.price.btc.modified] - Percent +/- to modify the autopricing (eg: +10 or -5.13 is 10% over or 5.13% under market rates, respectively), 0 to disable
   * @param {boolean} [options.price.ltc.enabled=true]
   * @param {(string|number)} [options.price.ltc.price] - Price of the rig per price.type per day (LTC)
   * @param {boolean} [options.price.ltc.autoprice] - Enable LTC autopricing -- adjusts the LTC rate based on your BTC price and the GDAX market rate
   * @param {string} [options.price.eth.enabled=true]
   * @param {(string|number)} [options.price.eth.price] - Price of the rig per price.type per day (ETH)
   * @param {boolean} [options.price.eth.autoprice] - Enable ETH autopricing -- adjusts the ETH rate based on your BTC price and the GDAX market rate
   * @param {string} [options.price.dash.enabled=true]
   * @param {string} [options.price.dash.price] - Price of the rig per price.type per day (DASH)
   * @param {boolean} [options.price.dash.autoprice] - Enable DASH autopricing -- adjusts the DASH rate based on your BTC price and the GDAX market rate
   * @param {string} [options.price.type='mh'] - The hash type of hash.. defaults to "mh" possible values: [hash,kh,mh,gh,th]
   * @param {number} [options.minhours] - 	Minimum number of hours available
   * @param {number} [options.maxhours] - Maximum number of hours available
   * @param {Object} [options.hash]
   * @param {(string|number)} [options.hash.hash] - Amounto f hash to advertise
   * @param {string} [options.hash.type='mh'] - The hash type of hash.. defaults to "mh" possible values: [hash,kh,mh,gh,th]
   * @returns {Promise<Object>}
   */


  async updateRigsByID(rigIDs, options) {
    let queryString = '';

    if (Array.isArray(rigIDs)) {
      queryString = rigIDs.join(';');
    } else {
      if (typeof rigIDs === 'string' || typeof rigIDs === 'number') {
        queryString = rigIDs;
      }
    }

    let endpoint = `/rig/${queryString}`;
    let params = {};

    if (options) {
      for (let opt in options) {
        params[opt] = options[opt];
      }
    }

    let api = this.initAPI(endpoint, params);

    try {
      return (await api.put(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'PUT', err);
    }
  }
  /**
   * Delete 1 or more rigs by ID
   * @param {(number|Array<number>)} rigIDs
   * @returns {Promise<Object>}
   */


  async deleteRigs(rigIDs) {
    let queryString = '';

    if (Array.isArray(rigIDs)) {
      queryString = rigIDs.join(';');
    } else {
      if (typeof rigIDs === 'string' || typeof rigIDs === 'number') {
        queryString = rigIDs;
      }
    }

    let endpoint = `/rig/${queryString}`;
    let api = this.initAPI(endpoint);

    try {
      return (await api.delete(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'DELETE', err);
    }
  }
  /**
   * For rig owners: extend a rental to donate time to the renter -- Assuming an active rental is in progress.
   * @param {(number|Array<number>)} rigIDs - IDs of the Rigs you wish to extend @ToDo: unclear if rig ID or rental ID needed
   * @param {Object} options
   * @param {number} options.hours - Hours to extend by
   * @param {number} options.minutes - Minutes to extend by
   * @returns {Promise<Object>}
   */


  async extendRental(rigIDs, options) {
    let queryString = '';

    if (Array.isArray(rigIDs)) {
      queryString = rigIDs.join(';');
    } else {
      if (typeof rigIDs === 'string' || typeof rigIDs === 'number') {
        queryString = rigIDs;
      }
    }

    let endpoint = `/rig/${queryString}/extend`;
    let params = {};

    if (options) {
      for (let opt in options) {
        params[opt] = options[opt];
      }
    }

    let api = this.initAPI(endpoint, params);

    try {
      return (await api.put(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'PUT', err);
    }
  }
  /**
   * Apply a pool profile to one or more rigs
   * @param {(number|Array<number>)} rigIDs - Rig IDs
   * @param {number} profileID - Profile ID to apply -- see /account/profile
   * @returns {Promise<Object>}
   */


  async addPoolToRigs(rigIDs, profileID) {
    let queryString = '';

    if (Array.isArray(rigIDs)) {
      queryString = rigIDs.join(';');
    } else {
      if (typeof rigIDs === 'string' || typeof rigIDs === 'number') {
        queryString = rigIDs;
      }
    }

    let endpoint = `/rig/${queryString}/profile`;
    let params = {
      profile: profileID
    };
    let api = this.initAPI(endpoint, params);

    try {
      return (await api.put(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'PUT', err);
    }
  }
  /**
   * List pools assigned to one or more rigs
   * @param {(number|Array<number>)} rigIDs - Rig IDs
   * @returns {Promise<Object>}
   */


  async getPoolsFromRigIDs(rigIDs) {
    let queryString = '';

    if (Array.isArray(rigIDs)) {
      queryString = rigIDs.join(';');
    } else {
      if (typeof rigIDs === 'string' || typeof rigIDs === 'number') {
        queryString = rigIDs;
      }
    }

    let endpoint = `/rig/${queryString}/pool`;
    let api = this.initAPI(endpoint);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }
  /** Add or replace a pool on one or more rigs
   * @param {(number|Array<number>)} rigIDs - Rig IDs
   * @param {Object} options
   * @param {string} options.host - pool host (the part after stratum+tcp://)
   * @param {number} options.port - pool port (ex: 3333)
   * @param {string} options.user - workername
   * @param {string} options.pass - worker password
   * @param {number} [options.priority] - 0-4 -- can be passed in after pool/ instead.eg /rig/17/pool/0
   */


  async addOrUpdatePoolOnRigs(rigIDs, options) {
    let queryString = '';

    if (Array.isArray(rigIDs)) {
      queryString = rigIDs.join(';');
    } else {
      if (typeof rigIDs === 'string' || typeof rigIDs === 'number') {
        queryString = rigIDs;
      }
    }

    let params = {};

    if (options) {
      for (let opt in options) {
        params[opt] = options[opt];
      }
    }

    let endpoint = `/rental/${queryString}/pool`;
    let api = this.initAPI(endpoint, params);

    try {
      return (await api.put(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'PUT', err);
    }
  }
  /**
   * Delete a pool on one or more rigs
   * @param {(number|Array<number>)} rigIDs - Rig IDs
   * @param {number} priority - 	0-4 -- can be passed in after pool/ instead.eg /rig/17/pool/0
   * @returns {Promise<Object>}
   */


  async deletePoolOnRigs(rigIDs, priority) {
    let queryString = '';

    if (Array.isArray(rigIDs)) {
      queryString = rigIDs.join(';');
    } else {
      if (typeof rigIDs === 'string' || typeof rigIDs === 'number') {
        queryString = rigIDs;
      }
    }

    let params = {
      priority
    };
    let endpoint = `/rental/${queryString}/pool`;
    let api = this.initAPI(endpoint, params);

    try {
      return (await api.delete(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'DELETE', err);
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
   * @returns {Promise<Object>}
   */


  async getRentals(options) {
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
  /**
   * Get information on rentals by rental ID.
   * @param {(number|Array<number>)} ids - Rental IDs
   * @returns {Promise<Object>}
   */


  async getRentalById(ids) {
    let idQueryString = '';

    if (Array.isArray(ids)) {
      idQueryString = ids.join(';');
    } else {
      if (typeof ids === 'string' || typeof ids === 'number') {
        idQueryString = ids;
      }
    }

    let endpoint = `/rental/${idQueryString}`;
    let api = this.initAPI(endpoint);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }
  /**
   * Create a new rental
   * @param {Object} options
   * @param {number} options.rig - Rig ID to rent
   * @param {number} options.length - Length in hours to rent
   * @param {number} options.profile - The profile ID to apply (see /account/profile)
   * @param {string} [options.currency='BTC'] - Currency to use -- one of [BTC,LTC,ETH,DASH]
   * @param {Object} [options.rate]
   * @param {string} [options.rate.type] - The hash type of rate. defaults to "mh", possible values: [hash,kh,mh,gh,th]
   * @param {number} [options.rate.price] - Price per [rate.type] per day to pay -- this is a filter only, it will use the rig's current price as long as it is <= this value
   * @returns {Promise<Object>}
   */


  async createRental(options) {
    let endpoint = `/rental`;
    let params = {};

    if (options) {
      for (let opt in options) {
        params[opt] = options[opt];
      }
    }

    let api = this.initAPI(endpoint, params);

    try {
      return (await api.put(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'PUT', err);
    }
  }
  /**
   * Apply a pool profile to one or more rentals
   * @param {(number|Array<number>)} rentalIDs - rental IDs
   * @param {number} profileID - Profile ID to apply -- see /account/profile
   * @returns {Promise<Object>}
   */


  async addPoolProfileToRentals(rentalIDs, profileID) {
    let queryString = '';

    if (Array.isArray(rentalIDs)) {
      queryString = rentalIDs.join(';');
    } else {
      if (typeof rentalIDs === 'string' || typeof rentalIDs === 'number') {
        queryString = rentalIDs;
      }
    }

    let endpoint = `/rental/${queryString}/profile/${profileID}`;
    let api = this.initAPI(endpoint);

    try {
      return (await api.put(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'PUT', err);
    }
  }
  /**
   * List pools assigned to one or more rentals.
   * @param {(number|Array<number>)} rentalIDs - Rental IDs
   * @returns {Promise<Object>}
   */


  async getPoolsByRentalID(rentalIDs) {
    let queryString = '';

    if (Array.isArray(rentalIDs)) {
      queryString = rentalIDs.join(';');
    } else {
      if (typeof rentalIDs === 'string' || typeof rentalIDs === 'number') {
        queryString = rentalIDs;
      }
    }

    let endpoint = `/rental/${queryString}/pool`;
    let api = this.initAPI(endpoint);

    try {
      return (await api.get(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'GET', err);
    }
  }
  /**
   * Add or replace a pool on one or more rentals
   * @param {(number|Array<number>)} rentalIDs - Rental IDs
   * @param {Object} options
   * @param {string} options.host - pool host (the part after stratum+tcp://)
   * @param {number} options.port - pool port (ex: 3333)
   * @param {string} options.user - workername
   * @param {string} options.pass - worker password
   * @param {number} [options.priority] - 0-4 -- can be passed in after pool/ instead.eg /rig/17/pool/0
   * @returns {Promise<Object>}
   */


  async addOrUpdatePoolOnRentals(rentalIDs, options) {
    let queryString = '';

    if (Array.isArray(rentalIDs)) {
      queryString = rentalIDs.join(';');
    } else {
      if (typeof rentalIDs === 'string' || typeof rentalIDs === 'number') {
        queryString = rentalIDs;
      }
    }

    let params = {};

    if (options) {
      for (let opt in options) {
        params[opt] = options[opt];
      }
    }

    let endpoint = `/rental/${queryString}/pool`;
    let api = this.initAPI(endpoint, params);

    try {
      return (await api.put(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'PUT', err);
    }
  }
  /**
   * Delete a pool on one or more rentals
   * @param {(number|Array<number>)} rentalIDs - Rental IDs
   * @param {number} priority - 0-4 -- can be passed in after pool/ instead.eg /rig/17/pool/0
   */


  async deletePoolOnRentals(rentalIDs, priority) {
    let queryString = '';

    if (Array.isArray(rentalIDs)) {
      queryString = rentalIDs.join(';');
    } else {
      if (typeof rentalIDs === 'string' || typeof rentalIDs === 'number') {
        queryString = rentalIDs;
      }
    }

    let endpoint = `/rental/${queryString}/pool/${priority}`;
    let api = this.initAPI(endpoint);

    try {
      return (await api.delete(endpoint)).data;
    } catch (err) {
      throw this.createError(endpoint, 'DELETE', err);
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
    let hmac_digest = this.createHMACSignature(endpoint, nonce, version, params);

    if (version === v1) {
      params = _objectSpread({}, params, {
        nonce
      });
    }

    return new _axios.default.create({
      baseURL: `${this.baseURL}${version}/`,
      headers: {
        'x-api-key': this.key,
        'x-api-sign': hmac_digest,
        'x-api-nonce': nonce,
        'Access-Control-Allow-Origin': '*'
      },
      params: params,
      paramsSerializer: params => {
        return _qs.default.stringify(params, {
          arrayFormat: 'repeat'
        });
      }
    });
  }

  /**
   * Create a SHA1 HMAC signature required for every mrr api call (see more at 'https://www.miningrigrentals.com/apidocv2')
   * @param {string} endpoint - the endpoint your wish to hit without the trailing slash
   * @param {number} nonce - a nonce that increments with each call
   * @param {string} [version='v2'] - MRR API version number (which version of the api you want to hit)
   * @param {Object} [params] - An object of parameters. Only needed if hitting the v1 API (used for creating the signature)
   * @returns {string} hmacSig - the HMAC signature in hex
   */
  createHMACSignature(endpoint, nonce, version, params) {
    if (version === 'v2') {
      const concatString = `${this.key}${nonce}${endpoint}`;
      return _crypto.default.createHmac('sha1', this.secret).update(concatString).digest('hex');
    } else if (version === 'v1') {
      let args = _objectSpread({}, params, {
        nonce
      });

      let querystring = _qs.default.stringify(args);

      return _crypto.default.createHmac('sha1', this.secret).update(querystring).digest('hex');
    }
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