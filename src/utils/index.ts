/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 17:36:33
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04
 * @FilePath: \eno-code-analyse\src\utils\index.ts
 * @Description:
 *
 */

export type MaybePromise<T> = T | Promise<T>;

export { getFileContent, writeFile } from './file';
