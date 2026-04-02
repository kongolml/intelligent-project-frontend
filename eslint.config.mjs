import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import next from "@next/eslint-plugin-next";

export default defineConfig([
  // Base JavaScript recommended config
  js.configs.recommended,
  
  // TypeScript and React config for all relevant files
  {
    files: ["**/*.{ts,tsx,js,mjs,cjs,jsx}"],
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/out/**",
    ],
    plugins: {
      "@typescript-eslint": tseslint,
      "react": reactPlugin,
      "react-hooks": reactHooks,
      "@next/next": next,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
        NodeJS: "readonly",
      },
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      // TypeScript specific rules
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      
      // React specific rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // Next.js specific rules
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-before-interactive-script-outside-document": "error",
      
      // General rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      
      // Disable no-undef for TypeScript files since TypeScript handles undefined checks
      "no-undef": "off",
    },
  },
]);