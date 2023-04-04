/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 16:19:00
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-04 22:22:42
 * @FilePath: \eno-code-analyse\src\index.ts
 * @Description:
 *
 */
import path from 'node:path';

import { MethodCommentsPlugin } from './plugins';
import { PluginContainer } from './plugins/plugin';

const testProjectDir = path.join(__dirname, '../example/ts-project/');

const files: Array<string> = [`${testProjectDir}/ccc.js`, `${testProjectDir}/index.tsx`];

const pluginsConfig: Array<{
  name: string;
  config: any;
}> = [
  {
    name: 'MethodCommentsPlugin',
    config: {
      extensions: ['jsx']
    }
  }
];

const plugins = [MethodCommentsPlugin].map(plugin => {
  const pluginConfig = pluginsConfig.find(plugin => plugin.name === plugin.name);

  return new plugin(pluginConfig?.config);
});

const analysePlugins = new PluginContainer(plugins);

files.forEach(fileName => {
  analysePlugins.startAnalyse(fileName);
});

console.log(path.join(__dirname, '../example/ts-project/'), 'process.cwd();');

(async () => {
  console.log(await analysePlugins.format());
})();
