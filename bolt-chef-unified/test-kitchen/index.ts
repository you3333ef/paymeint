import { ChefAgentLoop, LoopResult } from '../../chef-agent';

export interface TestCase {
  id: string;
  name: string;
  systemPrompt: string;
  userPrompt: string;
  expectedResult?: string;
  maxIterations?: number;
}

export interface TestResult {
  testId: string;
  testName: string;
  success: boolean;
  iterations: number;
  finalState: string;
  output?: any;
  error?: string;
  duration: number;
}

export class ChefTestingFramework {
  private testCases: TestCase[] = [];

  addTest(testCase: TestCase): void {
    this.testCases.push(testCase);
  }

  addTests(testCases: TestCase[]): void {
    this.testCases.push(...testCases);
  }

  async runTest(testCase: TestCase): Promise<TestResult> {
    const startTime = Date.now();
    const agent = new ChefAgentLoop({
      maxIterations: testCase.maxIterations || 10,
    });

    try {
      const result = await agent.run(testCase.systemPrompt, testCase.userPrompt);
      const duration = Date.now() - startTime;

      return {
        testId: testCase.id,
        testName: testCase.name,
        success: result.success,
        iterations: result.iterations,
        finalState: result.finalState,
        output: result.output,
        error: result.error,
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      return {
        testId: testCase.id,
        testName: testCase.name,
        success: false,
        iterations: 0,
        finalState: 'error',
        error: error.message,
        duration,
      };
    }
  }

  async runAll(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (const testCase of this.testCases) {
      console.log(`Running test: ${testCase.name}`);
      const result = await this.runTest(testCase);
      results.push(result);
    }

    return results;
  }

  async runTestById(testId: string): Promise<TestResult | null> {
    const testCase = this.testCases.find(t => t.id === testId);
    if (!testCase) return null;

    return await this.runTest(testCase);
  }

  getTestCases(): TestCase[] {
    return [...this.testCases];
  }

  getResultSummary(results: TestResult[]): {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
    totalDuration: number;
  } {
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    return {
      total: results.length,
      passed,
      failed,
      passRate: results.length > 0 ? (passed / results.length) * 100 : 0,
      totalDuration,
    };
  }
}

export const createTestSuite = (): ChefTestingFramework => {
  return new ChefTestingFramework();
};

export const DEFAULT_TESTS: TestCase[] = [
  {
    id: 'react-app',
    name: 'Create React App',
    systemPrompt: 'You are a full-stack developer. Create a React app with TypeScript.',
    userPrompt: 'Create a simple React counter application with TypeScript and Tailwind CSS',
    maxIterations: 5,
  },
  {
    id: 'api-endpoint',
    name: 'Create API Endpoint',
    systemPrompt: 'You are a backend developer. Create RESTful APIs.',
    userPrompt: 'Create a simple Express.js API with CRUD operations for todos',
    maxIterations: 5,
  },
  {
    id: 'database-schema',
    name: 'Create Database Schema',
    systemPrompt: 'You are a database designer.',
    userPrompt: 'Create a database schema for an e-commerce application with users, products, and orders',
    maxIterations: 5,
  },
];
