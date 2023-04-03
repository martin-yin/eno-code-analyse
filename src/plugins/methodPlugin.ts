/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-03 13:36:12
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-03 22:02:31
 * @FilePath: \eno-code-analyse\src\plugins\plugin.ts
 * @Description:
 *
 */

import ts from 'typescript';

import type { Plugin } from '../plugin';

// 数据收集插件
export const methodPlugin: Plugin = {
  name: 'MethodPlugin',
  startAnalyse: (orginFileName, node: ts.Node) => {
    ts.forEachChild(node, function visit(node: ts.Node) {
      if (ts.isFunctionDeclaration(node)) {
        const functionError: any = {
          name: node?.name?.escapedText,
          description: true,
          params: []
        };

        const comments = getJSDoc(node);
        const funcParams = getFuncParams(node);

        // 判断这个函数是否有描述信息
        functionError.description = !comments.description ? `函数 ${node?.name?.escapedText} 缺少描述信息` : '';
        // 对比变量名和注释，输出结果
        if (comments && funcParams?.length) {
          funcParams.forEach(({ name }) => {
            let errorMessage = {
              comment: '',
              kind: ''
            };

            const comment = comments.params.find(({ paramName }: any) => paramName === name);

            if (!comment) {
              errorMessage = {
                comment: `参数 ${name} 缺少注释信息`,
                kind: `参数 ${name} 缺少变量类型`
              };
            }

            if (comment?.comment === '') {
              errorMessage.comment = `参数 ${name} 缺少注释信息`;
            }

            if (comment?.comment === '') {
              errorMessage.kind = `参数 ${name} 缺少变量类型`;
            }

            functionError.params.push(errorMessage);
          });
        }

        console.log(functionError);
      }

      ts.forEachChild(node, visit);
    });
  }
};

function getFuncParams(node: ts.FunctionDeclaration) {
  const params: Array<{ name: string }> = [];

  node.parameters.forEach(parameter => {
    if (parameter) {
      params.push({
        name: parameter?.name?.getText()
      });
    }
  });

  return params;
}

function getJSDoc(node: ts.Node | any): any {
  const comments = node.jsDoc;

  const codeComment: any = {
    description: '',
    params: [],
    returns: ''
  };

  if (comments) {
    if (comments.length > 0) {
      comments[0].tags.forEach(tag => {
        if (tag.tagName.escapedText === 'description') {
          codeComment.description = tag.comment;
        }

        if (tag.tagName.escapedText === 'param') {
          codeComment.params.push({
            comment: tag.comment,
            paramName: tag.name.escapedText,
            kind: tag.typeExpression.kind
          });
        }

        if (tag.tagName.escapedText === 'returns') {
          codeComment.returns = tag.comment;
        }
      });
    }
  }

  return codeComment;
}
