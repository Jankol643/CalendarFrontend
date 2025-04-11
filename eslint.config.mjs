import globals from "globals";
import js from "@eslint/js";

const baseIgnore = [
  "**/.*",                  // Ignore all hidden files and folders
  "**/node_modules/**",     // Ignore the node_modules folder
  "**/vendor/**",           // Ignore the vendor folder
  "**/cache/**",            // Ignore the .angular folder in example-app
  "**/temp.js",
  "config/*",
  "*.conf.*"
];

const baseConfig = {
  languageOptions: {
    globals: globals.browser,
  },
  plugins: { js },
  rules: {
    // Limit maximum depth of nested blocks to 4
    "max-depth": ["error", 4],
    // Limit the cyclomatic complexity to 20
    "complexity": ["error", { "max": 20 }],
    "max-lines-per-function": ["error", { "max": 50 }]
  },
};

const testConfig = {
  languageOptions: {
    globals: {
      ...globals.browser,
      jasmine: true, // Add jasmine globals for test files
    },
  },
  plugins: { js },
  rules: {
    // Example rule for test files
    "no-unused-expressions": "off",
    "no-undef": "off"
    // Add more rules as needed
  },
};

export default [
  js.configs.recommended, // Recommended config applied to all files
  {
    ignores: [...baseIgnore]
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    ...baseConfig,
  },
  {
    files: ["**/*.spec.{js,mjs,cjs,ts}"], // Test files pattern
    ...testConfig,
  },
];
