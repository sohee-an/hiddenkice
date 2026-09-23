import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*"],
              message: "feature는 공개 진입점(@/features/<도메인>)으로만 가져오세요.",
            },
            {
              group: ["@/entities/*/*"],
              message: "entity는 공개 진입점(@/entities/<도메인>)으로만 가져오세요.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/features/*/*", "../../*"],
              message:
                "feature끼리는 서로 import할 수 없습니다. 공유 도메인 모델은 entities로, 도메인과 무관한 코드는 shared로 옮기세요.",
            },
            {
              group: ["@/entities/*/*"],
              message: "entity는 공개 진입점(@/entities/<도메인>)으로만 가져오세요.",
            },
            {
              group: ["@/app/*"],
              message: "features는 app에 의존할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/entities/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/features/*/*", "@/app/*"],
              message: "entities는 app이나 features에 의존할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*",
                "@/features/*/*",
                "@/entities/*",
                "@/entities/*/*",
                "@/app/*",
              ],
              message:
                "shared는 app, features, entities에 의존할 수 없습니다. 도메인을 모르는 코드만 둡니다.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
