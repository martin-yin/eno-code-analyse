/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 21:16:21
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-03 22:24:05
 * @FilePath: \eno-code-analyse\src\plugin.ts
 * @Description:
 *
 */
import type { Node } from 'typescript';

import type { MaybePromise } from './utils';

export type StartAnalyse = (orginFileName: string, tsNode: Node) => MaybePromise<void | null>;

export type Plugin = {
  name: string;
  startAnalyse?: StartAnalyse;
};

export class PluginContainer {
  plugins: Plugin[];

  constructor(plugins: Plugin[]) {
    this.plugins = plugins;
  }

  public async startAnalyse(orginFileName: string, tsNode: Node) {
    const analyseResultMap = new Map();

    for (const plugin of this.plugins) {
      if (plugin.startAnalyse) {
        // 如果在这里做数据格式的校验增加了该函数的复杂度，而且不符合单一职责
        await plugin.startAnalyse(orginFileName, tsNode);
      }
    }

    return analyseResultMap;
  }
}
