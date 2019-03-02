/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: 采取Oauth2的方式，将登录状态存储在vuex中，并实现sso登录。
 * @Date: 2019-02-28 14:53:27
 * @LastEditTime: 2019-03-01 21:01:05
 */

import * as authHttp from './http'
import * as authRoute from './route'
import authStore from './store'

export {
  authStore,
  authHttp,
  authRoute
}
