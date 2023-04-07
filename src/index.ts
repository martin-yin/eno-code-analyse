/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 16:19:00
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04
 * @FilePath: \eno-code-analyse\src\index.ts
 * @Description:
 *
 */

import type { ConfigType } from './config';
import { defineConfig } from './config';
import type { PluginInstance } from './plugins/index';
import { EslintDisableNextLinePlugin, MethodCommentsPlugin } from './plugins/index';

export { defineConfig, MethodCommentsPlugin, EslintDisableNextLinePlugin };
export type { ConfigType, PluginInstance };
