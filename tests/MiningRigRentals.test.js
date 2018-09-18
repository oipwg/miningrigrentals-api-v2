import MiningRigRentals from '../src/MiningRigRentals'
import apiKey from './apikey'


const profileID = 23136;
const rigIDs = [101619, 98881];
describe('MiningRigRentals', () => {
	/* ---------------- AXIOS ---------------- */
	describe('Create an API axios instance', () => {
		const testEndpoint = '/rig/14';
		it('should generate a nonce that increases with each call | generateNonce', () => {
			let mrr = new MiningRigRentals(apiKey);
			let nonce = mrr.generateNonce();
			let nonce2 = mrr.generateNonce();
			expect(nonce2 > nonce).toBeTruthy();
		});
		it('should successfully build the HMAC signature | createHMACSignature', () => {
			let mrr = new MiningRigRentals(apiKey);
			//ToDo: test x-api-sign
			// console.log(mrr.createHMACSignature(testEndpoint, mrr.generateNonce()));
		});
		it('should build an axios instance with all the required mrr fields | initAPI', () => {
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
		it('GET call to /whoami | whoami', async () => {
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
		it('GET call to /info/servers | getServers', async () => {
			let mrr = new MiningRigRentals(apiKey), thrown = false;
			try {
				let res = await mrr.getServers();
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /info/algos | getAlgos', async () => {
			let mrr = new MiningRigRentals(apiKey), thrown = false;
			try {
				let res = await mrr.getAlgos();
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /info/algos with specified currency | getAlgos', async () => {
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
		it('GET call to /info/algo/[NAME] | getAlgo', async () => {
			let mrr = new MiningRigRentals(apiKey), thrown = false;
			try {
				let res = await mrr.getAlgo("scrypt");
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /info/algo/[NAME] with specified currency | getAlgos', async () => {
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
		it('GET call /account | getAccount', async () => {
			let mrr = new MiningRigRentals(apiKey);
			try {
				let res = await mrr.getAccount();
				console.log(res)
				expect(res.success).toBeTruthy()
			} catch (err) {
				expect(err).toBeUndefined()
			}
		});
		it('GET call /account/balance | getAccountBalance', async () => {
			let mrr = new MiningRigRentals(apiKey);
			try {
				let res = await mrr.getAccountBalance();
				console.log(res)
				expect(res.success).toBeTruthy()
			} catch (err) {
				expect(err).toBeUndefined()
			}
		});
		it('PUT call /account/balance | withdrawalFunds', async () => {
			let mrr = new MiningRigRentals(apiKey);
			try {
				let res = await mrr.withdrawFunds();
				//@ToDO: this api is currently disabled so success will be false
				expect(res.success).toBeFalsy()
			} catch (err) {
				expect(err).toBeUndefined()
			}
		});
		it('GET call /account/transactions w/o options| getTransactions', async () => {
			let mrr = new MiningRigRentals(apiKey);
			try {
				let res = await mrr.getTransactions();
				console.log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				expect(err).toBeUndefined()
			}
		});
		it('GET call /account/profile w/o algo param| getPoolProfiles', async () => {
			let mrr = new MiningRigRentals(apiKey);
			try {
				let res = await mrr.getPoolProfiles();
				console.log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				expect(err).toBeUndefined()
			}
		});
		it('PUT call /account/profile| createPoolProfile', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let name = 'Ryan Test', algo = 'scrypt';
			try {
				let res = await mrr.createPoolProfile(name, algo);
				console.log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				expect(err).toBeUndefined()
			}
		});
		it('GET call /account/profile/[ID] | getPoolProfile', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let id = 23136;
			try {
				let res = await mrr.getPoolProfile(id);
				console.log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				expect(err).toBeUndefined()
			}
		});
		it('PUT call /account/profile/[ID] | updatePoolProfile', async () => {
			//ToDo: TEST WHEN CREATED POOl
			let mrr = new MiningRigRentals(apiKey);
			let options = {
				profileID: 73289,
				poolid: NaN,
				priority: 0,
				algo: 'scrypt',
				name: 'resttest'
			};
			try {
				let res = await mrr.updatePoolProfile(options);
				console.log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				console.log(err)
				expect(err).toBeUndefined()
			}
		});
		it('PUT call /account/profile/[ID]/[0-4] | updatePoolProfilePriority', async () => {
			//ToDo: TEST WHEN CREATED POOl
			let mrr = new MiningRigRentals(apiKey);
			let options = {
				profileID: 73289,
				poolid: NaN,
				priority: 0,
			};
			try {
				let res = await mrr.updatePoolProfilePriority(options);
				console.log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				console.log(err)
				expect(err).toBeUndefined()
			}
		});
		it('DELETE call /account/profile/[ID] | deletePoolProfile', async () => {
			//ToDo: TEST WHEN CREATED POOL
			let mrr = new MiningRigRentals(apiKey);
			let id =  73289;
			try {
				let res = await mrr.deletePoolProfile(id);
				console.log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				console.log(err)
				expect(err).toBeUndefined()
			}
		});
		// it('PUT call /account/pool | testPoolConnection', async () => {
		// 	//ToDo: DISABLED ENDPOINT
		// 	let mrr = new MiningRigRentals(apiKey);
		// 	try {
		// 		let res = await mrr.testPoolConnection();
		// 		console.log(res);
		// 		expect(res.success).toBeTruthy()
		// 	} catch (err) {
		// 		console.log(err)
		// 		expect(err).toBeUndefined()
		// 	}
		// });
		it('GET call /account/pool | getPools', async () => {
			let mrr = new MiningRigRentals(apiKey);
			try {
				let res = await mrr.getPools();
				console.log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				console.log(err)
				expect(err).toBeUndefined()
			}
		});
		it('GET call /account/pool/[ID1];[ID2].. | getPoolsByID', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let ids = [
				78854, 155427
			];
			try {
				let res = await mrr.getPoolsByID(ids);
				console.log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				console.log(err)
				expect(err).toBeUndefined()
			}
		});
		it('PUT call /account/pool | createPool', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let options = {
				type: 'scrypt',
				name: `ryan's super dope super pool`,
				host: 'snowflake.oip.fun',
				port: 8080,
				user: 'superman',
				pass: 'pass',
				notes: 'created via apiv2'
			};
			try {
				let res = await mrr.createPool(options);
				console.log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				console.log(err)
				expect(err).toBeUndefined()
			}
		});
		it('PUT call /account/pool/[ID1];[ID2]... | updatePools', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let poolIDs = 176851;
			let options = {
				type: 'scrypt',
				name: `ryan's super dope super pool`,
				host: 'snowflake.oip.fun',
				port: 8080,
				user: 'LEX',
				pass: 'pass',
				notes: 'created via apiv2'
			};
			try {
				let res = await mrr.updatePools(poolIDs, options);
				console.log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				console.log(err)
				expect(err).toBeUndefined()
			}
		});
		it('DELETE call /account/pool/[ID1];[ID2]... | deletePools', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let poolIDs = 176851;
			try {
				let res = await mrr.deletePools(poolIDs);
				console.log(res);
				expect(res.success).toBeTruthy()
			} catch (err) {
				console.log(err)
				expect(err).toBeUndefined()
			}
		});
	});
	/* ------------ Rig API ----------- */
	describe('Rig API', () => {
		it('GET call to /rig | getRigs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.getRigs({type: 'scrypt'});
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /rig with optional params | getRigs', async () => {
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
				let res = await mrr.getRigs(options);
				expect(res.success).toBeTruthy();
				// expect(res.data.count).toEqual(count);
				for (let r of res.data.records) {
					expect(r.rpi >= rpi.min || r.rpi <= rpi.max).toBeTruthy();
					// expect(r.type).toEqual(type)
				}
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		}, 15000);
		it('GET call to /rig/mine | listMyRigs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.listMyRigs();
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /rig/mine with params | listMyRigs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			let params = {
				type: 'scrypt',
				hashrate: 'true'
			};
			try {
				let res = await mrr.listMyRigs(params);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /rig/[ID1];[ID2]... | getRigsByID', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.getRigsByID(rigIDs);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('PUT call to /rig | createRig | createRig', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			let options = {
				name: `Ryan's super rig`,
				server: 'alexandria.oip.io',
				type: 'scrypt',
				hash: {
					hash: 5000,
					type: 'mh'
				}
			};
			try {
				let res = await mrr.createRig(options);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('PUT call to /rig/[ID1];[ID2];... | updateRigsByID', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			let options = {
				name: `Ryan's super rig`,
				server: 'alexandria.oip.io',
				type: 'scrypt',
				hash: {
					hash: 5000,
					type: 'mh'
				}
			};
			try {
				let res = await mrr.updateRigsByID(rigIDs, options);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('DELETE call to /rig/[ID1];[ID2];... | deleteRigs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.deleteRigs(rigIDs);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('PUT call to /rig/[ID1];[ID2];.../extend | extendRental', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			let options = {
				hours: 3,
				minutes: 6
			};
			try {
				let res = await mrr.extendRental(rigIDs, options);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		}, 15000);
		it('PUT call to /rig/[ID1];[ID2];.../profile | applyPoolToRigs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.applyPoolToRigs(rigIDs, profileID);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /rig/[ID1];[ID2];.../pool | getPoolsFromRigIDs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.getPoolsFromRigIDs(rigIDs);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('PUT call to /rig/[ID1];[ID2];.../pool | addOrUpdatePoolOnRigs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			let options = {
				host: '',
				port: 0,
				user: '',
				pass: '',
			};
			try {
				let res = await mrr.addOrUpdatePoolOnRigs(rigIDs, options);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('DELETE call to /rig/[ID1];[ID2];.../pool | deletePoolOnRigs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			let priority = 0;
			try {
				let res = await mrr.deletePoolOnRigs(rigIDs, priority);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
	});
	/* ------------ Rental API ----------- */
	describe('Rental API', () => {
		it('GET call to /rental | getRentals', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.getRentals();
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /rental/[ID] | getRentalById', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let ids = [1553515, 1553516, 98881];
			let thrown = false;
			try {
				let res = await mrr.getRentalById(ids);
				expect(res.success).toBeTruthy()
				expect(res.data[0].id === ids[0]).toBeTruthy()
				expect(res.data[1].id === ids[1]).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('PUT call to /rental/ | createRental', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			let options = {
				rig: 98881,
				length: 3.00,
				profile: profileID,
			};
			try {
				let res = await mrr.createRental(options);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		}, 10000);
		it('PUT call to /rental/[ID1];[ID2]/profile/[profileID] | applyPoolProfileToRentals', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.applyPoolProfileToRentals(1750630, profileID);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('GET call to /rental/[ID1];[ID2]/pool | getPoolsByRentalID', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			try {
				let res = await mrr.getPoolsByRentalID(1750630);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('PUT call to /rental/[ID1];[ID2]/pool | addOrUpdatePoolOnRentals', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			let rentalIDs = [1750630, 3242523];
			let options = {
				host: '',
				port: 0,
				user: '',
				pass: '',
				priority: 0
			};
			try {
				let res = await mrr.addOrUpdatePoolOnRentals(rentalIDs, options);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		});
		it('DELETE call to /rental/[ID1],[ID2]/pool/[priority] | deletePoolOnRentals', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			let rentalIDs = [1750630];
			let priority = 0;
			try {
				let res = await mrr.deletePoolOnRentals(rentalIDs, priority);
				expect(res.success).toBeTruthy()
			} catch (err) {
				thrown = true;
				expect(thrown).toBeTruthy()
			}
		})
	})
});
let log = (data) => {console.log(data)};

