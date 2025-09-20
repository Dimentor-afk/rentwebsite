import nextLintConfig from "eslint-config-next";

/** @type {import("eslint").Linter.FlatConfig[]} */
const config = [
  ...nextLintConfig,
  {
    rules: {
      "@next/next/no-page-custom-font": "off",
    },
  },
];

export default config;
