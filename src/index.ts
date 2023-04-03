/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 16:19:00
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-03 22:25:02
 * @FilePath: \eno-code-analyse\src\index.ts
 * @Description:
 *
 */
import ts from 'typescript';

import { getConfig } from './config';
import { parseTsAndJs, parseVue } from './parse';
import { PluginContainer } from './plugin';
import { commentsPlugin } from './plugins';

/**
 * 获取文件后缀名
 * @param file string
 * @returns string
 */
function getFileExtension(file: string): string {
  return file.substring(file.lastIndexOf('.') + 1);
}

const config = getConfig('');
const files: Array<string> = [
  'C://Users//Administrator//Documents//GitHub//eno-code-analyse//example//ts-project/index.ts'
];

const tsCompilerExtensions = ['jsx', 'js', 'ts', 'tsx'];

const analysePlugins = new PluginContainer([commentsPlugin]);

files.forEach(fileName => {
  const extension = getFileExtension(fileName);

  if (!config.extensions.includes(extension)) {
    console.log(`文件 ${fileName} 不在解析规则之内`);

    return;
  }

  let tsNode: ts.Node | null = null;

  // 能够被ts 直接解析的文件
  if (tsCompilerExtensions.includes(extension)) {
    tsNode = parseTsAndJs(fileName);
  }

  if (tsNode) {
    ts.forEachChild(tsNode, function visit(node: ts.Node) {
      analysePlugins.startAnalyse(fileName, node);
    });
  }
  // 这里拿到单个文件的校验结果
  // const analyseResult = analysePlugins.startAnalyse(fileName, codeAst);
  // console.log(analyseResult, 'analyseResult')
});

// console.log(`分析结果: ${analyseResult}`);
