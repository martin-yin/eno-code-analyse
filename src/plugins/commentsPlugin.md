# commentsPlugin 插件

此文档用来解释各个规则对应的代码。

`getMethodParams`与 `getMethodComments` 方法能接收以下该类型，故不在过多展开

```ts
FunctionDeclaration | MethodDeclaration | FunctionExpression | ArrowFunction;
```

## FunctionDeclaration

```ts
// 最基础的函数声明方式
function test() {}
```

## MethodDeclaration

```ts
// 对象下面的方法
export default {
  ccc() {}
};
```

## BinaryExpression

```ts
// 二元表达式？？
// 这个表达式会被拆成左右两块，右边是函数，左边是函数的声明对象
Vue.config.errorHandler = function (err: Error, vm: any, info: string): void {
  handleVueError.apply(null, [err, vm, info, Vue]);
};
```

## VariableDeclaration

有些方法是通过变量的形式声明的。

### FunctionExpression

```ts
// 用变量声明的普通函数
const method = function () {};
```

### ArrowFunction

```ts
// 箭头函数基本上都是通过变量的方式声明的，所以需要先判断是否是变量，然后判断是不是箭头函数
const test = () => {};
```

## PropertyAssignment

判断 `vue options api` 的代码

```ts
isPropertyAssignment(node) && (node.name.getText() === 'methods' || node.name.getText() === 'computed');
```
