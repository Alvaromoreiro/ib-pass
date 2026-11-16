import { TargetOptions } from "@angular-builders/custom-webpack";
import fs from "fs";
import path from "path";
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../package.json"), "utf8"),
);

export default (targetOptions: TargetOptions, indexHtml: string) => {
  const indexOfHead = indexHtml.indexOf("</head>");
  //const i = indexHtml.indexOf('</body>');
  const isDevServer = process.env.npm_lifecycle_script.includes("serve");
  let config = `<meta name="version" content="${packageJson.version}">`;
  config += `<meta name="buildNumber" content="${packageJson.buildNumber}">`;
  config += `<script src="env.js"></script>`;
  // local login script
  if (process.env.npm_config_login && isDevServer) {
    config += `<script src="web-iberia-plus-login.js"></script>`;
  }
  return `${indexHtml.slice(0, indexOfHead)}${config}${indexHtml.slice(
    indexOfHead,
  )}`;
};
