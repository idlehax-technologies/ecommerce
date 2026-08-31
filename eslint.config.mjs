import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
// import tseslint from "typescript-eslint";
// import explicitAwait from "./eslint/rules/explicit-await.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // tseslint.configs.recommendedTypeChecked,

  {
    // plugins: {
    //   local: {
    //     rules: {
    //       "explicit-await": explicitAwait,
    //     },
    //   },
    // },

    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },

    rules: {
      "no-return-await": "off",
      "@typescript-eslint/return-await": ["error", "always"],
      "@typescript-eslint/no-floating-promises": "error",

      // "local/explicit-await": "error",
    },
  },

  // Override default ignores of eslint-config-next
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;