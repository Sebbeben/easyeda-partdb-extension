import type esbuild from 'esbuild';

const config: Parameters<(typeof esbuild)['build']>[0] = {
    entryPoints: { index: './src/index' },
    outdir: './dist/',
    bundle: true,
    // Required by EDA extension runtime - do not modify
    minify: false,
    platform: 'browser',
    format: 'iife',
    globalName: 'edaEsbuildExportName',
    // End required settings
    treeShaking: true,
    ignoreAnnotations: true,
};

export default config;
