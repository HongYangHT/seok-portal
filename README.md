# seok-portal (谐音： say ok to portal)
> `seok-portal` 用于基于OAuth2协议的SSO登录，并基于 `vue-router` 、`vuex` 、`axios`做相关的拦截处理。  

### Install (安装)
> npm i seok-portal -S || npm i seok-portal@xxx -S

### Useage (应用)
> 查看使用[文档](/USEAGES.md)

### PR && Commit (提交代码)
- 使用 commitizen 来格式化 Git commit message
  - 安装 commitizen
  > npm install -g commitizen
  - 使用 angular 的 commit 规范 commitizen init cz-conventional-changelog --save-dev --save-exact
  - 重新安装 husky 与 lint-staged
  > npm i -D husky
  > npm i -D lint-staged
  
- 提交规则
  - feat: 新功能
  - fix: 修复bug
  - docs: 文档更新
  - style: 格式更新（不影响代码运行的变动）
  - refactor: 重构（既不是新增功能，又不是bug修复）
  - test: 添加测试
  - chore: 构建过程或辅助工具的变动

- git 提交
  - 将 `git commit` 用 `git cz` 代替


### 编译和发布
- npm run build 进行编译和打包
- 切换到当前项目目录
- 切换npm源到npm源（https://registry.npmjs.org/）: 只针对有自身源的情况
- npm login
- 修改package.json的版本号
- npm publish


### 更新日志
> 每次发布版本请更新日志(在change.md中修改)，查看[日志](./CHANGE.md)
