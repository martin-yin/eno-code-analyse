# eno-code-analyse

代码分析工具

# eno-code-analyse

代码分析工具

## 使用

```ts
git clone https://github.com/martin-yin/eno-code-analyse.git

cd eno-code-analyse

npm install

npm run build // 构建整体的 sdk

// npm run build:plugins sdk 中插件构建

npm link  // 没有发布npm包 所以需要 link 出去
```

在对应的需要分析的项目下面创建 `code-analyse.config.ts` 文件

```ts
import { defineConfig, MethodCommentsPlugin, EslintDisableNextLinePlugin } from 'eno-code-analyse';

// tips: 对应的项目需要先安装 `typescript`, 否则 MethodCommentsPlugin 插件无法执行

export default defineConfig({
  include: ['packages/**/*.ts', 'packages/**/*.js'],
  exclude: [], // 需要被排除的文件夹，cli 默认会把 node_module 加入。
  plugins: [MethodCommentsPlugin, EslintDisableNextLinePlugin], // 插件，插件的顺序只影响执行顺序。
});
```

shell 执行 `eno-code-analyse start --config code-analyse.config.ts`

命令执行完毕后会在当前 shell 路径下生成 `report.json` 文件
