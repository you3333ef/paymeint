import { createTestSuite, DEFAULT_TESTS } from './index.js';

const runner = createTestSuite();
runner.addTests(DEFAULT_TESTS);

console.log('🧪 Running Chef Test Kitchen\n');

const results = await runner.runAll();

console.log('\n📊 Test Results:\n');

results.forEach(result => {
  const status = result.success ? '✅ PASS' : '❌ FAIL';
  const duration = `${result.duration}ms`;
  console.log(`${status} ${result.testName} (${duration})`);
  if (result.error) {
    console.log(`   Error: ${result.error}`);
  }
});

const summary = runner.getResultSummary(results);

console.log('\n📈 Summary:');
console.log(`Total: ${summary.total}`);
console.log(`Passed: ${summary.passed}`);
console.log(`Failed: ${summary.failed}`);
console.log(`Pass Rate: ${summary.passRate.toFixed(2)}%`);
console.log(`Total Duration: ${summary.totalDuration}ms`);

process.exit(summary.failed > 0 ? 1 : 0);
