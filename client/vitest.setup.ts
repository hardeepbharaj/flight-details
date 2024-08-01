// vitest.globalSetup.ts

export default () => {
  // Save the original console.warn function
  const originalWarn = console.warn;

  // Override console.warn to suppress specific warnings
  console.warn = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('<Suspense> is an experimental feature')) {
      return;
    }
    originalWarn.call(console, ...args);
  };
};
