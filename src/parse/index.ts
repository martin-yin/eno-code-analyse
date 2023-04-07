/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 17:56:59
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04
 * @FilePath: \eno-code-analyse\src\parse\index.ts
 * @Description:
 *
 */
import fs from 'node:fs';
import path from 'node:path';

// import vueCompiler from '@vue/compiler-dom';
import md5 from 'js-md5';
import type { SourceFile } from 'typescript';
import ts from 'typescript';

import { getFileContent, writeFile } from '../utils';
// eslint-disable-next-line @typescript-eslint/padding-line-between-statements
const vueCompiler = require('@vue/compiler-dom');

/**
 * 解析 ts tsx js jsx 代码
 * @param fileName
 * @returns
 */
export function parseTsAndJs(fileName: string): SourceFile {
  return ts.createSourceFile(
    fileName,
    fs.readFileSync(fileName).toString(),
    ts.ScriptTarget.ESNext,
    /*setParentNodes*/ true
  );
}

/**
 *
 * @param fileName
 * @returns
 */
export function parseVue(fileName: string): SourceFile {
  const vueCode = getFileContent(fileName);
  const result = vueCompiler.parse(vueCode);
  const children = result.children;
  let tsCode = '';

  children.forEach((element: any) => {
    if (element?.tag == 'script') {
      tsCode = element.children[0].content;
    }
  });
  // 将ts片段写入临时目录下的ts文件中
  const vueTempTsFile = path.join(process.cwd(), `./dist/${md5(fileName)}.ts`);

  // writeFile(tsCode, vueTempTsFile);
  // 将ts代码转化为AST
  const tsNode = ts.createSourceFile(
    fileName,
    fs.readFileSync(fileName).toString(),
    ts.ScriptTarget.ESNext,
    /*setParentNodes*/ true
  );

  return tsNode;
}
