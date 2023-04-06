/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-06 14:10:20
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-06 21:40:31
 * @FilePath: \eno-code-analyse\src\analyse.ts
 * @Description:
 *
 */
import type { PluginContainer } from './plugins/plugin';

/**
 * @description 开始执行分析代码
 * @param {Array<string>} files 文件列表
 * @param {PluginContainer} pluginContainer 插件容器
 * @returns void
 */
export async function startAnalyse(files: Array<string>, pluginContainer: PluginContainer) {
  files.forEach(fileName => {
    pluginContainer.startAnalyse(fileName);
  });
}

/**
 * @description 执行格式化
 * @param {PluginContainer} pluginContainer
 * @returns {Promise<any>}
 */
export async function formatAnalyse(pluginContainer: PluginContainer): Promise<
  {
    [x: string]: any;
  }[]
> {
  return pluginContainer.format();
}
