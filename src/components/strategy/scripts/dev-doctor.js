// ---- scripts/dev-doctor.js ----
const { execSync } = require("child_process");
const fs = require("fs");

function run(cmd) {
  try { return execSync(cmd, { stdio: "pipe" }).toString().trim(); }
  catch (e) { return ""; }
}

const nodeV = run("node -v");
const pmLock = {
  pnpm: fs.existsSync("pnpm-lock.yaml"),
  npm: fs.existsSync("package-lock.json"),
  yarn: fs.existsSync("yarn.lock"),
};
const nextBin = fs.existsSync("node_modules/.bin/next");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

console.log("Node:", nodeV || "not found");
console.log("Package manager lockfiles:", pmLock);
console.log("packageManager field:", pkg.packageManager || "(missing)");
console.log("Next binary exists:", nextBin);
console.log("Scripts:", Object.keys(pkg.scripts || {}));

let ok = true;
if (!nodeV) { console.log("❌ Node not installed"); ok = false; }
if (!pkg.packageManager?.startsWith("pnpm")) { console.log("❌ packageManager not set to pnpm"); ok = false; }
if (pmLock.npm || pmLock.yarn) { console.log("❌ Remove other lockfiles (package-lock.json / yarn.lock)"); ok = false; }
if (!nextBin) { console.log("❌ Missing node_modules/.bin/next — run: pnpm install"); ok = false; }

process.exit(ok ? 0 : 1);
