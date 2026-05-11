// .github/scripts/security-scan.js

const fs = require("fs");
const diff = require("child_process")
  .execSync("git diff origin/main...HEAD")
  .toString();

let risk = "LOW";
let reasons = [];

const patterns = [
  { re: /eval\(/g, msg: "Unsafe eval usage detected" },
  { re: /DROP TABLE/i, msg: "Possible SQL injection / destructive query" },
  { re: /SELECT .* FROM .* WHERE .*=\s*['"]?\w+['"]?/i, msg: "Possible SQL injection pattern" },
  { re: /password\s*=\s*["'][^"']+["']/i, msg: "Hardcoded credential detected" },
  { re: /api[_-]?key\s*[:=]/i, msg: "API key exposure risk" }
];

for (const p of patterns) {
  if (p.re.test(diff)) {
    risk = "HIGH";
    reasons.push(p.msg);
  }
}

const report = `
🔐 SECURITY SCAN

Risk Level: ${risk}

${reasons.map(r => `- ${r}`).join("\n")}
`;

console.log(report);

fs.appendFileSync(process.env.GITHUB_OUTPUT, `report<<EOF\n${report}\nEOF\n`);
fs.appendFileSync(process.env.GITHUB_OUTPUT, `block=${risk === "HIGH"}\n`);
