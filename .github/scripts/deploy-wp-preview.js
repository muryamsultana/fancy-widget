// .github/scripts/deploy-wp-preview.js
import fs from 'fs';

const prNumber = process.env.PR_NUMBER;

async function run() {
  try {
    // This creates a direct Playground link that auto-installs your plugin from this PR
    const previewUrl = `https://playground.wordpress.net/?plugin=${encodeURIComponent(
      `https://github.com/${process.env.GITHUB_REPOSITORY}/archive/refs/heads/${process.env.GITHUB_HEAD_REF}.zip`
    )}`;

    console.log("Preview URL:", previewUrl);

    // Output for GitHub Actions
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `url=${previewUrl}\n`);

  } catch (error) {
    console.error("Preview URL generation failed:", error.message);
    const fallback = `https://playground.wordpress.net/?pr=${prNumber}`;
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `url=${fallback}\n`);
  }
}

run();
