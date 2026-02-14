import { defineConfig, type RolldownOptions } from 'rolldown';

type EntryConfig = {
  input: string;
  outDir: string;
  platform?: 'node' | 'browser' | 'neutral';
  external?: (string | RegExp)[];
};

function createConfigs(entry: EntryConfig): RolldownOptions[] {
  return (['esm', 'cjs'] as const).map((format) => ({
    input: { ltsv: entry.input },
    ...(entry.platform && { platform: entry.platform }),
    ...(entry.external && { external: entry.external }),
    output: {
      dir: entry.outDir,
      format,
      entryFileNames: `[name]${format === 'esm' ? '.mjs' : '.cjs'}`,
      sourcemap: true,
      cleanDir: false,
      ...(format === 'cjs' && { exports: 'named' as const })
    }
  }));
}

export default defineConfig([
  ...createConfigs({
    input: './src/index.ts',
    outDir: 'dist',
    platform: 'neutral'
  }),
  ...createConfigs({
    input: './src/nodejs_stream.ts',
    outDir: 'dist/nodejs_stream',
    platform: 'node',
    external: [/^node:/, 'stream', 'string_decoder']
  }),
  ...createConfigs({
    input: './src/whatwg_stream.ts',
    outDir: 'dist/whatwg_stream',
    platform: 'browser'
  })
]);
