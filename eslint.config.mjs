import next from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [
  // components/ui is generated shadcn/ui boilerplate, and components/react-bits is
  // vendored as fetched from the React Bits registry — neither is hand-maintained.
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'components/ui/**', 'components/react-bits/**', '.agents/**', '.claude/skills/**'] },
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default config;
