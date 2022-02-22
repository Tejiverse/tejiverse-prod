const ethers = require('ethers');

const signer = new ethers.Wallet(process.env.PRIVATE_KEY);

const sign = async(addr, amount) => {
	const message = ethers.utils.solidityKeccak256(
		["address", "address", "uint256"],
		[process.env.TEJIVERSE, addr, amount]
	);

	return await signer.signMessage(ethers.utils.arrayify(message));
}

const whitelist = require("./whitelist.json");

exports.handler = async function(event, context) {
    try {
      let { addr, amount } = event.queryStringParameters || {};
      if (!addr || !amount) {
        return { statusCode: 400, body: "Missing query parameters" };
      }

      try {
        addr = ethers.utils.getAddress(addr);
      }
      catch {
        return { statusCode: 400, body: "Invalid address" };
      }

      amount = parseInt(amount);
    
      if (!whitelist.includes(addr)) {
        return { statusCode: 400, body: "Not in whitelist" };
      }
      else if (amount != 1) {
        return { statusCode: 400, body: "Invalid amount" };
      }

      const signature = await sign(addr, amount);
    
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: signature
      }
    } 
    catch (err) {
      console.log("invocation error:", err); // output to netlify function log
      return {
        statusCode: 500,
        body: err.message
      };
    }
  };

