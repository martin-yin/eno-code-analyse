/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 16:19:00
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-03 21:59:14
 * @FilePath: \eno-code-analyse\src\index.ts
 * @Description:
 *
 */
import { getConfig } from './config';
import { parseTsAndJs, parseVue } from './parse';
import { PluginContainer } from './plugin';
import { methodPlugin } from './plugins/index';

/**
 * 获取文件后缀名
 * @param file string
 * @returns string
 */
function getFileExtension(file: string): string {
  return file.substring(file.lastIndexOf('.') + 1);
}

const config = getConfig('');
const files: Array<string> = ['D://eno-code-analyse-main//example//ts-project/index.ts'];
const analysePlugins = new PluginContainer([methodPlugin]);

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

  // 这里拿到单个文件的校验结果
  const analyseResult = analysePlugins.startAnalyse(fileName, codeAst);
  // console.log(analyseResult, 'analyseResult')
});

// console.log(`分析结果: ${analyseResult}`);
