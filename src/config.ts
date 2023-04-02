/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-02 22:19:50
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-02 22:27:41
 * @FilePath: \eno-code-analyse\src\config.ts
 * @Description:
 *
 */
export function getConfig(config: string) {
  return {
    includes: [],
    ignores: [],
    extensions: ['vue', 'ts', 'tsx', 'js']
  };
}
