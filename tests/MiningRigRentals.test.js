import MiningRigRentals from '../src/MiningRigRentals'
import uid from 'uid'
import { config } from 'dotenv'
config()

const apiKey = {
	key: process.env.API_KEY,
	secret: process.env.API_SECRET
};

const testPoolID = 178298
const testProfileID = 74047
const tradebotPoolID = 53370
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
		it.skip('should successfully build the HMAC signature | createHMACSignature', () => {
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
			let mrr = new MiningRigRentals(apiKey)
			let res = await mrr.whoami()
			expect(res.success).toBeTruthy()

		});
		it('GET call to /info/servers | getServers', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let res = await mrr.getServers();
			expect(res.success).toBeTruthy()

		});
		it('GET call to /info/algos | getAlgos', async () => {
			let mrr = new MiningRigRentals(apiKey)
			let res = await mrr.getAlgos();
			expect(res.success).toBeTruthy()

		});
		it('GET call to /info/algos with specified currency | getAlgos', async () => {
			let mrr = new MiningRigRentals(apiKey)
			let currency = 'DASH';
			let res = await mrr.getAlgos(currency);
			for (let x of res.data) {
				expect(x.suggested_price.currency).toEqual(currency)
			}
		}, 10000);
		it('GET call to /info/algo/[NAME] | getAlgo', async () => {
			let mrr = new MiningRigRentals(apiKey)
			let res = await mrr.getAlgo("scrypt");
			expect(res.success).toBeTruthy()
		});
		it('GET call to /info/algo/[NAME] with specified currency | getAlgos', async () => {
			let mrr = new MiningRigRentals(apiKey)
			let currency = 'DASH';
			let res = await mrr.getAlgo("scrypt", currency);
			expect(res.data.suggested_price.currency).toEqual(currency)
		});
	});
	/* ------------ Account API ----------- */
	describe('Account API', () => {
		it('GET call /account | getAccount', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let res = await mrr.getAccount();
			expect(res.success).toBeTruthy()
		});
		it('GET call /account/balance | getAccountBalance', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let res = await mrr.getAccountBalance();
			expect(res.success).toBeTruthy()
		});
		// it('PUT call /account/balance | withdrawalFunds', async () => {
		// 	let mrr = new MiningRigRentals(apiKey);
		// 	try {
		// 		let res = await mrr.withdrawFunds();
		// 		//@ToDO: this api is currently disabled so success will be false
		// 		expect(res.success).toBeFalsy()
		// 	} catch (err) {
		// 		expect(err).toBeUndefined()
		// 	}
		// });
		it('GET call /account/transactions w/o options| getTransactions', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let res = await mrr.getTransactions();
			expect(res.success).toBeTruthy()
		});
		it('GET call /account/profile w/o algo param| getPoolProfiles', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let res = await mrr.getPoolProfiles();
			expect(res.success).toBeTruthy()
		});
		it('PUT call /account/profile| createPoolProfile', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let name = 'SuperRyan', algo = 'scrypt';
			let res = await mrr.createPoolProfile(name, algo);
			expect(res.success).toBeTruthy()
		});
		it('GET call /account/profile/[ID] | getPoolProfile', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let id = profileID;
			let res = await mrr.getPoolProfile(id);
			expect(res.success).toBeTruthy()
		});
		it('PUT call /account/profile/[ID] | addPoolToProfile', async () => {
			//ToDo: Name doesn't seem to update
			let mrr = new MiningRigRentals(apiKey);
			let options = {
				profileID: testProfileID,
				poolid: testPoolID,
				priority: 1,
				algo: 'scrypt',
				name: 'resttest'
			};
			let res = await mrr.addPoolToProfile(options);
			expect(res.success).toBeTruthy()
		});
		it('PUT call /account/profile/[ID]| updatePoolOnProfile', async () => {
			//ToDo: Name doesn't seem to update
			let mrr = new MiningRigRentals(apiKey);
			let options = {
				profileID: testProfileID,
				poolid: tradebotPoolID,
				priority: 0,
				name: 'ryan'
			};
			let res = await mrr.updatePoolOnProfile(options);
			expect(res.success).toBeTruthy()
		});
		it('DELETE call /account/profile/[ID] | deletePoolProfile', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let id =  73293;
			let res = await mrr.deletePoolProfile(id);
			expect(res.success).toBeTruthy()
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
			let res = await mrr.getPools();
			expect(res.success).toBeTruthy()
		});
		it('GET call /account/pool/[ID1];[ID2].. | getPoolsByID', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let ids = [155427];
			let res = await mrr.getPoolsByID(ids);
			expect(res.success).toBeTruthy()
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
			let res = await mrr.createPool(options);
			expect(res.success).toBeTruthy()
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
			let res = await mrr.updatePools(poolIDs, options);
			expect(res.success).toBeTruthy()
		});
		it('DELETE call /account/pool/[ID1];[ID2]... | deletePools', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let poolIDs = 176851;
			let res = await mrr.deletePools(poolIDs);
			expect(res.success).toBeTruthy()
		});
	});
	/* ------------ Rig API ----------- */
	describe('Rig API', () => {
		it('GET call to /rig | getRigs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let res = await mrr.getRigs({type: 'scrypt'});
			expect(res.success).toBeTruthy()
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
			let res = await mrr.getRigs(options);
			expect(res.success).toBeTruthy();
			// expect(res.data.count).toEqual(count);
			for (let r of res.data.records) {
				expect(r.rpi >= rpi.min || r.rpi <= rpi.max).toBeTruthy();
				// expect(r.type).toEqual(type)
			}
		}, 15000);
		it('GET call to /rig/mine | listMyRigs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let res = await mrr.listMyRigs();
			expect(res.success).toBeTruthy()
		});
		it('GET call to /rig/mine with params | listMyRigs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let thrown = false;
			let params = {
				type: 'scrypt',
				hashrate: 'true'
			};
			let res = await mrr.listMyRigs(params);
			expect(res.success).toBeTruthy()
		});
		it('GET call to /rig/[ID1];[ID2]... | getRigsByID', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let res = await mrr.getRigsByID(rigIDs);
			expect(res.success).toBeTruthy()
		});
		it('PUT call to /rig | create && delete rig | createRig | deleteRig', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let options = {
				name: uid(),
				server: 'us-west01.miningrigrentals.com',
				type: 'scrypt',
				hash: {
					hash: 5000,
					type: 'mh'
				}
			};
			let res = await mrr.createRig(options);
			expect(res.success).toBeTruthy()

			let id = res.data.id;
			let deleteRig = await mrr.deleteRigs(id);
			expect(deleteRig.success).toBeTruthy()
		});
		it('PUT call to /rig/[ID1];[ID2];... | updateRigsByID', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let options = {
				name: `Ryan's super rig`,
				server: 'us-west01.miningrigrentals.com',
				type: 'scrypt',
				hash: {
					hash: 5000,
					type: 'mh'
				}
			};
			let createRig = await mrr.createRig(options);
			expect(createRig.success).toBeTruthy()
			let id = createRig.data.id;

			let options2 = {...options, name: 'yadayada'}
			let updateRig = await mrr.updateRigsByID(id, options2);
			expect(updateRig.success).toBeTruthy();

			let deleteRig = await mrr.deleteRigs(id);
			expect(deleteRig.success).toBeTruthy()
		});
		it('PUT call to /rig/[ID1];[ID2];.../extend | extendRental', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let options = {
				hours: 3,
				minutes: 6
			};
			let res = await mrr.extendRental(rigIDs, options);
			expect(res.success).toBeTruthy()
		}, 15000);
		it('PUT call to /rig/[ID1];[ID2];.../profile | applyPoolToRigs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let res = await mrr.applyPoolToRigs(rigIDs, profileID);
			expect(res.success).toBeTruthy()
		});
		it('GET call to /rig/[ID1];[ID2];.../pool | getPoolsFromRigIDs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let res = await mrr.getPoolsFromRigs(rigIDs);
			expect(res.success).toBeTruthy()
		});
		it('PUT call to /rig/[ID1];[ID2];.../pool | addPoolToRigs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let options = {
				host: 'api.alexandria.io',
				port: 3032,
				user: 'bitspill.1',
				pass: 'password',
			};
			let res = await mrr.addPoolToRigs(rigIDs, options);
			expect(res.success).toBeTruthy()
		});
		it('DELETE call to /rig/[ID1];[ID2];.../pool | deletePoolOnRigs', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let priority = 0;
			let res = await mrr.deletePoolOnRigs(rigIDs, priority);
			expect(res.success).toBeTruthy()
		});
	});
	/* ------------ Rental API ----------- */
	describe('Rental API', () => {
		it('GET call to /rental | getRentals', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let res = await mrr.getRentals();
			expect(res.success).toBeTruthy()
		});
		it('GET call to /rental/[ID] | getRentalById', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let ids = [1553515, 1553516, 98881];
			let res = await mrr.getRentalById(ids);
			expect(res.success).toBeTruthy()
			expect(res.data[0].id == ids[0]).toBeTruthy()
			expect(res.data[1].id == ids[1]).toBeTruthy()
			expect(res.data[2].id == ids[2]).toBeTruthy()
		});
		it.skip('PUT call to /rental/ | createRental', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let options = {
				rig: 98881,
				length: 3.00,
				profile: profileID,
			};
			let res = await mrr.createRental(options);
			expect(res.success).toBeTruthy()
		}, 10000);
		it('PUT call to /rental/[ID1];[ID2]/profile/[profileID] | applyPoolProfileToRentals', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let res = await mrr.applyPoolProfileToRentals(1750630, profileID);
			expect(res.success).toBeTruthy()
		});
		it('GET call to /rental/[ID1];[ID2]/pool | getPoolsByRentalID', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let res = await mrr.getPoolsByRentalID(1750630);
			expect(res.success).toBeTruthy()
		});
		it('PUT call to /rental/[ID1];[ID2]/pool | addPoolToRentals', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let rentalIDs = [1750630, 3242523];
			let options = {
				host: 'api.alexandria.io',
				port: 3032,
				user: 'bitspill.1',
				pass: 'password',
				priority: 0
			};
			let res = await mrr.addPoolToRentals(rentalIDs, options);
			expect(res.success).toBeTruthy()
		});
		it('DELETE call to /rental/[ID1],[ID2]/pool/[priority] | deletePoolOnRentals', async () => {
			let mrr = new MiningRigRentals(apiKey);
			let rentalIDs = [1750630];
			let priority = 0;
			let res = await mrr.deletePoolOnRentals(rentalIDs, priority);
			expect(res.success).toBeTruthy()
		})
	})
});

