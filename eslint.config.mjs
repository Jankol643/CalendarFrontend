import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

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
  rules: {
    // Limit maximum depth of nested blocks to 4
    "max-depth": ["error", 4],
    // Limit the cyclomatic complexity to 20
    "complexity": ["error", { "max": 20 }],
    "max-lines-per-function": ["error", { "max": 50 }],
    // Require explicit accessibility modifiers on class properties and methods.
    "@typescript-eslint/explicit-member-accessibility": "error",
    // Enforce specifying generic type arguments on type annotation or constructor name of a constructor call.
    "@typescript-eslint/consistent-generic-constructors": [
      "error",
      "constructor"
    ],
    // Require .toString() and .toLocaleString() to only be called on objects which provide useful information when stringified.
    "@typescript-eslint/no-base-to-string": "error",
    // Disallow non-null assertion in locations that may be confusing.
    "@typescript-eslint/no-confusing-non-null-assertion": "error",
    // Disallow using code marked as @deprecated.
    "@typescript-eslint/no-deprecated": "error",
    // Disallow using the delete operator on computed key expressions.
    "@typescript-eslint/no-dynamic-delete": "error"

  },
};

const testConfig = {
  languageOptions: {
    globals: {
      ...globals.browser,
      jasmine: true, // Add jasmine globals for test files
    },
  },
  rules: {
    // Example rule for test files
    "no-unused-expressions": "off",
    "no-undef": "off"
    // Add more rules as needed
  },
};

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
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
);
