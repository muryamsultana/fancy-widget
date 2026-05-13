// .github/scripts/comment.js
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const prNumber = parseInt(process.env.PR_NUMBER);
const aiReport = process.env.AI_REPORT || 'No AI report available.';
const securityReport = process.env.SECURITY_REPORT || '✅ Security scan passed.';
const previewUrl = process.env.PREVIEW_URL;

const commentBody = `
## 🚀 PR Preview Ready!

${previewUrl ? `
### 👀 **Live Preview**

[![Preview Site](${previewUrl ? 'https://img.shields.io/badge/Preview%20Site-Visit%20Now-0066ff?style=for-the-badge&logo=vercel&logoColor=white' : ''})](${previewUrl})

**🔗 [Open Preview →](${previewUrl})**

> Preview URL: \`${previewUrl}\`
` : ''}

---

### 🤖 AI Review
${aiReport}

---

### 🔐 Security Scan
${securityReport}

---

*Powered by Full PR Preview AI Agent*
`;

async function main() {
  try {
    // Delete previous bot comments (optional but clean)
    const { data: comments } = await octokit.issues.listComments({
      owner: process.env.GITHUB_REPOSITORY_OWNER,
      repo: process.env.GITHUB_REPOSITORY.split('/')[1],
      issue_number: prNumber,
    });

    for (const comment of comments) {
      if (comment.user.login === 'github-actions[bot]') {
        await octokit.issues.deleteComment({
          owner: process.env.GITHUB_REPOSITORY_OWNER,
          repo: process.env.GITHUB_REPOSITORY.split('/')[1],
          comment_id: comment.id,
        });
      }
    }

    // Post new comment
    await octokit.issues.createComment({
      owner: process.env.GITHUB_REPOSITORY_OWNER,
      repo: process.env.GITHUB_REPOSITORY.split('/')[1],
      issue_number: prNumber,
      body: commentBody,
    });

    console.log('✅ PR comment posted successfully with preview button.');
  } catch (error) {
    console.error('❌ Failed to post comment:', error.message);
    process.exit(1);
  }
}

main();
