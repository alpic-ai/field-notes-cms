import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const config = [
  ...nextVitals,
  ...nextTypescript,
  { rules: { 'react-hooks/refs': 'off', 'react-hooks/set-state-in-effect': 'off' } },
  { ignores: ['.next/**', 'src/payload-types.ts', 'src/payload-generated-schema.ts'] },
]

export default config
