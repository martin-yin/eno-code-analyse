/*
 * @Author: Martin martin-yin@foxmail.com
 * @Date: 2023-04-03 13:36:12
 * @LastEditors: Martin martin-yin@foxmail.com
 * @LastEditTime: 2023-04
 * @FilePath: \eno-code-analyse\src\plugins\commentsPlugin.ts
 * @Description: 用于抓取js ts 代码中的注释信息
 *
 */
import type {
  ArrowFunction,
  FunctionDeclaration,
  FunctionExpression,
  JSDocComment,
  MethodDeclaration,
  Node,
  NodeArray,
  ObjectLiteralExpression
} from 'typescript';
import {
  forEachChild,
  getJSDocTags,
  isArrowFunction,
  isBinaryExpression,
  isFunctionDeclaration,
  isFunctionExpression,
  isMethodDeclaration,
  isPropertyAssignment,
  isVariableDeclaration
} from 'typescript';

import { parseTsAndJs, parseVue } from '../parse';
import { getFileExtension } from '../utils/file';
import type { PluginInstance } from './plugin';

export interface MethodParam {
  escapedText: string;
}

type comment = string | NodeArray<JSDocComment>;

export interface MethodComments {
  description: {
    comment: comment;
  };
  params: Array<{
    description: {
      comment: comment;
    };
    escapedText: string;
    type: string;
  }>;
  returns: {
    comment: comment;
  };
}

type MethdoInfo = {
  params: MethodParam[];
  comments: MethodComments;
};

/**
 * 获取函数中的参数
 * @param {Node} node node 节点
 * @returns {MethodParam[]} params
 */
export function getMethodParams(
  node: FunctionDeclaration | MethodDeclaration | FunctionExpression | ArrowFunction
): MethodParam[] {
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
export function getMethodComments(
  node: FunctionDeclaration | MethodDeclaration | FunctionExpression | ArrowFunction
): MethodComments {
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
          const commentNodeAnd = commentNode as any;

          methdoComments.params.push({
            description: {
              comment: commentNode.comment ?? ''
            },
            // 这里是可以拿到类型的，但是 ts 提示不正确。
            escapedText: commentNodeAnd.name.getText() ?? '',
            type: commentNodeAnd.typeExpression?.kind ?? ''
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

export default class MethodCommentsPlugin implements PluginInstance {
  name = 'MethodCommentsPlugin';

  private extensions: Array<string> = ['jsx', 'js', 'ts', 'tsx', 'vue'];

  protected context = new Map<string, Map<string, MethdoInfo>>();

  constructor(config?: any) {
    // this.extensions = config?.extensions;
  }

  startAnalyse(filePath: string): void {
    const extension = getFileExtension(filePath);

    if (!this.extensions.includes(extension)) {
      console.log(`文件 ${filePath} 不在 ${this.name} 插件解析规则之内`);

      return;
    }

    const methdoCommentMap = new Map<string, MethdoInfo>();
    const sourceFile = filePath.endsWith('.vue') ? parseVue(filePath) : parseTsAndJs(filePath);

    forEachChild(sourceFile, function visit(node: Node) {
      if (isFunctionDeclaration(node)) {
        const methodName = node?.name ? node.name.getText() : '';

        methdoCommentMap.set(methodName, {
          params: getMethodParams(node),
          comments: getMethodComments(node as FunctionDeclaration)
        });
      }

      // 针对函数表达式的判断
      if (isMethodDeclaration(node)) {
        const methodName = node.name.getText();

        methdoCommentMap.set(methodName, {
          params: getMethodParams(node),
          comments: getMethodComments(node)
        });
      }

      if (isBinaryExpression(node) && isFunctionExpression(node.right)) {
        // 左名称
        const methodName = node.left.getText();

        // 右边函数
        const funcExpressionNode = node.right as FunctionExpression;

        methdoCommentMap.set(methodName, {
          params: getMethodParams(funcExpressionNode),
          comments: getMethodComments(funcExpressionNode)
        });
      }

      // 对箭头函数
      if (isVariableDeclaration(node) && node?.initializer) {
        const methodName = node.name.getText();

        if (isFunctionExpression(node?.initializer)) {
          const funcExpressionNode = node.initializer as FunctionExpression;

          methdoCommentMap.set(methodName, {
            params: getMethodParams(funcExpressionNode),
            comments: getMethodComments(funcExpressionNode)
          });
        }

        // 箭头函数的判断
        if (isArrowFunction(node.initializer)) {
          const arrowFuncNode = node.initializer as ArrowFunction;

          methdoCommentMap.set(methodName, {
            params: getMethodParams(arrowFuncNode),
            comments: getMethodComments(arrowFuncNode)
          });
        }
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

  /**
   * @description 数据格式化处理
   * @returns void
   */
  format() {
    let fileAnalyseMessage = {};

    this.context.forEach((val, fileName) => {
      let methodAnalyseMessage = {};

      val.forEach((commentInfo: MethdoInfo, methodName) => {
        const message = [];
        const { params, comments } = commentInfo;
        const { description, returns } = comments;

        if (description.comment === '') {
          message.push(`函数缺少描述信息`);
        }

        params.forEach(param => {
          const commentParam = comments.params.find(commentParam => param.escapedText === commentParam.escapedText);

          if (!commentParam) {
            message.push(`${param.escapedText} 参数缺少对应的注释信息`);

            return;
          }

          if (commentParam.description.comment === '') {
            message.push(`${param.escapedText} 参数缺少对应的描述信息`);
          }

          if (commentParam.type === '') {
            message.push(`${param.escapedText} 参数缺少对应的类型`);
          }
        });

        if (returns.comment === '') {
          message.push(`函数缺少返回值信息`);
        }

        methodAnalyseMessage = {
          ...methodAnalyseMessage,
          [`${methodName}`]: message
        };
      });

      fileAnalyseMessage = {
        ...fileAnalyseMessage,
        [`${fileName}`]: methodAnalyseMessage
      };
    });

    return fileAnalyseMessage;
  }
}
