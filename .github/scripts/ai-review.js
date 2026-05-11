// .github/scripts/ai-review.js
const { OpenAI } = require("openai");
const { execSync } = require("child_process");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function run() {
  try {
    // === Better git diff that works reliably in Actions ===
    const diff = execSync(`
      git fetch origin ${process.env.GITHUB_BASE_REF || 'main'} --depth=1 &&
      git diff origin/${process.env.GITHUB_BASE_REF || 'main'}...HEAD
    `, { encoding: 'utf8' }).trim();

    if (!diff) {
      console.log("No changes detected.");
      process.exit(0);
    }

    console.log(`📊 Diff length: ${diff.length} characters`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",   // or gpt-4o if you want higher quality
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `You are an expert senior full-stack code reviewer.
Focus on: bugs, security issues, performance, code quality, best practices, and WordPress/PHP specific issues.
Be concise but thorough. Use markdown.`
        },
        {
          role: "user",
          content: `Please review the following pull request diff:\n\n\`\`\`diff\n${diff}\n\`\`\``
        }
      ]
    });

    const report = response.choices[0].message.content;

    console.log("\n=== AI CODE REVIEW ===\n");
    console.log(report);

    // Output for GitHub Actions
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `report<<EOF\n${report}\nEOF\n`);

  } catch (error) {
    console.error("❌ Error in AI Review:", error.message);
    // Don't fail the whole workflow on AI error
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `report<<EOF\nAI Review failed: ${error.message}\nEOF\n`);
  }
}

run().catch(console.error);
