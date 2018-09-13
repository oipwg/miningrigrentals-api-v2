import axios from 'axios';
import crypto from 'crypto';

/**
 An importable Javascript class to make REST requests to the MiningRigRentals API
 */
class MiningRigRentals {
	/**
	 * Create a MiningRigRentals class
	 * @param {Object} api
	 * @param {string} api.key - mining rig rentals api key
	 * @param {string} api.secret - mining rig rentals api secret
	 */
	constructor(api) {
		this.baseURL = 'https://www.miningrigrentals.com/api/';

		if (api && api.key && api.secret) {
			this.key = api.key;
			this.secret = api.secret;
		}
	}

	/**
	 * Initialize a new instance of axios with desired endpoint
	 * @param {string} endpoint - the endpoint you wish to hit WITHOUT THE TRAILING SLASH; ex: /rig/14
	 * @param {string} [version='v2'] - specify the mining rig rental api version you want to hit; defaults v2
	 * @returns {AxiosInstance}
	 */
	mrrAPI = (endpoint, version = 'v2') => {
		return (
			axios.create({
				baseURL: `${this.baseURL}${version}/`,
				headers: {
					'x-api-key': this.key,
					'x-api-sign': this.createHMACSignature(endpoint),
					'x-api-nonce': this.createAPINonce()
				}
			})
		)
	};

	createHMACSignature = (endpoint) => {
		const concatString = `${this.key}${this.createAPINonce()}${endpoint}`;
		return crypto.createHmac('sha1', this.secret).update(concatString).digest('hex');
	};

	createAPINonce = () => {
		this.prevNonce = (new Date()).getTime();
		return this.prevNonce
	};

}

export default MiningRigRentals
