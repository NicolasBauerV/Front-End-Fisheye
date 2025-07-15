import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.browser },
        // Règles de base pour un projet JavaScript vanilla
        rules: {
            // Imposer l’égalité stricte (=== / !==) pour éviter les surprises de type coercion
            eqeqeq: ["error", "always"],

            // Avertir lorsqu’une variable est déclarée mais jamais utilisée
            "no-unused-vars": [
                "warn",
                { vars: "all", args: "after-used", ignoreRestSiblings: false }
            ],

            // Exiger des accolades pour toutes les structures de contrôle (if, while, etc.)
            curly: ["error", "all"],

            // Utiliser les guillemets double par défaut, sauf si l’échappement serait nécessaire
            quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],

            // Toujours terminer les instructions par un point‑virgule
            semi: ["error", "always"],

            // Tolérer console.warn et console.error mais signaler les autres
            "no-console": ["warn", { allow: ["warn", "error"] }],

            // Imposer un espace à l’intérieur des accolades d’objets
            "object-curly-spacing": ["error", "always"],

            // Harmoniser les sauts de ligne dans les objets multilignes
            "object-curly-newline": ["error", { multiline: true, consistent: true }]
        }
    }
]);
