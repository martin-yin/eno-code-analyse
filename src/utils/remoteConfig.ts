import axios from 'axios';
import path from 'path';

import { writeFile } from './file';

type RemoteConfig = {
  config: {
    content: string;
  };
  plugins: Array<{
    name: string;
    content: string;
  }>;
};

/**
 * @description 获取远程配置文件
 * @param url
 * @returns RemoteConfig
 */
export function fetchRemoteConfig(url: string): Promise<RemoteConfig> {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(data => {
        resolve(data.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * @description 向本地写入配置文件
 * @param remoteConfig 配置文件内容
 * @returns string
 */
export function writeRemoteConfig(remoteConfig: RemoteConfig): Promise<string> {
  const cwd = process.cwd();

  return new Promise(resolve => {
    const directory = path.join(cwd, 'remote');

    try {
      const {
        config: { content },
        plugins
      } = remoteConfig;

      const filePath = writeFile(directory, 'code-analyse.config.ts', content);

      plugins.forEach((plugin: any) => {
        writeFile(directory, `${plugin.name}.js`, plugin.content);
      });

      resolve(filePath);
    } catch (e) {
      throw Error(`写入配置文件出错，错误原因：${e}`);
    }
  });
}

/**
 * @description 获取远程的配置文件，并写入本地，完成后返回该配置文件地址。
 * @param url
 * @returns string or nunll
 */
export async function getRemoteConfigPath(url: string): Promise<string> {
  const remoteConfig = await fetchRemoteConfig(url);

  return await writeRemoteConfig(remoteConfig);
}
