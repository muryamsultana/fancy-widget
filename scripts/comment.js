// .github/scripts/comment.js

const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const pr = process.env.PR_NUMBER;

const body = `
🚀 **PR Preview Agent**

---

🌐 Preview:
${process.env.PREVIEW_URL}

---

🤖 AI Review:
${process.env.AI_REPORT}

---

🔐 Security Scan:
${process.env.SECURITY_REPORT}

---

✔ System completed analysis
`;

await octokit.issues.createComment({
  owner: process.env.GITHUB_REPOSITORY.split("/")[0],
  repo: process.env.GITHUB_REPOSITORY.split("/")[1],
  issue_number: pr,
  body
});
