/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 21:16:21
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04
 * @FilePath: \eno-code-analyse\src\plugins\plugin.ts
 * @Description:
 *
 */
import type { MaybePromise } from '../utils';

export interface PluginInterface {
  new (options: any): PluginInstance;
}

export type PluginConfig = {
  name: string;
  config: {
    [key: string]: any;
  };
};

export type FormatResult = {
  [x: string]: any;
};

export interface PluginInstance {
  name: string;

  startAnalyse(_orginFileName: string): MaybePromise<void | boolean | any>;

  format(): MaybePromise<void | boolean | FormatResult>;
}

export class PluginContainer {
  private plugins: PluginInstance[];

  constructor(plugins: PluginInstance[]) {
    this.plugins = plugins;
  }

  public async startAnalyse(_orginFileName: string) {
    for (const plugin of this.plugins) {
      if (plugin.startAnalyse) {
        await plugin.startAnalyse(_orginFileName);
      }
    }
  }

  public async format() {
    const foramtResulst: Array<FormatResult> = [];

    for (const plugin of this.plugins) {
      if (plugin.format) {
        // 每个插件自己去格式化数据
        const name = plugin.name;

        foramtResulst.push({
          [name]: await plugin.format()
        });
      }
    }

    return foramtResulst;
  }
}
