export default [
  {
    ignores: ["node_modules/", "dist/", "logs/"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        __dirname: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "warn",
      "prefer-const": "error",
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
    },
  },
];
