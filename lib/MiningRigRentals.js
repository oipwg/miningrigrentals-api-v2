"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 An importable Javascript class to make REST requests to the MiningRigRentals API
 */
class MiningRigRentals {
  /**
   * Create a new MiningRigRentals class from the constructor using your MRR api key and secret
   * @param {Object} apiSettings
   * @param {string} apiSettings.key - mining rig rentals api key
   * @param {string} apiSettings.secret - mining rig rentals api secret
   */
  constructor(apiSettings) {
    _defineProperty(this, "initAPI", (endpoint, version = 'v2') => {
      return _axios.default.create({
        baseURL: `${this.baseURL}${version}/`,
        headers: {
          'x-api-key': this.key,
          'x-api-sign': this.createHMACSignature(endpoint),
          'x-api-nonce': this.generateNonce()
        }
      });
    });

    _defineProperty(this, "createHMACSignature", endpoint => {
      const concatString = `${this.key}${this.generateNonce()}${endpoint}`;
      return _crypto.default.createHmac('sha1', this.secret).update(concatString).digest('hex');
    });

    _defineProperty(this, "generateNonce", () => {
      this.prevNonce += new Date().getTime() * Math.floor(Math.random() * 100);
      return this.prevNonce;
    });

    this.baseURL = 'https://www.miningrigrentals.com/api/';

    if (apiSettings && apiSettings.key && apiSettings.secret) {
      this.key = apiSettings.key;
      this.secret = apiSettings.secret;
      this.prevNonce = new Date().getTime();
    }
  }
  /**
   * Initialize a new instance of axios with desired endpoint
   * @param {string} endpoint - the endpoint you wish to hit WITHOUT THE TRAILING SLASH; ex: /rig/14
   * @param {string} [version='v2'] - specify the mining rig rental api version you want to hit; defaults v2
   * @returns {AxiosInstance}
   */


}

var _default = MiningRigRentals;
exports.default = _default;