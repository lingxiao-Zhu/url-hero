import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import clear from 'rollup-plugin-clear';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {terser} from 'rollup-plugin-terser';

export default {
  input: path.relative(__dirname, './src/index.ts'),
  output: {
    file: path.relative(__dirname, './lib/index.js'),
    format: 'umd',
    name: 'U',
    sourcemap: true,
  },
  plugins: [
    json(),
    terser(),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
    resolve({
      preferBuiltins: false,
    }),
    commonjs({
      include: 'node_modules/**',
      extensions: ['.js', '.ts'],
    }),
    clear({
      targets: ['lib'],
    }),
  ],
};
