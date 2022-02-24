const ethers = require('ethers');

const signer = new ethers.Wallet(process.env.PRIVATE_KEY);

const sign = async(addr) => {
	const message = ethers.utils.solidityKeccak256(
		["address", "address"],
		[process.env.TEJIVERSE, addr]
	);

	return await signer.signMessage(ethers.utils.arrayify(message));
}

const whitelist = require("./whitelist.json");

exports.handler = async function(event, context) {
    try {
      let { addr } = event.queryStringParameters || {};
      if (!addr) {
        return { statusCode: 400, body: "Missing query parameters" };
      }

      try {
        addr = ethers.utils.getAddress(addr);
      }
      catch {
        return { statusCode: 400, body: "Invalid address" };
      }
    
      if (!whitelist.includes(addr)) {
        return { statusCode: 400, body: "Not in whitelist" };
      }

      const signature = await sign(addr);
    
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

