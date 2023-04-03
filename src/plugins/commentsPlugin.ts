/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-03 13:36:12
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-03 22:56:20
 * @FilePath: \eno-code-analyse\src\plugins\commentsPlugin.ts
 * @Description:
 *
 */
import type { FunctionDeclaration, JSDoc, JSDocTag, Node, NodeArray } from 'typescript';
import { isFunctionDeclaration } from 'typescript';

import type { Plugin } from '../plugin';

interface FuncParam {
  name: string;
}

interface FuncComments {
  description: string | NodeArray<JSDocTag>;
  params: Array<{
    comment: string;
    name: string;
    kind: number;
  }>;
  returns: string;
}

// 数据收集插件
export const commentsPlugin: Plugin = {
  name: 'CommentsPlugin',
  startAnalyse: (orginFileName, node: Node) => {
    if (isFunctionDeclaration(node)) {
      const funcComments = getFuncComments(node as FunctionDeclaration & { jsDoc: JSDoc[] });
      const funcParams = getFuncParams(node);

      console.log('对这两个数据进行清洗：', funcComments, funcParams);
    }
  }
};

function getFuncParams(node: FunctionDeclaration): FuncParam[] {
  return node.parameters.reduce((params: FuncParam[], parameter) => {
    if (parameter) {
      params.push({ name: parameter.name.getText() });
    }

    return params;
  }, []);
}

/**
 * 获取函数的注释信息
 * @param node
 * @returns {FuncComments}
 */
function getFuncComments(node: FunctionDeclaration & { jsDoc: JSDoc[] }): FuncComments {
  const comments = node.jsDoc;
  const funcComments: FuncComments = { description: '', params: [], returns: '' };

  for (const comment of comments) {
    for (const tag of comment.tags as any) {
      switch (tag.tagName.escapedText) {
        case 'description':
          funcComments.description = tag.comment || '';
          break;
        case 'param':
          funcComments.params.push({
            comment: tag.comment,
            name: tag.name?.escapedText ?? '',
            kind: tag.typeExpression?.kind ?? 0
          });
          break;
        case 'returns':
          funcComments.returns = tag.comment || '';
          break;
        default:
          break;
      }
    }
  }

  return funcComments;
}
