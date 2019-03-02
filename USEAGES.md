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
|   |---- utils #提供功能函数
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
> ⚠️：请仔细比对一下代码，代码逻辑不能少
  - http 模块

    ```js
    /***
     * http 模块有两个功能函数
     * requestInterceptor (config, authorization, tokenUri)
     * handleResponseError (error, authorization)
     * 并将其注入到 模版工程的 http.js 中 
     */
    import {
      authHttp
    } from 'seok-portal/src'
    import authorization from './authorization'
    import store from './store'

    function requestInterceptor (config) {
      ...
      TGlobalLoading.start()
      let authConfig = authHttp.requestInterceptor(config, authorization, store.state.authStore)
      return merge(config, authConfig)
    }
    // ⚠️：需要将该拦截器需要注册到相关域中

    // 该错误拦截器是用于token失效时刷新token所用
    function responseError(error) {
      TGlobalLoading.error()
      ...
      // 注意这里的cb，可以传可以不传
      authHttp.responseErrorInterceptor (error, authorization, http.$http(这里可以是其他域的实例store.state.authStore, cb)
      return Promise.reject(error)
    }
    ```

  - route 模块

    ```js
    /***
     * router 模块需要在进入路由之前判断注册
     * beforeEach(to, from, next, authorization, requestInstance, cb)
     */
    // ⚠️： 一下代码都不能少，请仔细比对
    import {
      authRoute
    } from 'seok-portal/src'

    import authorization from './authorization'
    import http from './http'
    import store from './store'

    router.beforeEach((to, from, next) => {
      authRoute.beforeEach(to, from, next, authorization, http.$http(这里可以是其他域的实例), (accessToken, refreshToken, authState, code) => {
        store.commit('setAuthState', {
          accessToken, refreshToken, authState, code
        })
        next()
      })
      // ⚠️： 这里本身存在的next()的方法，需要注释掉
      // next()
    })
    ```

  - auth (vuex) 模块

  ```js
  /***
   * store 模块用于存储登录状态
   * 需要将其以模块状态的形式存入,
   * 分两步
   */
   import { authStore } from 'seok-portal'
   // 在store.js中注入
   ...
   const store = new Vuex.Store({
     namespaced: true, // 是否带命名方式
     state: {},
     // 1. 需要增加一个mutations，用于存储 同步 登录信息
     mutations: {
       'setAuthState': (state, payload) => {
        let {
          accessToken,
          refreshToken,
          authState,
          code
        } = payload
        state.authStore.authState = authState
        state.authStore.code = code
        state.authStore.accessToken = accessToken
        state.authStore.refreshToken = refreshToken
      }
     },
     // 2. 注入store
     modules: {
       authStore
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

  - authorization需要进行配置的参数
  ```js
  export default {
    client_id: 'cmiConfidentialWeb', // 客户端名称
    clientSecret: 'cmiConfidentialWeb%mvno$SixLou', // 客户端密码
    authorizeUri: 'xx/sso/oauth/authorize', // 用户认证的链接, 此时是测试机地址，生产环境需要将其改成正式环境地址
    tokenUri: 'xx/sso/oauth/token' // 获取token地址，是测试机地址，生产环境需要将其改成正式环境地址
  }
  ```

### 注意
> 上述函数调用的参数以工程中提供为准
