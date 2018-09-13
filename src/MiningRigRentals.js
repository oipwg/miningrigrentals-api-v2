import axios from 'axios';
import crypto from 'crypto';

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
		this.baseURL = 'https://www.miningrigrentals.com/api/';

		if (apiSettings && apiSettings.key && apiSettings.secret) {
			this.key = apiSettings.key;
			this.secret = apiSettings.secret;
			this.prevNonce = (new Date().getTime())
		}
	}
	/**
	 * Initialize a new instance of axios with desired endpoint
	 * @param {string} endpoint - the endpoint you wish to hit WITHOUT THE TRAILING SLASH; ex: /rig/14
	 * @param {string} [version='v2'] - specify the mining rig rental api version you want to hit; defaults v2
	 * @returns {AxiosInstance}
	 */
	initAPI = (endpoint, version = 'v2') => {
		return (
			axios.create({
				baseURL: `${this.baseURL}${version}/`,
				headers: {
					'x-api-key': this.key,
					'x-api-sign': this.createHMACSignature(endpoint),
					'x-api-nonce': this.generateNonce()
				}
			})
		)
	};
	/**
	 * Create a SHA1 HMAC signature required for every mrr api call (see more at 'https://www.miningrigrentals.com/apidocv2')
	 * @param {string} endpoint - the endpoint your wish to hit without the trailing slash
	 * @returns {string} hmacSig - the HMAC signature in hex
	 */
	createHMACSignature = (endpoint) => {
		const concatString = `${this.key}${this.generateNonce()}${endpoint}`;
		return crypto.createHmac('sha1', this.secret).update(concatString).digest('hex');
	};
	/**
	 * Generate a nonce needed to build the HMAC signature
	 * @returns {number} - ((the current UNIX time * X) + prevNonce) where X is a number 1 - 100
	 */
	generateNonce = () => {
		this.prevNonce += (new Date()).getTime() * Math.floor(Math.random() * 100);
		return this.prevNonce
	};

}

export default MiningRigRentals
