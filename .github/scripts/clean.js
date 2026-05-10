// .github/scripts/cleanup.js

const pr = process.env.PR_NUMBER;

console.log(`🧹 Cleaning up PR environment: ${pr}`);

// Docker cleanup example
console.log(`Stopping containers for PR-${pr}`);

// DB cleanup example
console.log(`Dropping staging DB for PR-${pr}`);

// Hosting cleanup (API call example)
// fetch(`https://api.yourhost.com/delete-preview/${pr}`)

console.log("Cleanup complete");
