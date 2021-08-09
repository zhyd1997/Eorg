module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "@typescript-eslint", "simple-import-sort"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    // It warns when dependencies are specified incorrectly and suggests a fix.
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-indent-props": [2, 2],
    "react/prop-types": [0],
    "linebreak-style": ["error", "unix"],
    // semi
    semi: "off",
    "@typescript-eslint/semi": ["error", "always"],
    // trailing comma
    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": ["error", "never"],
    // indent
    indent: "off",
    "@typescript-eslint/indent": ["error", 2],
    "react/jsx-indent": ["error", 2],
    "no-tabs": "off",
    // quote
    quote: "off",
    "@typescript-eslint/quotes": ["error", "double"],
    // no-shadow
    "no-shadow": "off",
    // except test files
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "src/setupTests.ts",
          "**/*.spec.ts",
          "**/*.test.ts",
          "**/*.spec.tsx",
          "**/*.test.tsx",
        ],
      },
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
