/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 16:14:29
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-02 22:25:37
 * @FilePath: \eno-code-analyse\tsup.config.ts
 * @Description: 构建使用的 tsup 配置文件
 */

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: true,
  clean: true
});
