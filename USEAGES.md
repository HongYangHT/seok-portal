# 使用 `seok-portal` 文档
> `seok-portal` 用于基于OAuth2协议的SSO登录，并基于 `vue-router` 、`vuex` 、`axios`做相关的拦截处理。

### 架构目录

```js
|-- build #webpack 相关的打包配置
|-- lib #打包后的文件
|-- node__modules #依赖的npm包
|-- src #内容
|   |---- http #操作拦截器模块
|   |---- route #操作路由拦截模块
|   |---- store #操作存储状态的模块
|   |---- index.js #入口文件
|-- .babelrc #babel配置文件
|-- .editorconfig #编辑器统一设置
|-- .eslintignore #eslint 忽略检查配置
|-- .eslintrc.js #eslint 检查配置
|-- .gitignore #git 忽略提交配置
|-- CHANGE.md #更新日志
|-- package.json # package配置
|-- README.md # README
|-- USEAGE.md # 使用文档
```

### 使用方式
> 通过npm包的形式，将本包作为依赖包加入项目中，并通过npm包下载

- Install
> npm i seok-portal -S || npm i seok-portal@xx -S

- 将相关拦截和状态注入到相关的文件中
  - http 模块

    ```js
    /***
     * http 模块有两个功能函数
     * requestInterceptor (config, authorization, tokenUri)
     * handleResponseError (error, authorization)
     * 并将其注入到 模版工程的 http.js 中 
     */
    import { http } from 'seok-portal'
    import authorization from 'xx/authorization.js'

    function requestInterceptor (config) {
      ...
      let conf = http.requestInterceptor(config, authorization, authorization.tokenUri)
      return merge(config, conf)
    }
    ```

  - route 模块

    ```js
    /***
     * router 模块需要在进入路由之前判断注册
     * beforeEach(to, from, next, authorization, requestInstance, cb)
     */
    import { route } from 'seok-portal'
    import authorization from 'xx/authorization.js'

    router.beforeEach((to, from, next) => {
      route.beforeEach(to, from, next, authorization, http.$xx)
    })
    ```

  - auth (vuex) 模块

  ```js
  /***
   * store 模块用于存储登录状态
   * 需要将其以模块状态的形式存入
   */
   import { auth } from 'seok-portal'
   // 在store.js中注入
   ...
   const store = new Vuex.Store({
     namespaced: true, // 是否带命名方式
     state: {},
     modules: {
       auth
     }
   })
   ...

   /***
    * 在单文件中访问登录状态
    * 应该已访问模块状态的方式访问
    */
  import {
    mapState
  } from 'vuex'

  export default {
    ...
    computed: {
      ...mapState({
        accessToken: state => state.auth.accessToken
      })
    }
  }
  ```

### 注意
> 上述函数调用的参数以工程中提供为准
