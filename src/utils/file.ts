/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 17:31:55
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-02 22:27:47
 * @FilePath: \eno-code-analyse\src\utils\file.ts
 * @Description:
 *
 */
import fs from 'node:fs'; // 文件操作
import path from 'node:path'; // 路径操作

/**
 * 读取文件内容
 * @param fileName
 * @returns
 */
export function getFileContent(fileName: string) {
  try {
    const code = fs.readFileSync(fileName, 'utf-8');

    return code;
  } catch (e) {
    throw e;
  }
}

/**
 * 往本地写入文件
 * @param content string
 * @param fileName string
 */
export function writeFile(content: string, fileName: string) {
  try {
    fs.writeFileSync(fileName, content, 'utf-8');
  } catch (e) {
    throw e;
  }
}
