import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    methodCommentsPlugin: 'src/plugins/methodCommentsPlugin.ts',
    eslintDisableNextLinePlugin: 'src/plugins/eslintDisableNextLinePlugin.ts'
  },
  outDir: './dist-plugins',
  format: ['cjs'],
  clean: true,
  treeshake: true
});
