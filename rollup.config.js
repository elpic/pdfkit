import babelrc from 'babelrc-rollup';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import istanbul from 'rollup-plugin-istanbul';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

let plugins = [
  resolve({
    jsnext: true,
    main: true,
    browser: true,
    preferBuiltins: true,
  }),
  commonjs(),
  babel(babelrc()),
  globals(),
  builtins(),
];

if (process.env.BUILD !== 'production') {
  plugins.push(istanbul({
    exclude: ['test/**/*', 'node_modules/**/*']
  }));
}

export default {
  entry: 'src/demo/index.js',
  dest: 'demo/bundle.js',
  plugins: plugins,
  external: external,
  format: 'iife',
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: 'pdfkit',
      sourceMap: true
    },
    {
      dest: pkg.module,
      format: 'es',
      sourceMap: true
    }
  ]
};
