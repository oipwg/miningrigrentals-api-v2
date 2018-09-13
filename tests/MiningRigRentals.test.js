import MiningRigRentals from '../src/MiningRigRentals'

const apiSettings = {
	key: '731cf0f318903cd1b24b4fb025fd246082d20561ae613665fa14fc0c7112ba39',
	secret: 'c4ebb2e8670ae7ae1c946da83a927463a64d02ad037d3296364464198e1bf80a'
};

const testEndpoint = '/rig/14'

describe('MiningRigRentals', () => {
	describe('Build an API axios instance', () => {
		it('should generate a nonce that increases with each call', () => {
			let mrr = new MiningRigRentals(apiSettings);
			let nonce = mrr.generateNonce();
			let nonce2 = mrr.generateNonce();
			expect(nonce2 > nonce).toBeTruthy();
		});
		it('should successfully build the HMAC signature', () => {
			let mrr = new MiningRigRentals(apiSettings);
			//ToDo: test x-api-sign
			console.log(mrr.createHMACSignature(testEndpoint));
		});
		it('should build an axios instance with all the required mrr fields', () => {
			let mrr = new MiningRigRentals(apiSettings);
			let api = mrr.initAPI(testEndpoint);
			let headers = api.defaults.headers;
			expect(headers['x-api-key']).toEqual(apiSettings.key);
			expect(mrr.prevNonce === headers['x-api-nonce']).toBeTruthy();
			//@ToDO: test x-api-sign
		});
	})
});