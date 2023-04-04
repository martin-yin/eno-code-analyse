/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 21:16:21
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-04 22:19:50
 * @FilePath: \eno-code-analyse\src\plugins\plugin.ts
 * @Description:
 *
 */
import type { MaybePromise } from '../utils';

/**
 * 抽象类
 */
export interface PluginInterface {
  name: string;

  startAnalyse(filePath: string): MaybePromise<void | boolean | any>;

  format(): MaybePromise<void | boolean | any>;

  report(): MaybePromise<void | boolean | any>;
}

export class PluginContainer {
  private plugins: PluginInterface[];

  constructor(plugins: PluginInterface[]) {
    this.plugins = plugins;
  }

  public async startAnalyse(filePath: string) {
    for (const plugin of this.plugins) {
      if (plugin.startAnalyse) {
        await plugin.startAnalyse(filePath);
      }
    }
  }

  public async format() {
    for (const plugin of this.plugins) {
      if (plugin.format) {
        // 每个插件自己去格式化数据
        console.log(await plugin.format());
      }
    }
  }
}
