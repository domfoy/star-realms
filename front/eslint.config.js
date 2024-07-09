import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  { settings: { react: { version: "detect" } } }, // Needed by pluginReactConfig
  ...fixupConfigRules(pluginReactConfig),
  eslintPluginPrettierRecommended,
  {
    rules: {
      "react/prop-types": 0,
    },
  },
];
