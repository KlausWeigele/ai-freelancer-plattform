// ESLint Flat Config for Next.js 16 + ESLint 9
// Use Next.js' native flat config export
import nextCoreWeb from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextCoreWeb,
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'coverage/**'],
  },
];

export default config;
