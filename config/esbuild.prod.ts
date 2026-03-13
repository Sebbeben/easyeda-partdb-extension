import esbuild from 'esbuild';
import config from './esbuild.common';

esbuild.build(config).catch(() => process.exit(1));
