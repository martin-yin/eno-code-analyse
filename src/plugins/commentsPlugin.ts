/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-03 13:36:12
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04-04 22:22:18
 * @FilePath: \eno-code-analyse\src\plugins\commentsPlugin.ts
 * @Description: 用于抓取js ts 代码中的注释信息
 *
 */
import type {
  FunctionDeclaration,
  JSDocComment,
  MethodDeclaration,
  Node,
  NodeArray,
  ObjectLiteralExpression
} from 'typescript';
import { forEachChild, getJSDocTags, isFunctionDeclaration, isPropertyAssignment } from 'typescript';

import { parseTsAndJs, parseVue } from '../parse';
import { getFileExtension } from '../utils/file';
import type { PluginInterface } from './plugin';

export interface MethodParam {
  escapedText: string;
}

type comment = string | NodeArray<JSDocComment>;

export interface MethodComments {
  description: {
    comment: comment;
  };
  params: Array<{
    comment: comment;
    escapedText: string;
    type: string;
  }>;
  returns: {
    comment: comment;
  };
}

type MethdoComment = {
  params: MethodParam[];
  comments: MethodComments;
};

export class MethodCommentsPlugin implements PluginInterface {
  name = 'MethodCommentsPlugin';

  private extensions: Array<string> = ['jsx', 'js', 'ts', 'tsx', 'vue'];

  protected context = new Map<string, Map<string, MethdoComment>>();

  constructor(config?: any) {
    this.extensions = config.extensions;
  }

  startAnalyse(filePath: string): void {
    const extension = getFileExtension(filePath);

    if (!this.extensions.includes(extension)) {
      console.log(`文件 ${filePath} 不在 ${this.name} 插件解析规则之内`);

      return;
    }

    const methdoCommentMap = new Map<string, MethdoComment>();
    const sourceFile = filePath.endsWith('.vue') ? parseVue(filePath) : parseTsAndJs(filePath);

    forEachChild(sourceFile, function visit(node: Node) {
      if (isFunctionDeclaration(node)) {
        const methodName = node?.name ? node.name.getText() : '';

        methdoCommentMap.set(methodName, {
          params: getMethodParams(node),
          comments: getMethodComments(node as FunctionDeclaration)
        });
      }

      // 对 vue options api的判断
      if (isPropertyAssignment(node) && (node.name.getText() === 'methods' || node.name.getText() === 'computed')) {
        if (node.initializer && node.initializer) {
          const methodNodes = node.initializer as ObjectLiteralExpression;

          methodNodes.forEachChild(childNode => {
            const methodNode = childNode as MethodDeclaration;
            const methodName = methodNode.name.getText();

            methdoCommentMap.set(methodName, {
              params: getMethodParams(methodNode),
              comments: getMethodComments(methodNode)
            });
          });
        }
      }

      // 需要箭头函数的判断

      forEachChild(node, visit);
    });
    this.context.set(filePath, methdoCommentMap);
  }

  format() {
    return this.context;
  }

  report() {
    return false;
  }
}

/**
 * 获取函数中的参数
 * @param {Node} node node 节点
 * @returns {MethodParam[]} params
 */
export function getMethodParams(node: FunctionDeclaration | MethodDeclaration): MethodParam[] {
  return node.parameters.reduce((params: MethodParam[], parameter) => {
    if (parameter) {
      params.push({ escapedText: parameter.name.getText() });
    }

    return params;
  }, []);
}

/**
 * 获取函数的注释信息
 * @param {Node} node
 * @returns {MethodComments}
 */
export function getMethodComments(node: FunctionDeclaration | MethodDeclaration): MethodComments {
  const commentsNode = getJSDocTags(node);
  const methdoComments: MethodComments = {
    description: {
      comment: ''
    },
    params: [],
    returns: {
      comment: ''
    }
  };

  if (commentsNode && commentsNode?.length) {
    for (const commentNode of commentsNode) {
      switch (commentNode.tagName.getText()) {
        case 'description':
          methdoComments.description.comment = commentNode.comment ?? '';
          break;
        case 'param':
          methdoComments.params.push({
            comment: commentNode.comment ?? '',
            // 这里是可以拿到类型的，但是 ts 提示不正确。
            escapedText: commentNode.name.getText() ?? '',
            type: commentNode.typeExpression?.kind ?? ''
          });
          break;
        case 'returns':
          methdoComments.returns.comment = commentNode.comment || '';
          break;
        default:
          break;
      }
    }
  }

  return methdoComments;
}
