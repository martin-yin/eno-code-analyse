/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-06 14:10:20
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-09 17:59:18
 * @FilePath: \eno-code-analyse\src\analyse.ts
 * @Description:
 *
 */
import fg from 'fast-glob';

import type { LoadedConfigType } from './config';
import type { FormatResult, PluginConfig, PluginInterface } from './plugins/plugin';
import { PluginContainer } from './plugins/plugin';
import { writeFile } from './utils';

/**
 * @description 分析代码
 * @param config
 * @returns void
 */
export async function startAnalyse(config: LoadedConfigType) {
  const cwd = process.cwd();

  const analyseFiles = getBeAnalyseFiles(cwd, config.include, config.exclude);
  const plugins = initPlugins(config.plugins, config.pluginsConfig);
  const pluginContainer = new PluginContainer(plugins);

  // 遍历文件，调用插件容器中的插件开始分析代码
  analyseFiles.forEach(fileName => {
    pluginContainer.startAnalyse(fileName);
  });

  // 拿到format 之后的结果
  const formatResult = await formatAnalyse(pluginContainer);

  // if (config.reportUrl) {
  //   // 调用接口上报数据
  // } else {
  writeFile(cwd, 'report.json', JSON.stringify(formatResult));
  // }
}

/**
 * @description 执行格式化
 * @param {PluginContainer} pluginContainer
 * @returns {Promise<any>}
 */
export async function formatAnalyse(pluginContainer: PluginContainer): Promise<FormatResult[]> {
  return pluginContainer.format();
}

/**
 * @description 初始化插件配置
 * @param plugins
 * @param pluginsConfig
 * @returns
 */
export function initPlugins(plugins: Array<PluginInterface>, pluginsConfig: Array<PluginConfig>) {
  return plugins.map(plugin => {
    const pluginConfig = pluginsConfig.find(plugin => plugin.name === plugin.name);

    return new plugin(pluginConfig?.config);
  });
}

/**
 * @description 获取需要被分析的文件
 * @param {string} cwd
 * @param {string} include
 * @param {string} exclude
 * @returns Array<string>
 */
export function getBeAnalyseFiles(cwd: string, include: Array<string>, exclude: Array<string>): Array<string> {
  const analyseFiles = fg.sync(include, {
    ignore: [...exclude],
    cwd,
    absolute: true
  });

  return analyseFiles;
}
