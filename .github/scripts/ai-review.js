
// .github/scripts/ai-review.js

const { OpenAI } = require("../node_modules/openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const diff = require("child_process")
  .execSync("git diff origin/main...HEAD")
  .toString();

async function run() {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are a senior code reviewer.
Detect bugs, logic issues, and improvement suggestions.
Explain clearly and concisely.
        `
      },
      {
        role: "user",
        content: `Review this PR diff:\n\n${diff}`
      }
    ]
  });

  const report = response.choices[0].message.content;

  console.log(report);

  require("fs").appendFileSync(
    process.env.GITHUB_OUTPUT,
    `report<<EOF\n${report}\nEOF\n`
  );
}

run();
