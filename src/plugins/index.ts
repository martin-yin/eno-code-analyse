/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-03 13:36:03
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04
 * @FilePath: \eno-code-analyse\src\plugins\index.ts
 * @Description:
 *
 */

import MethodCommentsPlugin from './methodCommentsPlugin';
import EslintDisableNextLinePlugin from './eslintDisableNextLinePlugin';
import type { PluginInstance } from './plugin';

export { MethodCommentsPlugin, EslintDisableNextLinePlugin };
export type { PluginInstance };
