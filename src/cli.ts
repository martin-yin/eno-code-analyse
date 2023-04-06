/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-06 13:35:02
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-06 21:40:34
 * @FilePath: \eno-code-analyse\src\cli.ts
 * @Description:
 *
 */
import { writeFileSync } from 'node:fs';

import cac from 'cac';
import fg from 'fast-glob';

import { version } from '../package.json';
import { formatAnalyse, startAnalyse } from './analyse';
import { loadConfig } from './config';
import { PluginContainer } from './plugins/plugin';

const VERSION = version as string;
const cli = cac('code-analyse');

type Options = {
  config: string;
};

cli.help();
cli.version(VERSION);

cli
  .command('start', '代码分析')
  .option('-c, --config <file>', `[string] 配置文件地址`)
  .action(async (options: Options) => {
    const cwd = process.cwd();

    const config = await loadConfig({
      configPath: options.config,
      cwd
    });

    const analyseFiles = fg.sync(config?.include, {
      ignore: [...config?.exclude],
      cwd,
      absolute: true
    });

    const plugins = config.plugins.map(plugin => {
      const pluginConfig = config.pluginsConfig.find(plugin => plugin.name === plugin.name);

      return new plugin(pluginConfig?.config);
    });

    const pluginContainer = new PluginContainer(plugins);

    // 开始分析代码
    startAnalyse(analyseFiles, pluginContainer);

    // 拿到format 之后的结果
    const formatResult = await formatAnalyse(pluginContainer);

    writeFileSync(`${cwd}/report.json`, JSON.stringify(formatResult), {
      flag: 'a'
    });
  });

cli.parse();
