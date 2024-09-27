import globals from "globals";
import eslintJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { languageOptions: { globals: globals.browser } },
  eslintJs.configs.recommended,
  eslintConfigPrettier,
];
