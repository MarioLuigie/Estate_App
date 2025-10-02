// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ["functions/**/*.ts", "functions/**/*.js"],
    languageOptions: {
      globals: {
        // to mówi ESLintowi, że ma znać zmienne Node.js
        Buffer: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
      },
    },
  },
]);
