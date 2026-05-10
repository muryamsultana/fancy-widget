// deploy-wp-preview.js

const pr = process.env.PR_NUMBER;

const url = `https://playground.wordpress.net/?pr=${pr}`;

console.log(url);

require("fs").appendFileSync(
  process.env.GITHUB_OUTPUT,
  `url=${url}\n`
);
