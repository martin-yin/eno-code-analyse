/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 21:16:21
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-02 21:55:00
 * @FilePath: \eno-code-analyse\src\plugin.ts
 * @Description:
 *
 */
export class PluginContainer {
  plugins: any[];
  context?: any;

  constructor(plugins: any[]) {
    this.plugins = plugins;
  }
}
