var fs = require("fs");
(async () => {
  const res = await fetch(
    "https://app.uniswap.org/explore/pools/base/0xd0b53D9277642d899DF5C87A3966A349A798F224"
  );
  const data = await res.arrayBuffer();
  fs.writeFileSync("orderAddresses.zip", Buffer.from(data));
  console.log("✅ data:", data);
})();
