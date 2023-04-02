/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 17:56:59
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-02 22:27:52
 * @FilePath: \eno-code-analyse\src\parse\index.ts
 * @Description:
 *
 */
import path from 'node:path';

import vueCompiler from '@vue/compiler-dom';
import md5 from 'js-md5';
import tsCompiler from 'typescript';

import { getFileContent, writeFile } from '../utils';

/**
 * 解析 ts tsx js jsx 代码
 * @param fileName
 * @returns
 */
export function parseTsAndJs(fileName: string) {
  const program = tsCompiler.createProgram([fileName], {});
  const ast = program.getSourceFile(fileName);
  const checker = program.getTypeChecker();

  return { ast, checker };
}

/**
 *
 * @param fileName
 * @returns
 */
export function parseVue(fileName: string) {
  const vueCode = getFileContent(fileName);
  const result = vueCompiler.parse(vueCode);
  const children = result.children;
  let tsCode = '';
  let baseLine = 0;

  children.forEach((element: any) => {
    if (element?.tag == 'script') {
      tsCode = element.children[0].content;
      baseLine = element.loc.start.line - 1;
    }
  });
  // 将ts片段写入临时目录下的ts文件中
  const vueTempTsFile = path.join(process.cwd(), `./dist/${md5(fileName)}.ts`);

  writeFile(tsCode, vueTempTsFile);
  // 将ts代码转化为AST
  const program = tsCompiler.createProgram([vueTempTsFile], {});
  const ast = program.getSourceFile(vueTempTsFile);
  const checker = program.getTypeChecker();

  return { ast, checker, baseLine };
}
