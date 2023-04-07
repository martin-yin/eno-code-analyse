/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 17:31:55
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04
 * @FilePath: \eno-code-analyse\src\utils\file.ts
 * @Description:
 *
 */
import fs from 'node:fs'; // 文件操作
import path from 'node:path';

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
export function writeFile(directory: string, fileName: string, content: string) {
  try {
    const filePath = path.join(directory, fileName);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    fs.writeFileSync(filePath, content, {
      flag: 'a'
    });

    return filePath;
  } catch (e) {
    throw e;
  }
}

/**
 * @description 获取文件后缀名
 * @param file string
 * @returns string
 */
export function getFileExtension(file: string): string {
  return file.substring(file.lastIndexOf('.') + 1);
}
