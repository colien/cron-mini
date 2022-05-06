import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';

var env = process.env.NODE_ENV;

export default {
  input: './src/cronActuator.js',
  plugins: [
    resolve(), // 查找和打包node_modules中的第三方模块
    commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
    //eslint(),
    babel({ runtimeHelpers: true }), 
  ].concat(env !== "development" ? terser() : []),
  output: {
    file: 'dist/cron-mini.min.js',
    format: 'umd',
    name: 'CronMini',
    exports: 'named'
  }
}

