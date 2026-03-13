import esbuild from 'esbuild';
import config from './esbuild.common';

const ctx = await esbuild.context(config);
await ctx.watch();
console.log('Watching for changes...');
