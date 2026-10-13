import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const testsDirectory = join(process.cwd(), ".test-dist", "tests");
// Read the source list so removed tests cannot run from stale compiled output.
const testFiles = readdirSync(join(process.cwd(), "tests"))
  .filter((fileName) => fileName.endsWith(".test.ts"))
  .map((fileName) => fileName.replace(/\.ts$/, ".js"))
  .sort();

if (testFiles.length === 0) {
  console.error("No test source files found in tests/.");
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
