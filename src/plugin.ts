/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 21:16:21
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-03 21:57:41
 * @FilePath: \eno-code-analyse\src\plugin.ts
 * @Description:
 *
 */
import type ts from 'typescript';

import type { MaybePromise } from './utils';

export type StartAnalyse = (orginFileName: string, ast: ts.Node) => MaybePromise<void | null>;

export type Plugin = {
  name: string;
  startAnalyse?: StartAnalyse;
};

export class PluginContainer {
  plugins: Plugin[];

  constructor(plugins: Plugin[]) {
    this.plugins = plugins;
  }

  public async startAnalyse(orginFileName: string, ast: ts.SourceFile) {
    const analyseResultMap = new Map();

    for (const plugin of this.plugins) {
      if (plugin.startAnalyse) {
        // 如果在这里做数据格式的校验增加了该函数的复杂度，而且不符合单一职责
        const result = await plugin.startAnalyse(orginFileName, ast);
        // 需要对数据格式进行一次校验，看看返回的格式是否符合要求
        const beforeAnalyseResult = analyseResultMap.get(orginFileName);

        if (result) {
          analyseResultMap.set(orginFileName, {
            ...beforeAnalyseResult,
            [plugin.name]: result
          });
        }
      }
    }

    return analyseResultMap;
  }
}
