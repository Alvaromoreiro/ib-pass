const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

if (process.env.CI) {
  console.log("⏭️  CI detected, skipping Husky setup");
  process.exit(0);
}

const rootDir = path.join(__dirname, "..", "..");
const huskyDir = path.join(rootDir, ".husky");
const hookPath = path.join(huskyDir, "pre-commit");

if (!fs.existsSync(huskyDir)) {
  fs.mkdirSync(huskyDir);
}

try {
  execSync("npx husky install", { stdio: "inherit" });
  console.log("✅ Husky installed");
} catch (error) {
  console.error("❌ Error installing Husky:", error.message || error);
  process.exit(1);
}

const content = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run precommit
`;

try {
  fs.writeFileSync(hookPath, content, { flag: "wx", mode: 0o755 });
  console.log("✅ pre-commit hook was created");
} catch (err) {
  if (err.code === "EEXIST") {
    console.log("ℹ️ pre-commit hook already exists, skipping creation");
  } else {
    throw err;
  }
}
