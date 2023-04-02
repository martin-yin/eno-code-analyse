/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 16:19:00
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-02 22:27:37
 * @FilePath: \eno-code-analyse\src\index.ts
 * @Description:
 *
 */
import { getConfig } from './config';
import { parseTsAndJs, parseVue } from './parse';

/**
 * 获取文件后缀名
 * @param file string
 * @returns string
 */
function getFileExtension(file: string): string {
  return file.substring(file.lastIndexOf('.') + 1);
}

const config = getConfig('');
const files: Array<string> = [];
const analyseResult = new Map();
const analysePlugins: Array<any> = [];

const tsCompilerExtensions = ['jsx', 'js', 'ts', 'tsx'];

files.forEach(fileName => {
  const extension = getFileExtension(fileName);

  if (!config.extensions.includes(extension)) {
    console.log(`文件 ${fileName} 不在解析规则之内`);

    return;
  }

  let codeAst: any = null;

  // 需要被分析的代码
  if (extension === 'vue') {
    codeAst = parseVue(fileName);
  }

  // 能够被ts 直接解析的文件
  if (tsCompilerExtensions.includes(extension)) {
    codeAst = parseTsAndJs(fileName);
  }

  analysePlugins.forEach((plugin: any) => {
    if (codeAst) {
      const result = plugin.start(codeAst);

      analyseResult.set(fileName, result);
    }
  });
});

console.log(`分析结果: ${analyseResult}`);
