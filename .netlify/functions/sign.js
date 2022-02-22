// import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";

// const signer = new ethers.Wallet(process.env.PRIVATE_KEY);

const sign = async(addr, amount) => {
  return `${addr} wants to mint ${amount}`
	// const message = ethers.utils.solidityKeccak256(
	// 	["address", "address", "uint256"],
	// 	[process.env.TEJIVERSE, addr, amount]
	// );

	// return await signer.signMessage(ethers.utils.arrayify(message));
}

exports.handler = async function(event, context) {
    try {
      const { addr, amount } = event.queryStringParameters || {};
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
    
      if (amount < 1 || amount > 3) {
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
        body: err.message // Could be a custom message or object i.e. JSON.stringify(err)
      };
    }
  };

