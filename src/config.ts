/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 22:19:50
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04
 * @FilePath: \eno-code-analyse\src\config.ts
 * @Description:
 *
 */
import fs from 'node:fs';
import path from 'node:path';

import { mergeWith } from 'lodash-es';
import { createConfigLoader as createLoader } from 'unconfig';

import type { PluginConfig, PluginInterface } from './plugins/plugin';

export type ConfigType = {
  appId?: string;
  reportUrl?: string;
  plugins: Array<PluginInterface>;
  pluginsConfig?: Array<PluginConfig>;
  include: Array<string> | string;
  exclude?: Array<string> | string;
  beforeStart?: () => void;
  onSuccess?: () => void;
  onFail?: () => void;
};

export type LoadedConfigType = ConfigType &
  Required<{
    include: Array<string>;
    exclude: Array<string>;
    pluginsConfig: Array<{
      name: string;
      config: any;
    }>;
  }>;

/**
 * @description 定义配置
 * @param config
 */
export function defineConfig(config: ConfigType): ConfigType {
  return config;
}

const defaultConfig = Object.freeze({
  include: [],
  exclude: ['**/node_modules/**', '**/.git/**'],
  pluginsConfig: []
});

export async function loadConfig(options: { cwd: string; configPath?: string }): Promise<LoadedConfigType> {
  const resolved = path.resolve(options.cwd, options.configPath || '');

  if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
    options.cwd = path.dirname(resolved);
  }

  const loader = createLoader<ConfigType>({
    cwd: options.cwd,
    defaults: {},
    sources: { files: ['code-analyse.config', 'codeAnalyse.config'] }
  });

  const config = (await loader.load()).config;

  return mergeWith({}, defaultConfig, config, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return srcValue;
    }
  });
}
