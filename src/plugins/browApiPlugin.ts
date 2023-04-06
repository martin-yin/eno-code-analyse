/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-06 12:40:59
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-06 21:40:02
 * @FilePath: \eno-code-analyse\src\plugins\browApiPlugin.ts
 * @Description:
 *
 */
import type { PluginInstance } from './plugin';

/**
 * 用于分析代码中 可能存在风险的浏览器API.
 */
export class BrowApiPluginPlugin implements PluginInstance {
  name = 'BrowApiPluginPlugin';

  private context = [];

  /**
   * @description 黑名单API列表
   */
  private blackBrowApi: Array<string> = [];

  initPlugin(): void {
    throw new Error('Method not implemented.');
  }

  startAnalyse(_orginFileName: any) {
    console.log(_orginFileName);
  }

  format() {
    return this.context;
  }

  report() {
    return false;
  }
}
