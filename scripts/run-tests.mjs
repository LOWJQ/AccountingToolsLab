import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const testsDirectory = join(process.cwd(), ".test-dist", "tests");
const testFiles = readdirSync(testsDirectory)
  .filter((fileName) => fileName.endsWith(".test.js"))
  .sort();

if (testFiles.length === 0) {
  console.error("No compiled test files found. Run tsc -p tsconfig.test.json first.");
  process.exit(1);
}

for (const testFile of testFiles) {
  const result = spawnSync(process.execPath, [join(testsDirectory, testFile)], {
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`PASS ran ${testFiles.length} test files`);
