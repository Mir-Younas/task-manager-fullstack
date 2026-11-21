const fs = require("node:fs");
const path = require("node:path");

const { swaggerSpec } = require("../dist/config/swagger");

if (!swaggerSpec.paths || Object.keys(swaggerSpec.paths).length === 0) {
  throw new Error("Swagger has no API paths");
}

fs.writeFileSync(
  path.resolve(__dirname, "../dist/swagger.json"),
  JSON.stringify(swaggerSpec, null, 2),
);

console.log("Swagger JSON generated successfully");
