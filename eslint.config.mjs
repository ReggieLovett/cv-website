import next from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [
  // components/ui is generated shadcn/ui boilerplate — not hand-maintained source.
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'components/ui/**'] },
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default config;
