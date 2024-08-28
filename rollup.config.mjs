import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import watchGlobs from 'rollup-plugin-watch-globs'
import hbsPlugin from './hbsPlugin.js'

export default {
  input: 'src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    commonjs(),
    hbsPlugin(),
    typescript({
      module: 'esnext',
    }),
    resolve(),
    json(),
    watchGlobs([
      'src/**/*.hbs',
    ]),
  ],
}
