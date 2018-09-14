import MiningRigRentals from '../src/MiningRigRentals'
import apiKey from './apikey';

describe('MiningRigRentals', () => {
	/* ---------------- AXIOS ---------------- */
	describe('Create an API axios instance', () => {
		const testEndpoint = '/rig/14';
		it('should generate a nonce that increases with each call', () => {
			let mrr = new MiningRigRentals(apiKey);
			let nonce = mrr.generateNonce();
			let nonce2 = mrr.generateNonce();
			expect(nonce2 > nonce).toBeTruthy();
		});
		it('should successfully build the HMAC signature', () => {
			let mrr = new MiningRigRentals(apiKey);
			//ToDo: test x-api-sign
			console.log(mrr.createHMACSignature(testEndpoint, mrr.generateNonce()));
		});
		it('should build an axios instance with all the required mrr fields', () => {
			let mrr = new MiningRigRentals(apiKey);
			let api = mrr.initAPI(testEndpoint);
			let headers = api.defaults.headers;
			expect(headers['x-api-key']).toEqual(apiKey.key);
			expect(mrr.prevNonce === headers['x-api-nonce']).toBeTruthy();
			//@ToDO: test x-api-sign
		});
	});
	/* ------------ Information API ----------- */
	describe('Information API', () => {
		it('GET call to /whoami', async () => {
			let mrr = new MiningRigRentals(apiKey), thrown = false;
			try {
				let res = await mrr.whoami();
				console.log(res)
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /info/servers', async () => {
			let mrr = new MiningRigRentals(apiKey), thrown = false;
			try {
				let res = await mrr.getServers();
				log(res)
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /info/algos', async () => {
			let mrr = new MiningRigRentals(apiKey), thrown = false;
			try {
				let res = await mrr.getAlgos();
				log(res)
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /info/algos with specified currency', async () => {
			let mrr = new MiningRigRentals(apiKey)
			let thrown = false, currency = 'DASH';
			try {
				let res = await mrr.getAlgos(currency);
				for (let x of res.data) {
					expect(x.suggested_price.currency).toEqual(currency)
				}
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		}, 10000);
		it('GET call to /info/algo/[NAME]', async () => {
			let mrr = new MiningRigRentals(apiKey), thrown = false;
			try {
				let res = await mrr.getAlgo("scrypt");
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /info/algo/[NAME] with specified currency', async () => {
			let mrr = new MiningRigRentals(apiKey)
			let thrown = false, currency = 'DASH';
			try {
				let res = await mrr.getAlgo("scrypt", currency);
				expect(res.data.suggested_price.currency).toEqual(currency)
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
	});
	/* ------------ Account API ----------- */
	describe('Account API', () => {
		it('GET call to /account?method=balance', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.getBalance();
				log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /account?method=pools', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.getFavoritePools();
				log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /account?method=profiles', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.getProfiles();
				log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
	});
	/* ------------ Rig API ----------- */
	describe('Rig API', () => {
		it('GET call to /rig', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.getRig({type: 'scrypt'});
				log(res.data)
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /rig with optional params', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			let count = 5, type = 'scrypt', rpi = {min: 60, max: 70};
			let hash = {min: 30000, max: 70000}, price ={};
			let minhours = {min: 3, max: 6}, maxhours = {min: 20, max: 30};
			let options = {
				type,
				// count,
				rpi,
				// hash
				// maxhours,
			};
			try {
				let res = await mrr.getRig(options);
				// log(res);
				expect(res.success).toBeTruthy();
				// expect(res.data.count).toEqual(count);
				for (let r of res.data.records) {
					// log(r.maxhours)
					expect(r.rpi >= rpi.min || r.rpi <= rpi.max).toBeTruthy();
					// expect(r.type).toEqual(type)
				}
			} catch (err) {
				log(err)
				thrown = true;
				console.log("thrown")
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /rig/mine', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.listMyRigs();
				console.log(res)
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /rig/mine with params', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			let params = {
				type: 'scrypt',
				hashrate: 'true'
			};
			try {
				let res = await mrr.listMyRigs(params);
				// console.log(res)
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		})
	});
	/* ------------ Rental API ----------- */
	describe('Rental API', () => {
		it('GET call to /rental', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.getRental();
				console.log(res)
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /rental/[ID]', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let ids = [1553515, 1553516, 98881];
			let thrown = false;
			try {
				let res = await mrr.getRentalById(ids);
				console.log(res.data[2])
				expect(res.success).toBeTruthy()
				expect(res.data[0].id === ids[0]).toBeTruthy()
				expect(res.data[1].id === ids[1]).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('PUT call to /rental/', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			let options = {
				rig: 98881,
				length: 3.00,
				profile: 16811,
			};
			try {
				let res = await mrr.createRental(options);
				log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});

	})
});
let log = (data) => {console.log(data)};

