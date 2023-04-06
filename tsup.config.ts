/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 16:14:29
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04
 * @FilePath: \eno-code-analyse-main\tsup.config.ts
 * @Description: 构建使用的 tsup 配置文件
 */

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts', 'src/index.ts'],
  format: ['cjs'],
  clean: true,
  treeshake: true,
  dts: {
    resolve: true
  }
});
