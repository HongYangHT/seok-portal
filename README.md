# seok-portal (谐音： say ok to portal)
> `seok-portal` 用于基于OAuth2协议的SSO登录，并基于 `vue-router` 、`vuex` 、`axios`做相关的拦截处理。  

### Install (安装)
> npm i seok-portal -S || npm i seok-portal@xxx -S

### Useage (应用)
> 查看应用[文档](/useage.md)

### PR && Commit (提交代码)
- 使用 commitizen 来格式化 Git commit message
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
- 1. npm run build 进行编译和打包
- 2. 切换到当前项目目录
- 3. 切换npm源到npm源（https://registry.npmjs.org/）: 只针对有自身源的情况
- 4. npm login
- 5. 修改package.json的版本号
- 6. npm publish
