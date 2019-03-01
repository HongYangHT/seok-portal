/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: 路由模块拦截器
 * @Date: 2019-02-28 15:47:58
 * @LastEditTime: 2019-03-01 14:58:25
 */
import {
  query,
  uuid,
  storage
} from '../utils'

/**
  * 由登录返回到当前页面
  * 有三种情况
  * 1. 带‘state’ 和 ‘code’，此时是从登录返回来, 此时我们需要去取token
  * 2. 不带‘state’ 和 ‘code’，且 token 存在 store 中，此时是页面间正常跳转
  * 3. 不带‘ state’ 和‘ code’, 且 token 不存在 store 中，我们还是让页面正常跳转，让请求拦截器去处理
  */
/**
  * @description 路由的钩子函数
  * @param {*} to 进入下一个路由信息
  * @param {*} from 出来的路由详细
  * @param {*} next 路由执行函数，必须执行
  * @param {*} authorization 配置参数
  * @param {*} requestInstance http的实体
  * @param {*} cb 回调函数
  */
export async function beforeEach (to, from, next, authorization, requestInstance, cb) {
  const authState = query.getQuery('state')
  const code = query.getQuery('code')
  let count = storage.get('se_ok_portal_count')
  // 1. 一种是带‘ state’ 和‘ code’， 此时是从登录返回来, 此时我们需要去取token
  if (authState && code) {
    try {
      const tokeResponse = await requestInstance.post(authorization.tokenUri + '?code=' + code + '&state=' + authState +
        '&grant_type=authorization_code' + '&client_id=' + authorization.client_id + '&redirect_uri=' + encodeURIComponent(window.location.href))
      const accessToken = tokeResponse && tokeResponse.data && tokeResponse.data.access_token
      const refreshToken = tokeResponse && tokeResponse.data && tokeResponse.data.refresh_token
      /**
       * 通过回调函数进行设置access_token 、 refresh_token、state、code
       * 因为在包中无法进行设置
       */
      cb(accessToken, refreshToken, authState, code)
    } catch (error) {
      /**
       * 将请求次数保存在 sessionStorge 中，当我们第二次再去请求授权时报错，我们将不再发请求，以防进入死循环
       */
      if (count && parseInt(count) > 0) {
        next()
      } else {
        // 请求报错，我们需要跳回去重新尝试授权、认证
        /**
         * 记录请求授权次数
         */
        storage.set('se_ok_portal_count', 1)

        let msg = {
          client_id: authorization.client_id,
          redirect_uri: encodeURIComponent(window.location.href),
          state: uuid.uuid(6, 16)
        }
        window.location.href = authorization.authorizeUri + '?client_id=' + msg.client_id + '&redirect_uri=' + msg.redirect_uri + '&response_type=code&scope=read&state=' + msg.state
      }
    }
  } else {
    // 2. 一种是不带‘ state’ 和‘ code’， 此时是页面间正常跳转
    next()
  }
}
