var mongoose = require('mongoose');

var userSchema = new mongoose.Schema( {
	username: String,
	password: String
}),
user = mongoose.model('user', userSchema);

module.exports = user;

block =
{
	"timestamp":1650385117551,
	"lastHash":"000bf97873892eaa5679dd34d3c709023a752786a5ca11eb10dead0d866ced22",
	"hash":"0002ac836fd8ad02fbc10e3f62f2b39f693b2df93024c99ce611539befb76629",
	"data":[
		{
			"id":"5e318450-bffc-11ec-804e-97ac5e87d007", 
			"outputMap":
		{
			"04ebb35b9b775c8bd3295b5656670b12702bea0a3da6016a22465601ffb1b1e0eb89201d4a15d3ac4480a19750ce7b6e6eab8fd1efe1e27fb96610c4b3f62996b0":10,
			"0410987970f125aa1d8adc9b78d29f3ab985b13003abdc8c0003ca8d9091307898b7d98513033fb6175824930cedf7983fcc274a26df216036af520a669561adad":1470
		},
		"input":{
			"timestamp":1650385117461,
			"amount":1480,
			"address":"0410987970f125aa1d8adc9b78d29f3ab985b13003abdc8c0003ca8d9091307898b7d98513033fb6175824930cedf7983fcc274a26df216036af520a669561adad",
			"signature":
			{
				"r":"53785fec154db5883ef464ecc681b938fe695158742057c74423d419299dd239",
				"s":"ddd905658f8a9ea383b37a139d6b7c9b1964f5530d4c34537062cd39661d73d4",
				"recoveryParam":1
			}
		}
	}
	,
	{
		"id":"5e31ab60-bffc-11ec-804e-97ac5e87d007",
		"outputMap":{"044e4e2d39e8477ee7702587dc58955ceff7fba5847c7fe750ecb0cf7d0977a28ce58dee8c97707ed91b0af7f6f50e2b88ad657280a5b00041351d646ec28a94c4":15,
		"04ebb35b9b775c8bd3295b5656670b12702bea0a3da6016a22465601ffb1b1e0eb89201d4a15d3ac4480a19750ce7b6e6eab8fd1efe1e27fb96610c4b3f62996b0":955},
		"input":
		{
			"timestamp":1650385117462,
			"amount":970,
			"address":"04ebb35b9b775c8bd3295b5656670b12702bea0a3da6016a22465601ffb1b1e0eb89201d4a15d3ac4480a19750ce7b6e6eab8fd1efe1e27fb96610c4b3f62996b0",
			"signature":
			{
				"r":"ae186ea21ba570493a88821b37cd5330315214ad3af75d781f569923208c5f0d",
				"s":"1b2cb7bad47cff9ed46582013ccb4767a7a700a888cf22cc395ccb5545fff557",
				"recoveryParam":1
			}
		}
	},
	{
		"id":"5e322090-bffc-11ec-804e-97ac5e87d007",
		"outputMap":
		{
			"0410987970f125aa1d8adc9b78d29f3ab985b13003abdc8c0003ca8d9091307898b7d98513033fb6175824930cedf7983fcc274a26df216036af520a669561adad":50}, 
			"input":
			{
				"address":"*authorized-reward*"
			}
				
	}],
	"nonce":3028,
	"difficulty":11
}
// block = [
// 	Block = {
// 	  timestamp: 1,
// 	  lastHash: '----',
// 	  hash: 'hash-1',
// 	  data: [],
// 	  nonce: 0,
// 	  difficulty: 3
// 	},
// 	Block = {
// 	  timestamp: 1650607234591,
// 	  lastHash: 'hash-1',
// 	  hash: '0727ac8191ae05bdcb0de88fd8fbbc1b2042bbc36a467ba2df4b0db153d4f0d7',
// 	  data: [ [Transaction], [Transaction], [Transaction] ],
// 	  nonce: 13,
// 	  difficulty: 2
// 	},
// 	Block = {
// 	  timestamp: 1650607234608,
// 	  lastHash: '0727ac8191ae05bdcb0de88fd8fbbc1b2042bbc36a467ba2df4b0db153d4f0d7',
// 	  hash: '0be6f991a19d200db4ba34c5ab8166795567c96d46743ac3dfdcda0a3cd02586',
// 	  data: [ [Transaction], [Transaction], [Transaction] ],
// 	  nonce: 10,
// 	  difficulty: 3
// 	},
// 	Block = {
// 	  timestamp: 1650607234629,
// 	  lastHash: '0be6f991a19d200db4ba34c5ab8166795567c96d46743ac3dfdcda0a3cd02586',
// 	  hash: '08ec44f268e592cbaf03cfd236843d785430498e9e6a1368b3abc51d9d1c8834',
// 	  data: [ [Transaction], [Transaction], [Transaction] ],
// 	  nonce: 12,
// 	  difficulty: 4
// 	},
// 	Block {
// 	  timestamp: 1650607234651,
// 	  lastHash: '08ec44f268e592cbaf03cfd236843d785430498e9e6a1368b3abc51d9d1c8834',
// 	  hash: '04f68b5bcafac9c331f67b74715aabdd05e888ffac1e7be172709bb73f286ace',
// 	  data: [ [Transaction], [Transaction], [Transaction] ],
// 	  nonce: 35,
// 	  difficulty: 5
// 	},
// 	Block {
// 	  timestamp: 1650607234669,
// 	  lastHash: '04f68b5bcafac9c331f67b74715aabdd05e888ffac1e7be172709bb73f286ace',
// 	  hash: '024c1cd30fa06650efde49f697d1a590e17ee4b1655d0303353f5d904655f3d0',
// 	  data: [ [Transaction], [Transaction], [Transaction] ],
// 	  nonce: 16,
// 	  difficulty: 6
// 	},
// 	Block {
// 	  timestamp: 1650607234689,
// 	  lastHash: '024c1cd30fa06650efde49f697d1a590e17ee4b1655d0303353f5d904655f3d0',
// 	  hash: '00d8b49a507e0b08a4066bd4260a0827dcfe501bfe8f10fc570eb776ddb18b1d',
// 	  data: [ [Transaction], [Transaction], [Transaction] ],
// 	  nonce: 320,
// 	  difficulty: 7
// 	},
// 	Block {
// 	  timestamp: 1650607234708,
// 	  lastHash: '00d8b49a507e0b08a4066bd4260a0827dcfe501bfe8f10fc570eb776ddb18b1d',
// 	  hash: '00bde46f6f3fe531a6b859d6747aca68e3555f3e71384d74c8f48aef41a9ded5',
// 	  data: [ [Transaction], [Transaction], [Transaction] ],
// 	  nonce: 398,
// 	  difficulty: 8
// 	},
// 	Block {
// 	  timestamp: 1650607234725,
// 	  lastHash: '00bde46f6f3fe531a6b859d6747aca68e3555f3e71384d74c8f48aef41a9ded5',
// 	  hash: '0013a5bf89fa4b5fd4f9dac0925d6b451fc152f6ced357d6c8ec86914869052d',
// 	  data: [ [Transaction], [Transaction], [Transaction] ],
// 	  nonce: 250,
// 	  difficulty: 9
// 	},
// 	Block {
// 	  timestamp: 1650607234770,
// 	  lastHash: '0013a5bf89fa4b5fd4f9dac0925d6b451fc152f6ced357d6c8ec86914869052d',
// 	  hash: '002605d2b7b67efdb729c7dc58420c2c125b671f91440632e7c1a8f2f2cccb4d',
// 	  data: [ [Transaction], [Transaction], [Transaction] ],
// 	  nonce: 1405,
// 	  difficulty: 10
// 	},
// 	Block {
// 	  timestamp: 1650607234835,
// 	  lastHash: '002605d2b7b67efdb729c7dc58420c2c125b671f91440632e7c1a8f2f2cccb4d',
// 	  hash: '00086016baa4060a1d78adc49428a81b6e3ba3cad801364bf7e758147f4961d9',
// 	  data: [ [Transaction], [Transaction], [Transaction] ],
// 	  nonce: 1981,
// 	  difficulty: 11
// 	},
// 	Block {
// 	  timestamp: 1650607248476,
// 	  lastHash: '00086016baa4060a1d78adc49428a81b6e3ba3cad801364bf7e758147f4961d9',
// 	  hash: '0028997506ef6b1708172af4a7fe45fdffeb748dd6e88bb3e99ebe7145868712',
// 	  data: [ [Transaction], [Transaction] ],
// 	  nonce: 141,
// 	  difficulty: 10
// 	}
//   ]
Transaction =
{
	id: 'f41973a0-c200-11ec-9714-4b82a8619557',
	outputMap: {
	  '046b082c3f4440da5bb22bd541347bfc3c588e099eb1d67361675dcfd893e1d78e103cdebd76a090dce1820c06a0beb736d49295e42cac0f0dcc934e287350ef31': 12,
	  '04e7bedd4520d9d40b6c6303daec20a64319e7ad8483407499bd61d3b6bde9a6cc50a94f81c4c9843472a8063dbc8bd8f7845d4cdf6bb0bd182530b31af6745d49': 1468
	},
	input: {
	  timestamp: 1650606989274,
	  amount: 1480,
	  address: '04e7bedd4520d9d40b6c6303daec20a64319e7ad8483407499bd61d3b6bde9a6cc50a94f81c4c9843472a8063dbc8bd8f7845d4cdf6bb0bd182530b31af6745d49',
	  signature: { 
		  "r":"2e7b5f4b97ad16a67dd99b23a12ebf9e907e596fd35cab5cb0bdb122eddc6a5e",
		  "s":"c0b65f10fe12ca17a39b6af86b3fd936d35c1c93832e57463994498ebd07057c",
		  "recoveryParam":1
		}
	}
  }
  Transaction =
  {
	  id: 'f41973a0-c200-11ec-9714-4b82a8619557',
	  outputMap: {
		'046b082c3f4440da5bb22bd541347bfc3c588e099eb1d67361675dcfd893e1d78e103cdebd76a090dce1820c06a0beb736d49295e42cac0f0dcc934e287350ef31': 12,
		'04e7bedd4520d9d40b6c6303daec20a64319e7ad8483407499bd61d3b6bde9a6cc50a94f81c4c9843472a8063dbc8bd8f7845d4cdf6bb0bd182530b31af6745d49': 1468
	  },
	  input: {
		timestamp: 1650606989274,
		amount: 1480,
		address: '04e7bedd4520d9d40b6c6303daec20a64319e7ad8483407499bd61d3b6bde9a6cc50a94f81c4c9843472a8063dbc8bd8f7845d4cdf6bb0bd182530b31af6745d49',
		signature: { 
			"r":"2e7b5f4b97ad16a67dd99b23a12ebf9e907e596fd35cab5cb0bdb122eddc6a5e",
			"s":"c0b65f10fe12ca17a39b6af86b3fd936d35c1c93832e57463994498ebd07057c",
			"recoveryParam":1
		  }
	  }
	}
  

